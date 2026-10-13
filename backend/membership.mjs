// School-project assumptions: Monday-Sunday weeks; inclusive validity dates;
// an un-attended cancellation releases a reserved session. Not Octiv integration.
export function validDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}

export function membershipEligibility(membership, session, bookings, classes, memberId) {
  if (!membership || membership.memberId !== memberId || membership.status !== 'active') return 'membership_required';
  if (!validDate(session.date) || !validDate(membership.startsOn) || !validDate(membership.expiresOn) ||
      membership.startsOn > membership.expiresOn) return 'invalid_membership_dates';
  if (session.date < membership.startsOn || session.date > membership.expiresOn) return 'membership_outside_validity';
  const weekly = { weekly3: 3, weekly4: 4, unlimited: Infinity };
  const credits = { concession10: 10, concession15: 15, concession20: 20, dropin: 1 };
  if (typeof membership.plan !== 'string' || (!Object.hasOwn(weekly, membership.plan) && !Object.hasOwn(credits, membership.plan))) return 'invalid_membership_plan';
  const active = bookings.filter(b => b.memberId === memberId && b.status === 'active' &&
    (!b.membershipId || b.membershipId === membership.id));
  if (Object.hasOwn(credits, membership.plan)) return active.length >= credits[membership.plan] ? 'membership_sessions_used' : null;
  const date = new Date(`${session.date}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 6) % 7);
  const monday = date.toISOString().slice(0, 10);
  date.setUTCDate(date.getUTCDate() + 6);
  const sunday = date.toISOString().slice(0, 10);
  const used = active.filter(b => {
    const day = b.date || classes.find(c => c.id === b.classId)?.date;
    return !validDate(day) || (day >= monday && day <= sunday);
  }).length;
  return used >= weekly[membership.plan] ? 'membership_weekly_limit' : null;
}
