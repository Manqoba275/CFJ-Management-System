import { randomUUID } from 'node:crypto';

export const trainers = [
  { id: 'T-DEMO-1', displayName: 'Demo Strength Coach', specialty: 'Strength', language: 'English' },
  { id: 'T-DEMO-2', displayName: 'Demo Conditioning Coach', specialty: 'Conditioning', language: 'English' }
];
const exercises = [
  { id: 'E-DEMO-1', title: 'Strength session guide', goal: 'Build strength', instructions: 'Ask your assigned trainer to select and demonstrate exercises appropriate for your session.' },
  { id: 'E-DEMO-2', title: 'Conditioning session guide', goal: 'Endurance', instructions: 'Use the session plan provided by your trainer and record your completed activity.' }
];
export const communityPaths = ['/api/v1/trainers', '/api/v1/members', '/api/v1/exercises', '/api/v1/me/trainer-requests', '/api/v1/me/friend-connections', '/api/v1/trainer-requests', '/api/v1/friend-connections'];
export const isCommunityPath = path => communityPaths.includes(path) || /^\/api\/v1\/friend-connections\/[a-zA-Z0-9-]+\/accept$/.test(path);
const fail = (status, error) => ({ status, data: { error } });
const ok = data => ({ status: 200, data });
export function communityRead(path, state, actor, identities) {
  if (actor.role !== 'member') return fail(403, 'member_required');
  if (path === '/api/v1/trainers') return ok(trainers);
  if (path === '/api/v1/members') return ok(identities.filter(i => i.role === 'member' && i.discoverable === true && i.id !== actor.id)
    .map(i => ({ id: i.id, displayName: i.displayName || 'Demo member', goal: i.goal || 'General fitness' })));
  if (path === '/api/v1/exercises') return state.payments.some(p => p.memberId === actor.id && p.simulated === true && p.amountCents > 0)
    ? ok(exercises) : fail(403, 'paid_demo_membership_required');
  if (path === '/api/v1/me/trainer-requests') return ok(state.trainerRequests.filter(r => r.memberId === actor.id));
  if (path === '/api/v1/me/friend-connections') return ok(state.friendConnections.filter(r => r.fromId === actor.id || r.toId === actor.id));
  return fail(404, 'not_found');
}
export function communityWrite(path, body, state, actor, identities) {
  if (actor.role !== 'member') return fail(403, 'member_required');
  const accept = /^\/api\/v1\/friend-connections\/([a-zA-Z0-9-]+)\/accept$/.exec(path);
  if (accept) {
    if (Object.keys(body).length) return fail(400, 'invalid_request');
    const connection = state.friendConnections.find(r => r.id === accept[1] && r.toId === actor.id);
    if (!connection) return fail(404, 'connection_not_found');
    connection.status = 'accepted';
    return ok(connection);
  }
  const trainer = path === '/api/v1/trainer-requests';
  if (!trainer && path !== '/api/v1/friend-connections') return fail(404, 'not_found');
  const field = trainer ? 'trainerId' : 'memberId';
  if (Object.keys(body).length !== 1 || typeof body[field] !== 'string') return fail(400, 'invalid_request');
  if (trainer) {
    if (!trainers.some(t => t.id === body.trainerId)) return fail(404, 'trainer_not_found');
    const existing = state.trainerRequests.find(r => r.memberId === actor.id && r.trainerId === body.trainerId);
    if (existing) return ok(existing);
    const record = { id: randomUUID(), memberId: actor.id, trainerId: body.trainerId, status: 'pending' };
    state.trainerRequests.push(record);
    return { status: 201, data: record };
  }
  if (body.memberId === actor.id) return fail(400, 'self_connection');
  if (!identities.some(i => i.id === body.memberId && i.role === 'member' && i.discoverable === true)) return fail(404, 'member_not_found');
  const existing = state.friendConnections.find(r => (r.fromId === actor.id && r.toId === body.memberId) || (r.toId === actor.id && r.fromId === body.memberId));
  if (existing) return ok(existing); // Reciprocal requests never imply acceptance.
  const record = { id: randomUUID(), fromId: actor.id, toId: body.memberId, status: 'pending' };
  state.friendConnections.push(record);
  return { status: 201, data: record };
}
