import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, Building2, ArrowRight, Droplet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DonationCamp {
  id: string;
  camp_name: string;
  organization_name: string;
  camp_date: string;
  start_time: string;
  end_time: string;
  location: string;
  city: string;
  state: string;
  expected_donors: number;
  actual_donors: number;
  units_collected: number;
  description: string;
  facilities: string[];
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
}

const DonationCamps = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [camps, setCamps] = useState<DonationCamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('upcoming');

  useEffect(() => {
    fetchCamps();

    // Set up real-time subscription
    const campsSubscription = supabase
      .channel('camps-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'donation_camps' },
        () => {
          fetchCamps();
        }
      )
      .subscribe();

    return () => {
      campsSubscription.unsubscribe();
    };
  }, [filter]);

  const fetchCamps = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('donation_camps')
        .select('*')
        .order('camp_date', { ascending: true });

      if (filter === 'upcoming') {
        query = query.eq('status', 'Upcoming');
      } else if (filter === 'ongoing') {
        query = query.eq('status', 'Ongoing');
      } else if (filter === 'completed') {
        query = query.eq('status', 'Completed');
      }

      const { data, error } = await query;

      if (error) throw error;

      setCamps(data || []);
    } catch (error) {
      console.error('Error fetching camps:', error);
      toast({
        title: 'Error',
        description: 'Failed to load donation camps',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Ongoing':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFacilityIcon = (facility: string) => {
    const icons: { [key: string]: string } = {
      parking: '🅿️',
      refreshments: '🍴',
      'medical-staff': '👨‍⚕️',
      'rest-area': '🛋️',
      certificates: '📜',
    };
    return icons[facility] || '✓';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Droplet className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Blood Donation Camps</h1>
            <p className="text-xl text-red-100 max-w-2xl mx-auto">
              Join organized blood donation camps in your area and save lives
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-4 overflow-x-auto">
            {[
              { value: 'all', label: 'All Camps' },
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'ongoing', label: 'Ongoing' },
              { value: 'completed', label: 'Completed' },
            ].map((tab) => (
              <Button
                key={tab.value}
                variant={filter === tab.value ? 'default' : 'outline'}
                onClick={() => setFilter(tab.value as any)}
                className={filter === tab.value ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Camps List */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading donation camps...</p>
          </div>
        ) : camps.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No camps found</h3>
              <p className="text-gray-600 mb-6">
                {filter === 'upcoming'
                  ? 'There are no upcoming donation camps at the moment.'
                  : 'No camps match your filter criteria.'}
              </p>
              <Button
                onClick={() => setFilter('all')}
                variant="outline"
              >
                View All Camps
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {camps.map((camp) => (
              <Card
                key={camp.id}
                className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-red-200"
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl text-gray-900">
                      {camp.camp_name}
                    </CardTitle>
                    <Badge className={`${getStatusColor(camp.status)} border`}>
                      {camp.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {camp.organization_name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Date & Time */}
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatDate(camp.camp_date)}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(camp.start_time)} - {formatTime(camp.end_time)}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{camp.location}</p>
                      <p className="text-sm text-gray-600">
                        {camp.city}, {camp.state}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">
                        {camp.actual_donors}/{camp.expected_donors} donors
                      </span>
                    </div>
                    {camp.units_collected > 0 && (
                      <div className="flex items-center gap-2">
                        <Droplet className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-gray-600">
                          {camp.units_collected} units
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Facilities */}
                  {camp.facilities && camp.facilities.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {camp.facilities.slice(0, 4).map((facility, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {getFacilityIcon(facility)}{' '}
                          {facility.replace('-', ' ')}
                        </Badge>
                      ))}
                      {camp.facilities.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{camp.facilities.length - 4} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  {camp.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 pt-2">
                      {camp.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      onClick={() => {
                        // Check if user is logged in
                        supabase.auth.getSession().then(({ data }) => {
                          if (data.session) {
                            toast({
                              title: 'Registration',
                              description: 'Registration feature coming soon!',
                            });
                          } else {
                            navigate('/login');
                          }
                        });
                      }}
                      disabled={camp.status !== 'Upcoming'}
                    >
                      {camp.status === 'Upcoming' ? 'Register Now' : 'View Details'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Organize a Camp?</h2>
          <p className="text-xl text-red-100 mb-8">
            Contact our admin team to organize a blood donation camp at your organization
          </p>
          <Button
            size="lg"
            variant="outline"
            className="bg-white text-red-600 hover:bg-red-50"
            onClick={() => navigate('/login')}
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DonationCamps;
