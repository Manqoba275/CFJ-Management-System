// Covers weekly resets, cancelled bookings and renewed memberships so session allowances stay consistent.
import test from 'node:test';
import assert from 'node:assert/strict';
import { membershipEligibility as eligible } from './membership.mjs';

const membership = { id: 'PLAN', memberId: 'M', status: 'active', plan: 'weekly3', startsOn: '2026-10-01', expiresOn: '2027-03-31' };
const session = { date: '2026-10-18' };
const booked = count => Array.from({ length: count }, (_, i) => ({ memberId: 'M', membershipId: 'PLAN', status: 'active', date: `2026-10-${12 + i}` }));
const check = (plan, bookings = [], date = session.date) => eligible(plan, { date }, bookings, [], 'M');

test('weekly limits count Monday through Sunday and reset on Monday', () => {
  assert.equal(check(membership, booked(2)), null);
  assert.equal(check(membership, booked(3)), 'membership_weekly_limit');
  assert.equal(check(membership, booked(3), '2026-10-19'), null);
  assert.equal(check({ ...membership, plan: 'weekly4' }, booked(3)), null);
  assert.equal(check({ ...membership, plan: 'weekly4' }, booked(4)), 'membership_weekly_limit');
  assert.equal(check({ ...membership, plan: 'unlimited' }, booked(8)), null);
});
test('concession credits, cancellations and renewal ownership are respected', () => {
  for (const [plan, count] of [['concession10', 10], ['concession15', 15], ['concession20', 20], ['dropin', 1]]) {
    const records = booked(count);
    assert.equal(check({ ...membership, plan }, records), 'membership_sessions_used');
    records[0].status = 'cancelled';
    assert.equal(check({ ...membership, plan }, records), null);
    records[0].status = 'active'; records[0].membershipId = 'OLD';
    assert.equal(check({ ...membership, plan }, records), null);
  }
});
test('invalid and expired memberships fail closed; validity includes final day', () => {
  assert.equal(check(null), 'membership_required');
  assert.equal(check({ ...membership, status: 'suspended' }), 'membership_required');
  assert.equal(check({ ...membership, memberId: 'OTHER' }), 'membership_required');
  assert.equal(check({ ...membership, expiresOn: '2026-10-17' }), 'membership_outside_validity');
  assert.equal(check({ ...membership, expiresOn: '2026-10-18' }), null);
  assert.equal(check({ ...membership, startsOn: '2026-10-19' }), 'membership_outside_validity');
  assert.equal(check({ ...membership, expiresOn: '2026-02-30' }), 'invalid_membership_dates');
  assert.equal(check({ ...membership, plan: 'unknown' }), 'invalid_membership_plan');
  assert.equal(check({ ...membership, plan: 'constructor' }), 'invalid_membership_plan');
});
