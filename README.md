# Blood Donation Management System

This repository contains the Blood Donation Management System — a React + TypeScript single-page application that integrates with Supabase for auth and data storage. The app provides donor registration, admin dashboard, and user dashboards for managing donors and donations.

## Quick links
- Local dev URL (default Vite): http://localhost:5173 (Vite may show a different port like 8080; check terminal output)
- Supabase migrations: `supabase/migrations/20251004083457_05a9cc30-a14b-43a4-b755-7a2a9059df9d.sql`

## Features
- Donor registration and profile management
- User authentication (Supabase Auth)
- Admin dashboard with basic analytics and donor management
- Role-based access control (admin / donor)

## Requirements
- Node.js (16+, recommended LTS)
- npm (or pnpm/yarn) — this project uses npm by default
- Supabase account (for running against a hosted DB) — optional for local UI-only work

## Setup (local development)
1. Clone the repo:

```bash
git clone <YOUR_REPO_URL>
cd life-link-dashboard-main
```

2. Copy environment example and set values:

```bash
cp .env.example .env
# Edit .env with your VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY
```

3. Install dependencies:

```bash
npm install
```

4. Start the dev server:

```bash
npm run dev
```

Open the URL printed by Vite (http://localhost:5173 or the URL shown in terminal).

## Environment variables
Create a `.env` file at the project root with:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-or-public-key
```

Keep service_role or any server keys out of browser code.

## Supabase migrations
- The SQL file at `supabase/migrations/20251004083457_05a9cc30-a14b-43a4-b755-7a2a9059df9d.sql` sets up the expected schema (profiles, user_roles, donors, RLS policies, triggers). Use the Supabase dashboard or CLI to run it.

## Key scripts
- `npm run dev` — start Vite dev server
- `npm run build` — build production assets
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint

## Project structure (important files)
- `src/` — application source
	- `main.tsx` — app entry
	- `App.tsx` — top-level App component and routing
	- `pages/` — page components (AdminDashboard, UserDashboard, Login, RegisterDonor, etc.)
	- `integrations/supabase/` — Supabase client and types
	- `components/` — UI building blocks
- `public/` — static assets (favicon, logos)
- `supabase/` — migration SQL and config

## How to run the migrations locally
1. Create a Supabase project and get the URL and anon key.
2. Connect with the Supabase CLI or use the dashboard SQL editor to run the migration file.

## Common troubleshooting
- If icons or favicons don't update, hard-refresh (Ctrl+F5) or clear cache. Favicons are heavily cached by browsers.
- If TypeScript or build errors appear after edits, run `npm run dev` and check the terminal output for exact errors; fix import paths or missing types.
- If Supabase errors show up, verify env variables and confirm the migration has been applied.

## Deployment notes
- Build with `npm run build` and deploy the `dist/` folder to your static host (Netlify, Vercel, Cloudflare Pages, etc.) or serve via a Node server that hosts static files.
- If you deploy to a platform that supports environment variables, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` there.

## Contributors & contact
- Repo owner / maintainer: navedsayyed

---

If you'd like, I can:
- Add a short screenshot gallery to `README.md` (login, admin dashboard, donor registration)
- Add a quick health-check script for Supabase connectivity
- Add a small CONTRIBUTING.md with development guidelines

Tell me which additions you want and I'll add them.

