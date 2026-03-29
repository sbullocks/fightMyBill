-- Enable pgcrypto for gen_random_uuid
create extension if not exists "pgcrypto";

-- analyses table
create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'processing' check (status in ('processing', 'complete', 'failed')),
  paid boolean not null default false,
  pack_id uuid,
  free_data jsonb,
  paid_data jsonb,
  stripe_session_id text,
  stripe_payment_intent text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '90 days')
);

-- bill_packs table
create table if not exists public.bill_packs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_session_id text not null,
  total_credits integer not null default 3,
  used_credits integer not null default 0,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '90 days')
);

-- Add FK from analyses.pack_id to bill_packs.id
alter table public.analyses
  add constraint fk_analyses_pack_id
  foreign key (pack_id) references public.bill_packs(id) on delete set null;

-- Indexes
create index if not exists idx_analyses_session_id on public.analyses(session_id);
create index if not exists idx_analyses_user_id on public.analyses(user_id);
create index if not exists idx_analyses_expires_at on public.analyses(expires_at);
create index if not exists idx_bill_packs_user_id on public.bill_packs(user_id);
