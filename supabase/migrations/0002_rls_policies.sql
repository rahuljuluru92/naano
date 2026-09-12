-- naano clone: row-level security
-- Design: RLS is the real isolation boundary between brands/creators/admin, not
-- an app-layer convention. Every table below gets `enable row level security`
-- plus explicit policies; nothing is left to a default-deny/default-allow guess.

alter table profiles enable row level security;
alter table brand_profiles enable row level security;
alter table creator_profiles enable row level security;
alter table campaigns enable row level security;
alter table bookings enable row level security;
alter table submissions enable row level security;
alter table payouts enable row level security;

create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function is_brand()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'brand'
  );
$$;

-- profiles ---------------------------------------------------------------
create policy "profiles_select_own_or_admin" on profiles
  for select using (id = auth.uid() or is_admin());

create policy "profiles_insert_self" on profiles
  for insert with check (id = auth.uid());

create policy "profiles_update_own" on profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- brand_profiles -----------------------------------------------------------
create policy "brand_profiles_select_own_or_admin" on brand_profiles
  for select using (user_id = auth.uid() or is_admin());

create policy "brand_profiles_insert_self" on brand_profiles
  for insert with check (user_id = auth.uid());

create policy "brand_profiles_update_own" on brand_profiles
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- creator_profiles ---------------------------------------------------------
-- The marketplace's whole point is that brands can see creators' price/profile,
-- so this is intentionally broader than "owner only" -- but still gated to
-- authenticated brands/admin/the creator themself, never `using (true)`.
create policy "creator_profiles_select_marketplace" on creator_profiles
  for select using (
    user_id = auth.uid() or is_admin() or is_brand()
  );

create policy "creator_profiles_insert_self" on creator_profiles
  for insert with check (user_id = auth.uid());

create policy "creator_profiles_update_own" on creator_profiles
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- campaigns ------------------------------------------------------------
-- Draft campaigns (unpublished briefs/budgets) are visible only to their
-- owning brand and admin. Creators only ever see 'active' campaigns.
create policy "campaigns_select" on campaigns
  for select using (
    brand_id = auth.uid()
    or is_admin()
    or status = 'active'
  );

create policy "campaigns_insert_own" on campaigns
  for insert with check (brand_id = auth.uid());

create policy "campaigns_update_own_or_admin" on campaigns
  for update using (brand_id = auth.uid() or is_admin())
  with check (brand_id = auth.uid() or is_admin());

-- bookings -----------------------------------------------------------------
-- Visible to: the invited creator, the brand that owns the campaign, or admin.
-- This is the policy that stops Brand A from reading Brand B's pipeline.
create policy "bookings_select" on bookings
  for select using (
    creator_id = auth.uid()
    or is_admin()
    or exists (
      select 1 from campaigns c
      where c.id = bookings.campaign_id and c.brand_id = auth.uid()
    )
  );

-- Only the owning brand (or admin, for Managed-plan bookings-on-behalf-of) may
-- invite a creator to a campaign.
create policy "bookings_insert_by_owning_brand" on bookings
  for insert with check (
    is_admin()
    or exists (
      select 1 from campaigns c
      where c.id = bookings.campaign_id and c.brand_id = auth.uid()
    )
  );

-- Both sides can update their own booking (creator accepts/declines/submits;
-- brand approves). WHICH transitions are legal is enforced by the trigger in
-- 0004, not here -- this policy only gates *who* may attempt an update at all.
create policy "bookings_update_participant_or_admin" on bookings
  for update using (
    creator_id = auth.uid()
    or is_admin()
    or exists (
      select 1 from campaigns c
      where c.id = bookings.campaign_id and c.brand_id = auth.uid()
    )
  );

-- submissions ----------------------------------------------------------
create policy "submissions_select" on submissions
  for select using (
    is_admin()
    or exists (
      select 1 from bookings b
      join campaigns c on c.id = b.campaign_id
      where b.id = submissions.booking_id
        and (b.creator_id = auth.uid() or c.brand_id = auth.uid())
    )
  );

-- Only the booking's own creator can submit a post for it.
create policy "submissions_insert_by_creator" on submissions
  for insert with check (
    exists (
      select 1 from bookings b
      where b.id = submissions.booking_id and b.creator_id = auth.uid()
    )
  );

-- payouts ------------------------------------------------------------------
-- Most sensitive table (money): no cross-creator, no cross-brand read.
create policy "payouts_select" on payouts
  for select using (
    is_admin()
    or exists (
      select 1 from bookings b
      join campaigns c on c.id = b.campaign_id
      where b.id = payouts.booking_id
        and (b.creator_id = auth.uid() or c.brand_id = auth.uid())
    )
  );

-- A payout can only be created by the brand that owns the underlying
-- campaign (the "approve" action), and only once the booking has actually
-- reached 'approved' -- the amount itself is never taken from the client,
-- see the set_payout_amount_from_booking trigger in 0004.
create policy "payouts_insert_by_owning_brand" on payouts
  for insert with check (
    is_admin()
    or exists (
      select 1 from bookings b
      join campaigns c on c.id = b.campaign_id
      where b.id = payouts.booking_id
        and c.brand_id = auth.uid()
        and b.status = 'approved'
    )
  );

-- Marking a payout paid is allowed for the owning brand (self-serve demo has
-- no real payment rail to move money automatically) or admin. The
-- payouts_immutable_once_paid trigger in 0004 stops any further change once
-- status = 'paid', and stops amount from ever being edited.
create policy "payouts_update_by_owning_brand_or_admin" on payouts
  for update using (
    is_admin()
    or exists (
      select 1 from bookings b
      join campaigns c on c.id = b.campaign_id
      where b.id = payouts.booking_id and c.brand_id = auth.uid()
    )
  )
  with check (
    is_admin()
    or exists (
      select 1 from bookings b
      join campaigns c on c.id = b.campaign_id
      where b.id = payouts.booking_id and c.brand_id = auth.uid()
    )
  );
