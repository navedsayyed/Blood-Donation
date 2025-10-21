# 🩸 Blood-O - Blood Donation Management System

A modern, full-stack web application built to connect blood donors with those in need. Blood-O streamlines the blood donation process, making it easier for donors to register, track their donations, and for administrators to manage urgent blood requests efficiently.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://navedsayyed.github.io/Blood-Donation/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🌟 Features

### 🏠 **Landing Page**
- **Educational Content**: Comprehensive information about blood donation importance
- **Interactive Blood Type Selector**: Learn about blood compatibility - who you can donate to and receive from
- **Donation Types Guide**: Detailed information about Red Blood Cells, Plasma, and Platelets donation
- **Automatic Image Slideshow**: Visual representation of the donation process
- **Responsive Design**: Optimized for both desktop and mobile devices

### 👤 **Donor Dashboard**
- **Profile Management**: View and edit personal information
- **Blood Type Compatibility**: Interactive display showing compatible donors and recipients
- **Donation History**: Track past donations and availability status
- **Achievements System**: Earn badges like "Welcome Hero," "Golden Donor," and "Life Saver"
- **Profile Photo Upload**: Upload and manage profile pictures via Supabase Storage

### 👨‍💼 **Admin Dashboard**
- **Donor Management**: View and manage all registered donors
- **Urgent Blood Requests**: Create, track, and fulfill urgent blood needs
- **Request History**: Complete history of all blood requests with status tracking
- **Analytics Dashboard**: Real-time statistics on donors and donations
- **Cancel/Fulfill Requests**: Manage urgent requests efficiently

### 🔐 **Authentication & Security**
- Secure authentication powered by Supabase Auth
- Role-based access control (Admin/Donor)
- Protected routes and secure data handling
- Session management with automatic redirects

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components
- **Lucide React** - Modern icon library
- **React Router** - Client-side routing

### **Backend & Database**
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Authentication
  - Storage for profile images
  - Real-time subscriptions

### **Deployment**
- **GitHub Pages** - Static site hosting
- **GitHub Actions** - CI/CD pipeline

## 📁 Project Structure

