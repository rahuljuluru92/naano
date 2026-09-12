-- naano clone: core schema
-- Requires pgcrypto for gen_random_uuid() (preinstalled on Supabase, declared here for portability).
create extension if not exists pgcrypto;

create type user_role as enum ('brand', 'creator', 'admin');
create type follower_tier as enum ('nano', 'micro', 'mid', 'macro');
create type campaign_status as enum ('draft', 'active', 'completed');
create type booking_status as enum (
  'invited', 'accepted', 'declined', 'in_progress', 'submitted', 'approved', 'paid'
);
create type payout_status as enum ('pending', 'paid');

-- One row per auth.users row. id IS the auth user id, so every RLS policy
-- downstream can be a trivial `auth.uid() = id` / `auth.uid() = user_id`.
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role user_role not null,
  created_at timestamptz not null default now()
);

create table brand_profiles (
  user_id uuid primary key references profiles (id) on delete cascade,
  company_name text not null,
  website text,
  logo_url text,
  industry text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table creator_profiles (
  user_id uuid primary key references profiles (id) on delete cascade,
  display_name text not null,
  linkedin_url text,
  avatar_url text,
  country text,
  verticals text[] not null default '{}',
  follower_tier follower_tier not null,
  price_per_post numeric(10, 2) not null default 20,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table campaigns (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brand_profiles (user_id) on delete cascade,
  title text not null,
  description text,
  verticals text[] not null default '{}',
  target_follower_tier follower_tier,
  budget_min numeric(10, 2),
  budget_max numeric(10, 2),
  status campaign_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint campaigns_budget_range_chk check (
    budget_min is null or budget_max is null or budget_min <= budget_max
  )
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns (id) on delete cascade,
  creator_id uuid not null references creator_profiles (user_id) on delete cascade,
  status booking_status not null default 'invited',
  agreed_price numeric(10, 2),
  cta_link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (campaign_id, creator_id)
);

create table submissions (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references bookings (id) on delete cascade,
  post_url text not null,
  impressions integer not null default 0,
  clicks integer not null default 0,
  leads integer not null default 0,
  submitted_at timestamptz not null default now()
);

create table payouts (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references bookings (id) on delete cascade,
  amount numeric(10, 2) not null,
  status payout_status not null default 'pending',
  paid_at timestamptz
);

-- Generic updated_at maintenance, reused by every table that has the column.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger brand_profiles_set_updated_at
  before update on brand_profiles
  for each row execute function set_updated_at();

create trigger creator_profiles_set_updated_at
  before update on creator_profiles
  for each row execute function set_updated_at();

create trigger campaigns_set_updated_at
  before update on campaigns
  for each row execute function set_updated_at();

create trigger bookings_set_updated_at
  before update on bookings
  for each row execute function set_updated_at();
