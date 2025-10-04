import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Droplet, LogOut, User, Phone, Mail, MapPin, Calendar, Award, Bell, Menu, X, Activity, Heart } from 'lucide-react';

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

interface UrgentRequest {
  id: string;
  blood_group: string;
  units_needed: number;
  hospital_name: string;
  city: string;
  contact_number: string;
  created_at: string;
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [donor, setDonor] = useState<DonorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [urgentRequests, setUrgentRequests] = useState<UrgentRequest[]>([]);
  const [userLocation, setUserLocation] = useState<string>('');

  useEffect(() => {
    fetchDonorProfile();
    fetchUrgentRequests();
    getUserLocation();
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
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        // No donor profile found, redirect to registration
        toast({
          title: "Profile Not Found",
          description: "Please complete your donor registration",
          variant: "destructive",
        });
        navigate('/register-donor');
        return;
      }
      
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

  const fetchUrgentRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('urgent_blood_requests')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setUrgentRequests(data || []);
    } catch (error: any) {
      console.error('Error fetching urgent requests:', error);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In production, use reverse geocoding API
          setUserLocation('Current Location');
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const getBadges = () => {
    const badges = [];
    
    // Welcome badge - always shown
    badges.push({
      name: 'Welcome',
      icon: '👋',
      color: 'from-blue-500 to-cyan-500',
      description: 'New Member'
    });

    // Golden badge - after first donation
    if (donor?.last_donation_date) {
      badges.push({
        name: 'Golden Donor',
        icon: '🏆',
        color: 'from-yellow-500 to-amber-500',
        description: 'First Donation Complete'
      });
    }

    // Life Saver badge - if available to donate
    if (donor?.available_to_donate) {
      badges.push({
        name: 'Life Saver',
        icon: '❤️',
        color: 'from-red-500 to-pink-500',
        description: 'Ready to Help'
      });
    }

    return badges;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="flex flex-col items-center gap-4">
          <Droplet className="w-12 h-12 text-red-500 animate-pulse" />
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const badges = getBadges();
  const localRequests = urgentRequests.filter(req => 
    req.city.toLowerCase() === donor?.city.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                <Droplet className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">LifeLink</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => scrollToSection('dashboard')} 
                className={`flex items-center gap-2 transition-colors ${
                  activeSection === 'dashboard' 
                    ? 'text-red-500 font-semibold' 
                    : 'text-gray-700 hover:text-red-500'
                }`}
              >
                <Activity className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              <button 
                onClick={() => scrollToSection('notifications')} 
                className={`flex items-center gap-2 transition-colors relative ${
                  activeSection === 'notifications' 
                    ? 'text-red-500 font-semibold' 
                    : 'text-gray-700 hover:text-red-500'
                }`}
              >
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
                {localRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {localRequests.length}
                  </span>
                )}
              </button>
              <button 
                onClick={() => scrollToSection('profile')} 
                className={`flex items-center gap-2 transition-colors ${
                  activeSection === 'profile' 
                    ? 'text-red-500 font-semibold' 
                    : 'text-gray-700 hover:text-red-500'
                }`}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
              <Button onClick={handleSignOut} variant="outline" size="sm" className="ml-4">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => scrollToSection('dashboard')} 
                  className={`flex items-center gap-2 ${
                    activeSection === 'dashboard' 
                      ? 'text-red-500 font-semibold' 
                      : 'text-gray-700'
                  }`}
                >
                  <Activity className="w-5 h-5" />
                  <span>Dashboard</span>
                </button>
                <button 
                  onClick={() => scrollToSection('notifications')} 
                  className={`flex items-center gap-2 ${
                    activeSection === 'notifications' 
                      ? 'text-red-500 font-semibold' 
                      : 'text-gray-700'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </button>
                <button 
                  onClick={() => scrollToSection('profile')} 
                  className={`flex items-center gap-2 ${
                    activeSection === 'profile' 
                      ? 'text-red-500 font-semibold' 
                      : 'text-gray-700'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with Badges */}
        <div id="dashboard" className="mb-8 scroll-mt-20">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {donor?.full_name}! 👋
          </h1>
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <MapPin className="w-4 h-4" />
            <span>{donor?.city}, {donor?.state}</span>
          </div>

          {/* Achievement Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {badges.map((badge, index) => (
              <div
                key={index}
                className={`bg-gradient-to-r ${badge.color} rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{badge.icon}</span>
                  <div>
                    <p className="font-bold text-lg">{badge.name}</p>
                    <p className="text-sm opacity-90">{badge.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent Blood Requests in Your Area */}
        {localRequests.length > 0 && (
          <Card id="notifications" className="mb-8 border-red-200 bg-red-50 scroll-mt-20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <Heart className="w-6 h-6 animate-pulse" />
                Urgent Blood Requests in {donor?.city}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {localRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-white rounded-lg p-4 border-2 border-red-300 shadow-md"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-2xl font-bold text-red-600">{request.blood_group}</p>
                        <p className="text-sm text-gray-600">{request.units_needed} units needed</p>
                      </div>
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                        URGENT
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-800">{request.hospital_name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{request.city}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${request.contact_number}`} className="text-red-600 hover:underline">
                          {request.contact_number}
                        </a>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(request.created_at).toLocaleString()}
                      </p>
                    </div>
                    {donor?.blood_group === request.blood_group && donor?.available_to_donate && (
                      <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">
                        <Phone className="w-4 h-4 mr-2" />
                        Contact Hospital
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile and Status Cards */}
        <div id="profile" className="grid lg:grid-cols-2 gap-6 scroll-mt-20">
          {/* Profile Card */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Blood Group</span>
                  <span className="text-2xl font-bold text-red-600">{donor?.blood_group}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Age</span>
                  <span className="font-semibold">{donor?.age} years</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Gender</span>
                  <span className="font-semibold capitalize">{donor?.gender}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Status Card */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact & Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium">{donor?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium">{donor?.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-medium">{donor?.city}, {donor?.state}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Donation Status</p>
                    <p className={`font-semibold ${donor?.available_to_donate ? 'text-green-600' : 'text-red-600'}`}>
                      {donor?.available_to_donate ? 'Available' : 'Not Available'}
                    </p>
                  </div>
                </div>
                {donor?.last_donation_date && (
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Award className="w-5 h-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Last Donation</p>
                      <p className="font-medium">{new Date(donor.last_donation_date).toLocaleDateString()}</p>
                    </div>
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