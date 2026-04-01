# FightMyBill

AI-powered medical bill auditor. Upload or paste a medical bill, get every line item decoded into plain English, and receive a personalized negotiation letter you can send to the billing department today.

**Live:** [www.fight-my-bill.com](https://www.fight-my-bill.com)

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

## Privacy and compliance

- Raw bill content is **never stored** — sent to Claude for analysis and immediately discarded
- Structured analysis results are stored for 90 days then auto-deleted
- Not a HIPAA Business Associate; operates as an informational analysis tool
- See [Privacy Policy](https://www.fight-my-bill.com/privacy) and [Terms of Service](https://www.fight-my-bill.com/terms)
