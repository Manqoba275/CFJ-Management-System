// Maps the existing API contract to relational rows. All write decisions run inside an Oracle transaction.
import { createHash } from 'node:crypto';
import oracledb from 'oracledb';
const sid = value => String(value);
const date = value => value instanceof Date ? value.toISOString() : value;
async function rows(c, sql) {
  const result=(await c.execute(sql, [], {outFormat:oracledb.OUT_FORMAT_OBJECT, maxRows:10001})).rows;
  // Refuse an oversized snapshot rather than silently ignoring records in capacity checks.
  if(result.length>10000)throw new Error('Prototype snapshot limit exceeded; use paginated SQL adapters');
  return result;
}
async function load(c) {
  const state={requests:{}};
  state.classes=(await rows(c,"SELECT s.session_id,s.title,s.capacity,t.display_name AS trainer,TO_CHAR(s.starts_at AT TIME ZONE 'Africa/Johannesburg','YYYY-MM-DD') AS day FROM cfj_class_sessions s JOIN cfj_trainers t ON t.trainer_id=s.trainer_id")).map(r=>({id:r.SESSION_ID,name:r.TITLE,trainer:r.TRAINER,capacity:r.CAPACITY,date:r.DAY}));
  state.memberships=(await rows(c,"SELECT membership_id,member_id,plan_code,status,TO_CHAR(starts_on,'YYYY-MM-DD') AS starts_on,TO_CHAR(expires_on,'YYYY-MM-DD') AS expires_on FROM cfj_memberships")).map(r=>({id:r.MEMBERSHIP_ID,memberId:sid(r.MEMBER_ID),plan:r.PLAN_CODE,status:r.STATUS,startsOn:r.STARTS_ON,expiresOn:r.EXPIRES_ON,simulated:true}));
  state.bookings=(await rows(c,'SELECT * FROM cfj_bookings')).map(r=>({id:r.BOOKING_ID,memberId:sid(r.MEMBER_ID),classId:r.SESSION_ID,membershipId:r.MEMBERSHIP_ID,status:r.STATUS,date:state.classes.find(s=>s.id===r.SESSION_ID).date}));
  for(const [key,table,id,stamp,path] of [['attendance','cfj_attendance','ATTENDANCE_ID','CHECKED_IN_AT','attendance'],['payments','cfj_payments','PAYMENT_ID','PAID_AT','payments']]) {
    state[key]=(await rows(c,`SELECT * FROM ${table}`)).map(r=>{
      const record={id:r[id],bookingId:r.BOOKING_ID,memberId:state.bookings.find(b=>b.id===r.BOOKING_ID).memberId,recordedBy:r.RECORDED_BY || 'synthetic',recordedAt:date(r[stamp])};
      if(key==='payments')Object.assign(record,{amountCents:r.AMOUNT_CENTS,currency:r.CURRENCY,simulated:true});
      if(r.RECORDED_BY && r.ORIGINAL_REQUEST)state.requests[`${r.RECORDED_BY}:/api/v1/${path}:${r.ORIGINAL_REQUEST}`]={fingerprint:JSON.stringify([record.bookingId,record.amountCents??null]),record};
      return record;
    });
  }
  state.trainers=(await rows(c,'SELECT * FROM cfj_trainers')).map(r=>({id:r.TRAINER_ID,displayName:r.DISPLAY_NAME,specialty:r.SPECIALTY,language:r.LANGUAGE}));
  state.resources=(await rows(c,'SELECT * FROM cfj_resources')).map(r=>({id:r.RESOURCE_ID,title:r.TITLE,goal:r.GOAL,instructions:r.INSTRUCTIONS}));
  state.trainerRequests=(await rows(c,'SELECT * FROM cfj_trainer_requests')).map(r=>({id:r.REQUEST_ID,memberId:sid(r.MEMBER_ID),trainerId:r.TRAINER_ID,status:r.STATUS}));
  state.friendConnections=(await rows(c,'SELECT * FROM cfj_friend_connections')).map(r=>({id:r.CONNECTION_ID,fromId:sid(r.FROM_MEMBER_ID),toId:sid(r.TO_MEMBER_ID),status:r.STATUS}));
  state.events=(await rows(c,'SELECT * FROM cfj_events')).map(r=>({id:r.EVENT_ID,name:r.TITLE,capacity:r.CAPACITY}));
  state.registrations=(await rows(c,'SELECT * FROM cfj_event_registrations')).map(r=>{
    const details={eventId:r.EVENT_ID,displayName:r.DISPLAY_NAME,email:r.EMAIL,consent:r.CONSENT===1};
    return {...details,id:r.REGISTRATION_ID,requestId:r.REQUEST_ID,registeredAt:date(r.REGISTERED_AT),fingerprint:JSON.stringify(details)};
  });
  state.messages=(await rows(c,'SELECT * FROM cfj_messages')).map(r=>({id:r.MESSAGE_ID,senderId:sid(r.SENDER_ID),recipientId:sid(r.RECIPIENT_ID),body:r.BODY,sentAt:date(r.SENT_AT)}));
  return state;
}
async function persist(c,before,next) {
  for(const b of next.bookings) {
    const old=before.bookings.find(x=>x.id===b.id);
    if(!old) await c.execute('INSERT INTO cfj_bookings(booking_id,member_id,session_id,membership_id,status) VALUES(:id,:memberId,:classId,:membershipId,:status)',{id:b.id,memberId:Number(b.memberId),classId:b.classId,membershipId:b.membershipId,status:b.status});
    else if(old.status!==b.status || old.membershipId!==b.membershipId) await c.execute('UPDATE cfj_bookings SET status=:status,membership_id=:membershipId WHERE booking_id=:id',{status:b.status,membershipId:b.membershipId,id:b.id});
  }
  for(const key of ['attendance','payments'])for(const r of next[key].filter(r=>!before[key].some(b=>b.id===r.id))) {
    const request=Object.keys(next.requests).find(k=>next.requests[k].record.id===r.id);
    if(!request)throw new Error('Missing retry identity');
    const prefix=`${r.recordedBy}:/api/v1/${key}:`;
    const binds={id:r.id,booking:r.bookingId,request:createHash('sha256').update(request).digest('hex'),actor:r.recordedBy,original:request.slice(prefix.length)};
    if(key==='payments') await c.execute('INSERT INTO cfj_payments(payment_id,booking_id,request_id,recorded_by,original_request,amount_cents) VALUES(:id,:booking,:request,:actor,:original,:amount)',{...binds,amount:r.amountCents});
    else await c.execute('INSERT INTO cfj_attendance(attendance_id,booking_id,request_id,recorded_by,original_request) VALUES(:id,:booking,:request,:actor,:original)',binds);
  }
  for(const r of next.trainerRequests.filter(r=>!before.trainerRequests.some(b=>b.id===r.id)))await c.execute('INSERT INTO cfj_trainer_requests(request_id,member_id,trainer_id,status) VALUES(:id,:memberId,:trainerId,:status)',{id:r.id,memberId:Number(r.memberId),trainerId:r.trainerId,status:r.status});
  for(const r of next.friendConnections) {
    const old=before.friendConnections.find(b=>b.id===r.id);
    if(!old) await c.execute('INSERT INTO cfj_friend_connections(connection_id,from_member_id,to_member_id,status) VALUES(:id,:fromId,:toId,:status)',{id:r.id,fromId:Number(r.fromId),toId:Number(r.toId),status:r.status});
    else if(old.status!==r.status)await c.execute('UPDATE cfj_friend_connections SET status=:status WHERE connection_id=:id',{status:r.status,id:r.id});
  }
  for(const r of next.registrations.filter(r=>!before.registrations.some(b=>b.id===r.id)))await c.execute('INSERT INTO cfj_event_registrations(registration_id,event_id,display_name,email,consent,request_id) VALUES(:id,:eventId,:name,:email,1,:request)',{id:r.id,eventId:r.eventId,name:r.displayName,email:r.email,request:r.requestId});
  for(const r of next.messages.filter(r=>!before.messages.some(b=>b.id===r.id)))await c.execute('INSERT INTO cfj_messages(message_id,sender_id,recipient_id,body) VALUES(:id,:sender,:recipient,:body)',{id:r.id,sender:Number(r.senderId),recipient:Number(r.recipientId),body:r.body});
}
export function oracleOperationsStore(pool) {
  return {
    async load() {
      const c=await pool.getConnection();
      try { await c.execute('SET TRANSACTION READ ONLY'); return await load(c); }
      finally {await c.rollback();await c.close();}
    },
    async transact(change) {
      const c=await pool.getConnection();
      try {
        // A coarse lock is intentional for this small school prototype. It serializes writers
        // across processes, including weekly limits across different sessions. Scale later with row locks.
        await c.execute('LOCK TABLE cfj_bookings, cfj_memberships, cfj_class_sessions, cfj_attendance, cfj_payments, cfj_trainer_requests, cfj_friend_connections, cfj_events, cfj_event_registrations, cfj_messages IN EXCLUSIVE MODE WAIT 10');
        const current=await load(c);
        const {result,next}=await change(current);
        if(result.status<300){await persist(c,current,next);await c.commit();}
        else await c.rollback();
        return result;
      }catch(error){await c.rollback();throw error;}
      finally{await c.close();}
    }
  };
}
