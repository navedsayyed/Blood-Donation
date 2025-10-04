import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Droplet, Shield, User } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // User login/signup state
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Admin login state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const handleUserAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up new user
        const { error } = await supabase.auth.signUp({
          email: userEmail,
          password: userPassword,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: userFullName }
          }
        });

        if (error) throw error;

        // Don't assume an authenticated session is created here. Many Supabase
        // projects require email confirmation which means `signUp` will not
        // return an active session immediately. Navigating straight to the
        // donor registration page will cause the registration form to reject
        // submissions because the user isn't signed in yet.
        toast({
          title: "Account created!",
          description: "Check your email to confirm your account. After confirmation, sign in to complete donor registration.",
        });

        // Reset the sign-up form and switch back to the sign-in view.
        setIsSignUp(false);
        setUserFullName('');
        setUserEmail('');
        setUserPassword('');
      } else {
        // Sign in existing user
        const { error } = await supabase.auth.signInWithPassword({
          email: userEmail,
          password: userPassword,
        });

        if (error) throw error;

        // Check if user has donor profile
        const { data: donor } = await supabase
          .from('donors')
          .select('id')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .maybeSingle();

        if (!donor) {
          navigate('/register-donor');
        } else {
          navigate('/dashboard');
        }
      }
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

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });

      if (error) throw error;

      // Check if the signed-in user has an admin role
      const currentUser = (await supabase.auth.getUser()).data.user;
      if (!currentUser) {
        await supabase.auth.signOut();
        throw new Error('Authentication failed');
      }

      const { data: role } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', currentUser.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!role) {
        await supabase.auth.signOut();
        throw new Error('Not authorized as admin');
      }

      navigate('/admin');
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--gradient-secondary)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'var(--gradient-primary)' }}>
            <Droplet className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Blood Donation System</h1>
          <p className="text-muted-foreground">Save lives by donating blood</p>
        </div>

        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="user" className="gap-2">
              <User className="w-4 h-4" />
              User
            </TabsTrigger>
            <TabsTrigger value="admin" className="gap-2">
              <Shield className="w-4 h-4" />
              Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user">
            <Card>
              <CardHeader>
                <CardTitle>{isSignUp ? 'Create Account' : 'User Login'}</CardTitle>
                <CardDescription>
                  {isSignUp ? 'Register as a blood donor' : 'Sign in to your account'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUserAuth} className="space-y-4">
                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={userFullName}
                        onChange={(e) => setUserFullName(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="userEmail">Email</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      placeholder="user@example.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="userPassword">Password</Label>
                    <Input
                      id="userPassword"
                      type="password"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
                  </Button>

                  <Button
                    type="button"
                    variant="link"
                    className="w-full"
                    onClick={() => setIsSignUp(!isSignUp)}
                  >
                    {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>Access the admin dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      placeholder="admin@example.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adminPassword">Admin Password</Label>
                    <Input
                      id="adminPassword"
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Please wait...' : 'Sign In as Admin'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;