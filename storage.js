import {fresh,validateBackup,snapshot} from './model.js';
const KEY='locusData';
export async function read(){const data=await chrome.storage.local.get(KEY);const s=data[KEY]||fresh();s.settings={...fresh().settings,...s.settings};return s;}
export async function transact(fn,{backup=false}={}){
  return navigator.locks.request('locus-write',async()=>{
    const s=await read();const next=structuredClone(s);await fn(next);
    next.revision=(s.revision||0)+1;
    const values={[KEY]:next};if(backup)values.locusRecovery=snapshot(s);
    await chrome.storage.local.set(values);return next;
  });
}
export async function restoreRecovery(){return navigator.locks.request('locus-write',async()=>{const data=await chrome.storage.local.get(['locusData','locusRecovery']);if(!data.locusRecovery)throw Error('No recovery snapshot is available.');const s=validateBackup(data.locusRecovery);s.timer=null;s.revision=(data.locusData?.revision||0)+1;await chrome.storage.local.set({locusData:s,locusRecovery:snapshot(data.locusData||fresh())});return s;});}
export const subscribe=fn=>chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&changes[KEY])fn(changes[KEY].newValue);});
