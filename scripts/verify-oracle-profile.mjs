import assert from 'node:assert/strict';
import { once } from 'node:events';
import { randomBytes } from 'node:crypto';
import oracledb from 'oracledb';
import { createProfileServer } from '../backend/profile-server.mjs';
import { oracleProfileStore } from '../backend/oracle-profile-store.mjs';

const pool = await oracledb.createPool({ user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD, connectString: process.env.ORACLE_CONNECT_STRING || '127.0.0.1:1521/FREEPDB1', poolMax: 3 });
const token = randomBytes(32).toString('hex');
const servers = [];
try {
  for (let i = 0; i < 2; i++) {
    const server = await createProfileServer({ token, store: oracleProfileStore(pool, 10) });
    server.listen(0, '127.0.0.1'); await once(server, 'listening'); servers.push(server);
  }
  const url = i => `http://127.0.0.1:${servers[i].address().port}/api/v1/me`;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  assert.equal((await fetch(url(0))).status, 401);
  const original = await (await fetch(url(0), { headers })).json();
  const value = { ...original, displayName: 'Oracle Evidence Member', goal: 'Endurance' };
  const results = await Promise.all([0, 1].map(i => fetch(url(i), { method: 'PATCH', headers, body: JSON.stringify(value) })));
  assert.deepEqual(results.map(r => r.status).sort(), [200, 409]);
  const loaded = await (await fetch(url(1), { headers })).json();
  assert.equal(loaded.displayName, value.displayName);
  assert.equal(loaded.version, original.version + 1);
  assert.equal((await fetch(url(0), { method: 'PATCH', headers, body: JSON.stringify({ ...loaded, goal: 'invalid' }) })).status, 400);
  const fresh = await oracleProfileStore(pool, 10).load();
  assert.deepEqual(fresh, loaded);
  assert.ok(await oracleProfileStore(pool, 10).update({ ...original, version: fresh.version }));
  const c = await pool.getConnection();
  try {
    const counts = (await c.execute("SELECT 'CFJ_MEMBERS' AS table_name, COUNT(*) AS records FROM cfj_members UNION ALL SELECT 'CFJ_PROFILES', COUNT(*) FROM cfj_profiles", [], { outFormat: oracledb.OUT_FORMAT_OBJECT })).rows;
    assert.ok(counts.every(row => row.RECORDS >= 10));
    console.log(JSON.stringify({ verifiedAt: new Date().toISOString(), checks: ['unauthorized request rejected', 'two API instances: one concurrent update succeeds and one conflicts', 'other API instance reads committed update', 'invalid goal rejected', 'fresh database connection reads committed data', 'synthetic profile restored'], tables: counts, status: 'PASS' }, null, 2));
  } finally { await c.close(); }
} finally {
  await Promise.all(servers.map(server => new Promise(resolve => server.close(resolve))));
  await pool.close(10);
}
