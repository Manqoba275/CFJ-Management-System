// Inserts reserved synthetic fixtures only. Reruns preserve existing rows and never delete user data.
import oracledb from 'oracledb';
const c=await oracledb.getConnection({user:process.env.ORACLE_USER,password:process.env.ORACLE_PASSWORD,connectString:process.env.ORACLE_CONNECT_STRING});
const id=(kind,i)=>`SEED-${kind}-${i}`;
async function insert(table,key,row) {
  const columns=Object.keys(row);
  // Table and column names come solely from the fixed fixtures below, never from a client request.
  const binds=Object.fromEntries(columns.map((k,i)=>['v'+i,row[k]]));
  const keyIndex=columns.indexOf(key);
  const result=await c.execute(`INSERT INTO ${table} (${columns.join(',')}) SELECT ${columns.map((k,i)=>['starts_on','expires_on'].includes(k) ? `TO_DATE(:v${i},'YYYY-MM-DD')` : ':v'+i).join(',')} FROM dual WHERE NOT EXISTS (SELECT 1 FROM ${table} WHERE ${key}=:v${keyIndex})`,binds);
  return result.rowsAffected;
}
let inserted=0;
try {
  for(let i=1;i<=10;i++) {
    const member=9000+i;
    const existing=await c.execute('SELECT identity_uid FROM cfj_members WHERE member_id=:id',{id:member});
    if(existing.rows.length && existing.rows[0][0]!==id('UID',i)) throw new Error(`Reserved member ${member} is already used; no data changed`);
    inserted+=await insert('cfj_members','member_id',{member_id:member,identity_uid:id('UID',i),email:`seed${i}@example.invalid`});
    inserted+=await insert('cfj_profiles','member_id',{member_id:member,display_name:`Synthetic Member ${i}`,goal:'Build strength',version:0});
    inserted+=await insert('cfj_trainers','trainer_id',{trainer_id:id('TRAINER',i),display_name:`Synthetic Coach ${i}`,specialty:i%2?'Strength':'Conditioning',language:'English'});
    inserted+=await insert('cfj_memberships','membership_id',{membership_id:id('MS',i),member_id:member,plan_code:'unlimited',status:'active',starts_on:'2026-01-01',expires_on:'2027-12-31'});
    inserted+=await insert('cfj_class_sessions','session_id',{session_id:id('CLASS',i),title:`Synthetic Strength ${i}`,trainer_id:id('TRAINER',i),starts_at:new Date(`2026-10-${String(i).padStart(2,'0')}T08:00:00Z`),capacity:12});
    inserted+=await insert('cfj_bookings','booking_id',{booking_id:id('BOOK',i),member_id:member,session_id:id('CLASS',i),membership_id:id('MS',i),status:'active'});
    inserted+=await insert('cfj_attendance','attendance_id',{attendance_id:id('ATT',i),booking_id:id('BOOK',i),request_id:id('ATT-REQUEST',i)});
    inserted+=await insert('cfj_payments','payment_id',{payment_id:id('PAY',i),booking_id:id('BOOK',i),amount_cents:10000+i*100,currency:'ZAR',simulated:1,request_id:id('PAY-REQUEST',i)});
    inserted+=await insert('cfj_trainer_requests','request_id',{request_id:id('TR',i),member_id:member,trainer_id:id('TRAINER',i),status:'pending'});
    inserted+=await insert('cfj_events','event_id',{event_id:id('EVENT',i),title:`Synthetic Community Event ${i}`,starts_at:new Date('2026-11-01T08:00:00Z'),capacity:100});
    inserted+=await insert('cfj_event_registrations','registration_id',{registration_id:id('REG',i),event_id:id('EVENT',i),display_name:`Synthetic Guest ${i}`,email:`guest${i}@example.invalid`,consent:1,request_id:id('REG-REQUEST',i)});
    inserted+=await insert('cfj_resources','resource_id',{resource_id:id('RESOURCE',i),title:`Synthetic Training Guide ${i}`,goal:'Build strength',instructions:'Ask the assigned trainer to demonstrate the planned session.',requires_payment:1});
  }
  // References are inserted after every member exists, including the final ring connection.
  for(let i=1;i<=10;i++) {
    const from=9000+i,to=9000+(i%10)+1;
    inserted+=await insert('cfj_friend_connections','connection_id',{connection_id:id('FRIEND',i),from_member_id:from,to_member_id:to,status:'pending'});
    inserted+=await insert('cfj_messages','message_id',{message_id:id('MSG',i),sender_id:from,recipient_id:to,body:'Synthetic message for database verification only.'});
  }
  await c.commit();console.log(JSON.stringify({status:'PASS',inserted,fixturePrefix:'SEED-',memberRange:'9001-9010'}));
} catch(error) { await c.rollback();throw error; }
finally {await c.close();}
