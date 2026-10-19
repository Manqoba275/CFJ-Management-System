// An operator explicitly links a verified test account to an existing synthetic member.
import oracledb from 'oracledb';
const [memberId,uid]=process.argv.slice(2);
if(!/^\d{1,10}$/.test(memberId || '') || !uid || uid.length>128 || /\s/.test(uid))throw Error('Usage: node --env-file=.env.oracle scripts/link-firebase-member.mjs MEMBER_ID FIREBASE_UID');
const c=await oracledb.getConnection({user:process.env.ORACLE_USER,password:process.env.ORACLE_PASSWORD,connectString:process.env.ORACLE_CONNECT_STRING});
try {
 const row=await c.execute('SELECT identity_uid FROM cfj_members WHERE member_id=:id FOR UPDATE',{id:Number(memberId)});
 if(!row.rows.length)throw Error('Member does not exist');
 const previous=row.rows[0][0];
 if(previous!==uid && !/^(synthetic-|seed-)/i.test(previous))throw Error('Refusing to overwrite an already linked account');
 await c.execute('UPDATE cfj_members SET identity_uid=:firebase_uid WHERE member_id=:id',{firebase_uid:uid,id:Number(memberId)});
 await c.commit();console.log('Member identity mapping saved. No membership entitlement was changed.');
} finally {await c.rollback();await c.close();}
