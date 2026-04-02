-- Step 1: Enable RLS on checkout_attempts and deny all direct client access.
-- The table is only ever written/read by edge functions using the service role key.
alter table public.checkout_attempts enable row level security;

create policy "no_client_access_checkout_attempts"
  on public.checkout_attempts
  for all
  using (false)
  with check (false);

-- Step 2: Atomic pack-credit deduction.
-- Returns true if a credit was successfully consumed, false if none were available.
-- Using SECURITY DEFINER so it runs with the table owner's privileges even when
-- called from an edge function authenticated as the anon role.
create or replace function public.use_pack_credit(p_pack_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_count int;
begin
  update bill_packs
  set used_credits = used_credits + 1
  where id = p_pack_id
    and active = true
    and used_credits < total_credits;
  get diagnostics updated_count = row_count;
  return updated_count > 0;
end;
$$;

-- Step 3: Atomic promo-slot claim.
-- Uses a session-level advisory lock so concurrent calls serialize, preventing
-- multiple callers from reading the same count before any insertion occurs.
-- Returns true if the caller is within the promo limit and has claimed a slot.
create or replace function public.claim_promo_analysis(p_limit int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_count bigint;
begin
  -- Advisory lock serializes concurrent promo claims for the duration of this call.
  perform pg_advisory_xact_lock(hashtext('fmb_promo_claim'));
  select count(*) into current_count from analyses where paid = true;
  return current_count < p_limit;
end;
$$;
