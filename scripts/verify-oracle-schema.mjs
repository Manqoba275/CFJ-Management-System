// Tests real constraints with rolled-back mutations; no production or identity-service access is used.
import assert from 'node:assert/strict';
import oracledb from 'oracledb';
const config={user:process.env.ORACLE_USER,password:process.env.ORACLE_PASSWORD,connectString:process.env.ORACLE_CONNECT_STRING};
const c=await oracledb.getConnection(config);
const checks=[];
async function rejects(label,sql,code) {
  await c.execute('SAVEPOINT constraint_test');
  try { await assert.rejects(c.execute(sql),e=>e.errorNum===code);checks.push(label); }
  finally { await c.execute('ROLLBACK TO constraint_test'); }
}
try {
  const tables=(await c.execute("SELECT table_name FROM user_tables WHERE table_name LIKE 'CFJ_%' ORDER BY table_name")).rows.flat();
  assert.equal(tables.length,14,'Expected two profile tables plus twelve domain tables');
  const counts=[];
  for(const table of tables) {
    assert.match(table,/^CFJ_[A-Z_]+$/);
    const count=(await c.execute(`SELECT COUNT(*) FROM ${table}`)).rows[0][0];
    assert.ok(count>=10,`${table} needs at least 10 rows`);counts.push({table,records:count});
  }
  await rejects('orphan membership rejected',"UPDATE cfj_memberships SET member_id=-1 WHERE membership_id='SEED-MS-1'",2291);
  await rejects('invalid plan rejected',"UPDATE cfj_memberships SET plan_code='unknown' WHERE membership_id='SEED-MS-1'",2290);
  await rejects('reversed membership dates rejected',"UPDATE cfj_memberships SET expires_on=DATE '2000-01-01' WHERE membership_id='SEED-MS-1'",2290);
  await rejects('negative class capacity rejected',"UPDATE cfj_class_sessions SET capacity=-1 WHERE session_id='SEED-CLASS-1'",2290);
  await rejects('fractional class capacity rejected',"UPDATE cfj_class_sessions SET capacity=1.5 WHERE session_id='SEED-CLASS-1'",2290);
  await rejects('duplicate member-session booking rejected',"INSERT INTO cfj_bookings (booking_id,member_id,session_id,membership_id,status) VALUES ('VERIFY-DUP',9001,'SEED-CLASS-1','SEED-MS-1','active')",1);
  await rejects('another member membership rejected',"UPDATE cfj_bookings SET membership_id='SEED-MS-2' WHERE booking_id='SEED-BOOK-1'",2291);
  await rejects('invalid booking status rejected',"UPDATE cfj_bookings SET status='fake' WHERE booking_id='SEED-BOOK-1'",2290);
  await rejects('double attendance rejected',"INSERT INTO cfj_attendance(attendance_id,booking_id,request_id) VALUES('VERIFY-ATT','SEED-BOOK-1','VERIFY-ATT-REQ')",1);
  await rejects('zero payment rejected',"UPDATE cfj_payments SET amount_cents=0 WHERE payment_id='SEED-PAY-1'",2290);
  await rejects('fractional payment cents rejected',"UPDATE cfj_payments SET amount_cents=1.5 WHERE payment_id='SEED-PAY-1'",2290);
  await rejects('real payment claim rejected',"UPDATE cfj_payments SET simulated=0 WHERE payment_id='SEED-PAY-1'",2290);
  await rejects('duplicate payment request rejected',"UPDATE cfj_payments SET request_id='SEED-PAY-REQUEST-2' WHERE payment_id='SEED-PAY-1'",1);
  await rejects('reciprocal friend duplicate rejected',"INSERT INTO cfj_friend_connections(connection_id,from_member_id,to_member_id,status) VALUES('VERIFY-FRIEND',9002,9001,'pending')",1);
  await rejects('self connection rejected',"UPDATE cfj_friend_connections SET to_member_id=from_member_id WHERE connection_id='SEED-FRIEND-1'",2290);
  await rejects('registration without consent rejected',"UPDATE cfj_event_registrations SET consent=0 WHERE registration_id='SEED-REG-1'",2290);
  await rejects('duplicate event/email rejected',"INSERT INTO cfj_event_registrations(registration_id,event_id,display_name,email,consent,request_id) VALUES('VERIFY-REG','SEED-EVENT-1','Synthetic Guest','guest1@example.invalid',1,'VERIFY-REG-REQUEST')",1);
  await rejects('invalid library goal rejected',"UPDATE cfj_resources SET goal='unknown' WHERE resource_id='SEED-RESOURCE-1'",2290);
  await rejects('self message rejected',"UPDATE cfj_messages SET recipient_id=sender_id WHERE message_id='SEED-MSG-1'",2290);
  const disabled=(await c.execute("SELECT constraint_name FROM user_constraints WHERE table_name LIKE 'CFJ_%' AND (status <> 'ENABLED' OR validated <> 'VALIDATED')")).rows;
  assert.equal(disabled.length,0);checks.push('all schema constraints enabled and validated');
  await c.rollback();
  const fresh=await oracledb.getConnection(config);
  try {assert.equal((await fresh.execute("SELECT COUNT(*) FROM cfj_messages WHERE message_id LIKE 'SEED-%'")).rows[0][0],10);checks.push('committed fixture rows visible from a fresh connection');}
  finally {await fresh.close();}
  const columns=(await c.execute("SELECT table_name,column_name,data_type,data_length,data_precision,data_scale,nullable FROM user_tab_columns WHERE table_name LIKE 'CFJ_%' ORDER BY table_name,column_id",[],{outFormat:oracledb.OUT_FORMAT_OBJECT})).rows;
  const constraints=(await c.execute("SELECT table_name,constraint_name,constraint_type,status,validated FROM user_constraints WHERE table_name LIKE 'CFJ_%' ORDER BY table_name,constraint_type",[],{outFormat:oracledb.OUT_FORMAT_OBJECT})).rows;
  console.log(JSON.stringify({verifiedAt:new Date().toISOString(),environment:'local Oracle FREEPDB1',status:'PASS',counts,checks,columns,constraints,limitations:['Domain API still uses JSON; schema creation does not integrate clients.','No hosted Oracle, phone acceptance or recovery test claimed.','Capacity and role rules need transactional API integration.']},null,2));
} finally {await c.rollback();await c.close();}
