-- Enable RLS
alter table public.analyses enable row level security;
alter table public.bill_packs enable row level security;

-- analyses: allow reading free_data by matching session_id (excludes paid_data via column selection in Edge Function)
create policy "select_analyses_by_session"
  on public.analyses
  for select
  using (session_id = current_setting('request.headers', true)::json->>'x-session-id');

-- analyses: allow authenticated users to see their own rows
create policy "select_analyses_by_user"
  on public.analyses
  for select
  using (user_id = auth.uid());

-- analyses: no client-side inserts — service role only
create policy "no_client_insert_analyses"
  on public.analyses
  for insert
  with check (false);

-- analyses: no client-side updates — service role only
create policy "no_client_update_analyses"
  on public.analyses
  for update
  using (false);

-- analyses: no client-side deletes — cleanup handled by cron
create policy "no_client_delete_analyses"
  on public.analyses
  for delete
  using (false);

-- bill_packs: authenticated users can only read their own packs
create policy "select_own_bill_packs"
  on public.bill_packs
  for select
  using (user_id = auth.uid());

-- bill_packs: no client-side writes
create policy "no_client_insert_bill_packs"
  on public.bill_packs
  for insert
  with check (false);

create policy "no_client_update_bill_packs"
  on public.bill_packs
  for update
  using (false);

create policy "no_client_delete_bill_packs"
  on public.bill_packs
  for delete
  using (false);
