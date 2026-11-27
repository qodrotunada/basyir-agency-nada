-- BASYIR AGENCY: role admin dan kebijakan baca dashboard
-- Jalankan sekali di Supabase SQL Editor setelah tabel public.profiles dan public.player_progress tersedia.
-- Role default adalah student. Pengguna tidak dapat menaikkan role dirinya sendiri dari aplikasi.

alter table public.profiles
  add column if not exists role text not null default 'student';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_role_allowed'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_role_allowed
      check (role in ('student', 'admin'));
  end if;
end $$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

grant select on table public.profiles to authenticated;
grant select on table public.player_progress to authenticated;

alter table public.profiles enable row level security;
alter table public.player_progress enable row level security;

drop policy if exists "profiles_admin_select_all" on public.profiles;
create policy "profiles_admin_select_all"
on public.profiles
for select
to authenticated
using ((select public.is_admin()));

drop policy if exists "progress_admin_select_all" on public.player_progress;
create policy "progress_admin_select_all"
on public.player_progress
for select
to authenticated
using ((select public.is_admin()));

-- GANTI alamat email berikut dengan email akun yang akan menjadi admin.
-- Pastikan akun tersebut sudah pernah mendaftar agar baris profiles sudah dibuat.
update public.profiles p
set role = 'admin', updated_at = now()
from auth.users u
where p.id = u.id
  and lower(u.email) = lower('qodrotunada@gmail.com');

-- Verifikasi: hasil harus menampilkan akun admin yang dipilih.
select id, display_name, role, created_at
from public.profiles
where role = 'admin';
