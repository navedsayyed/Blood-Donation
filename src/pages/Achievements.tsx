import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface Badge {
  name: string;
  icon: string;
  color: string;
  description: string;
}

const Achievements = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [donor, setDonor] = useState<DonorProfile | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);

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
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({ title: 'No profile', description: 'Please register as a donor to see achievements', variant: 'default' });
        navigate('/register-donor');
        return;
      }

      setDonor(data);

      // compute badges
      const b: Badge[] = [];
      b.push({ name: 'Welcome', icon: '👋', color: 'from-blue-500 to-cyan-500', description: 'New Member' });
      if (data.last_donation_date) {
        b.push({ name: 'Golden Donor', icon: '🏆', color: 'from-yellow-500 to-amber-500', description: 'First Donation Complete' });
      }
      if (data.available_to_donate) {
        b.push({ name: 'Life Saver', icon: '❤️', color: 'from-red-500 to-pink-500', description: 'Ready to Help' });
      }

      setBadges(b);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to load profile', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Award className="w-12 h-12 text-red-600 animate-pulse" />
        <p className="text-lg font-medium text-gray-800">Loading achievements...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-red-700 flex items-center gap-3">
            <Award className="w-6 h-6 text-red-600" />
            Achievements
          </h1>
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>

        {badges.length === 0 ? (
          <div className="p-6 bg-gray-50 rounded-lg text-center">No achievements yet — start donating to earn badges.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {badges.map((badge, idx) => (
              <Card key={idx} className="shadow">
                <CardHeader className={`bg-gradient-to-r ${badge.color} text-white`}>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">{badge.icon}</span>
                    <span className="font-semibold">{badge.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;
