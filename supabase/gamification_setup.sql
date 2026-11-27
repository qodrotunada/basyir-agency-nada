-- BASYIR AGENCY vNext8.0
-- Tabel tambahan untuk menyimpan reward ledger dan aktivitas harian.
-- Jalankan sekali di Supabase SQL Editor sebelum mengaktifkan sinkronisasi reward cloud.
-- Tabel progres lama (profiles dan player_progress) tidak diubah oleh migrasi ini.

create table if not exists public.player_gamification (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{"schemaVersion":1,"rewardLedger":{},"activityLog":[],"dailyCheckins":[]}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.player_gamification enable row level security;

revoke all on table public.player_gamification from anon;
grant select, insert, update on table public.player_gamification to authenticated;

drop policy if exists "player_gamification_select_own" on public.player_gamification;
create policy "player_gamification_select_own"
on public.player_gamification
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "player_gamification_insert_own" on public.player_gamification;
create policy "player_gamification_insert_own"
on public.player_gamification
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "player_gamification_update_own" on public.player_gamification;
create policy "player_gamification_update_own"
on public.player_gamification
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

comment on table public.player_gamification is 'Basyir Agency: reward ledger, daily missions, dan streak per pengguna.';
