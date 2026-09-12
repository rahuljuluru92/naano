-- naano clone: business-rule triggers
-- These are the database-level backstop behind the Server Action layer --
-- per Next.js's own Server Actions guidance, a client can tamper with a
-- mutation call, so state-changing invariants are enforced here too, not
-- only in src/lib/bookings/state-machine.ts.

-- bookings.status can only move along the real pipeline, never skip a step
-- (e.g. 'invited' -> 'paid' directly) or move backwards.
create or replace function assert_valid_booking_transition()
returns trigger
language plpgsql
as $$
declare
  allowed boolean;
begin
  if old.status = new.status then
    return new; -- unrelated column update (e.g. cta_link), not a status change
  end if;

  allowed := case old.status
    when 'invited' then new.status in ('accepted', 'declined')
    when 'accepted' then new.status = 'in_progress'
    when 'in_progress' then new.status = 'submitted'
    when 'submitted' then new.status = 'approved'
    when 'approved' then new.status = 'paid'
    else false
  end;

  if not allowed then
    raise exception 'Invalid booking status transition: % -> %', old.status, new.status;
  end if;

  return new;
end;
$$;

create trigger bookings_status_transition
  before update on bookings
  for each row execute function assert_valid_booking_transition();

-- payouts.amount is never client-supplied: it is always derived from the
-- booking's agreed_price at the moment the payout row is created.
create or replace function set_payout_amount_from_booking()
returns trigger
language plpgsql
as $$
declare
  booking_price numeric(10, 2);
begin
  select agreed_price into booking_price from bookings where id = new.booking_id;

  if booking_price is null then
    raise exception 'Cannot create payout: booking % has no agreed_price', new.booking_id;
  end if;

  new.amount = booking_price;
  return new;
end;
$$;

create trigger payouts_set_amount
  before insert on payouts
  for each row execute function set_payout_amount_from_booking();

-- Once paid, a payout is immutable; amount can never be edited at all.
create or replace function assert_payout_immutable_once_paid()
returns trigger
language plpgsql
as $$
begin
  if old.status = 'paid' then
    raise exception 'Payout % is already paid and cannot be modified', old.id;
  end if;

  if new.status = 'paid' and old.status <> 'pending' then
    raise exception 'Invalid payout status transition: % -> %', old.status, new.status;
  end if;

  if new.amount <> old.amount then
    raise exception 'Payout amount cannot be changed after creation';
  end if;

  return new;
end;
$$;

create trigger payouts_immutable_once_paid
  before update on payouts
  for each row execute function assert_payout_immutable_once_paid();
