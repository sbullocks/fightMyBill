-- Track checkout attempts for rate limiting
create table if not exists public.checkout_attempts (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_checkout_attempts_session_id on public.checkout_attempts(session_id);
create index if not exists idx_checkout_attempts_created_at on public.checkout_attempts(created_at);
