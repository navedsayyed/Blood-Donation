import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Droplet, User } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // User login/signup state
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
  // unified login state
  // admin users will simply sign in with the same form; after sign-in we check role

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
        // Sign in existing user (could be admin or donor)
        const { error } = await supabase.auth.signInWithPassword({
          email: userEmail,
          password: userPassword,
        });

        if (error) throw error;

        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) throw new Error('Authentication failed');

        // Check if user has admin role
        const { data: role } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', currentUser.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (role) {
          navigate('/admin');
          return;
        }

        // Not admin -> check donor profile
        const { data: donor } = await supabase
          .from('donors')
          .select('id')
          .eq('user_id', currentUser.id)
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

        <Card>
          <CardHeader>
            <CardTitle>{isSignUp ? 'Create Account' : 'Sign In'}</CardTitle>
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
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
      </div>
    </div>
  );
};

export default Login;