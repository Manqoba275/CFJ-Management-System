// Applies additive schema files. Oracle DDL commits immediately, so progress is inspected before a retry.
import { readFile } from 'node:fs/promises';
import oracledb from 'oracledb';
const connection = await oracledb.getConnection({user:process.env.ORACLE_USER,password:process.env.ORACLE_PASSWORD,connectString:process.env.ORACLE_CONNECT_STRING});
try {
  for (const file of ['database/002_operations.sql','database/003_community.sql']) {
    const sql = (await readFile(new URL('../'+file,import.meta.url),'utf8')).replace(/^\s*--.*$/gm,'');
    for (const statement of sql.split(';').map(s=>s.trim()).filter(Boolean)) {
      const match = /^CREATE (?:UNIQUE )?(TABLE|INDEX) (\w+)/i.exec(statement);
      if (!match) throw new Error('Only additive CREATE TABLE/INDEX statements are supported');
      const name=match[2].toUpperCase();
      const exists=await connection.execute('SELECT object_name FROM user_objects WHERE object_name=:name AND object_type=:kind',{name,kind:match[1].toUpperCase()});
      if (exists.rows.length) { console.log(`EXISTS ${name}: not modified; run schema verification`); continue; }
      await connection.execute(statement); console.log(`CREATED ${name}`);
    }
  }
} finally { await connection.close(); }
