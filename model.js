export const VERSION = 1;
export const COLORS = ['#337363','#b86a42','#6978aa','#a2638d','#9a812e','#4a8798'];
export const uid = () => crypto.randomUUID();
export const fresh = () => ({schemaVersion:VERSION, app:'Locus', revision:0, projects:[], timer:null, settings:{sort:'manual',theme:'light',design:'modern',backupFrequency:'daily',onboardingDone:false}});
export const today = () => localDay(Date.now());
export function localDay(ms) { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
export function entity(name, more={}) {return {id:uid(),name,description:'',start:'',end:'',progress:null,notes:[],sessions:[],history:[],createdAt:Date.now(),...more};}
export function project(name,more={}) {return entity(name,{color:COLORS[0],tasks:[],...more});}
export function task(name,more={}) {return entity(name,{completed:false,previousProgress:null,...more});}
export function locate(s,pid,tid) {const p=s.projects.find(p=>p.id===pid); if(!p) throw Error('This project no longer exists.'); const e=tid?p.tasks.find(t=>t.id===tid):p; if(!e) throw Error('This task no longer exists.'); return e;}
export function setProgress(e,value,now=Date.now()) {if(e.progress!==value) {e.progress=value; e.history.push({id:uid(),at:now,progress:value});} if('completed' in e)e.completed=value===100;}
export function toggleTask(t,checked) {if(checked){t.previousProgress=t.progress;setProgress(t,100);}else {setProgress(t,t.previousProgress===100?0:t.previousProgress??null);t.completed=false;}}
export function stopTimer(s,now=Date.now()) {if(!s.timer)return;const t=s.timer;const e=locate(s,t.projectId,t.taskId);if(now>t.startedAt)e.sessions.push({id:uid(),start:t.startedAt,end:now,kind:'timer',note:''});s.timer=null;}
export function startTimer(s,pid,tid=null,now=Date.now()) {locate(s,pid,tid);stopTimer(s,now);s.timer={projectId:pid,taskId:tid,startedAt:now};}
export function move(items,id,target,after=false) {if(id===target)return;const from=items.findIndex(x=>x.id===id); if(from<0)return;const item=items.splice(from,1)[0];const to=items.findIndex(x=>x.id===target);items.splice(to<0?items.length:to+(after?1:0),0,item);}
export function sorted(projects,sort) {const list=[...projects];if(sort==='manual')return list;const [key,dir]=sort.split(':');return list.sort((a,b)=>{if(key==='name')return a.name.localeCompare(b.name,undefined,{numeric:true,sensitivity:'base'})*(dir==='desc'?-1:1);if(!a[key]&&!b[key])return 0;if(!a[key])return 1;if(!b[key])return -1;return a[key].localeCompare(b[key])*(dir==='desc'?-1:1);});}
export function sessionsFor(p,s,now=Date.now()) {let all=[...p.sessions,...p.tasks.flatMap(t=>t.sessions)];if(s.timer?.projectId===p.id)all.push({id:'running',start:s.timer.startedAt,end:now,kind:'timer',note:''});return all;}
export function duration(sessions,from=-Infinity,to=Infinity) {return sessions.reduce((sum,x)=>sum+Math.max(0,Math.min(x.end,to)-Math.max(x.start,from)),0);}
export function entityTime(e,s,pid,tid=null,now=Date.now()) {const sessions=[...e.sessions];if(s.timer?.projectId===pid&&s.timer?.taskId===tid)sessions.push({start:s.timer.startedAt,end:now});return duration(sessions);}
export function timeText(ms,seconds=false){const sec=Math.max(0,Math.floor(ms/1000));if(seconds)return `${String(Math.floor(sec/3600)).padStart(2,'0')}:${String(Math.floor(sec/60)%60).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;const m=Math.floor(sec/60);return m>=60?`${Math.floor(m/60)}h ${m%60}m`:`${m}m`;}
export function snapshot(s,now=Date.now()){const copy=structuredClone(s);stopTimer(copy,now);copy.exportedAt=new Date(now).toISOString();return copy;}

// Reconstruct only recognized fields. Reject malformed backups before touching storage.
export function validateBackup(raw,now=Date.now()){
  const fail=m=>{throw Error('Invalid Locus backup: '+m);};
  const obj=(x,label)=>{if(!x||typeof x!=='object'||Array.isArray(x))fail(label);return x;};
  obj(raw,'expected an object');if(raw.app!=='Locus'||raw.schemaVersion!==VERSION)fail('unsupported app or schema version');
  const ids=new Set();const id=x=>{if(typeof x!=='string'||!x||ids.has(x))fail('missing or duplicate ID');ids.add(x);return x;};
  const str=(x,label)=>{if(typeof x!=='string')fail(label+' must be text');return x;};
  const arr=(x,label)=>{if(!Array.isArray(x))fail(label+' must be a list');return x;};
  const stamp=x=>{if(!Number.isSafeInteger(x)||x<0||x>8640000000000000)fail('invalid timestamp');return x;};
  const progress=x=>{if(x!==null&&(!Number.isInteger(x)||x<0||x>100))fail('progress must be unset or 0–100');return x;};
  const date=x=>{if(x==='')return x;if(typeof x!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(x)||!Number.isFinite(Date.parse(x))||new Date(x).toISOString().slice(0,10)!==x)fail('invalid date');return x;};
  function clean(x,isTask){obj(x,'invalid item');const e={id:id(x.id),name:str(x.name,'name'),description:str(x.description,'description'),start:date(x.start),end:date(x.end),progress:progress(x.progress),createdAt:stamp(x.createdAt)};
    if(!e.name.trim())fail('empty name');if(e.start&&e.end&&e.start>e.end)fail('end date precedes start');
    e.notes=arr(x.notes,'notes').map(n=>{obj(n,'invalid note');return {id:id(n.id),text:str(n.text,'note'),at:stamp(n.at)};});
    e.history=arr(x.history,'history').map(h=>{obj(h,'invalid history');return {id:id(h.id),at:stamp(h.at),progress:progress(h.progress)};});
    e.sessions=arr(x.sessions,'sessions').map(t=>{obj(t,'invalid time entry');const r={id:id(t.id),start:stamp(t.start),end:stamp(t.end),kind:t.kind,note:str(t.note,'time note')};if(r.end<r.start||!['timer','manual'].includes(r.kind))fail('invalid time entry');return r;});
    if(isTask){if(typeof x.completed!=='boolean'||x.completed!==(e.progress===100))fail('inconsistent task completion');e.completed=x.completed;e.previousProgress=progress(x.previousProgress);}
    else {if(!COLORS.includes(x.color))fail('invalid project color');e.color=x.color;e.tasks=arr(x.tasks,'tasks').map(t=>clean(t,true));}
    return e;
  }
  const s=fresh();s.projects=arr(raw.projects,'projects').map(p=>clean(p,false));
  if(raw.timer!==null){obj(raw.timer,'invalid timer');const p=s.projects.find(p=>p.id===raw.timer.projectId);if(!p||!(raw.timer.taskId===null||p.tasks.some(t=>t.id===raw.timer.taskId)))fail('orphaned timer');s.timer={projectId:p.id,taskId:raw.timer.taskId,startedAt:stamp(raw.timer.startedAt)};if(s.timer.startedAt>now)fail('timer starts in the future');}
  if(raw.settings){if(['manual','name:asc','name:desc','start:asc','start:desc','end:asc','end:desc'].includes(raw.settings.sort))s.settings.sort=raw.settings.sort;if(['light','dark'].includes(raw.settings.theme))s.settings.theme=raw.settings.theme;}
  if(raw.settings){if(['modern','classic','minimalist'].includes(raw.settings.design))s.settings.design=raw.settings.design;if(['off','hourly','daily','weekly'].includes(raw.settings.backupFrequency))s.settings.backupFrequency=raw.settings.backupFrequency;if(typeof raw.settings.onboardingDone==='boolean')s.settings.onboardingDone=raw.settings.onboardingDone;}
  return s;
}