```
Blood-Donation/
├── public/
│   ├── images/              # Slideshow and illustration images
│   └── ...
├── src/
│   ├── components/
│   │   └── ui/              # shadcn/ui components
│   ├── contexts/
│   │   └── AuthContext.tsx  # Authentication context
│   ├── integrations/
│   │   └── supabase/        # Supabase client & types
│   ├── pages/
│   │   ├── Home.tsx         # Landing page
│   │   ├── Login.tsx        # Login page
│   │   ├── RegisterDonor.tsx # Donor registration
│   │   ├── UserDashboard.tsx # Donor dashboard
│   │   ├── AdminDashboard.tsx # Admin panel
│   │   ├── Profile.tsx      # Donor profile page
│   │   └── Achievements.tsx # Achievements page
│   ├── App.tsx              # Main app component
│   └── main.tsx             # App entry point
├── supabase/
│   └── migrations/          # Database migrations
└── package.json

```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or bun
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/navedsayyed/Blood-Donation.git
cd Blood-Donation
```

2. **Install dependencies**
```bash
npm install
# or
bun install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-or-public-key
```

> ⚠️ **Important**: Never commit your `.env` file or expose your service_role key in the browser code.

4. **Set up Supabase Database**

Run the migrations in your Supabase project:
- Navigate to SQL Editor in your Supabase dashboard
- Execute the migration files in `supabase/migrations/` folder in order:
  - `20251004_urgent_blood_requests.sql`
  - `20251004083457_05a9cc30-a14b-43a4-b755-7a2a9059df9d.sql`
  - `20251004120000_create_default_admin.sql`

5. **Start the development server**

```bash
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:8080`

## 📖 Usage

### For Donors

1. **Registration**
   - Click "Register as Donor" on the landing page
   - Fill in personal details (name, email, blood type, location)
   - Upload profile photo (optional)
   - Complete registration to create your donor profile

2. **Login**
   - Use your registered email and password
   - Access your personalized donor dashboard

3. **Donor Dashboard**
   - View your profile information and donation history
   - See urgent blood requests in your area
   - Track your total donations and achievements
   - Update your profile details
   - Manage notification preferences

### For Administrators

1. **Admin Login**
   - Default admin credentials (set during migration):
     - Email: `admin@blooddonation.com`
     - Password: `admin123`
   - ⚠️ **Change these credentials immediately in production!**

2. **Admin Dashboard**
   - View all registered donors with search and filter
   - Create urgent blood requests
   - Manage donor profiles (edit, delete)
   - View donation statistics and analytics
   - Export donor data for reports

## 🗃️ Database Schema

### **profiles** table
Stores user profile information linked to Supabase Auth.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key, references auth.users |
| email | text | User email address |
| full_name | text | User's full name |
| created_at | timestamp | Account creation time |
| updated_at | timestamp | Last profile update |

### **donors** table
Stores donor-specific information.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to profiles |
| full_name | text | Donor's full name |
| email | text | Donor's email |
| blood_type | text | Blood type (A+, A-, B+, B-, AB+, AB-, O+, O-) |
| phone | text | Contact number |
| address | text | Physical address |
| city | text | City/town |
| state | text | State/province |
| pincode | text | Postal/ZIP code |
| age | integer | Donor's age |
| weight | numeric | Donor's weight (kg) |
| profile_photo_url | text | URL to profile photo in Supabase storage |
| total_donations | integer | Total number of donations (default: 0) |
| last_donation_date | date | Date of last donation |
| created_at | timestamp | Registration timestamp |
| is_available | boolean | Availability status (default: true) |

### **urgent_blood_requests** table
Stores urgent blood requirement requests.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| blood_type | text | Required blood type |
| units_needed | integer | Number of units needed |
| hospital_name | text | Hospital name |
| contact_person | text | Contact person name |
| contact_phone | text | Contact number |
| location | text | Hospital location |
| urgency_level | text | Critical/High/Medium/Low |
| description | text | Additional details |
| created_at | timestamp | Request creation time |
| expires_at | timestamp | Request expiry time |
| status | text | Active/Fulfilled/Expired |

### **user_roles** table
Manages user roles (donor/admin).

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to auth.users |
| role | text | User role (donor/admin) |
| created_at | timestamp | Role assignment time |

## 🚀 Deployment

### Local Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

### GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages:

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

3. **Deployment Process**
   - The `predeploy` script automatically runs `npm run build`
   - The `deploy` script publishes the `dist/` folder to the `gh-pages` branch
   - GitHub Pages serves the site from the `gh-pages` branch

4. **Access Your Site**
   - Live at: `https://[your-username].github.io/[repository-name]/`
   - Current deployment: https://navedsayyed.github.io/Blood-Donation/

### Production Environment Variables

Set these in your deployment platform:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon/public key

### Other Hosting Options

The built `dist/` folder can be deployed to:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop `dist/` folder or connect GitHub repo
- **Cloudflare Pages**: Connect GitHub repo with build command `npm run build`

## 🐛 Troubleshooting

### Images Not Loading
- Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache and disable cache in DevTools
- Verify images exist in `public/images/` folder
- Check that `BASE_URL` is correctly configured in `vite.config.ts`

### Build Errors
- Run `npm run dev` to see detailed error messages
- Check for missing imports or incorrect file paths
- Verify TypeScript types are correct
- Ensure all dependencies are installed (`npm install`)

### Supabase Connection Issues
- Verify `.env` file has correct credentials
- Check that migrations have been executed
- Confirm Row Level Security (RLS) policies are properly set
- Test Supabase connection in the console

### Mobile Layout Issues
- Test responsive design using browser DevTools
- Verify Tailwind breakpoints (sm:, md:, lg:) are applied correctly
- Check that `whitespace-nowrap` is used for text that shouldn't break

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Write clean, documented code
   - Follow existing code style and conventions
   - Test your changes thoroughly
4. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines

- Use TypeScript for type safety
- Follow React best practices and hooks patterns
- Use Tailwind CSS utility classes for styling
- Leverage shadcn/ui components for UI elements
- Write descriptive commit messages
- Test on multiple screen sizes (mobile, tablet, desktop)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

**Project Maintainer**: Naved Sayyed

- GitHub: [@navedsayyed](https://github.com/navedsayyed)
- Project Link: [https://github.com/navedsayyed/Blood-Donation](https://github.com/navedsayyed/Blood-Donation)
- Live Demo: [https://navedsayyed.github.io/Blood-Donation/](https://navedsayyed.github.io/Blood-Donation/)

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [Supabase](https://supabase.com/) - Backend services
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Lucide Icons](https://lucide.dev/) - Icon library

---

Made with ❤️ for saving lives through blood donation

