import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, MapPin, Calendar, Award } from 'lucide-react';

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
  photo_url?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [donor, setDonor] = useState<DonorProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<DonorProfile>>({});
  const [uploading, setUploading] = useState(false);
  const [selectedBlood, setSelectedBlood] = useState<string>('A+');

  const compatibilityMap: Record<string, { donors: string[]; recipients: string[] }> = {
    'A+': { donors: ['O+','O-','A+','A-'], recipients: ['A+','AB+'] },
    'O+': { donors: ['O+','O-'], recipients: ['O+','A+','B+','AB+'] },
    'B+': { donors: ['O+','O-','B+','B-'], recipients: ['B+','AB+'] },
    'AB+': { donors: ['O+','O-','A+','A-','B+','B-','AB+','AB-'], recipients: ['AB+'] },
    'A-': { donors: ['O-','A-'], recipients: ['A+','A-','AB+','AB-'] },
    'O-': { donors: ['O-'], recipients: ['Everyone'] },
    'B-': { donors: ['O-','B-'], recipients: ['B+','B-','AB+','AB-'] },
    'AB-': { donors: ['O-','A-','B-','AB-'], recipients: ['AB+','AB-'] },
  };

  const getCompatibleDonors = (bt: string) => compatibilityMap[bt]?.donors || [];
  const getCompatibleRecipients = (bt: string) => compatibilityMap[bt]?.recipients || [];

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/login'); return; }
      const { data, error } = await supabase.from('donors').select('*').eq('user_id', user.id).maybeSingle();
      if (error) throw error;
      if (!data) { toast({ title: 'No profile', description: 'Please register as a donor', variant: 'default' }); navigate('/register-donor'); return; }
      setDonor(data);
      setForm(data);
      if (data.blood_group) setSelectedBlood(data.blood_group);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to load profile', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const handleChange = (k: keyof DonorProfile, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const ext = file.name.split('.').pop();
      const name = `${Date.now()}.${ext}`;
      const { data: res, error } = await supabase.storage.from('profiles').upload(name, file, { upsert: true });
      if (error) throw error;
      const url = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profiles/${res.path}`;
      handleChange('photo_url' as any, url);
      toast({ title: 'Uploaded', description: 'Photo uploaded' });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message || String(err), variant: 'destructive' });
    } finally { setUploading(false); }
  };

  const save = async () => {
    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate('/login');
      const payload: any = { full_name: form.full_name, phone: form.phone, age: form.age, gender: form.gender, city: form.city, state: form.state, available_to_donate: form.available_to_donate };
      if ((form as any).photo_url) payload.photo_url = (form as any).photo_url;
      const { error } = await supabase.from('donors').update(payload).eq('user_id', user.id);
      if (error) throw error;
      toast({ title: 'Saved' });
      await fetchProfile();
      setEditing(false);
    } catch (err: any) { toast({ title: 'Save failed', description: err.message || String(err), variant: 'destructive' }); }
    finally { setUploading(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero / donation info like the screenshot */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-center text-red-700 mb-6">Learn About Donation</h2>
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <p className="text-center text-gray-600 mb-4">Select your Blood Type</p>
              <div className="flex flex-wrap gap-3 mb-6 justify-center">
                {['A+','O+','B+','AB+','A-','O-','B-','AB-'].map(bt => (
                  <button key={bt} onClick={() => setSelectedBlood(bt)} className={`px-6 py-4 rounded-lg border-2 ${selectedBlood===bt ? 'bg-red-700 text-white border-red-700' : 'bg-white text-gray-800 border-red-600'} shadow font-semibold`}>{bt}</button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-6 rounded-md bg-amber-100">
                  <h3 className="text-xl font-semibold mb-2">You can take from</h3>
                  <p className="text-lg font-medium">
                    {getCompatibleDonors(selectedBlood).join(' ')}
                  </p>
                </div>
                <div className="p-6 rounded-md bg-sky-100">
                  <h3 className="text-xl font-semibold mb-2">You can give to</h3>
                  <p className="text-lg font-medium">{getCompatibleRecipients(selectedBlood).join(' ')}</p>
                </div>
              </div>
            </div>
            <div className="w-96 hidden lg:block">
              <img src="/placeholder.svg" alt="donation" className="rounded-lg object-cover w-full h-64" />
              <p className="text-center mt-4 text-lg">One Blood Donation can save upto <span className="text-red-600 font-bold">Three Lives</span></p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-6 mt-12">
          <div className="w-1/3">
            <Card>
              <CardContent>
                <div className="flex flex-col items-center gap-4 p-4">
                  <img src={donor?.photo_url || '/placeholder.svg'} alt="avatar" className="w-32 h-32 rounded-full object-cover" />
                  <h3 className="text-lg font-semibold">{donor?.full_name}</h3>
                  <p className="text-sm text-gray-500">{donor?.city}, {donor?.state}</p>
                  <div className="flex gap-2 mt-2">
                    <Button onClick={() => setEditing(true)}>Edit</Button>
                    <Button variant="ghost" onClick={() => navigate('/dashboard')}>Back</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex-1">
            <Card>
              <CardHeader className="bg-white border-b">
                <CardTitle className="text-red-700">Profile Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {editing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <input value={form.full_name || ''} onChange={(e) => handleChange('full_name', e.target.value)} className="p-2 border rounded" placeholder="Full name" />
                      <input value={form.email || ''} disabled className="p-2 border rounded bg-gray-50" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input value={form.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} className="p-2 border rounded" placeholder="Phone" />
                      <input value={form.age || ''} onChange={(e) => handleChange('age', Number(e.target.value))} className="p-2 border rounded" type="number" placeholder="Age" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <select value={form.gender || ''} onChange={(e) => handleChange('gender', e.target.value)} className="p-2 border rounded">
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <input value={form.blood_group || ''} disabled className="p-2 border rounded bg-gray-50" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input value={form.city || ''} onChange={(e) => handleChange('city', e.target.value)} className="p-2 border rounded" placeholder="City" />
                      <input value={form.state || ''} onChange={(e) => handleChange('state', e.target.value)} className="p-2 border rounded" placeholder="State" />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm">Upload photo</label>
                      <input type="file" accept="image/*" onChange={handleFile} />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={save} disabled={uploading}>Save</Button>
                      <Button variant="ghost" onClick={() => { setEditing(false); setForm(donor || {}); }}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Full name</p>
                        <p className="font-medium">{donor?.full_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{donor?.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{donor?.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Age</p>
                        <p className="font-medium">{donor?.age}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="font-medium capitalize">{donor?.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Blood Group</p>
                        <p className="font-medium">{donor?.blood_group}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{donor?.city}, {donor?.state}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Donation Status</p>
                        <p className="font-medium">{donor?.available_to_donate ? 'Available' : 'Not Available'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
