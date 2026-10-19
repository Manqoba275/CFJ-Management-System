// The HTTP class response must be consumable by the shared website projection.
import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {once} from 'node:events';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createOperationsHandler} from './operations.mjs';
import {fitnessClassFromResponse} from '../website/modules/fitness-class.mjs';
test('class endpoint satisfies the shared trainer and availability contract',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'cfj-contract-'));
 const token='contract-test-token'.padEnd(40,'-');
 const handler=await createOperationsHandler({file:join(dir,'state.json'),identities:[{id:'m1',role:'member',token}]});
 const server=http.createServer(handler);server.listen(0,'127.0.0.1');await once(server,'listening');
 try {const result=await fetch(`http://127.0.0.1:${server.address().port}/api/v1/classes`,{headers:{Authorization:`Bearer ${token}`}});assert.equal(result.status,200);const values=await result.json();assert.equal(values.length,1);const item=fitnessClassFromResponse(values[0]);assert.equal(item.id,'C-DEMO');assert.equal(item.trainer,'Trainer to be assigned');assert.equal(item.spaces,1);}
 finally{await new Promise(r=>server.close(r));await rm(dir,{recursive:true,force:true});}
});
