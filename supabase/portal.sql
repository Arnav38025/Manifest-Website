-- Manifest member portal schema. Run in the Supabase SQL editor (safe to re-run).
-- All access goes through the Next.js server with the service role key, so RLS is
-- enabled with no policies: the public anon key cannot read or write these tables.

create extension if not exists pgcrypto;

create table if not exists public.portal_members (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  avatar_url text,
  dues_paid boolean not null default false,
  dues_updated_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.coffee_chats (
  id uuid primary key default gen_random_uuid(),
  logged_by uuid not null references public.portal_members(id) on delete cascade,
  partner_member_id uuid references public.portal_members(id) on delete set null,
  partner_name text not null,
  chat_date date not null,
  notes text not null,
  photo_url text,
  created_at timestamptz not null default now()
);

create index if not exists coffee_chats_chat_date_idx on public.coffee_chats (chat_date desc, created_at desc);

-- One row per member per Wednesday meeting they attended.
create table if not exists public.portal_attendance (
  member_id uuid not null references public.portal_members(id) on delete cascade,
  meeting_date date not null,
  checked_in_at timestamptz not null default now(),
  primary key (member_id, meeting_date)
);

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'portal_attendance' and column_name = 'week_start'
  ) then
    alter table public.portal_attendance rename column week_start to meeting_date;
  end if;
end $$;

create table if not exists public.portal_photos (
  id uuid primary key default gen_random_uuid(),
  uploaded_by uuid not null references public.portal_members(id) on delete cascade,
  storage_path text not null,
  url text not null,
  caption text,
  created_at timestamptz not null default now()
);

create index if not exists portal_photos_created_at_idx on public.portal_photos (created_at desc);

alter table public.portal_members enable row level security;
alter table public.coffee_chats enable row level security;
alter table public.portal_attendance enable row level security;
alter table public.portal_photos enable row level security;

insert into storage.buckets (id, name, public)
values ('portal', 'portal', true)
on conflict (id) do nothing;
