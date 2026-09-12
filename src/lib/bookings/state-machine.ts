// Mirrors supabase/migrations/0004_business_rule_triggers.sql's
// assert_valid_booking_transition() exactly. This lets a Server Action
// reject an illegal transition with a clean error message *before* hitting
// the database -- the DB trigger is the backstop of record, this is the
// fast/friendly first check, not a replacement for it.
export type BookingStatus =
  | "invited"
  | "accepted"
  | "declined"
  | "in_progress"
  | "submitted"
  | "approved"
  | "paid";

const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  invited: ["accepted", "declined"],
  accepted: ["in_progress"],
  declined: [],
  in_progress: ["submitted"],
  submitted: ["approved"],
  approved: ["paid"],
  paid: [],
};

export function canTransition(from: BookingStatus, to: BookingStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export class InvalidBookingTransitionError extends Error {
  constructor(from: BookingStatus, to: BookingStatus) {
    super(`Invalid booking status transition: ${from} -> ${to}`);
    this.name = "InvalidBookingTransitionError";
  }
}

export function assertTransition(from: BookingStatus, to: BookingStatus): void {
  if (!canTransition(from, to)) {
    throw new InvalidBookingTransitionError(from, to);
  }
}
