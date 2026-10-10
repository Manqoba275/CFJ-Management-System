import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const source = await readFile(new URL('../website/app.js', import.meta.url), 'utf8');

function start(saved) {
  const context = {
    structuredClone,
    localStorage: { getItem: () => saved },
    document: {
      body: { dataset: { page: 'index' } },
      querySelector: () => null,
      addEventListener: () => {}
    }
  };
  return runInNewContext(`${source}\nJSON.stringify(state);`, context);
}

test('missing or invalid JSON restores demo data', () => {
  for (const saved of [null, '{broken', 'null']) {
    assert.ok(JSON.parse(start(saved)).users.length > 0);
  }
});

test('damaged collections do not prevent startup or erase unrelated records', () => {
  for (const users of [null, {}, 'invalid', 42]) {
    const state = JSON.parse(start(JSON.stringify({
      users,
      members: [{ id: 'CUSTOM', name: 'Saved member' }],
      payments: null,
      bookings: 'invalid'
    })));
    assert.ok(state.users.length > 0);
    assert.equal(state.members[0].id, 'CUSTOM');
    assert.ok(Array.isArray(state.payments));
    assert.ok(Array.isArray(state.bookings));
  }
});

test('invalid collection entries are removed while valid entries survive', () => {
  const state = JSON.parse(start(JSON.stringify({
    users: [null, 4, [], { id: 'CUSTOM', email: 'demo@example.test' }],
    members: [null, false, { id: 'MEMBER', goal: 'Build strength' }]
  })));
  assert.ok(state.users.some(user => user.id === 'CUSTOM'));
  assert.equal(state.members.length, 1);
  assert.deepEqual(state.members[0].goals, ['Build strength']);
});

test('valid empty collections and legacy records are preserved', () => {
  const state = JSON.parse(start(JSON.stringify({ members: [], payments: [], classes: [{ id: 'OLD' }] })));
  assert.deepEqual(state.members, []);
  assert.deepEqual(state.payments, []);
  assert.match(state.classes[0].date, /^\d{4}-\d{2}-\d{2}$/);
});
