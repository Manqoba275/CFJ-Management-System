import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { enrolMember } from './enrolment.mjs';
import { firebaseGate } from './firebase-gate.mjs';
function request(body) {
  const req = Readable.from([Buffer.from(JSON.stringify(body))]);
  req.headers = { 'content-type': 'application/json' }; return req;
}
const claims = { uid: 'verified-uid', email: 'member@example.invalid', email_verified: true };
test('enrolment takes identity only from verified claims and validates the profile', async () => {
  let input;
  const provision = async value => { input = value; return { registered: true }; };
  const profile = { displayName: ' New Member ', goal: 'Endurance' };
  assert.equal((await enrolMember(request(profile), claims, provision)).status, 200);
  assert.deepEqual(input, { ...profile, displayName: 'New Member', uid: claims.uid, email: claims.email });
  for (const extra of [{ role: 'admin' }, { uid: 'someone-else' }, { email: 'other@example.invalid' }]) {
    assert.equal((await enrolMember(request({ ...profile, ...extra }), claims, () => assert.fail('must not provision'))).status, 400);
  }
  assert.equal((await enrolMember(request(profile), { ...claims, email_verified: false }, () => assert.fail())).status, 403);
});
test('enrolment cannot bypass token verification or email verification', async () => {
  for (const verified of [false, true]) {
    let called = false;
    const req = request({ displayName: 'Member', goal: 'Endurance' });
    Object.assign(req, { method: 'POST', url: '/api/v1/enrol' }); req.headers.authorization = 'Bearer token';
    const res = { writeHead(status) { this.status = status; }, end() {} };
    await firebaseGate({ verifyToken: async () => ({ ...claims, email_verified: verified }),
      findMember: () => assert.fail('enrolment should not require an existing member'), dispatch: () => assert.fail(),
      enrol: async () => { called = true; return { status: 200, data: {} }; }
    })(req, res);
    assert.equal(called, verified); assert.equal(res.status, verified ? 200 : 403);
  }
});
