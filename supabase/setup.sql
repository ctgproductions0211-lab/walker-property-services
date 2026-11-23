-- Walker Property Services — database setup
-- Paste into Supabase → SQL Editor → Run. Safe to run more than once.
-- Before running: change the admin email at the bottom if you use a different login.

create extension if not exists pgcrypto;

-- ── Tables ──────────────────────────────────────────────────────────────────

create table if not exists public.jobs (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  customer_name    text not null,
  customer_email   text,
  customer_phone   text,
  property_address text not null,
  job_type         text not null,
  status           text not null default 'received',
  quote_amount     numeric,
  customer_notes   text,
  internal_notes   text,
  tracking_code    text not null unique
);

alter table public.jobs add column if not exists ai_quote_low      numeric;
alter table public.jobs add column if not exists ai_quote_high     numeric;
alter table public.jobs add column if not exists ai_analysis       jsonb;
alter table public.jobs add column if not exists ai_confidence     text;
alter table public.jobs add column if not exists utm_source        text;
alter table public.jobs add column if not exists utm_medium        text;
alter table public.jobs add column if not exists utm_campaign      text;
alter table public.jobs add column if not exists service_selection text;
alter table public.jobs add column if not exists internal_notes    text;
alter table public.jobs add column if not exists quote_amount      numeric;

create table if not exists public.job_files (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  job_id     uuid not null references public.jobs(id) on delete cascade,
  file_path  text not null,
  file_name  text not null,
  file_type  text not null
);

create table if not exists public.pricing_notes (
  id         text primary key,
  content    text,
  updated_at timestamptz default now()
);

create table if not exists public.admin_users (
  email      text primary key,
  created_at timestamptz not null default now()
);

-- ── Admin check ─────────────────────────────────────────────────────────────

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- ── Row level security: the public may submit, only admins may read ─────────

alter table public.jobs          enable row level security;
alter table public.job_files     enable row level security;
alter table public.pricing_notes enable row level security;
alter table public.admin_users   enable row level security;

-- Replace any older policies (some allowed anyone to read every customer's details).
do $$
declare r record;
begin
  for r in
    select policyname, tablename from pg_policies
    where schemaname = 'public' and tablename in ('jobs', 'job_files', 'pricing_notes', 'admin_users')
  loop
    execute format('drop policy if exists %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

create policy "public can submit jobs" on public.jobs
  for insert to anon, authenticated
  with check (status = 'received');

create policy "admins manage jobs" on public.jobs
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "public can attach submission photos" on public.job_files
  for insert to anon, authenticated
  with check (file_type = 'submission_photo');

create policy "admins manage job files" on public.job_files
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "admins manage pricing notes" on public.pricing_notes
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "admins read admin list" on public.admin_users
  for select to authenticated
  using (public.is_admin());

grant insert on public.jobs, public.job_files to anon;
grant select, insert, update, delete on public.jobs, public.job_files, public.pricing_notes to authenticated;
grant select on public.admin_users to authenticated;

-- ── Public job tracking (returns one job's status by its tracking code) ─────

drop function if exists public.get_job_by_tracking_code(text);

create function public.get_job_by_tracking_code(code text)
returns table (
  tracking_code    text,
  customer_name    text,
  property_address text,
  job_type         text,
  status           text,
  quote_amount     numeric,
  created_at       timestamptz,
  ai_quote_low     numeric,
  ai_quote_high    numeric,
  ai_analysis      jsonb
)
language sql stable security definer
set search_path = public
as $$
  select j.tracking_code::text, j.customer_name::text, j.property_address::text,
         j.job_type::text, j.status::text, j.quote_amount::numeric, j.created_at::timestamptz,
         j.ai_quote_low::numeric, j.ai_quote_high::numeric, j.ai_analysis::jsonb
  from public.jobs j
  where j.tracking_code = upper(trim(code))
  limit 1;
$$;

grant execute on function public.get_job_by_tracking_code(text) to anon, authenticated;

-- ── Photo storage ───────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('job-files', 'job-files', false)
on conflict (id) do nothing;

drop policy if exists "wps public submission uploads" on storage.objects;
create policy "wps public submission uploads" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'job-files' and (storage.foldername(name))[2] = 'submission');

drop policy if exists "wps admins manage job files" on storage.objects;
create policy "wps admins manage job files" on storage.objects
  for all to authenticated
  using (bucket_id = 'job-files' and public.is_admin())
  with check (bucket_id = 'job-files' and public.is_admin());

-- ── Admin accounts ──────────────────────────────────────────────────────────
-- Each email here must also exist under Authentication → Users.

insert into public.admin_users (email)
values ('admin@walkerpropservices.com')
on conflict (email) do nothing;
