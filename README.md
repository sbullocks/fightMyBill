# FightMyBill

AI-powered medical bill auditor. Upload or paste a medical bill, get every line item decoded into plain English, and receive a personalized negotiation letter you can send to the billing department today.

**Live:** [fight-my-bill.vercel.app](https://fight-my-bill.vercel.app)

---

## What it does

1. **Free** — decodes every CPT/ICD code into plain English, shows total billed vs. total due, flags how many potential issues were found
2. **Paid ($5 single / $12 for 3-pack)** — full audit of each issue (duplicate charges, upcoding, unbundling, balance billing violations), estimated savings, and a ready-to-send negotiation letter

No account required for a single bill. Bill packs require an account.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| State / data fetching | Redux Toolkit, RTK Query |
| UI | Material UI v6 |
| Backend | Supabase (Postgres, Auth, Edge Functions) |
| AI | Anthropic Claude (claude-sonnet-4-6) |
| Payments | Stripe Checkout |
| Hosting | Vercel (frontend), Supabase (backend) |
| Tests | Vitest, React Testing Library |

---

## Local development

### Prerequisites

- Node.js 20+
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- A Supabase project
- An Anthropic API key
- A Stripe account (test mode is fine)

### 1. Clone and install

```bash
git clone https://github.com/sbullocks/fightMyBill.git
cd fightMyBill
npm install
```

### 2. Environment variables

Create a `.env` file in the project root (never commit this):

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_<your-key>
```

### 3. Supabase migrations

Run in order via the Supabase SQL editor or CLI:

```bash
supabase db push
```

Or paste each file manually in the Supabase dashboard SQL editor:

- `supabase/migrations/001_create_analyses.sql`
- `supabase/migrations/002_rls_policies.sql`
- `supabase/migrations/003_cleanup_cron.sql` *(requires pg_cron extension — enable in Dashboard → Database → Extensions first)*

### 4. Edge Function secrets

```bash
supabase link --project-ref <your-project-ref>

supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_PRICE_SINGLE=price_...
supabase secrets set STRIPE_PRICE_PACK=price_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...

# Optional: founding user promo — first N full analyses are free
# Set to 0 or omit to disable
supabase secrets set PROMO_FREE_LIMIT=50
```

### 5. Deploy Edge Functions

```bash
supabase functions deploy analyze-bill
supabase functions deploy get-analysis
supabase functions deploy create-checkout
supabase functions deploy stripe-webhook --no-verify-jwt
```

### 6. Run locally

```bash
npm run dev
```

---

## Stripe webhook setup

1. In the Stripe dashboard, go to **Developers → Webhooks → Add destination**
2. Set the endpoint URL to: `https://<your-project-ref>.supabase.co/functions/v1/stripe-webhook`
3. Select event: `checkout.session.completed`
4. Copy the signing secret and set it as `STRIPE_WEBHOOK_SECRET`

---

## Vercel deployment

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo
3. Add the three environment variables from your `.env` file in the Vercel dashboard
4. Deploy — the `vercel.json` rewrite rule handles SPA routing automatically

Your live URL will appear in the Vercel dashboard after the first deploy.

---

## Running tests

```bash
npm test          # run once
npm run test:watch  # watch mode
```

---

## Project structure

```
src/
  app/              Redux store
  components/       Shared UI (NavBar, Footer, ErrorBanner, etc.)
  features/
    analysis/       Bill upload form, results display, RTK Query endpoints
    auth/           Auth guard, login/register, auth slice
    payment/        Paywall modal, pricing cards, checkout API
  hooks/            useMyPack, useSessionId, useAnalysisPolling
  pages/            Route-level page components
  routes/           AppRouter
  theme/            MUI theme
  types/            Shared TypeScript types
supabase/
  functions/        Edge Functions (Deno)
  migrations/       SQL migrations
```

---

## Privacy and compliance

- Raw bill content is **never stored** — sent to Claude for analysis and immediately discarded
- Structured analysis results are stored for 90 days then auto-deleted
- Not a HIPAA Business Associate; operates as an informational analysis tool
- See [Privacy Policy](https://fight-my-bill.vercel.app/privacy) and [Terms of Service](https://fight-my-bill.vercel.app/terms)
