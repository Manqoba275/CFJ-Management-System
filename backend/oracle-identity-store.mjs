// Connects verified Firebase UIDs to existing Oracle members using a bound lookup.
import oracledb from 'oracledb';
export function oracleIdentityStore(pool) {
 return async uid => {
  const c=await pool.getConnection(); c.callTimeout=8000;
  try {
   const result=await c.execute('SELECT m.member_id, p.display_name FROM cfj_members m JOIN cfj_profiles p ON p.member_id=m.member_id WHERE m.identity_uid=:firebase_uid',{firebase_uid:uid},{outFormat:oracledb.OUT_FORMAT_OBJECT});
   return result.rows.length ? {id:result.rows[0].MEMBER_ID,displayName:result.rows[0].DISPLAY_NAME} : null;
  } finally {await c.close();}
 };
}
