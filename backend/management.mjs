import { randomUUID } from 'node:crypto';

export const events = [{ id: 'MARATHON-DEMO', name: 'CFJ community marathon — development event', capacity: 100 }];
export function publicEvents(state) {
  return events.map(event => ({ ...event, spaces: event.capacity - state.registrations.filter(r => r.eventId === event.id).length }));
}
export function register(body, state) {
  const fail = (status, error) => ({ status, data: { error } });
  if (Object.keys(body).some(k => !['eventId', 'displayName', 'email', 'consent', 'requestId'].includes(k)) ||
      typeof body.displayName !== 'string' || body.displayName.trim().length < 2 || body.displayName.trim().length > 60 ||
      typeof body.email !== 'string' || body.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) ||
      body.consent !== true || typeof body.requestId !== 'string' || !/^[a-zA-Z0-9-]{20,80}$/.test(body.requestId)) return fail(400, 'invalid_registration');
  const event = events.find(e => e.id === body.eventId);
  if (!event) return fail(404, 'event_not_found');
  const details = { eventId: event.id, displayName: body.displayName.trim(), email: body.email.trim().toLowerCase(), consent: true };
  const fingerprint = JSON.stringify(details);
  const retry = state.registrations.find(r => r.requestId === body.requestId);
  if (retry) return retry.fingerprint === fingerprint ? { status: 200, data: { reference: retry.id, status: 'registered' } } : fail(409, 'request_id_reused');
  if (state.registrations.some(r => r.eventId === event.id && r.email === details.email)) return fail(409, 'registration_unavailable');
  if (state.registrations.filter(r => r.eventId === event.id).length >= event.capacity) return fail(409, 'event_full');
  const record = { ...details, id: randomUUID(), requestId: body.requestId, fingerprint, registeredAt: new Date().toISOString() };
  state.registrations.push(record);
  return { status: 201, data: { reference: record.id, status: 'registered' } };
}
export function managementReport(state) {
  return {
    generatedAt: new Date().toISOString(), development: true, currency: 'ZAR',
    bookings: { active: state.bookings.filter(b => b.status === 'active').length, cancelled: state.bookings.filter(b => b.status === 'cancelled').length },
    attendance: state.attendance.length,
    simulatedPayments: { count: state.payments.length, amountCents: state.payments.reduce((sum, p) => sum + p.amountCents, 0) },
    trainerRequests: state.trainerRequests.length,
    connections: { pending: state.friendConnections.filter(r => r.status === 'pending').length, accepted: state.friendConnections.filter(r => r.status === 'accepted').length },
    events: publicEvents(state).map(e => ({ id: e.id, name: e.name, registrations: e.capacity - e.spaces, spaces: e.spaces }))
  };
}
