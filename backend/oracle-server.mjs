// Starts the local Oracle profile service. Connection details come from the environment, not the clients.
import oracledb from 'oracledb';
import { createProfileServer } from './profile-server.mjs';
import { oracleProfileStore } from './oracle-profile-store.mjs';
import { oracleOperationsStore } from './oracle-operations-store.mjs';
import { createOperationsHandler } from './operations.mjs';

const pool = await oracledb.createPool({
  user: process.env.ORACLE_USER, password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECT_STRING || '127.0.0.1:1521/FREEPDB1',
  poolMin: 0, poolMax: 3, poolIncrement: 1
});
try {
  const identities = [{id:'9001',role:'member',token:process.env.CFJ_DEV_TOKEN,discoverable:true,displayName:'Synthetic Member 1'}];
  for(const [key,id,role] of [['CFJ_DEV_PEER_TOKEN','9002','member'],['CFJ_DEV_STAFF_TOKEN','staff','staff'],['CFJ_DEV_ADMIN_TOKEN','admin','admin']]) {
    if(process.env[key])identities.push({id,role,token:process.env[key],discoverable:role==='member'});
  }
  const operations=await createOperationsHandler({identities,store:oracleOperationsStore(pool)});
  const server = await createProfileServer({ token: process.env.CFJ_DEV_TOKEN, store: oracleProfileStore(pool,9001), operations });
  server.listen(8788, '127.0.0.1', () => console.log('Oracle profile API listening on http://127.0.0.1:8788 (development identity)'));
  const stop = () => server.close(async () => { await pool.close(10); process.exit(0); });
  process.on('SIGINT', stop); process.on('SIGTERM', stop);
} catch (error) { await pool.close(0); throw error; }
