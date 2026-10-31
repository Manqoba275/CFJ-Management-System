import { readProfileBody } from './request-body.mjs';
import { validProfile } from './profile-server.mjs';

// Only verified Firebase identity supplies UID/email. Body cannot choose roles or member IDs.
export async function enrolMember(req, claims, provision) {
  if (!claims.email_verified || typeof claims.email !== 'string' || !claims.email || claims.email.length > 254) {
    return { status: 403, data: { error: 'verified_email_required' } };
  }
  if (req.headers['content-type']?.split(';')[0] !== 'application/json') return { status: 415, data: { error: 'json_required' } };
  let value;
  try { value = JSON.parse(await readProfileBody(req)); }
  catch (error) { return { status: error.status || 400, data: { error: 'invalid_body' } }; }
  if (!validProfile(value) || Object.keys(value).some(k => !['displayName', 'goal'].includes(k))) {
    return { status: 400, data: { error: 'invalid_profile' } };
  }
  return { status: 200, data: await provision({ uid: claims.uid, email: claims.email, displayName: value.displayName.trim(), goal: value.goal }) };
}

export function oracleEnrolment(pool) {
  return async ({ uid, email, displayName, goal }) => {
    const c = await pool.getConnection(); c.callTimeout = 8000;
    try {
      // Serialise the small prototype's new-member allocation and concurrent retries.
      await c.execute('LOCK TABLE cfj_members IN EXCLUSIVE MODE WAIT 10');
      const existing = await c.execute('SELECT member_id FROM cfj_members WHERE identity_uid=:uid', { uid });
      if (existing.rows.length) { await c.rollback(); return { registered: true }; }
      const id = (await c.execute('SELECT NVL(MAX(member_id),0)+1 FROM cfj_members')).rows[0][0];
      await c.execute('INSERT INTO cfj_members(member_id,identity_uid,email) VALUES(:id,:uid,:email)', { id, uid, email: email.trim().toLowerCase() });
      await c.execute('INSERT INTO cfj_profiles(member_id,display_name,goal,version) VALUES(:id,:displayName,:goal,0)', { id, displayName, goal });
      await c.commit();
      return { registered: true };
    } catch (error) { await c.rollback(); throw error; }
    finally { await c.close(); }
  };
}
