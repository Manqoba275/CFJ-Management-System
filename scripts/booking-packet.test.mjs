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

test('class card announces state changes and enables only a ready request', async () => {
  const { createClassCard } = await import('../website/modules/class-card.mjs');
  const previousDocument = globalThis.document;
  const makeElement = tag => ({
    tag, attributes: {}, listeners: {}, children: [], className: '',
    textContent: '', disabled: false,
    setAttribute(name, value) { this.attributes[name] = value; },
    addEventListener(name, listener) { this.listeners[name] = listener; },
    append(...children) { this.children.push(...children); }
  });
  globalThis.document = { createElement: makeElement };
  try {
    let requestedId = null;
    const summary = { id: 'C-DEMO', name: 'Strength', trainer: 'Coach', spaces: 1 };
    const readyCard = createClassCard(summary, 'READY', id => { requestedId = id; });
    const status = readyCard.children.find(child => child.attributes.role === 'status');
    const request = readyCard.children.find(child => child.tag === 'button');
    assert.equal(readyCard.children[1].textContent, 'Coach · 1 space available');
    assert.equal(status.attributes['aria-live'], 'polite');
    assert.equal(status.attributes['aria-atomic'], 'true');
    assert.equal(request.attributes['aria-label'], 'Request a place in Strength');
    assert.equal(request.disabled, false);
    request.listeners.click();
    assert.equal(requestedId, 'C-DEMO');

    const fullCard = createClassCard({ ...summary, spaces: 0 }, 'FULL', () => {});
    assert.equal(fullCard.children.find(child => child.tag === 'button').disabled, true);
  } finally {
    globalThis.document = previousDocument;
  }
});
