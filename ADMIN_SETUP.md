# Admin Account Setup Guide

## Default Admin Credentials

For quick testing and development, use these default admin credentials:

```
Email: admin@lifelink.com
Password: Admin@123
```

⚠️ **IMPORTANT**: Change these credentials in production environments!

## How to Set Up the Admin Account

### Option 1: Using Supabase Dashboard (Recommended)

1. **Open your Supabase project dashboard**
   - Go to https://app.supabase.com
   - Select your project: `ziamgsdxqgcsquleqeca`

2. **Create the admin user**
   - Navigate to **Authentication** → **Users**
   - Click **"Add user"** or **"Create new user"**
   - Enter:
     - Email: `admin@lifelink.com`
     - Password: `Admin@123`
     - ✅ Check "Auto Confirm User" (skip email confirmation)
   - Click **"Create user"**
   - Copy the generated **User ID** (UUID)

3. **Grant admin role**
   - Navigate to **Database** → **Table Editor**
   - Open the `user_roles` table
   - Click **"Insert row"**
   - Enter:
     - user_id: `<paste the User ID from step 2>`
     - role: `admin`
   - Click **"Save"**

4. **Test the login**
   - Go to your app (http://localhost:5173 or your deployed URL)
   - Click the **Admin** tab on the login page
   - Enter:
     - Email: `admin@lifelink.com`
     - Password: `Admin@123`
   - Click **"Sign In as Admin"**
   - You should now see the Admin Dashboard!

### Option 2: Using SQL Editor

1. **Create the admin user in Supabase Dashboard** (Authentication → Users → Add user)
   - Use the credentials above
   - Copy the generated User ID

2. **Run this SQL in the SQL Editor**
   ```sql
   -- Replace <USER_ID> with the actual UUID from step 1
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('<USER_ID>', 'admin')
   ON CONFLICT (user_id, role) DO NOTHING;
   ```

### Option 3: Run the Migration

If you're using Supabase CLI locally:

1. First, create the user manually in Supabase Dashboard (as in Option 1, step 2)
2. Note the User ID
3. Edit the migration file: `supabase/migrations/20251004120000_create_default_admin.sql`
4. Uncomment the last section and replace `<REPLACE_WITH_ACTUAL_USER_ID>` with your User ID
5. Run: `supabase db push` (if using local Supabase CLI)

## Troubleshooting

### "Not authorized as admin" error
- Make sure the `user_roles` table has a row with:
  - The correct `user_id` (matching the Auth user)
  - `role` = `'admin'`

### Can't create user in Dashboard
- Check that you have owner/admin access to the Supabase project
- Try using the SQL Editor instead

### Email confirmation required
- When creating the user in Dashboard, make sure to check **"Auto Confirm User"**
- Or manually confirm the user in Authentication → Users → (select user) → Confirm Email

## Security Notes

- These default credentials are for **development only**
- In production:
  - Create a unique admin email and strong password
  - Use password managers
  - Enable 2FA if available
  - Never commit real credentials to git

## Additional Admin Users

To create more admin users, repeat the steps above with different email addresses.
