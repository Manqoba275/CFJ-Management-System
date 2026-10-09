import { readProfileBody } from './request-body.mjs';
export { readProfileBody } from './request-body.mjs';
import http from 'node:http';
import { timingSafeEqual } from 'node:crypto';
import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const goals = ['Build strength', 'Weight loss', 'Muscle tone', 'Endurance'];
export function validProfile(value) {
  return value && typeof value.displayName === 'string' && value.displayName.trim().length >= 2 &&
    value.displayName.trim().length <= 60 && goals.includes(value.goal);
}

// Local development adapter only. Production requires verified identity and Oracle storage.
export async function createProfileServer({ token, file, operations }) {
  if (typeof token !== 'string' || token.length < 32) throw new Error('Set CFJ_DEV_TOKEN to a random token of at least 32 characters');
  let profile = { displayName: 'Demo Member', goal: goals[0], version: 0 };
  try {
    profile = JSON.parse(await readFile(file, 'utf8'));
    if (!validProfile(profile) || !Number.isSafeInteger(profile.version) || profile.version < 0) throw new Error('Invalid saved profile');
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  let pending = Promise.resolve();
  const secret = Buffer.from(`Bearer ${token}`);
  return http.createServer(async (req, res) => {
    const reply = (status, body) => {
      res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify(body));
    };
    if (req.url === '/service.html' && req.method === 'GET') {
      try {
        const page = await readFile(new URL('../website/service.html', import.meta.url));
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
        return res.end(page);
      } catch { return reply(404, { error: 'not_found' }); }
    }
    if (req.url !== '/api/v1/me') return operations ? operations(req, res) : reply(404, { error: 'not_found' });
    const supplied = Buffer.from(req.headers.authorization || '');
    if (supplied.length !== secret.length || !timingSafeEqual(supplied, secret)) return reply(401, { error: 'unauthorized' });
    if (req.method === 'GET') { await pending; return reply(200, profile); }
    if (req.method !== 'PATCH') return reply(405, { error: 'method_not_allowed' });
    if (req.headers['content-type']?.split(';')[0] !== 'application/json') return reply(415, { error: 'json_required' });
    try {
      let body;
      try { body = await readProfileBody(req); }
      catch (error) { return reply(error.status || 400, { error: error.status === 413 ? 'body_too_large' : 'invalid_body' }); }
      let value;
      try { value = JSON.parse(body); } catch { return reply(400, { error: 'invalid_json' }); }
      if (!validProfile(value) || Object.keys(value).some(key => !['displayName', 'goal', 'version'].includes(key)) ||
          !Number.isSafeInteger(value.version) || value.version < 0) return reply(400, { error: 'invalid_profile' });
      const update = pending.then(async () => {
        if (value.version !== profile.version) return reply(409, { error: 'profile_changed_reload' });
        const next = { displayName: value.displayName.trim(), goal: value.goal, version: profile.version + 1 };
        await mkdir(dirname(file), { recursive: true });
        await writeFile(`${file}.next`, JSON.stringify(next), { mode: 0o600 });
        await rename(`${file}.next`, file);
        profile = next;
        reply(200, profile);
      });
      pending = update.catch(() => {});
      await update;
    } catch { if (!res.headersSent) reply(500, { error: 'save_failed' }); }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { createOperationsHandler } = await import('./operations.mjs');
  const identities = [{ id: 'demo-member', role: 'member', token: process.env.CFJ_DEV_TOKEN || '', discoverable: true, displayName: 'Demo Member', goal: 'Build strength' }];
  if (process.env.CFJ_DEV_PEER_TOKEN) identities.push({ id: 'demo-peer', role: 'member', token: process.env.CFJ_DEV_PEER_TOKEN, discoverable: true, displayName: 'Demo Training Partner', goal: 'Endurance' });
  if (process.env.CFJ_DEV_STAFF_TOKEN) identities.push({ id: 'demo-staff', role: 'staff', token: process.env.CFJ_DEV_STAFF_TOKEN });
  const operations = await createOperationsHandler({ file: resolve('tmp/profile-api/operations.json'), identities });
  const server = await createProfileServer({ token: process.env.CFJ_DEV_TOKEN, file: resolve('tmp/profile-api/member.json'), operations });
  server.listen(8787, '127.0.0.1', () => console.log('Development profile API: http://127.0.0.1:8787/api/v1/me (synthetic member only)'));
}
