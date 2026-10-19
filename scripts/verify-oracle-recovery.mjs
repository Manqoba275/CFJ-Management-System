// Verifies a logical data backup by restoring it into new scratch tables, never over the source tables.
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {randomBytes,createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import oracledb from 'oracledb';
const c=await oracledb.getConnection({user:process.env.ORACLE_USER,password:process.env.ORACLE_PASSWORD,connectString:process.env.ORACLE_CONNECT_STRING});
const prefix='RC_'+randomBytes(4).toString('hex').toUpperCase(),created=[],backup={format:1,capturedAt:new Date().toISOString(),tables:[]};
const directory=resolve('output/private-database-backups');
const signature=rows=>createHash('sha256').update(JSON.stringify(rows.map(r=>JSON.stringify(r)).sort())).digest('hex');
function expression(column) {
  const n=column.COLUMN_NAME,t=column.DATA_TYPE;
  if(t==='DATE')return `TO_CHAR(${n},'YYYY-MM-DD HH24:MI:SS')`;
  if(t.includes('TIME ZONE'))return `TO_CHAR(${n},'YYYY-MM-DD HH24:MI:SS.FF6 TZH:TZM')`;
  if(t.startsWith('TIMESTAMP'))return `TO_CHAR(${n},'YYYY-MM-DD HH24:MI:SS.FF6')`;
  return n;
}
function bindExpression(column,i) {
  const t=column.DATA_TYPE;
  if(t==='DATE')return `TO_DATE(:v${i},'YYYY-MM-DD HH24:MI:SS')`;
  if(t.includes('TIME ZONE'))return `TO_TIMESTAMP_TZ(:v${i},'YYYY-MM-DD HH24:MI:SS.FF6 TZH:TZM')`;
  if(t.startsWith('TIMESTAMP'))return `TO_TIMESTAMP(:v${i},'YYYY-MM-DD HH24:MI:SS.FF6')`;
  return ':v'+i;
}
let result;
try {
  await c.execute('SET TRANSACTION READ ONLY');
  const tables=(await c.execute("SELECT table_name FROM user_tables WHERE table_name LIKE 'CFJ_%' ORDER BY table_name")).rows.flat();
  for(const table of tables) {
    assert.match(table,/^CFJ_[A-Z_]+$/);
    const columns=(await c.execute('SELECT column_name,data_type FROM user_tab_columns WHERE table_name=:t ORDER BY column_id',{t:table},{outFormat:oracledb.OUT_FORMAT_OBJECT})).rows;
    const count=(await c.execute(`SELECT COUNT(*) FROM ${table}`)).rows[0][0];
    if(count>10000)throw new Error('Backup exceeds this prototype verifier limit');
    const data=(await c.execute(`SELECT ${columns.map(expression).join(',')} FROM ${table}`,[],{maxRows:10001})).rows;
    assert.equal(data.length,count);
    backup.tables.push({name:table,columns,rows:data,sha256:signature(data)});
  }
  await c.rollback();
  await mkdir(directory,{recursive:true});
  const path=resolve(directory,`${prefix}.json`);
  await writeFile(path,JSON.stringify(backup),{mode:0o600});
  // Read from the saved artifact, rather than accidentally restoring the in-memory source data.
  const saved=JSON.parse(await readFile(path,'utf8'));
  const restored=[];
  for(const [i,table] of saved.tables.entries()) {
    const target=`${prefix}_${i}`;
    await c.execute(`CREATE TABLE ${target} AS SELECT * FROM ${table.name} WHERE 1=0`);created.push(target);
    const sql=`INSERT INTO ${target} (${table.columns.map(x=>x.COLUMN_NAME).join(',')}) VALUES (${table.columns.map(bindExpression).join(',')})`;
    for(const row of table.rows)await c.execute(sql,Object.fromEntries(row.map((v,j)=>['v'+j,v])));
    await c.commit();
    const actual=(await c.execute(`SELECT ${table.columns.map(expression).join(',')} FROM ${target}`,[],{maxRows:10001})).rows;
    assert.equal(actual.length,table.rows.length);assert.equal(signature(actual),table.sha256);
    restored.push({table:table.name,rows:actual.length,sha256:table.sha256,status:'MATCH'});
  }
  result={status:'PASS',verifiedAt:new Date().toISOString(),method:'logical backup restored into isolated scratch tables; row hashes compared',tables:restored,backupFile:path,limitations:['Data restoration only: scratch tables do not recreate foreign keys, indexes, grants or service configuration.','Not a hosted backup, RMAN recovery or disaster-recovery certification.','Backup contains synthetic application data and stays outside Git.']};
} finally {
  await c.rollback();
  // Only names created by this run are dropped. Source CFJ tables are never deletion targets.
  for(const target of created.reverse())await c.execute(`DROP TABLE ${target} PURGE`);
  await c.close();
}
result.scratchCleanup='completed';console.log(JSON.stringify(result,null,2));
