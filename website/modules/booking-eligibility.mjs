/** Preview eligibility only. The API must recheck identity and capacity in a transaction. */
export function bookingEligibility({ online, signedIn, alreadyBooked, spaces }) {
  if (!Number.isSafeInteger(spaces) || spaces < 0) return 'INVALID_CAPACITY';
  if (online !== true) return 'OFFLINE';
  if (signedIn !== true) return 'SIGN_IN_REQUIRED';
  if (alreadyBooked === true) return 'ALREADY_BOOKED';
  if (alreadyBooked !== false) return 'INVALID_BOOKING_STATE';
  return spaces === 0 ? 'FULL' : 'READY';
}
