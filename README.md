# Glowa

Glowa is a React/Vite beauty styling application with OpenAI-powered analysis and image editing, optional Supabase authentication/cloud sync, and optional PostHog analytics.

## Local development

Prerequisites: Node.js 22 and npm.

```bash
cp .env.example .env.local
npm install
npm run dev
```

The Vite development server runs the frontend only. AI calls use Vercel serverless functions under `/api`, so use `vercel dev` when testing live AI calls locally or deploy a preview to Vercel.

Never expose `OPENAI_API_KEY` through a `VITE_` variable. It must exist only in the server/runtime environment.

## Verification

```bash
npm run check
```

This runs TypeScript, Vitest, and the production build. GitHub Actions runs the same command for pushes and pull requests.

## Production deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for required environment variables, Supabase setup, abuse/cost controls, and the release checklist.

## Architecture

- Browser: React 19, Vite, Tailwind, IndexedDB
- Server: Vercel functions in `api/`
- AI: OpenAI SDK, called only from the server
- Optional account sync: Supabase with row-level security
- Optional analytics: PostHog, with autocapture disabled
