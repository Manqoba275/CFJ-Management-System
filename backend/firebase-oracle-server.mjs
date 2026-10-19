// Firebase entry point. The development-token listener remains a separate executable.
import http from 'node:http';
import { randomBytes } from 'node:crypto';
import oracledb from 'oracledb';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { firebaseGate } from './firebase-gate.mjs';
import { oracleIdentityStore } from './oracle-identity-store.mjs';
import { oracleProfileStore } from './oracle-profile-store.mjs';
import { oracleOperationsStore } from './oracle-operations-store.mjs';
import { createOperationsHandler } from './operations.mjs';
import { createProfileServer } from './profile-server.mjs';
if(process.env.FIREBASE_AUTH_EMULATOR_HOST) throw Error('The Oracle identity server does not accept emulator tokens');
const projectId=process.env.FIREBASE_PROJECT_ID;
if(!projectId)throw Error('Set FIREBASE_PROJECT_ID');
const auth=getAuth(initializeApp({projectId}));
const pool=await oracledb.createPool({user:process.env.ORACLE_USER,password:process.env.ORACLE_PASSWORD,connectString:process.env.ORACLE_CONNECT_STRING,poolMin:0,poolMax:3,queueTimeout:5000,queueMax:20,poolPingTimeout:3000});
const handler=firebaseGate({
 verifyToken: token=>auth.verifyIdToken(token),
 findMember:oracleIdentityStore(pool),
 allowedOrigins:(process.env.CFJ_ALLOWED_ORIGINS || '').split(',').map(x=>x.trim()).filter(Boolean),
 async dispatch(req,res,member) {
  // Reuse the tested handlers behind a fresh, server-only credential. No external token bypasses verification.
  const token=randomBytes(32).toString('hex');
  const operations=await createOperationsHandler({identities:[{...member,token}],store:oracleOperationsStore(pool),lazyLoad:true});
  const inner=await createProfileServer({token,store:oracleProfileStore(pool,Number(member.id)),operations});
  req.headers.authorization=`Bearer ${token}`;
  await inner.listeners('request')[0](req,res);
 }
});
// Readiness exposes no credentials or member data and never mutates the database.
const server=http.createServer(async (req,res)=>{
 if(req.method==='GET' && req.url==='/healthz') {
  let connection;
  try {
   connection=await pool.getConnection();connection.callTimeout=3000;
   await connection.execute('SELECT 1 FROM dual');
   res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end('{"status":"ready"}');
  } catch {res.writeHead(503,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end('{"status":"database_unavailable"}');}
  finally {if(connection)await connection.close();}
  return;
 }
 await handler(req,res);
});
server.requestTimeout=30000;
server.headersTimeout=15000;
server.listen(Number(process.env.PORT || 8789),process.env.CFJ_BIND_HOST || '127.0.0.1',()=>console.log('Firebase-to-Oracle API ready; verified, provisioned members only'));
const stop=()=>server.close(async()=>{await pool.close(10);process.exit(0);});
process.on('SIGINT',stop);process.on('SIGTERM',stop);
