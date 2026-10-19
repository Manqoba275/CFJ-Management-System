// Exercises two independent HTTP servers against Oracle, then removes only this run's synthetic fixtures.
import assert from 'node:assert/strict';
import http from 'node:http';
import {once} from 'node:events';
import {randomBytes,randomInt} from 'node:crypto';
import oracledb from 'oracledb';
import {createOperationsHandler} from '../backend/operations.mjs';
import {oracleOperationsStore} from '../backend/oracle-operations-store.mjs';
const pool=await oracledb.createPool({user:process.env.ORACLE_USER,password:process.env.ORACLE_PASSWORD,connectString:process.env.ORACLE_CONNECT_STRING,poolMax:5});
const tag='CHECK-'+randomBytes(6).toString('hex'), a=randomInt(1000000,9000000), b=a+1;
const identities=[{id:String(a),role:'member',discoverable:true},{id:String(b),role:'member',discoverable:true},{id:'staff-check',role:'staff'},{id:'admin-check',role:'admin'}].map(x=>({...x,token:randomBytes(32).toString('hex')}));
const servers=[],checks=[];let fixturesCreated=false;
const c=await pool.getConnection();
async function call(server,actor,path,method='GET',body) {
 const r=await fetch(`http://127.0.0.1:${servers[server].address().port}${path}`,{method,headers:{...(actor===null?{}:{Authorization:'Bearer '+identities[actor].token}),'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
 return {status:r.status,data:await r.json()};
}
try {
 for(const member of [a,b]) {
  await c.execute('INSERT INTO cfj_members(member_id,identity_uid,email) VALUES(:id,:uid,:email)',{id:member,uid:`${tag}-${member}`,email:`${tag}-${member}@example.invalid`});
  await c.execute("INSERT INTO cfj_memberships(membership_id,member_id,plan_code,status,starts_on,expires_on) VALUES(:id,:member,'weekly3','active',DATE '2026-01-01',DATE '2027-12-31')",{id:`${tag}-${member}`,member});
 }
 for(let i=0;i<5;i++)await c.execute("INSERT INTO cfj_class_sessions(session_id,title,trainer_id,starts_at,capacity) VALUES(:id,'Synthetic API verification','SEED-TRAINER-1',TO_TIMESTAMP_TZ('2026-10-19 10:00:00 +02:00','YYYY-MM-DD HH24:MI:SS TZH:TZM'),:capacity)",{id:`${tag}-${i}`,capacity:i===0?1:10});
 await c.execute("INSERT INTO cfj_events(event_id,title,starts_at,capacity) VALUES(:id,'Synthetic API event',SYSTIMESTAMP,1)",{id:tag});
 await c.commit();fixturesCreated=true;
 for(let i=0;i<2;i++) {
  const handler=await createOperationsHandler({identities,store:oracleOperationsStore(pool)});
  const s=http.createServer((req,res)=>handler(req,res).catch(()=>{res.writeHead(500);res.end('{"error":"unexpected"}');}));
  s.listen(0,'127.0.0.1');await once(s,'listening');servers.push(s);
 }
 assert.equal((await call(0,null,'/api/v1/classes')).status,401);checks.push('unauthenticated protected request rejected');
 assert.equal((await call(0,0,'/api/v1/admin/reports')).status,403);checks.push('member denied admin report');
 const race=await Promise.all([call(0,0,'/api/v1/bookings','POST',{classId:tag+'-0'}),call(1,1,'/api/v1/bookings','POST',{classId:tag+'-0'})]);
 assert.deepEqual(race.map(r=>r.status).sort(),[201,409]);checks.push('two independent servers: last place booked once');
 const winner=race[0].status===201?0:1, booking=race[winner].data;
 assert.ok((await call(1,winner,'/api/v1/bookings')).data.some(r=>r.id===booking.id));checks.push('other server sees committed booking');
 assert.equal((await call(0,1-winner,'/api/v1/bookings/'+booking.id,'DELETE')).status,404);checks.push('another member cannot cancel booking');
 assert.equal((await call(0,winner,'/api/v1/bookings/'+booking.id,'DELETE')).status,200);
 const rebook=await call(1,winner,'/api/v1/bookings','POST',{classId:tag+'-0'});assert.equal(rebook.status,201);assert.equal(rebook.data.id,booking.id);checks.push('cancellation and rebooking reuse the constrained booking row');
 const payment={bookingId:booking.id,requestId:tag+'-payment',amountCents:12345};
 assert.equal((await call(0,2,'/api/v1/payments','POST',payment)).status,201);
 assert.equal((await call(1,2,'/api/v1/payments','POST',payment)).status,200);
 assert.equal((await call(1,2,'/api/v1/payments','POST',{...payment,amountCents:999})).status,409);checks.push('payment retries survive other instance and reject changed amount');
 assert.equal((await call(0,2,'/api/v1/attendance','POST',{bookingId:booking.id,requestId:tag+'-att'})).status,201);
 assert.equal((await call(1,2,'/api/v1/attendance','POST',{bookingId:booking.id,requestId:tag+'-att'})).status,200);
 assert.equal((await call(0,winner,'/api/v1/bookings/'+booking.id,'DELETE')).status,409);checks.push('attendance persists and prevents later cancellation');
 assert.equal((await call(0,winner,'/api/v1/bookings','POST',{classId:tag+'-1'})).status,201);
 const weekly=await Promise.all([call(0,winner,'/api/v1/bookings','POST',{classId:tag+'-2'}),call(1,winner,'/api/v1/bookings','POST',{classId:tag+'-3'})]);
 assert.deepEqual(weekly.map(r=>r.status).sort(),[201,409]);checks.push('weekly allowance protected across different sessions and servers');
 const friend=await call(0,0,'/api/v1/friend-connections','POST',{memberId:String(b)});assert.equal(friend.status,201);
 assert.equal((await call(0,0,'/api/v1/friend-connections/'+friend.data.id+'/accept','POST',{})).status,404);
 assert.equal((await call(1,1,'/api/v1/friend-connections/'+friend.data.id+'/accept','POST',{})).status,200);
 assert.equal((await call(0,0,'/api/v1/messages','POST',{recipientId:String(b),body:'Synthetic integration check'})).status,201);
 assert.equal((await call(1,1,'/api/v1/me/messages')).data.length,1);checks.push('recipient-only acceptance and persisted private message');
 assert.equal((await call(0,0,'/api/v1/trainer-requests','POST',{trainerId:'SEED-TRAINER-1'})).status,201);
 assert.equal((await call(1,0,'/api/v1/me/trainer-requests')).data.length,1);checks.push('trainer request stored and visible across servers');
 assert.ok((await call(1,winner,'/api/v1/exercises')).data.length>=10);checks.push('paid synthetic member reads Oracle resource catalog');
 const registration={eventId:tag,displayName:'Synthetic Guest',email:`${tag.toLowerCase()}@example.invalid`,consent:true,requestId:tag+'-registration'};
 assert.equal((await call(0,null,'/api/v1/public/registrations','POST',registration)).status,201);
 assert.equal((await call(1,null,'/api/v1/public/registrations','POST',registration)).status,200);
 assert.equal((await call(1,null,'/api/v1/public/registrations','POST',{...registration,email:'another@example.invalid',requestId:tag+'-different-registration'})).status,409);checks.push('public Oracle event capacity and idempotent registration');
 assert.equal((await call(1,3,'/api/v1/admin/reports')).status,200);checks.push('admin report reads persisted relational state');
 const fresh=await pool.getConnection();try {assert.equal((await fresh.execute('SELECT COUNT(*) FROM cfj_payments WHERE request_id IN (SELECT request_id FROM cfj_payments WHERE original_request=:r)',{r:payment.requestId})).rows[0][0],1);}finally{await fresh.close();}
 checks.push('fresh database connection confirms one payment record');
} finally {
 await Promise.all(servers.map(s=>new Promise(resolve=>s.close(resolve))));
 await c.rollback();
 if(fixturesCreated) {
  for(const table of ['cfj_attendance','cfj_payments'])await c.execute(`DELETE FROM ${table} WHERE booking_id IN (SELECT booking_id FROM cfj_bookings WHERE member_id IN (:a,:b))`,{a,b});
  await c.execute('DELETE FROM cfj_bookings WHERE member_id IN (:a,:b)',{a,b});
  for(const table of ['cfj_trainer_requests','cfj_memberships'])await c.execute(`DELETE FROM ${table} WHERE member_id IN (:a,:b)`,{a,b});
  await c.execute('DELETE FROM cfj_messages WHERE sender_id IN (:a,:b) OR recipient_id IN (:a,:b)',{a,b});
  await c.execute('DELETE FROM cfj_friend_connections WHERE from_member_id IN (:a,:b) OR to_member_id IN (:a,:b)',{a,b});
  await c.execute('DELETE FROM cfj_event_registrations WHERE event_id=:tag',{tag});
  await c.execute('DELETE FROM cfj_events WHERE event_id=:tag',{tag});
  for(let i=0;i<5;i++)await c.execute('DELETE FROM cfj_class_sessions WHERE session_id=:id',{id:tag+'-'+i});
  await c.execute('DELETE FROM cfj_members WHERE member_id IN (:a,:b)',{a,b});await c.commit();
 }
 await c.close();await pool.close(10);
}
console.log(JSON.stringify({status:'PASS',verifiedAt:new Date().toISOString(),environment:'local Oracle; two independent HTTP servers',checks,fixtureCleanup:'completed',limitations:['Development identities only; not Firebase SSO.','No hosted database or phone acceptance claimed.']},null,2));
