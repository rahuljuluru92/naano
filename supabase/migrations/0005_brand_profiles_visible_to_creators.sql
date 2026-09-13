-- Phase 4 surfaced a gap: a creator's bookings/invites page needs to show
-- which brand invited them, but brand_profiles_select_own_or_admin (0002)
-- only ever let the owning brand or admin read a brand_profiles row --
-- there was no case before Phase 4 where a creator needed to read one at
-- all. Mirrors the existing is_brand()-gated creator_profiles_select_marketplace
-- policy, just in the other direction.

create or replace function is_creator()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'creator'
  );
$$;

drop policy "brand_profiles_select_own_or_admin" on brand_profiles;

create policy "brand_profiles_select_own_admin_or_creator" on brand_profiles
  for select using (
    user_id = auth.uid() or is_admin() or is_creator()
  );
