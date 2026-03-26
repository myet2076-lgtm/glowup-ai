# Supabase Setup (P1.5)

Follow these steps once in your Supabase project.

## 1) Run database schema

1. Open **Supabase Dashboard → SQL Editor**
2. Open `supabase/schema.sql` from this repo and copy all SQL.
3. Paste into SQL Editor and run.

This creates:
- `analyses`
- `inventory`
- `profiles`

with RLS so each user can only access their own rows.

## 2) Configure Authentication providers

### Email/password
1. Go to **Authentication → Providers**
2. Ensure **Email** provider is enabled.

### Google OAuth
1. Go to **Authentication → Providers → Google**
2. Enable Google provider.
3. In Google Cloud Console, create OAuth credentials and add this redirect URI:
   - `https://<YOUR_PROJECT_REF>.supabase.co/auth/v1/callback`
4. Paste Google Client ID and Client Secret into Supabase Google provider settings.

## 3) Configure URL settings in Supabase

1. Go to **Authentication → URL Configuration**
2. Set **Site URL**:
   - Local dev: `http://localhost:5173`
   - Production: your deployed app URL
3. Add **Redirect URLs** (at minimum):
   - `http://localhost:5173`
   - your production URL (if deployed)

## 4) Verify local env vars

`.env.local` must include:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

(Already present for this project.)

## 5) Test checklist

1. Start app (`npm run dev`)
2. Click **Sign in** in header
3. Test Google login + email signup/signin
4. Create analysis/inventory/profile photo while logged in
5. Confirm records appear in Supabase tables
6. Sign out and confirm guest mode still works with local IndexedDB data
