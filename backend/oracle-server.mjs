import oracledb from 'oracledb';
import { createProfileServer } from './profile-server.mjs';
import { oracleProfileStore } from './oracle-profile-store.mjs';

const pool = await oracledb.createPool({
  user: process.env.ORACLE_USER, password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECT_STRING || '127.0.0.1:1521/FREEPDB1',
  poolMin: 0, poolMax: 3, poolIncrement: 1
});
try {
  const server = await createProfileServer({ token: process.env.CFJ_DEV_TOKEN, store: oracleProfileStore(pool) });
  server.listen(8788, '127.0.0.1', () => console.log('Oracle profile API listening on http://127.0.0.1:8788 (development identity)'));
  const stop = () => server.close(async () => { await pool.close(10); process.exit(0); });
  process.on('SIGINT', stop); process.on('SIGTERM', stop);
} catch (error) { await pool.close(0); throw error; }
