import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Droplet, Users, Search, LogOut, Phone, Mail, MapPin, Calendar } from 'lucide-react';

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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [totalDonors, setTotalDonors] = useState(0);
  const [searchBloodGroup, setSearchBloodGroup] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(true);

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
    const { count } = await supabase
      .from('donors')
      .select('*', { count: 'exact', head: true });
    
    setTotalDonors(count || 0);
  };

  const handleSearch = async () => {
    try {
      let query = supabase.from('donors').select('*');

      if (searchBloodGroup) {
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
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <Droplet className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage blood donors</p>
            </div>
          </div>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Donors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-8 h-8 text-primary" />
                <p className="text-3xl font-bold">{totalDonors}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Donors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select value={searchBloodGroup} onValueChange={setSearchBloodGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
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

              <div className="space-y-2 flex items-end">
                <Button onClick={handleSearch} className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {donors.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Search Results ({donors.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {donors.map((donor) => (
                    <div
                      key={donor.id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedDonor(donor)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{donor.full_name}</p>
                          <p className="text-sm text-muted-foreground">{donor.city}, {donor.state}</p>
                        </div>
                        <span className="text-primary font-bold">{donor.blood_group}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedDonor && (
              <Card>
                <CardHeader>
                  <CardTitle>Donor Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{selectedDonor.full_name}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Blood Group</p>
                      <p className="font-medium text-primary text-lg">{selectedDonor.blood_group}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Age</p>
                      <p className="font-medium">{selectedDonor.age} years</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Contact Information</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <a href={`mailto:${selectedDonor.email}`} className="text-primary hover:underline">
                          {selectedDonor.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <a href={`tel:${selectedDonor.phone}`} className="text-primary hover:underline">
                          {selectedDonor.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">
                      {selectedDonor.address}, {selectedDonor.city}, {selectedDonor.state} - {selectedDonor.pincode}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Emergency Contact</p>
                    <p className="font-medium">{selectedDonor.emergency_contact_name}</p>
                    <p className="text-sm">{selectedDonor.emergency_contact_phone}</p>
                  </div>

                  {selectedDonor.last_donation_date && (
                    <div>
                      <p className="text-sm text-muted-foreground">Last Donation</p>
                      <p className="font-medium">{new Date(selectedDonor.last_donation_date).toLocaleDateString()}</p>
                    </div>
                  )}

                  {selectedDonor.medical_conditions && (
                    <div>
                      <p className="text-sm text-muted-foreground">Medical Conditions</p>
                      <p className="font-medium">{selectedDonor.medical_conditions}</p>
                    </div>
                  )}

                  <div className="pt-4 space-y-2">
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