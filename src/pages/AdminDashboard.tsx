import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Droplet, Users, Search, LogOut, Phone, Mail, MapPin, AlertCircle, Menu, X, Activity, Send } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

interface Donor {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  blood_group: string;
  age: number;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  last_donation_date: string | null;
  available_to_donate: boolean;
  medical_conditions: string | null;
  emergency_contact_name: string;
  emergency_contact_phone: string;
}

interface UrgentRequest {
  blood_group: string;
  units_needed: number;
  hospital_name: string;
  city: string;
  state: string;
  contact_number: string;
  patient_name: string;
  urgency_level: string;
  additional_notes: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [totalDonors, setTotalDonors] = useState(0);
  const [activeDonors, setActiveDonors] = useState(0);
  const [searchBloodGroup, setSearchBloodGroup] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [urgentDialogOpen, setUrgentDialogOpen] = useState(false);
  const [urgentRequest, setUrgentRequest] = useState<UrgentRequest>({
    blood_group: '',
    units_needed: 1,
    hospital_name: '',
    city: '',
    state: '',
    contact_number: '',
    patient_name: '',
    urgency_level: 'high',
    additional_notes: ''
  });

  useEffect(() => {
    checkAdminAndFetchData();
  }, []);

  const checkAdminAndFetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: role } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!role) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      await fetchDonorStats();
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

  const fetchDonorStats = async () => {
    const { count: total } = await supabase
      .from('donors')
      .select('*', { count: 'exact', head: true });
    
    const { count: active } = await supabase
      .from('donors')
      .select('*', { count: 'exact', head: true })
      .eq('available_to_donate', true);
    
    setTotalDonors(total || 0);
    setActiveDonors(active || 0);
  };

  const handleSearch = async () => {
    try {
      let query = supabase.from('donors').select('*');

      if (searchBloodGroup && searchBloodGroup !== 'all') {
        query = query.eq('blood_group', searchBloodGroup);
      }

      if (searchLocation) {
        query = query.or(`city.ilike.%${searchLocation}%,state.ilike.%${searchLocation}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      setDonors(data || []);
      setSelectedDonor(null);

      toast({
        title: "Search Complete",
        description: `Found ${data?.length || 0} donor(s)`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCreateUrgentRequest = async () => {
    try {
      if (!urgentRequest.blood_group || !urgentRequest.hospital_name || !urgentRequest.city || !urgentRequest.contact_number) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('urgent_blood_requests')
        .insert([{
          ...urgentRequest,
          status: 'active',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      const { data: matchingDonors, error: donorError } = await supabase
        .from('donors')
        .select('email, full_name, phone')
        .eq('blood_group', urgentRequest.blood_group)
        .eq('city', urgentRequest.city)
        .eq('available_to_donate', true);

      if (donorError) throw donorError;

      toast({
        title: "Urgent Request Created!",
        description: `Notified ${matchingDonors?.length || 0} matching donors in ${urgentRequest.city}`,
      });

      setUrgentRequest({
        blood_group: '',
        units_needed: 1,
        hospital_name: '',
        city: '',
        state: '',
        contact_number: '',
        patient_name: '',
        urgency_level: 'high',
        additional_notes: ''
      });
      setUrgentDialogOpen(false);

      console.log('Notifying donors:', matchingDonors);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
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
              <span className="text-xl font-bold text-gray-800">LifeLink Admin</span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors">
                <Activity className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              <button className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors">
                <Users className="w-5 h-5" />
                <span>Donors</span>
              </button>
              <Button onClick={handleSignOut} variant="outline" size="sm" className="ml-4">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>

            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col gap-4">
                <button className="flex items-center gap-2 text-gray-700">
                  <Activity className="w-5 h-5" />
                  <span>Dashboard</span>
                </button>
                <button className="flex items-center gap-2 text-gray-700">
                  <Users className="w-5 h-5" />
                  <span>Donors</span>
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage blood donors and urgent requests</p>
          </div>
          
          <Dialog open={urgentDialogOpen} onOpenChange={setUrgentDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <AlertCircle className="w-4 h-4 mr-2" />
                Create Urgent Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  Create Urgent Blood Request
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-name">Patient Name *</Label>
                    <Input
                      id="patient-name"
                      placeholder="Enter patient name"
                      value={urgentRequest.patient_name}
                      onChange={(e) => setUrgentRequest({...urgentRequest, patient_name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="blood-group">Blood Group *</Label>
                    <Select 
                      value={urgentRequest.blood_group} 
                      onValueChange={(value) => setUrgentRequest({...urgentRequest, blood_group: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOOD_GROUPS.map(group => (
                          <SelectItem key={group} value={group}>{group}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="units">Units Needed *</Label>
                    <Input
                      id="units"
                      type="number"
                      min="1"
                      value={urgentRequest.units_needed}
                      onChange={(e) => setUrgentRequest({...urgentRequest, units_needed: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency Level *</Label>
                    <Select 
                      value={urgentRequest.urgency_level} 
                      onValueChange={(value) => setUrgentRequest({...urgentRequest, urgency_level: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical (Immediate)</SelectItem>
                        <SelectItem value="high">High (Within 24hrs)</SelectItem>
                        <SelectItem value="medium">Medium (Within 48hrs)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hospital">Hospital Name *</Label>
                  <Input
                    id="hospital"
                    placeholder="Enter hospital name"
                    value={urgentRequest.hospital_name}
                    onChange={(e) => setUrgentRequest({...urgentRequest, hospital_name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="Enter city"
                      value={urgentRequest.city}
                      onChange={(e) => setUrgentRequest({...urgentRequest, city: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      placeholder="Enter state"
                      value={urgentRequest.state}
                      onChange={(e) => setUrgentRequest({...urgentRequest, state: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number *</Label>
                  <Input
                    id="contact"
                    placeholder="Enter contact number"
                    value={urgentRequest.contact_number}
                    onChange={(e) => setUrgentRequest({...urgentRequest, contact_number: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information..."
                    value={urgentRequest.additional_notes}
                    onChange={(e) => setUrgentRequest({...urgentRequest, additional_notes: e.target.value})}
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleCreateUrgentRequest} 
                  className="w-full bg-red-600 hover:bg-red-700"
                  size="lg"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Urgent Request & Notify Donors
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg border-t-4 border-t-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Donors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-gray-800">{totalDonors}</p>
                  <p className="text-sm text-gray-500 mt-1">Registered</p>
                </div>
                <Users className="w-12 h-12 text-blue-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-t-4 border-t-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active Donors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-gray-800">{activeDonors}</p>
                  <p className="text-sm text-gray-500 mt-1">Available</p>
                </div>
                <Droplet className="w-12 h-12 text-green-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-t-4 border-t-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-gray-800">
                    {totalDonors > 0 ? Math.round((activeDonors / totalDonors) * 100) : 0}%
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ready to donate</p>
                </div>
                <Activity className="w-12 h-12 text-red-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Card */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Donors
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select value={searchBloodGroup} onValueChange={setSearchBloodGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Groups</SelectItem>
                    {BLOOD_GROUPS.map(group => (
                      <SelectItem key={group} value={group}>{group}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location (City/State)</Label>
                <Input
                  id="location"
                  placeholder="Enter city or state"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>

              <div className="space-y-2 flex items-end md:col-span-2">
                <Button onClick={handleSearch} className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Search Donors
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {donors.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader className="bg-gray-50">
                <CardTitle>Search Results ({donors.length})</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 max-h-[600px] overflow-y-auto">
                <div className="space-y-3">
                  {donors.map((donor) => (
                    <div
                      key={donor.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedDonor?.id === donor.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedDonor(donor)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-lg">{donor.full_name}</p>
                          <p className="text-sm text-gray-600">{donor.age} years • {donor.gender}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <p className="text-sm text-gray-500">{donor.city}, {donor.state}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-red-600">{donor.blood_group}</span>
                          <div className="mt-1">
                            {donor.available_to_donate ? (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                Available
                              </span>
                            ) : (
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                Not Available
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedDonor && (
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                  <CardTitle>Donor Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Full Name</p>
                    <p className="font-bold text-xl">{selectedDonor.full_name}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-red-50 p-3 rounded-lg text-center">
                      <p className="text-xs text-gray-600">Blood Group</p>
                      <p className="text-2xl font-bold text-red-600">{selectedDonor.blood_group}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <p className="text-xs text-gray-600">Age</p>
                      <p className="text-2xl font-bold text-blue-600">{selectedDonor.age}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg text-center">
                      <p className="text-xs text-gray-600">Gender</p>
                      <p className="text-lg font-bold text-purple-600 capitalize">{selectedDonor.gender}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Email</p>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <a href={`mailto:${selectedDonor.email}`} className="text-blue-600 hover:underline">
                          {selectedDonor.email}
                        </a>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Phone</p>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <a href={`tel:${selectedDonor.phone}`} className="text-blue-600 hover:underline">
                          {selectedDonor.phone}
                        </a>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Address</p>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <p className="text-sm">
                          {selectedDonor.address}<br />
                          {selectedDonor.city}, {selectedDonor.state} - {selectedDonor.pincode}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Emergency Contact</p>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="font-medium">{selectedDonor.emergency_contact_name}</p>
                      <p className="text-sm text-gray-600">{selectedDonor.emergency_contact_phone}</p>
                    </div>
                  </div>

                  {selectedDonor.last_donation_date && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Last Donation Date</p>
                      <p className="font-semibold text-green-700">
                        {new Date(selectedDonor.last_donation_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}

                  {selectedDonor.medical_conditions && (
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                      <p className="text-xs text-gray-600 mb-1">Medical Conditions</p>
                      <p className="text-sm text-gray-700">{selectedDonor.medical_conditions}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <Button className="w-full" asChild>
                      <a href={`tel:${selectedDonor.phone}`}>
                        <Phone className="w-4 h-4 mr-2" />
                        Call Donor
                      </a>
                    </Button>
                    <Button className="w-full" variant="outline" asChild>
                      <a href={`mailto:${selectedDonor.email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;