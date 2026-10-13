import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { bookingEligibility } from '../website/modules/booking-eligibility.mjs';

// Android reads this same fixture: changing a shared rule must satisfy both clients.
const fixture = readFileSync(new URL('../mobile-app/app/src/test/resources/booking-eligibility.tsv', import.meta.url), 'utf8');
const rows = fixture.trim().split(/\r?\n/).slice(1);
assert.equal(rows.length, 24, 'Cover all Boolean combinations for negative, zero and available capacity');
for (const row of rows) {
  const [online, signedIn, alreadyBooked, spaces, expected] = row.split('\t');
  test(`booking ${row.replaceAll('\t', ' / ')}`, () => {
    assert.equal(bookingEligibility({ online: online === 'true', signedIn: signedIn === 'true', alreadyBooked: alreadyBooked === 'true', spaces: Number(spaces) }), expected);
  });
}

test('web rejects malformed capacity and unknown booking state', () => {
  const input = { online: true, signedIn: true, alreadyBooked: false, spaces: 1 };
  for (const spaces of [NaN, Infinity, 1.5, '1', null, undefined, Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(bookingEligibility({ ...input, spaces }), 'INVALID_CAPACITY');
  }
  for (const alreadyBooked of [null, undefined, 'false', 0]) {
    assert.equal(bookingEligibility({ ...input, alreadyBooked }), 'INVALID_BOOKING_STATE');
  }
});
