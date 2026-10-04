import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import { createProfileServer } from './profile-server.mjs';

test('profile API authenticates, validates, persists and rejects stale writes', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'cfj-profile-'));
  const options = { token: 'test-only-token-with-at-least-32-characters', file: join(directory, 'member.json') };
  let server;
  async function start() {
    server = await createProfileServer(options);
    server.listen(0, '127.0.0.1'); await once(server, 'listening');
    return `http://127.0.0.1:${server.address().port}/api/v1/me`;
  }
  const close = () => new Promise(resolve => server.close(resolve));
  try {
    let url = await start();
    const headers = { Authorization: `Bearer ${options.token}`, 'Content-Type': 'application/json' };
    const patch = value => fetch(url, { method: 'PATCH', headers, body: JSON.stringify(value) });
    assert.equal((await fetch(url)).status, 401);
    assert.equal((await fetch(url, { headers: { Authorization: 'Bearer incorrect' } })).status, 401);
    const initial = await (await fetch(url, { headers })).json();
    assert.equal(initial.version, 0);
    assert.equal((await patch({ ...initial, displayName: 'A' })).status, 400);
    assert.equal((await patch({ ...initial, goal: 'unknown' })).status, 400);
    assert.equal((await patch({ ...initial, userId: 'someone-else' })).status, 400);
    assert.equal((await fetch(url, { method: 'PATCH', headers, body: '{' })).status, 400);
    const competing = await Promise.all([patch({ ...initial, displayName: 'First member' }), patch({ ...initial, displayName: 'Second member' })]);
    assert.deepEqual(competing.map(r => r.status).sort(), [200, 409]);
    const saved = await (await fetch(url, { headers })).json();
    assert.equal(saved.version, 1);
    await close(); url = await start();
    assert.deepEqual(await (await fetch(url, { headers })).json(), saved);
  } finally { if (server?.listening) await close(); await rm(directory, { recursive: true, force: true }); }
});
