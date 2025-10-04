import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Droplet, LogOut, User, Phone, Mail, MapPin, Calendar } from 'lucide-react';

interface DonorProfile {
  full_name: string;
  email: string;
  phone: string;
  blood_group: string;
  age: number;
  gender: string;
  city: string;
  state: string;
  available_to_donate: boolean;
  last_donation_date: string | null;
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [donor, setDonor] = useState<DonorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonorProfile();
  }, []);

  const fetchDonorProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setDonor(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-8" style={{ background: 'var(--gradient-secondary)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <Droplet className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Donor Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {donor?.full_name}</p>
            </div>
          </div>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{donor?.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Blood Group</p>
                  <p className="font-medium text-primary text-lg">{donor?.blood_group}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium">{donor?.age} years</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium capitalize">{donor?.gender}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <p>{donor?.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <p>{donor?.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <p>{donor?.city}, {donor?.state}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Donation Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Availability</p>
                  <p className="font-medium">
                    {donor?.available_to_donate ? (
                      <span className="text-green-600">Available to Donate</span>
                    ) : (
                      <span className="text-red-600">Not Available</span>
                    )}
                  </p>
                </div>
                {donor?.last_donation_date && (
                  <div>
                    <p className="text-sm text-muted-foreground">Last Donation</p>
                    <p className="font-medium">{new Date(donor.last_donation_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;