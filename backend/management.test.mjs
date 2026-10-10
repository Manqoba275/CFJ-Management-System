import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import { createOperationsHandler } from './operations.mjs';
import { createProfileServer } from './profile-server.mjs';
import { register } from './management.mjs';

test('public registration persists; only admins see accurate aggregate reports', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'cfj-management-'));
  const identities = ['member', 'staff', 'admin'].map(role => ({ id: role, role, token: role.padEnd(40, '-') }));
  let server, base;
  async function start() {
    const operations = await createOperationsHandler({ file: join(dir, 'operations.json'), identities });
    server = await createProfileServer({ token: identities[0].token, file: join(dir, 'profile.json'), operations });
    server.listen(0, '127.0.0.1'); await once(server, 'listening'); base = `http://127.0.0.1:${server.address().port}`;
  }
  const stop = () => new Promise(resolve => server.close(resolve));
  async function call(path, actor, body) {
    const response = await fetch(base + '/api/v1' + path, { method: body ? 'POST' : 'GET', headers: { ...(actor === undefined ? {} : { Authorization: `Bearer ${identities[actor].token}` }), 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
    return { status: response.status, data: await response.json() };
  }
  const body = { eventId: 'MARATHON-DEMO', displayName: 'Demo Runner', email: 'runner@example.test', consent: true, requestId: 'public-registration-request-one' };
  try {
    await start();
    assert.equal((await fetch(base + '/registration.html')).status, 200);
    assert.equal((await call('/public/events')).data[0].spaces, 100);
    assert.equal((await call('/admin/reports')).status, 401);
    for (const actor of [0, 1]) assert.equal((await call('/admin/reports', actor)).status, 403);
    assert.equal((await call('/public/registrations', undefined, { ...body, consent: false })).status, 400);
    assert.equal((await call('/public/registrations', undefined, { ...body, email: 'bad' })).status, 400);
    assert.equal((await call('/public/registrations', undefined, { ...body, role: 'admin' })).status, 400);
    const concurrent = await Promise.all([call('/public/registrations', undefined, body), call('/public/registrations', undefined, body)]);
    assert.deepEqual(concurrent.map(r => r.status).sort(), [200, 201]);
    assert.deepEqual(concurrent[0].data, concurrent[1].data);
    assert.deepEqual(Object.keys(concurrent[0].data).sort(), ['reference', 'status']);
    assert.equal((await call('/public/registrations', undefined, { ...body, email: 'changed@example.test' })).status, 409);
    assert.equal((await call('/public/registrations', undefined, { ...body, email: 'RUNNER@example.test', requestId: 'duplicate-email-request-two' })).status, 409);
    const booking = await call('/bookings', 0, { classId: 'C-DEMO' });
    await call('/attendance', 1, { bookingId: booking.data.id, requestId: 'report-attendance' });
    await call('/payments', 1, { bookingId: booking.data.id, requestId: 'report-payment', amountCents: 12500 });
    await stop(); await start();
    assert.deepEqual((await call('/public/registrations', undefined, body)).data, concurrent[0].data);
    const report = await call('/admin/reports', 2);
    assert.equal(report.status, 200);
    assert.deepEqual(report.data.bookings, { active: 1, cancelled: 0 });
    assert.equal(report.data.attendance, 1);
    assert.deepEqual(report.data.simulatedPayments, { count: 1, amountCents: 12500 });
    assert.equal(report.data.events[0].registrations, 1);
    assert.equal(report.data.events[0].spaces, 99);
    assert.equal(JSON.stringify(report.data).includes(body.email), false);
    assert.equal(JSON.stringify((await call('/public/events')).data).includes(body.email), false);
  } finally { if (server?.listening) await stop(); await rm(dir, { recursive: true, force: true }); }
});

test('full events reject new registrations but permit a confirmed retry', () => {
  const state = { registrations: [] };
  const request = i => ({ eventId: 'MARATHON-DEMO', displayName: 'Demo Runner', email: `runner${i}@example.test`, consent: true, requestId: `registration-capacity-${i}` });
  for (let i = 0; i < 100; i++) assert.equal(register(request(i), state).status, 201);
  assert.equal(register(request(100), state).status, 409);
  assert.equal(register(request(0), state).status, 200);
  assert.equal(state.registrations.length, 100);
});
