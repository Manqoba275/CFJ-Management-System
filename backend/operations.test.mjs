import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import { createOperationsHandler } from './operations.mjs';
import { createProfileServer } from './profile-server.mjs';

test('booking transactions, ownership, attendance and simulated payment retries persist', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'cfj-operations-'));
  const identities = ['member-a', 'member-b', 'staff'].map(id => ({ id, role: id === 'staff' ? 'staff' : 'member', token: id.padEnd(40, '-') }));
  let server, base;
  async function start() {
    const operations = await createOperationsHandler({ file: join(dir, 'operations.json'), identities });
    server = await createProfileServer({ token: identities[0].token, file: join(dir, 'profile.json'), operations });
    server.listen(0, '127.0.0.1'); await once(server, 'listening');
    base = `http://127.0.0.1:${server.address().port}`;
  }
  const stop = () => new Promise(resolve => server.close(resolve));
  const call = (actor, path, method = 'GET', body) => fetch(base + path, { method, headers: { Authorization: `Bearer ${identities[actor].token}`, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  try {
    await start();
    assert.equal((await fetch(base + '/api/v1/classes')).status, 401);
    assert.equal((await fetch(base + '/service.html')).status, 200);
    const results = await Promise.all([call(0, '/api/v1/bookings', 'POST', { classId: 'C-DEMO' }), call(1, '/api/v1/bookings', 'POST', { classId: 'C-DEMO' })]);
    assert.deepEqual(results.map(r => r.status).sort(), [201, 409]);
    const winner = results.findIndex(r => r.status === 201), loser = 1 - winner;
    const booking = await results[winner].json();
    assert.equal((await call(winner, '/api/v1/bookings', 'POST', { classId: 'C-DEMO' })).status, 409);
    assert.equal((await call(loser, `/api/v1/bookings/${booking.id}`, 'DELETE')).status, 404);
    assert.deepEqual(await (await call(loser, '/api/v1/bookings')).json(), []);
    assert.equal((await call(winner, `/api/v1/bookings/${booking.id}`, 'DELETE')).status, 200);
    assert.equal((await call(winner, `/api/v1/bookings/${booking.id}`, 'DELETE')).status, 200);
    const replacement = await (await call(loser, '/api/v1/bookings', 'POST', { classId: 'C-DEMO' })).json();
    const attendance = { bookingId: replacement.id, requestId: 'attendance-unique' };
    assert.equal((await call(loser, '/api/v1/attendance', 'POST', attendance)).status, 403);
    assert.equal((await call(2, '/api/v1/attendance', 'POST', attendance)).status, 201);
    assert.equal((await call(2, '/api/v1/attendance', 'POST', attendance)).status, 200);
    assert.equal((await call(2, '/api/v1/attendance', 'POST', { ...attendance, requestId: 'different-request' })).status, 409);
    assert.equal((await call(loser, `/api/v1/bookings/${replacement.id}`, 'DELETE')).status, 409);
    const payment = { bookingId: replacement.id, requestId: 'payment-unique', amountCents: 12500 };
    assert.equal((await call(loser, '/api/v1/payments', 'POST', payment)).status, 403);
    assert.equal((await call(2, '/api/v1/payments', 'POST', { ...payment, amountCents: 0 })).status, 400);
    const paid = await (await call(2, '/api/v1/payments', 'POST', payment)).json();
    assert.equal(paid.simulated, true);
    assert.deepEqual(await (await call(2, '/api/v1/payments', 'POST', payment)).json(), paid);
    assert.equal((await call(2, '/api/v1/payments', 'POST', { ...payment, amountCents: 100 })).status, 409);
    await stop(); await start();
    assert.equal((await (await call(loser, '/api/v1/me/attendance')).json()).length, 1);
    assert.deepEqual(await (await call(loser, '/api/v1/me/payments')).json(), [paid]);
    assert.deepEqual(await (await call(winner, '/api/v1/me/payments')).json(), []);
    assert.deepEqual(await (await call(2, '/api/v1/payments', 'POST', payment)).json(), paid);
    assert.equal((await (await call(loser, '/api/v1/classes')).json())[0].spaces, 0);
  } finally { if (server?.listening) await stop(); await rm(dir, { recursive: true, force: true }); }
});
