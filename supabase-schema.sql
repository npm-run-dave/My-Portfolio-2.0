-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/behbcosnzoduzibkgqit/sql)

-- ========== PROFILES ==========
create table if not exists profiles (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  name text not null default '',
  title text not null default '',
  bio text not null default '',
  avatar_url text,
  email text,
  github_url text,
  linkedin_url text,
  twitter_url text,
  resume_url text,
  created_at timestamptz default now()
);

-- ========== PROJECTS ==========
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  long_description text,
  image_url text,
  live_url text,
  github_url text,
  tags text[] default '{}',
  featured boolean default false,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ========== SKILLS ==========
create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Other',
  level integer default 80 check (level >= 0 and level <= 100),
  icon text,
  order_index integer default 0,
  created_at timestamptz default now()
);

-- ========== EXPERIENCE ==========
create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('work', 'education')),
  title text not null,
  organization text not null default '',
  period text not null default '',
  description text not null default '',
  tags text[] default '{}',
  order_index integer default 0,
  created_at timestamptz default now()
);

-- ========== ROW LEVEL SECURITY ==========
alter table profiles enable row level security;
alter table projects enable row level security;
alter table skills enable row level security;
alter table experience enable row level security;

-- Allow public read access
create policy "Public can read profiles" on profiles for select using (true);
create policy "Public can read projects" on projects for select using (true);
create policy "Public can read skills" on skills for select using (true);
create policy "Public can read experience" on experience for select using (true);

-- Allow service_role full access (used by CMS admin)
-- The service_role key bypasses RLS automatically

-- ========== HERO COLUMNS (run if upgrading an existing profiles table) ==========
alter table profiles add column if not exists location_badge text;
alter table profiles add column if not exists hero_tagline text;
alter table profiles add column if not exists tech_stack jsonb;

-- ========== CONTACT FORM CONFIG (run if upgrading an existing profiles table) ==========
alter table profiles add column if not exists contact_form_config jsonb;

-- ========== SEED PROFILE (optional) ==========
insert into profiles (id, name, title, bio, email)
values (
  '00000000-0000-0000-0000-000000000001',
  'Dave',
  'Full-Stack Developer',
  'I build modern web applications with clean code and great user experiences. Passionate about open source and developer tooling.',
  'hello@example.com'
)
on conflict (id) do nothing;
