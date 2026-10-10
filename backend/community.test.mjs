import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import { createOperationsHandler } from './operations.mjs';
import { createProfileServer } from './profile-server.mjs';

test('community consent, retries, private records and paid guide access survive restart', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'cfj-community-'));
  const identities = ['alice', 'bob', 'hidden', 'staff'].map(id => ({ id, role: id === 'staff' ? 'staff' : 'member', token: id.padEnd(40, '-'), discoverable: ['alice', 'bob'].includes(id), displayName: id, goal: 'Endurance' }));
  let server, base;
  async function start() {
    const operations = await createOperationsHandler({ file: join(dir, 'operations.json'), identities });
    server = await createProfileServer({ token: identities[0].token, file: join(dir, 'profile.json'), operations });
    server.listen(0, '127.0.0.1'); await once(server, 'listening');
    base = `http://127.0.0.1:${server.address().port}/api/v1`;
  }
  const stop = () => new Promise(resolve => server.close(resolve));
  async function call(actor, path, body) {
    const r = await fetch(base + path, { method: body === undefined ? 'GET' : 'POST', headers: { Authorization: `Bearer ${identities[actor].token}`, 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
    return { status: r.status, data: await r.json() };
  }
  try {
    await start();
    assert.equal((await fetch(base + '/members')).status, 401);
    assert.deepEqual((await call(0, '/members')).data, [{ id: 'bob', displayName: 'bob', goal: 'Endurance' }]);
    assert.equal((await call(3, '/members')).status, 403);
    assert.equal((await call(0, '/exercises')).status, 403);
    assert.equal((await call(0, '/friend-connections', { memberId: 'alice' })).status, 400);
    assert.equal((await call(0, '/friend-connections', { memberId: 'hidden' })).status, 404);
    assert.equal((await call(0, '/friend-connections', { memberId: 'bob', status: 'accepted' })).status, 400);
    const pair = await Promise.all([call(0, '/friend-connections', { memberId: 'bob' }), call(1, '/friend-connections', { memberId: 'alice' })]);
    assert.deepEqual(pair.map(r => r.status).sort(), [200, 201]);
    assert.equal(pair[0].data.id, pair[1].data.id);
    assert.equal(pair[0].data.status, 'pending');
    const connection = pair[0].data;
    const sender = connection.fromId === 'alice' ? 0 : 1, recipient = 1 - sender;
    const acceptPath = `/friend-connections/${connection.id}/accept`;
    assert.equal((await call(sender, acceptPath, {})).status, 404);
    assert.equal((await call(2, acceptPath, {})).status, 404);
    assert.deepEqual((await call(2, '/me/friend-connections')).data, []);
    assert.equal((await call(recipient, acceptPath, { status: 'accepted' })).status, 400);
    assert.equal((await call(recipient, acceptPath, {})).data.status, 'accepted');
    assert.equal((await call(recipient, acceptPath, {})).status, 200);
    assert.equal((await call(0, '/trainer-requests', { trainerId: 'unknown' })).status, 404);
    assert.equal((await call(3, '/trainer-requests', { trainerId: 'T-DEMO-1' })).status, 403);
    const trainer = await call(0, '/trainer-requests', { trainerId: 'T-DEMO-1' });
    assert.equal(trainer.status, 201);
    assert.deepEqual((await call(0, '/trainer-requests', { trainerId: 'T-DEMO-1' })).data, trainer.data);
    assert.deepEqual((await call(1, '/me/trainer-requests')).data, []);
    const booking = await call(0, '/bookings', { classId: 'C-DEMO' });
    assert.equal((await call(3, '/payments', { bookingId: booking.data.id, requestId: 'guide-access-payment', amountCents: 12500 })).status, 201);
    assert.equal((await call(0, '/exercises')).data.length, 2);
    assert.equal((await call(1, '/exercises')).status, 403);
    await stop(); await start();
    assert.equal((await call(0, '/me/friend-connections')).data[0].status, 'accepted');
    assert.deepEqual((await call(0, '/me/trainer-requests')).data, [trainer.data]);
    assert.equal((await call(0, '/exercises')).status, 200);
  } finally { if (server?.listening) await stop(); await rm(dir, { recursive: true, force: true }); }
});
