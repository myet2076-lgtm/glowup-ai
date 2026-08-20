# Production deployment checklist

The codebase is production-buildable, but the external services below must be configured before public launch.

## 1. Vercel environment variables

Configure these separately for Production and Preview environments.

Required:

- `OPENAI_API_KEY`: a project-scoped OpenAI API key. Keep it server-only.
- `APP_ORIGIN`: the exact production origin, for example `https://glowa.example.com`.

Recommended model overrides:

- `OPENAI_TEXT_MODEL`: defaults to `gpt-4o`.
- `OPENAI_IMAGE_MODEL`: defaults to `gpt-image-1`.

Required for accounts and cloud sync:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Optional analytics:

- `VITE_POSTHOG_KEY`
- `VITE_POSTHOG_HOST` (defaults to the US PostHog host)

After configuration, redeploy and verify `GET /api/health` returns HTTP 200 with `{"status":"ok"}`. The health endpoint never returns secret values.

## 2. OpenAI cost and abuse controls

The API function performs same-origin checks, request-size validation, and best-effort per-instance rate limiting. Serverless in-memory limits are not a complete public abuse-control system.

Before launch:

1. Use a dedicated OpenAI Project and restricted project API key.
2. Configure project spend alerts and a hard operational budget.
3. Enable Vercel Firewall rate limiting for `/api/ai` (or add a durable Redis/Upstash limiter).
4. Monitor 429, 5xx, latency, token usage, and image-generation spend.
5. Rotate any OpenAI key that was previously used by the browser build; older versions of this project embedded it in client JavaScript.

## 3. Supabase

1. Create a production Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Confirm row-level security is enabled on `analyses`, `inventory`, and `profiles`.
4. Configure the production site URL and allowed redirect URLs in Authentication URL settings.
5. Enable/configure Google OAuth only if the Google sign-in button will remain visible.
6. Configure email confirmation, SMTP, password policy, CAPTCHA, and auth rate limits.
7. Test two separate accounts and confirm neither can read or modify the other's rows.
8. Define an account-deletion support process; auth-user deletion requires an administrative server-side workflow.

The Supabase anon key is intended to be client-visible. Security depends on RLS policies, so never place the Supabase service-role key in a `VITE_` variable.

## 4. Analytics and privacy

PostHog is disabled when `VITE_POSTHOG_KEY` is absent. If enabled, configure a data-retention period and consent/banner behavior appropriate to the launch jurisdictions.

Before accepting real users:

- Replace the support email if needed.
- Have counsel review the Privacy Policy and Terms, especially facial-photo processing, minors, biometric/privacy laws, AI-generated likenesses, and international transfers.
- Publish a deletion/request workflow and response timeline.
- Decide whether users must consent before any photo is sent to OpenAI.

## 5. Release verification

```bash
npm ci
npm audit --audit-level=high
npm run check
```

On a Vercel preview deployment, verify:

- `/api/health` is healthy.
- Home, account sign-in, and cloud sync work.
- Face validation and each analysis path returns a result.
- Makeup and hair image generation work with representative JPEG, PNG, and WebP files.
- Oversized/invalid uploads show a safe error.
- Cross-origin POST requests to `/api/ai` are rejected.
- Mobile and desktop layouts have no console errors.

Only promote the preview after all checks pass and spend/abuse monitoring is active.
