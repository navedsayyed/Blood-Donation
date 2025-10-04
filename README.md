# Welcome to your project

## Project info

**URL**: (project URL or local)

## How can I edit this code?

There are several ways of editing your application.

You can edit this project locally using your preferred IDE or editor. Changes can be committed and pushed to your repository as usual.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Follow your normal deployment workflow or hosting provider's instructions to publish this project.

## Can I connect a custom domain?

Yes — follow your hosting provider's domain configuration steps. If you deploy to a platform, check its docs for custom domain setup.

## Supabase — setup your own database (step-by-step)

If your friend already used Supabase for this project, you can create your own Supabase project and run the included migrations so the app works exactly the same.

1) Create a Supabase project
	- Go to https://app.supabase.com and sign in or sign up.
	- Click "New project" and follow the prompts. Choose a password for the database and note it down.
	- Wait for the project to be provisioned.

2) Get the project URL and anon/public key
	- In the Supabase project, open Settings → API.
	- Copy the "Project URL" (it looks like https://<project-ref>.supabase.co).
	- Copy the "anon/public" key under "Config" → "API" (Client API keys).

3) Add keys locally
	- Copy `.env.example` to `.env` at the repository root and fill the values:

	  VITE_SUPABASE_URL=https://your-project-ref.supabase.co
	  VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-or-public-key

	- Vite will load env variables prefixed with VITE_ at build/dev time.

4) Run the migrations (create tables, enums, policies)
	- The SQL migration is in `supabase/migrations/20251004083457_05a9cc30-a14b-43a4-b755-7a2a9059df9d.sql` and it creates the `profiles`, `user_roles`, `donors` tables, enum `app_role`, RLS policies, triggers and helper functions.
	- You can apply this SQL in two ways:
	  - Supabase Dashboard: open SQL Editor → run the contents of that file.
	  - supabase CLI: install the Supabase CLI (https://supabase.com/docs/guides/cli) and use `supabase db remote commit` / `supabase db push` depending on CLI version. (See Supabase docs for exact commands.)

5) Start the app locally
	- Install deps and run dev server:

	  npm install
	  npm run dev

	- Open http://localhost:5173 (or the URL shown by Vite).

6) Verify
	- Register a new user in the app. The `auth.users` row is handled by Supabase Auth. The migration's trigger `handle_new_user` will create a matching `profiles` row and a default `user_roles` entry.
	- In the Supabase Dashboard you should see rows in `profiles`, `user_roles`, and `donors` after relevant actions.

Notes and tips
 - If you need server-side service role actions (not recommended in the browser), you'll find the service_role key in Settings → API. Keep it secret — never commit it.
 - If you run into CORS or missing env issues, ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are present in your `.env` and that Vite was restarted after changes.
 - The app expects the DB schema shown in `src/integrations/supabase/types.ts`. If you modify tables, regenerate types if you use a generator.

