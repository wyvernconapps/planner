/* Precompute room metadata using the FULL schedule, then emit a slim
   panels-only payload. Reuses the app's own functions so the two can't
   drift apart. */
const fs=require('fs'), path=require('path');
const shell=fs.readFileSync(path.join(__dirname,'shell.html'),'utf8');
const DATA=JSON.parse(fs.readFileSync(path.join(__dirname,'data.json'),'utf8'));
const EV=DATA.events, HOT=3, LOC=4, TRK=5, DESC=7;

/* lift the real implementations out of the app */
const js=shell.match(/<script>([\s\S]*)<\/script>/)[1];
const grab=n=>js.match(new RegExp('function '+n+'\\([\\s\\S]*?\\n\\}'))[0];
globalThis.FLOOR_MAP =eval('('+js.match(/const FLOOR_MAP=(\{[\s\S]*?\n\});/)[1]+')');
globalThis.MAIN_ROOMS=new Set(eval(js.match(/const MAIN_ROOMS=new Set\((\[[\s\S]*?\])\)/)[1]));
globalThis.BIGNAME   =eval(js.match(/const BIGNAME=(\/.*?\/i);/)[1]);
eval([grab('floorOverride'),grab('floorOf'),grab('familyOf'),grab('tidy'),grab('tierFor')]
  .join('\n').replace(/\bfunction /g,'globalThis.__x=function ')
  .replace(/globalThis\.__x=function (\w+)/g,'function $1'));

const BULK=new Set(eval(js.match(/const BULK=new Set\((\[[\s\S]*?\])\)/)[1]));
const bulkIdx=new Set(DATA.tracks.map((t,i)=>BULK.has(t)?i:-1).filter(i=>i>=0));

/* DCTV air times, matched by title in dctv_match.py. Anything DCTV broadcasts
   is worth keeping even when its track is filtered out - "Hades II Guests" is
   a guest panel that happens to be tagged Video Gaming. */
const DCTV=JSON.parse(fs.readFileSync(path.join(__dirname,'dctv.json'),'utf8'));

/* ---- room names, floors (identical logic to buildRooms) ---- */
const meta=new Map(), key=(h,l)=>h+'|'+l, per=new Map();
EV.forEach(e=>{ if(!per.has(e[HOT])) per.set(e[HOT],new Set()); per.get(e[HOT]).add(e[LOC]); });
per.forEach((locSet,h)=>{
  const hc=DATA.hotels[h], raw=[...locSet].map(l=>({l,n:DATA.locs[l]}));
  const byLen=[...raw].sort((a,b)=>a.n.length-b.n.length);
  raw.forEach(r=>{
    let base=r.n;
    for(const c of byLen){
      if(c.n!==r.n && r.n.startsWith(c.n) &&
         (r.n.length===c.n.length || !/[A-Za-z0-9]/.test(r.n[c.n.length]))){ base=c.n; break; }
    }
    const name=tidy(hc,base)||base;
    const ov=floorOverride(hc,name), num=ov?null:floorOf(name);
    meta.set(key(h,r.l),{
      name,
      floor: ov?ov.order:num,
      label: ov?ov.label:(num===null?null:num===0?'Galleria level':'Floor '+num),
      fam:   familyOf(name)
    });
  });
});

/* ---- tiers, from the FULL schedule before anything is dropped ---- */
const MP=DATA.tracks.indexOf('Main Programming'), agg=new Map();
EV.forEach(e=>{
  const m=meta.get(key(e[HOT],e[LOC])); if(!m) return;
  const k=DATA.hotels[e[HOT]]+'|'+m.name;
  if(!agg.has(k)) agg.set(k,{tracks:new Set(),main:false});
  agg.get(k).tracks.add(e[TRK]);
  if(e[TRK]===MP) agg.get(k).main=true;
});
meta.forEach((m,k)=>{
  const hc=DATA.hotels[+k.split('|')[0]], ak=hc+'|'+m.name;
  const a=agg.get(ak)||{tracks:new Set(),main:false};
  m.tracks=a.tracks.size;
  m.tier=tierFor(a.tracks.size,a.main,m.name,MAIN_ROOMS.has(ak));
});

/* ---- slim payload: panels only, trimmed descriptions ---- */
const CAP=600;
const keep=EV.filter(e=>!bulkIdx.has(e[TRK]) || DCTV[e[8]])
  .map(e=>{ const d=e[DESC]||'';
    return [e[0],e[1],e[2],e[3],e[4],e[5],e[6],
            d.length>CAP?d.slice(0,CAP-3).trimEnd()+'...':d, e[8]]; });

/* only ship rooms and tracks the slim set actually uses */
const usedLoc=new Set(keep.map(e=>e[LOC])), usedTrk=new Set(keep.map(e=>e[TRK]));
const roomMeta={};
meta.forEach((m,k)=>{ if(usedLoc.has(+k.split('|')[1])) roomMeta[k]=[m.name,m.floor,m.label,m.fam,m.tier,m.tracks]; });

/* ---- repeats: the same panel running again at another time ----
   Excludes same-time-same-room pairs, which are duplicate rows in the
   source rather than a second session. */
const norm=t=>t.toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const byTitle=new Map();
keep.forEach(e=>{ const k=norm(e[0]);
  if(!byTitle.has(k)) byTitle.set(k,[]); byTitle.get(k).push(e); });
