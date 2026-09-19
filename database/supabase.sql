-- 🌴 Oru Date? (Kerala Version) — Supabase Schema
-- Run this in your Supabase SQL Editor if you wish to use remote cloud storage.

create table if not exists public.date_proposals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  dob date not null,
  places text[] not null,
  area text,
  custom_place text,
  notes text,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.date_proposals enable row level security;

-- Allow anonymous inserts from your GitHub Pages website
create policy "allow_public_insert_proposals"
on public.date_proposals
for insert
to anon
with check (true);

-- Allow anonymous select for demo admin (or restrict to authenticated users in production)
create policy "allow_public_select_proposals"
on public.date_proposals
for select
to anon
using (true);
