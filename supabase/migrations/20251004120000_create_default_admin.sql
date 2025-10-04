-- Create default admin user for development/testing
-- This migration creates a default admin account with known credentials
-- 
-- Default Admin Credentials:
-- Email: admin@lifelink.com
-- Password: Admin@123
--
-- IMPORTANT: Change these credentials in production!

-- First, create the admin user in auth.users
-- Note: In production Supabase, you typically create users via the Auth API or Dashboard
-- This is a simplified approach for local development

-- Insert into auth.users (this approach works for local Supabase)
-- For hosted Supabase, you'll need to create the user via Dashboard or API first,
-- then run the second part of this migration with the actual user_id

DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Check if admin user already exists
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'admin@lifelink.com';

  -- If user doesn't exist, we'll create a placeholder
  -- For hosted Supabase: Create user manually in Dashboard with email 'admin@lifelink.com' and password 'Admin@123'
  -- Then the user_roles insert below will work
  
  IF admin_user_id IS NULL THEN
    -- Generate a fixed UUID for the admin user (for consistency across resets)
    admin_user_id := '00000000-0000-0000-0000-000000000001'::uuid;
    
    -- Note: Direct insert into auth.users requires service role or special permissions
    -- For hosted Supabase, create the user via Authentication UI instead
    -- This SQL is primarily for reference
    
    RAISE NOTICE 'Admin user does not exist yet. Please create user with email: admin@lifelink.com in Supabase Dashboard';
    RAISE NOTICE 'Then the user_roles entry below will grant admin access.';
  END IF;

  -- Create or update the admin role entry
  INSERT INTO public.user_roles (user_id, role, created_at)
  VALUES (admin_user_id, 'admin', NOW())
  ON CONFLICT (user_id, role) 
  DO NOTHING;

  RAISE NOTICE 'Admin role configured for user: %', admin_user_id;
END $$;

-- Alternative: If you've already created the admin user in Supabase Dashboard,
-- you can uncomment and run this with the actual user_id:
--
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('<REPLACE_WITH_ACTUAL_USER_ID>', 'admin')
-- ON CONFLICT (user_id, role) DO NOTHING;
