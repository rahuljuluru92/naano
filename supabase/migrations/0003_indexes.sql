-- naano clone: indexes
-- GIN indexes back the vertical-overlap matching query (lib/matching.ts);
-- the btree indexes back the dashboard/pipeline list+filter views.

create index creator_profiles_verticals_gin on creator_profiles using gin (verticals);
create index campaigns_verticals_gin on campaigns using gin (verticals);

create index campaigns_brand_id_idx on campaigns (brand_id);
create index campaigns_status_idx on campaigns (status);

create index bookings_campaign_id_idx on bookings (campaign_id);
create index bookings_creator_id_idx on bookings (creator_id);
create index bookings_status_idx on bookings (status);
