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

## Sephora click reporting

The wishlist's native Sephora link emits `sephora_link_clicked` through the existing
optional PostHog client. Properties are `destination: sephora`, `source: wishlist`,
and `product_id: sha256_v1_<digest>`. The digest groups normalized brand/name pairs
because recommendations have no catalog ID; it is not a Sephora SKU and cannot show
human-readable product names. Names, brands, photos, analysis contents, and search
URLs are not sent by this handler. Event URL context is reduced to the site origin.
The SDK's existing identity/context behavior otherwise remains in effect.

Only primary/keyboard activation and middle-button auxiliary activation count;
right-click menus do not count. A browser's “open link” context-menu action cannot
be measured by this handler. Counts are best effort: Do Not Track, SDK opt-out,
missing configuration, blockers, network failures and tab closure can omit events.
Unique PostHog users are browser/account identifiers, not a verified person count.
Historical missing clicks cannot be recovered.

After approval to release, deploy the reviewed change using the existing Vercel
workflow. Verify Production retains its existing `VITE_POSTHOG_KEY` and host
configuration without exposing values; Vite embeds these at build time, so a
configuration change requires a rebuild. Do not enable global autocapture or
recording. No PostHog dashboard changes are required to ingest the event.

In PostHog Product analytics, select `sephora_link_clicked`, use **Total count**,
filter `$host = www.glowa.beauty` and `source = wishlist`, and set the desired dates
and timezone. Break down by `product_id` for product groups, or by day for trends.
Use unique users only as a separate approximate metric. Saving an insight or
changing backend settings is a separate action. Verify ingestion with an explicitly
authorized staging/test project or the first real production event; do not generate
fake production clicks as part of local tests.
