import {fresh, snapshot, validateBackup} from './model.js';
export const BACKUP_ALARM='locus-automatic-backup';
export const FREQUENCIES={off:0,hourly:60,daily:1440,weekly:10080};
export const META_KEY='locusBackupMeta';
export function backupFilename(state,kind='manual',now=Date.now()) {
  const stamp=new Date(now).toISOString().replace('T','_').replace(/[:.]/g,'-');
  return `Locus_${kind==='auto'?'Auto':'Manual'}_${stamp}_${state.projects.length}-projects_r${state.revision||0}.json`;
}
export function backupPath(state,kind='auto',now=Date.now()) {
  return `Locus/Backups/${new Date(now).toISOString().slice(0,7)}/${backupFilename(state,kind,now)}`;
}
export function frequencyOf(s) {return Object.hasOwn(FREQUENCIES,s?.settings?.backupFrequency)?s.settings.backupFrequency:'daily';}

// The worker owns download metadata. Workspace writes remain in storage.js.
// Persist schedule and download IDs so a suspended/restarted worker can resume.
export function createBackupController(api,clock=Date.now) {
  let queue=Promise.resolve();
  const serial=fn=>{const p=queue.then(fn);queue=p.catch(()=>{});return p;};
  const getMeta=async()=> (await api.storage.local.get(META_KEY))[META_KEY]||{};
  const saveMeta=meta=>api.storage.local.set({[META_KEY]:meta});
  async function settle(meta) {
    if(!meta.pending)return meta;
    const matches=await api.downloads.search({id:meta.pending.id});
    const item=matches[0];
    if(item?.state==='in_progress')return meta;
    if(item?.state==='complete') {
      meta.lastSuccess={at:clock(),filename:meta.pending.filename,downloadId:meta.pending.id};
      meta.error=null;
    } else meta.error=item?.error||'The backup download did not finish. Check Chrome Downloads and try again.';
    meta.pending=null;
    await saveMeta(meta);return meta;
  }
  async function download(meta,kind) {
    meta=await settle(meta);
    if(meta.pending)return {pending:true,filename:meta.pending.filename};
    const now=clock();
    try {
    const raw=(await api.storage.local.get('locusData')).locusData||fresh();
    // Preserve the current revision, while validating every user-data field.
    const clean=validateBackup(raw,now);clean.revision=raw.revision||0;
    const data=snapshot(clean,now),filename=backupPath(data,kind,now);
      const id=await api.downloads.download({url:'data:application/json;charset=utf-8,'+encodeURIComponent(JSON.stringify(data,null,2)),filename,saveAs:false,conflictAction:'uniquify'});
      meta.pending={id,filename,startedAt:now};meta.lastAttempt=now;meta.error=null;
      await saveMeta(meta);
      // A small file may have completed before the onChanged listener ran.
      await settle(meta);
      return {started:true,filename};
    } catch(error) {meta.error=error.message||String(error);meta.lastAttempt=now;meta.pending=null;await saveMeta(meta);throw error;}
  }
  async function reconcile() {
    const raw=(await api.storage.local.get('locusData')).locusData||fresh();
    const frequency=frequencyOf(raw),minutes=FREQUENCIES[frequency],now=clock();
    let meta=await settle(await getMeta());
    if(!minutes){await api.alarms.clear(BACKUP_ALARM);if(meta.frequency!==frequency||meta.nextAt){meta.frequency=frequency;meta.nextAt=null;await saveMeta(meta);}return;}
    if(meta.frequency!==frequency||!meta.nextAt){meta.frequency=frequency;meta.nextAt=now+minutes*60000;await saveMeta(meta);}
    const due=meta.nextAt<=now;
    if(due){meta.nextAt=now+minutes*60000;await saveMeta(meta);}
    // Recreate the alarm on worker startup; do not rely on alarm persistence.
    await api.alarms.create(BACKUP_ALARM,{when:meta.nextAt,periodInMinutes:minutes});
    if(due)await download(meta,'auto');
  }
  return {
    reconcile:()=>serial(reconcile),
    runNow:()=>serial(async()=>download(await getMeta(),'manual')),
    changed:id=>serial(async()=>{const meta=await getMeta();if(meta.pending?.id===id)await settle(meta);})
  };
}
export function installBackups(api=chrome) {
  const controller=createBackupController(api);
  const safe=p=>p.catch(error=>console.error('Locus backup:',error));
  api.alarms.onAlarm.addListener(alarm=>{if(alarm.name===BACKUP_ALARM)safe(controller.reconcile());});
  api.runtime.onStartup.addListener(()=>safe(controller.reconcile()));
  api.runtime.onInstalled.addListener(()=>safe(controller.reconcile()));
  api.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&changes.locusData&&frequencyOf(changes.locusData.oldValue)!==frequencyOf(changes.locusData.newValue))safe(controller.reconcile());});
  api.downloads.onChanged.addListener(delta=>{if(delta.state||delta.error)safe(controller.changed(delta.id));});
  api.runtime.onMessage.addListener((message,sender,reply)=>{
    if(sender.id!==api.runtime.id||message?.type!=='locus:backup-now')return;
    controller.runNow().then(result=>reply({ok:true,...result}),error=>reply({ok:false,error:error.message}));return true;
  });
  safe(controller.reconcile());return controller;
}
