import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { bookingEligibility } from '../website/modules/booking-eligibility.mjs';
import { fitnessClassFromResponse } from '../website/modules/fitness-class.mjs';

const cases = JSON.parse(await readFile(new URL('../website/specifications/booking-cases.json', import.meta.url), 'utf8'));
for (const example of cases) {
  test(`${example.id}: ${example.description}`, () => assert.equal(bookingEligibility(example), example.expected));
}
test('reject malformed capacity and unknown booking status', () => {
  const base = {online:true,signedIn:true,alreadyBooked:false,spaces:1};
  for (const spaces of [1.5, '1', NaN, Infinity]) assert.equal(bookingEligibility({...base,spaces}), 'INVALID_CAPACITY');
  assert.equal(bookingEligibility({...base,alreadyBooked:undefined}), 'INVALID_BOOKING_STATE');
});
test('class response rejects missing fields and negative availability', () => {
  const valid = {id:'C-DEMO',name:'Strength',trainer:'Demo',spaces:4};
  assert.deepEqual(fitnessClassFromResponse(valid), valid);
  for (const value of [null, {...valid,id:''}, {...valid,trainer:' '}, {...valid,spaces:-1}, {...valid,spaces:1.5}]) {
    assert.throws(() => fitnessClassFromResponse(value), TypeError);
  }
});
