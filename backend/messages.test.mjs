// Private messages require explicit acceptance and stay visible only to the two participants.
import test from 'node:test';
import assert from 'node:assert/strict';
import {communityRead,communityWrite} from './community.mjs';
test('messages require an accepted connection and do not leak to another member',()=>{
 const state={friendConnections:[{id:'pair',fromId:'1',toId:'2',status:'pending'}],messages:[]};
 const sender={id:'1',role:'member'},recipient={id:'2',role:'member'},stranger={id:'3',role:'member'};
 assert.equal(communityWrite('/api/v1/messages',{recipientId:'2',body:'Hello'},state,sender,[]).status,403);
 assert.equal(communityWrite('/api/v1/friend-connections/pair/accept',{},state,sender,[]).status,404);
 assert.equal(communityWrite('/api/v1/friend-connections/pair/accept',{},state,recipient,[]).status,200);
 assert.equal(communityWrite('/api/v1/messages',{recipientId:'2',body:'  '},state,sender,[]).status,400);
 assert.equal(communityWrite('/api/v1/messages',{recipientId:'2',body:'Hello'},state,sender,[]).status,201);
 assert.equal(communityRead('/api/v1/me/messages',state,recipient,[]).data.length,1);
 assert.equal(communityRead('/api/v1/me/messages',state,stranger,[]).data.length,0);
 assert.equal(communityRead('/api/v1/me/messages',state,{id:'staff',role:'staff'},[]).status,403);
});