const repeats={};
byTitle.forEach(list=>{
  if(list.length<2) return;
  list.forEach(e=>{
    /* a session at the SAME start time is not a second chance, whatever
       room it is in - only a different time counts as a repeat */
    const others=list.filter(o=>o[8]!==e[8] && o[1]!==e[1])
      .map(o=>o[1]).sort((a,b)=>a-b);
    if(others.length) repeats[e[8]]=others;
  });
});

/* ---- what kind of panel is this? ----
   From the 2026 Program Book's own three lists, not inferred: Spotlight
   Guests are the booked headliners, Featured Guests are authors and artists,
   Attending Professionals are working creators. 713 of 825 presenters in the
   schedule match by name; the rest are bands, theatre companies, and guests
   confirmed after the book went to print. */
const ROLES=JSON.parse(fs.readFileSync(path.join(__dirname,'roles.json'),'utf8'));
const nkey=n=>n.toLowerCase().replace(/[^a-z]/g,'');
const BILLING={spotlight:'Spotlight Guest',featured:'Featured Guest',
  professionals:'Attending Professional'};

const CRED=/\b(Dr\.|PhD|Ph\.D|Prof\.|Professor|M\.?D\.?|NASA|JPL)\b/i;
const EXPERT_TRACKS=new Set(['Science','Skeptics','Space','Robotics and Makers',
  'Electronic Frontiers Forum']);
const PARTY_TRACKS=new Set(['Filk Music','Live Performances',
  'Live Performances - Hyatt Concourse']);
const PARTY_TITLE=/\b(DJ|dance|ball|concert|karaoke|burlesque|masquerade)\b/i;
const ABOUT=/\b(panel|Q&A|discussion|history of|intro to)\b/i;
/* 39 of 43 say so in the title; the rest only in the description */
const PAID=/\*{0,2}\s*EXTRA FEE|\badditional fee\b|\bseparate ticket\b/i;

/* who is on each panel, with what they actually do. Roles come from each
   person's own bio in the Program Book, so the badge says ACTOR or AUTHOR
   rather than the meaningless "guest". */
const people={};

const kinds={};
keep.forEach(e=>{
  const names=(e[6]||'').split(',').map(x=>x.trim()).filter(Boolean);
  /* Attending Professionals cover most regular panellists, so they carry no
     badge - but they are still named in the detail. */
  const billed=names.map(n=>ROLES[nkey(n)]).filter(Boolean);
  const notable=billed.filter(p=>p.t!=='professionals');
  /* a Guest of Honor is billed by their title, which outranks the tier */
  if(billed.length) people[e[8]]=billed.map(p=>[p.n,p.r,p.h||BILLING[p.t]]);

  const tags=[];
  const seen=new Set();
  notable.forEach(p=>{ if(p.r && !seen.has(p.r)){ seen.add(p.r); tags.push(p.r); } });
  if(CRED.test(e[6]) || EXPERT_TRACKS.has(DATA.tracks[e[5]])) tags.push('expert');
  if(PAID.test(e[0]+' '+e[7])) tags.push('paid');
  if(PARTY_TRACKS.has(DATA.tracks[e[5]]) ||
     (PARTY_TITLE.test(e[0]) && !ABOUT.test(e[0]))) tags.push('party');
  const uniq=[...new Set(tags)].slice(0,4);
  if(uniq.length) kinds[e[8]]=uniq;
});

/* only ship air data for panels that survived */
const keptIds=new Set(keep.map(e=>e[8]));
const dctv={}; for(const k in DCTV) if(keptIds.has(k)) dctv[k]=DCTV[k];

const out={epoch:DATA.epoch,hotels:DATA.hotels,locs:DATA.locs,tracks:DATA.tracks,
  events:keep,roomMeta,dctv,repeats,kinds,people,
  built:new Date().toISOString().slice(0,16).replace('T',' ')+' UTC'};
const s=JSON.stringify(out,{},0).length?JSON.stringify(out):null;
fs.writeFileSync(path.join(__dirname,'data-slim.json'),JSON.stringify(out));

const tiers={1:0,2:0,3:0};
Object.values(roomMeta).forEach(r=>tiers[r[4]]++);
console.log('events   :',EV.length,'->',keep.length);
console.log('rooms    :',Object.keys(roomMeta).length,'| tiers',JSON.stringify(tiers));
console.log('tracks   :',usedTrk.size,'of',DATA.tracks.length,'still in use');
console.log('dctv     :',Object.keys(dctv).length,'panels |',
  Object.values(dctv).filter(v=>v.live).length,'live,',
  Object.values(dctv).filter(v=>v.airs.length).length,'with replays');
console.log('rescued  :',keep.filter(e=>bulkIdx.has(e[TRK])).length,
  'panels kept only because DCTV airs them');
console.log('repeats  :',Object.keys(repeats).length,'events run again at another time');
const tally={};
Object.values(kinds).forEach(t=>t.forEach(x=>tally[x]=(tally[x]||0)+1));
console.log('people   :',Object.keys(people).length,'panels have a listed guest');
console.log('tags     :',JSON.stringify(tally));
console.log('payload  :',Math.round(Buffer.byteLength(JSON.stringify(out))/1024),'KB');
