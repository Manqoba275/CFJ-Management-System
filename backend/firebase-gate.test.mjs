// Exercise the authentication boundary without a real account or database.
import test from 'node:test';
import assert from 'node:assert/strict';
import {firebaseGate} from './firebase-gate.mjs';
async function invoke({authorization='Bearer signed-token',claims={uid:'uid-a',email_verified:true},member={id:42},origin,verifyError=false,storeError=false}={}) {
 let lookups=0,actor;
 const res={headers:{},setHeader(k,v){this.headers[k]=v;},writeHead(s){this.status=s;this.headersSent=true;},end(body){this.body=body;}};
 const gate=firebaseGate({verifyToken:async()=>{if(verifyError)throw Error();return claims;},findMember:async uid=>{lookups++;assert.equal(uid,claims.uid);if(storeError)throw Error();return member;},dispatch:async(req,res,a)=>{actor=a;res.writeHead(200);res.end();},allowedOrigins:['https://cfj.example']});
 await gate({method:'GET',headers:{authorization,origin}},res);
 return {...res,lookups,actor};
}
test('missing and rejected tokens never reach Oracle',async()=>{for(const options of [{authorization:''},{verifyError:true}]){const r=await invoke(options);assert.equal(r.status,401);assert.equal(r.lookups,0);}});
test('unverified account never reaches Oracle',async()=>{const r=await invoke({claims:{uid:'a',email_verified:false}});assert.equal(r.status,403);assert.equal(r.lookups,0);});
test('verified unmapped account is refused',async()=>{assert.equal((await invoke({member:null})).status,403);});
test('client admin claims cannot grant staff access',async()=>{const r=await invoke({claims:{uid:'a',email_verified:true,role:'admin'}});assert.equal(r.status,200);assert.deepEqual(r.actor,{id:'42',role:'member',displayName:undefined,discoverable:false});});
test('foreign origin is refused before storage',async()=>{const r=await invoke({origin:'https://evil.example'});assert.equal(r.status,403);assert.equal(r.lookups,0);});
test('database failure returns sanitized 503',async()=>{const r=await invoke({storeError:true});assert.equal(r.status,503);assert.equal(r.body,'{"error":"service_unavailable"}');});
