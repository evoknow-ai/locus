import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const code=fs.readFileSync(new URL('../background.js',import.meta.url),'utf8').split('\n').slice(2).join('\n');
async function run(tabs,clicks=1){let listener;const calls=[];const chrome={runtime:{getURL:()=> 'chrome-extension://test/index.html'},action:{onClicked:{addListener(fn){listener=fn;}}},tabs:{async query(){return tabs;},async update(...args){calls.push(['update',...args]);},async create(...args){calls.push(['create',...args]);}},windows:{async update(...args){calls.push(['window',...args]);}}};vm.runInNewContext(code,{chrome,console});for(let i=0;i<clicks;i++)listener();await new Promise(resolve=>setImmediate(resolve));return calls;}
test('toolbar click reuses existing Locus tab',async()=>{const calls=await run([{id:42,windowId:3,url:'chrome-extension://test/index.html#reports'}]);assert.equal(calls[0][0],'update');assert.equal(calls[0][1],42);assert.equal(calls[1][0],'window');assert.equal(calls.some(c=>c[0]==='create'),false);});
test('rapid toolbar clicks create a single tab',async()=>{const calls=await run([],3);assert.equal(calls.filter(c=>c[0]==='create').length,1);});
