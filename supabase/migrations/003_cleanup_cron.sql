-- Requires pg_cron extension enabled in Supabase dashboard (Database > Extensions > pg_cron)

-- Nightly deletion of expired analyses (runs at 3:00 AM UTC)
select cron.schedule(
  'delete-expired-analyses',
  '0 3 * * *',
  $$delete from public.analyses where expires_at < now()$$
);

-- Nightly deletion of expired bill packs (runs at 3:05 AM UTC)
select cron.schedule(
  'delete-expired-packs',
  '5 3 * * *',
  $$delete from public.bill_packs where expires_at < now()$$
);
