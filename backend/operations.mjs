// Stores the development booking workflow in a local file. Its write queue protects one running process, not several servers.
import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { dirname } from 'node:path';
import { randomUUID, timingSafeEqual } from 'node:crypto';
import { readProfileBody } from './request-body.mjs';
import { isCommunityPath, communityRead, communityWrite } from './community.mjs';
import { publicEvents, register, managementReport } from './management.mjs';
import { membershipEligibility } from './membership.mjs';

// Single-process development transactions. Production requires Oracle and verified identities.
export async function createOperationsHandler({ file, identities, store }) {
  if (!identities.length || identities.some(i => !i.id || !['member', 'staff', 'admin'].includes(i.role) || typeof i.token !== 'string' || i.token.length < 32) ||
      new Set(identities.map(i => i.id)).size !== identities.length ||
      new Set(identities.map(i => i.token)).size !== identities.length) throw new Error('Invalid development identities');
  let state = { classes: [{ id: 'C-DEMO', name: 'Demo strength class', capacity: 1 }], bookings: [], attendance: [], payments: [], requests: {} };
  try { state = store ? await store.load() : JSON.parse(await readFile(file, 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (!['classes', 'bookings', 'attendance', 'payments'].every(key => Array.isArray(state[key])) || !state.requests) throw new Error('Invalid operations store');
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Johannesburg' }).format(new Date());
  state.classes = state.classes.map(c => ({ date: today, ...c }));
  // Existing development fixtures receive explicitly synthetic unlimited memberships.
  state.memberships ??= identities.filter(i => i.role === 'member').map(i => ({
    id: `DEMO-${i.id}`, memberId: i.id, plan: 'unlimited', status: 'active',
    startsOn: today, expiresOn: `${Number(today.slice(0, 4)) + 1}-12-31`, simulated: true
  }));
  if (!Array.isArray(state.memberships) || state.memberships.some(m => !m || typeof m !== 'object' || !m.id || !m.memberId)) throw new Error('Invalid membership store');
  // Upgrade earlier development stores without discarding bookings or payments.
  state.trainerRequests ??= [];
  state.friendConnections ??= [];
  state.registrations ??= [];
  if (!Array.isArray(state.registrations)) throw new Error('Invalid registration store');
  if (!Array.isArray(state.trainerRequests) || !Array.isArray(state.friendConnections)) throw new Error('Invalid community store');
  let queue = Promise.resolve();
  return async (req, res) => {
    const reply = (code, data) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(data)); };
    const supplied = Buffer.from(req.headers.authorization || '');
    const actor = identities.find(i => { const expected = Buffer.from(`Bearer ${i.token}`); return supplied.length === expected.length && timingSafeEqual(supplied, expected); });
    const path = req.url;
    const publicRead = req.method === 'GET' && path === '/api/v1/public/events';
    const publicWrite = req.method === 'POST' && path === '/api/v1/public/registrations';
    if (!actor && !publicRead && !publicWrite) return reply(401, { error: 'unauthorized' });
    if (req.method === 'GET') {
      await queue;
      // Reload database state for each request so other API instances are visible.
      if (store) { try { state = await store.load(); } catch { return reply(503, { error: 'storage_unavailable' }); } }
      if (publicRead) return reply(200, publicEvents(state));
      if (path === '/api/v1/admin/reports') return actor.role === 'admin' ? reply(200, managementReport(state)) : reply(403, { error: 'admin_required' });
      if (isCommunityPath(path)) { const result = communityRead(path, state, actor, identities); return reply(result.status, result.data); }
      if (path === '/api/v1/classes') return reply(200, state.classes.map(c => ({ ...c, spaces: c.capacity - state.bookings.filter(b => b.classId === c.id && b.status === 'active').length })));
      if (path === '/api/v1/bookings') return reply(200, state.bookings.filter(b => actor.role === 'staff' || b.memberId === actor.id));
      if (path === '/api/v1/me/attendance') return reply(200, state.attendance.filter(a => a.memberId === actor.id));
      if (path === '/api/v1/me/payments') return reply(200, state.payments.filter(p => p.memberId === actor.id));
      if (path === '/api/v1/me/memberships') return reply(200, state.memberships.filter(m => m.memberId === actor.id));
      return reply(404, { error: 'not_found' });
    }
    const cancel = /^\/api\/v1\/bookings\/([a-zA-Z0-9-]+)$/.exec(path);
    if (!publicWrite && !(req.method === 'DELETE' && cancel) && !(req.method === 'POST' && (isCommunityPath(path) || ['/api/v1/bookings', '/api/v1/attendance', '/api/v1/payments'].includes(path)))) return reply(404, { error: 'not_found' });
    let body = {};
    if (req.method === 'POST') {
      if (req.headers['content-type']?.split(';')[0] !== 'application/json') return reply(415, { error: 'json_required' });
      try { body = JSON.parse(await readProfileBody(req)); }
      catch (error) { return reply(error.status || 400, { error: 'invalid_body' }); }
      if (!body || Array.isArray(body) || typeof body !== 'object') return reply(400, { error: 'invalid_body' });
    }
    // Check and save each change in order so two requests cannot take the same last place.
    const operation = queue.then(async () => {
      const applyChange = async current => {
      const next = structuredClone(current);
      const fail = (status, error) => ({ status, data: { error } });
      function change() {
        if (publicWrite) return register(body, next);
        if (isCommunityPath(path)) return communityWrite(path, body, next, actor, identities);
        if (cancel) {
          const booking = next.bookings.find(b => b.id === cancel[1]);
          if (!booking || booking.memberId !== actor.id) return fail(404, 'booking_not_found');
          if (next.attendance.some(a => a.bookingId === booking.id)) return fail(409, 'already_attended');
          booking.status = 'cancelled';
          return { status: 200, data: booking };
        }
        if (path === '/api/v1/bookings') {
          if (actor.role !== 'member') return fail(403, 'member_required');
          if (Object.keys(body).some(k => k !== 'classId') || typeof body.classId !== 'string') return fail(400, 'invalid_booking');
          const session = next.classes.find(c => c.id === body.classId);
          if (!session) return fail(404, 'class_not_found');
          const active = next.bookings.filter(b => b.classId === session.id && b.status === 'active');
          if (active.some(b => b.memberId === actor.id)) return fail(409, 'already_booked');
          if (active.length >= session.capacity) return fail(409, 'class_full');
          const memberships = next.memberships.filter(m => m.memberId === actor.id);
          const membership = memberships.find(m => !membershipEligibility(m, session, next.bookings, next.classes, actor.id));
          if (!membership) return fail(409, membershipEligibility(memberships[0], session, next.bookings, next.classes, actor.id));
          const booking = { id: randomUUID(), memberId: actor.id, classId: session.id, status: 'active', date: session.date, membershipId: membership.id };
          const previous = next.bookings.find(b => b.memberId === actor.id && b.classId === session.id);
          // Oracle retains one member/session row; rebooking reactivates a cancelled row.
          if (previous) { booking.id = previous.id; Object.assign(previous, booking); }
          else next.bookings.push(booking);
          return { status: 201, data: booking };
        }
        if (actor.role !== 'staff') return fail(403, 'staff_required');
        const allowed = path === '/api/v1/payments' ? ['bookingId', 'requestId', 'amountCents'] : ['bookingId', 'requestId'];
        if (Object.keys(body).some(k => !allowed.includes(k)) || typeof body.bookingId !== 'string' ||
            typeof body.requestId !== 'string' || !/^[a-zA-Z0-9-]{8,80}$/.test(body.requestId)) return fail(400, 'invalid_record');
        if (path === '/api/v1/payments' && (!Number.isSafeInteger(body.amountCents) || body.amountCents < 1 || body.amountCents > 10000000)) return fail(400, 'invalid_amount');
        const key = `${actor.id}:${path}:${body.requestId}`;
        // A retry may reuse its ID only when it carries the same booking and amount.
        const fingerprint = JSON.stringify([body.bookingId, body.amountCents ?? null]);
        if (next.requests[key]) return next.requests[key].fingerprint === fingerprint ? { status: 200, data: next.requests[key].record } : fail(409, 'request_id_reused');
        const booking = next.bookings.find(b => b.id === body.bookingId && b.status === 'active');
        if (!booking) return fail(409, 'active_booking_required');
        if (path === '/api/v1/attendance' && next.attendance.some(a => a.bookingId === booking.id)) return fail(409, 'already_recorded');
        const record = { id: randomUUID(), bookingId: booking.id, memberId: booking.memberId, recordedBy: actor.id, recordedAt: new Date().toISOString() };
        if (path === '/api/v1/payments') { Object.assign(record, { amountCents: body.amountCents, currency: 'ZAR', simulated: true }); next.payments.push(record); }
        else next.attendance.push(record);
        next.requests[key] = { fingerprint, record };
        return { status: 201, data: record };
      }
      const result = change();
      return { result, next };
      };
      if (store) {
        const result = await store.transact(applyChange);
        return reply(result.status, result.data);
      }
      const { result, next } = await applyChange(state);
      if (result.status < 300) {
        await mkdir(dirname(file), { recursive: true });
        await writeFile(`${file}.next`, JSON.stringify(next), { mode: 0o600 });
        await rename(`${file}.next`, file);
        state = next;
      }
      reply(result.status, result.data);
    });
    queue = operation.catch(() => {});
    try { await operation; } catch { if (!res.headersSent) reply(500, { error: 'save_failed' }); }
  };
}
