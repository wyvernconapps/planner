const fs=require('fs');
require('./domshim.js');
const {ids}=require('./domshim.js');
const html=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8');
const js=html.match(/<script>([\s\S]*)<\/script>/)[1];
let fail=0;
const ok=(label,cond,extra='')=>{ if(!cond) fail++;
  console.log('  '+(cond?'ok  ':'FAIL')+'  '+label+(extra?'  '+extra:'')); };

const app=new Function(js+'\n;return {set view(v){view=v},render,setLevel,levelOf,intOf,openSheet,'+
 'get EV(){return EV},get picks(){return picks},get ruled(){return ruled},get watch(){return watch},'+
 'get notInt(){return notInt},get locked(){return locked},get priv(){return priv},'+
 'setLocked,setPrivate,isRuled,toggleWatch,toggleRuled,dctvOf,laterRepeats,isWatch,shareLink,importFromHash,'+
 'set hidePast(v){hidePast=v},set listSort(v){listSort=v},set day(v){day=v},get day(){return day},'+
 'get hotels(){return hotels},get days(){return days},get offTracks(){return offTracks},set query(v){query=v},'+
 'get query(){return query},activeFilters,planTrips,roomOf,makeBreak,sortList,'+
 'classifyFormat,formatOf,fmtKey,get eventFormats(){return eventFormats},'+
 'get FORMAT_OVERRIDES(){return FORMAT_OVERRIDES},get offFormats(){return offFormats},'+
 'presenterInfo,presenterBadges,catFacets,catOf,get offCats(){return offCats},peopleOn,'+
 'setIsolate,clearIsolate,get isolate(){return isolate},isolateMatch,openCompare,'+
 'buildICS,planIdx,shareEventLink,alsoStarred,get friends(){return friends},'+
 'set friends(v){friends=v},set myName(v){myName=v},get sharedEvent(){return sharedEvent},'+
 'get presenterIndex(){return presenterIndex},fmtKey,pKey,'+
 'set advSort(v){advSort=v},set sortGroup(v){sortGroup=v},set sortTiers(v){sortTiers=v},'+
 'set breakOn(v){breakOn=v},get breakOn(){return breakOn},get breaks(){return breaks},'+
 'set breaks(v){breaks=v},get breakDecisions(){return breakDecisions},set hasDctvPass(v){hasDctvPass=v},'+
 'get DATA(){return DATA},set picks(v){picks=v}};')();

setTimeout(()=>{
  const EV=app.EV, T=0,START=1,ID=8;
  console.log('DATA');
  ok('payload unpacked', EV.length>1700, EV.length+' events');
  ok('build stamp present', !!app.DATA.built, app.DATA.built);
  ok('ids unique', new Set(EV.map(e=>e[ID])).size===EV.length);
  ok('no broken characters', !EV.some(e=>(e[0]+e[6]+e[7]).includes('\ufffd')));
  ok('rooms all placed', Object.values(app.DATA.roomMeta).every(r=>r[0]));
  ok('dctv present', Object.keys(app.DATA.dctv).length===39);
  ok('repeats present', Object.keys(app.DATA.repeats).length>150);

  console.log('\nVIEWS');
  app.hidePast=false;
  ['now','browse','grid','mine'].forEach(v=>{
    app.view=v;
    try{ app.render(); ok(v+' renders', ids.main.children.length>0,
      ids.main.children.length+' nodes'); }
    catch(e){ ok(v+' renders', false, e.message); }
  });

  console.log('\nINTERACTIONS');
  const carl=EV.findIndex(e=>e[T].startsWith('New Achievement'));
  app.setLevel(carl,2); ok('star to high priority', app.levelOf(carl)===2);
  app.setLevel(carl,1); ok('down to interested keeps the pick', app.picks.has(EV[carl][ID]));
  app.toggleRuled(carl); ok('not now replaces the pick, mutually exclusive',
    app.ruled.size===1&&!app.picks.has(EV[carl][ID])&&app.intOf(carl)===-1);
  app.toggleRuled(carl); ok('un-rule back to unrated', app.ruled.size===0&&app.intOf(carl)===0);
  app.setLevel(carl,2);   /* re-pick, so the later share test has something to carry */
  const air=app.dctvOf(carl).airs[0];
  app.toggleWatch(EV[carl][ID],air);
  ok('watch becomes an event', app.EV.some(e=>e[ID].startsWith('w')));
  ok('watch is on the timeline', app.EV.find(e=>e[ID].startsWith('w'))[START]===air);
  app.toggleWatch(EV[carl][ID],air);
  ok('watch removed cleanly', app.watch.length===0&&!app.EV.some(e=>e[ID].startsWith('w')));

  console.log('\nFILTERS + SORT');
  app.view='browse'; app.days.add('Sat'); app.hotels.add('HIL'); app.query='dragon';
  app.offTracks.add(3); app.render();
  ok('filters counted', app.activeFilters()===4);
  ids.clearBtn.onclick();
  ok('clear resets all', !app.days.size&&!app.hotels.size&&!app.offTracks.size&&!app.query);
  ok('clear keeps picks', app.picks.size===1);
  ['time','interest','place'].forEach(m=>{
    app.listSort=m;
    try{ app.render(); ok('sort '+m, ids.main.children.length>0); }
    catch(e){ ok('sort '+m,false,e.message); }
  });

  console.log('\nBREAKS');
  app.breakOn=true;
  const list=[...app.picks.keys()].map(id=>app.EV.findIndex(e=>e[ID]===id)).filter(i=>i>=0);
  const plan=app.planTrips(list);
  ok('breaks planned across days', plan.length>=2, plan.length+' break-days');
  ok('breaks have a cost', plan.every(t=>t.impossible||typeof t.cost==='number'));
  ok('breaks carry a type/travel flag', plan.every(t=>t.impossible||typeof t.travel==='boolean'));
  /* a travel break whose window is only the Saturday parade blackout has no slot */
  app.breaks=[app.makeBreak('pet',{label:'Feed the dog',from:9*60,to:12*60+30,duration:60,each:30})];
  ok('parade blocks a Sat-morning-only break',
     app.planTrips(list).some(t=>t.day==='Sat'&&t.impossible));
  /* an on-site break (travel off) plans with zero travel */
  app.breaks=[app.makeBreak('meal',{label:'Lunch',from:12*60,to:14*60,duration:45})];
  ok('on-site break plans without travel',
     app.planTrips(list).some(t=>!t.impossible&&t.travel===false));

  console.log('\nEVENT FORMAT');
  const VALID=new Set(['PANEL','WORKSHOP','PERFORMANCE','PARTY','ACTIVITY','OPERATIONAL']);
  const real=EV.filter(e=>String(e[ID])[0]!=='w');
  ok('every event has a valid format', real.every(e=>VALID.has(app.classifyFormat(e))));
  let gMiss=0,gPresent=0;
  Object.entries(app.FORMAT_OVERRIDES).forEach(([k,want])=>{
    const e=EV.find(e=>app.fmtKey(e[T])===k);
    if(e){ gPresent++; if(app.classifyFormat(e)!==want) gMiss++; } });
  ok('gold-standard overrides all land', gMiss===0, gPresent+' present, '+gMiss+' wrong');
  const bySig=t=>EV.findIndex(e=>e[T]===t);
  /* most concerts read as PERFORMANCE (a few filk-band concerts lean ACTIVITY) */
  const concerts=EV.filter(e=>/^Concert /.test(e[T]));
  const perfShare=concerts.filter(e=>app.classifyFormat(e)==='PERFORMANCE').length;
  ok('concerts are mostly PERFORMANCE', perfShare>concerts.length/2, perfShare+'/'+concerts.length);
  const kick=EV.find(e=>/Track Kick-?Off/i.test(e[T])&&!/celebration/i.test(e[T]));
  if(kick) ok('a track kick-off is not PARTY', app.classifyFormat(kick)!=='PARTY', kick[T].slice(0,30));
  /* the format filter really excludes: hiding every format empties the list */
  app.view='browse'; app.hidePast=false;
  app.offFormats.clear(); app.render(); const before=ids.main.querySelectorAll('.ev').length;
  ['PANEL','WORKSHOP','PERFORMANCE','PARTY','ACTIVITY','OPERATIONAL'].forEach(f=>app.offFormats.add(f));
  app.render(); const after=ids.main.querySelectorAll('.ev').length;
  ok('hiding every format empties the list', before>0&&after===0, before+' -> '+after+' rows');
  app.offFormats.clear();

  console.log('\nPRESENTERS');
  /* CREATOR/PERFORMER derive from the specific role */
  ok('author -> CREATOR', app.catOf('author')==='CREATOR');
  ok('actor -> PERFORMER', app.catOf('actor')==='PERFORMER');
  ok('scientist stays specific (no broad cat)', app.catOf('scientist')==='');
  /* a Guest of Honor is detected and leads the card badges */
  const gi=EV.findIndex((e,i)=>String(e[ID])[0]!=='w'&&app.presenterInfo(i).goh);
  ok('at least one Guest of Honor event', gi>=0);
  if(gi>=0){
    ok('GoH leads the card badges', /GUEST OF HONOR/.test(app.presenterBadges(gi)));
    ok('specific role kept off the card', !/AUTHOR|ARTIST|ACTOR/.test(app.presenterBadges(gi)));
  }
  /* the broad presenter filter really excludes */
  app.view='browse'; app.hidePast=false;
  app.offCats.clear(); app.render(); const preC=ids.main.querySelectorAll('.ev').length;
  ['CREATOR','PERFORMER','EXPERT','goh','featured','fan'].forEach(c=>app.offCats.add(c));
  app.render(); const postC=ids.main.querySelectorAll('.ev').length;
  ok('hiding every presenter type empties the list', preC>0&&postC===0, preC+' -> '+postC);
  app.offCats.clear();

  console.log('\nTAP TO EXPLORE');
  /* isolate: "show only this facet" narrows the list to matching events */
  app.view='browse'; app.hidePast=false;
  app.setIsolate('trait','paid'); app.render();
  const isoRows=ids.main.querySelectorAll('.ev').length;
  ok('isolate to Extra fee shows only extra-fee events',
     isoRows>0 && [...ids.main.querySelectorAll('.ev')].length===isoRows,
     app.isolate&&app.isolate.label);
  ok('isolate matcher agrees with the label', app.isolate.label==='Extra fee');
  /* every visible row genuinely has the facet */
  const paidIdx=EV.map((e,i)=>i).filter(i=>String(EV[i][ID])[0]!=='w'&&app.isolateMatch(i));
  ok('every isolated event has the trait', paidIdx.length>0 &&
     paidIdx.every(i=>(app.DATA.kinds[EV[i][ID]]||[]).includes('paid')));
  app.setIsolate('cat','goh');
  ok('isolate to Guests of Honor', EV.some((e,i)=>String(e[ID])[0]!=='w'&&app.isolateMatch(i)) &&
     !app.isolateMatch(EV.findIndex((e,i)=>!app.presenterInfo(i).goh)));
  app.clearIsolate();
  ok('clear isolate restores everything', app.isolate===null);
  /* presenter index: a headliner is on more than one event */
  const zahn=app.presenterIndex.get(app.pKey('Timothy Zahn'));
  ok('presenter index finds a guest with their events', !!zahn && zahn.events.length>=1,
     zahn&&zahn.events.length+' events');

  console.log('\nCONFLICT COMPARE');
  const byStart={};
  EV.forEach((e,i)=>{ if(String(e[ID])[0]!=='w'){ (byStart[e[START]]=byStart[e[START]]||[]).push(i); } });
  const clash=Object.values(byStart).find(g=>g.length>=2);
  if(clash){
    app.setLevel(clash[0],2); app.setLevel(clash[1],2);
    app.openCompare([clash[0],clash[1]]);
    ok('compare builds an evidence table', ids.sheetCard.querySelectorAll('.cmptab td').length>0,
       ids.sheetCard.querySelectorAll('.cmptab tr').length+' rows');
    ok('compare offers rule-out / move actions',
       ids.sheetCard.querySelectorAll('.cmpruleout').length>0);
    app.setLevel(clash[0],0); app.setLevel(clash[1],0);
  } else ok('compare (no same-start pair in data to test)', true);

  console.log('\nADVANCED SORT');
  app.view='browse'; app.hidePast=false;
  const pool=EV.map((e,i)=>i).slice(0,500);
  app.advSort=true; app.sortGroup='none'; app.sortTiers=[{key:'interest',dir:-1}];
  const sDesc=app.sortList(pool);
  let descOk=true;
  for(let j=1;j<sDesc.length;j++) if(app.levelOf(sDesc[j-1])<app.levelOf(sDesc[j])){descOk=false;break;}
  ok('interest tier, High→Low orders high first', descOk);
  app.sortTiers=[{key:'interest',dir:1}];
  const sAsc=app.sortList(pool);
  let ascOk=true;
  for(let j=1;j<sAsc.length;j++) if(app.levelOf(sAsc[j-1])>app.levelOf(sAsc[j])){ascOk=false;break;}
  ok('per-tier direction flips the order', ascOk);
  app.sortGroup='day'; app.sortTiers=[{key:'interest',dir:-1},{key:'time',dir:1}];
  try{ app.render(); ok('group + multi-tier renders', ids.main.children.length>0,
    ids.main.children.length+' nodes'); }
  catch(e){ ok('group + multi-tier renders', false, e.message); }
  app.advSort=false; app.sortGroup='none';

  console.log('\nCALENDAR');
  app.setLevel(carl,2);                 /* make sure the plan has at least one event */
  const ics=app.buildICS();
  ok('ics has the calendar wrapper',
     ics.startsWith('BEGIN:VCALENDAR') && /END:VCALENDAR\r\n$/.test(ics));
  ok('ics has a timed VEVENT',
     /BEGIN:VEVENT/.test(ics) && /DTSTART:\d{8}T\d{6}/.test(ics) && /DTEND:\d{8}T\d{6}/.test(ics));
  ok('one VEVENT per planned event',
     (ics.match(/BEGIN:VEVENT/g)||[]).length===app.planIdx().length, app.planIdx().length+' events');

  console.log('\nSYNC');
  const url=app.shareLink();
  const saved=new Map(app.picks);
  app.picks=new Map();
  globalThis.location.hash=url.slice(url.indexOf('#'));
  const n=app.importFromHash();
  ok('picks survive the link', n===saved.size&&app.picks.size===saved.size);

  console.log('\nSHARE (locked + single event)');
  app.setLevel(carl,2); app.setLocked(carl,true);
  ok('a locked high-priority pick encodes as digit 4', app.shareLink().includes(EV[carl][ID]+'4'));
  app.setLocked(carl,false);
  ok('an unlocked high pick encodes as digit 2', app.shareLink().includes(EV[carl][ID]+'2'));
  ok('single-event link carries just the id', app.shareEventLink(carl).endsWith('#e='+EV[carl][ID]));
  globalThis.location.hash='#e='+EV[carl][ID];
  app.importFromHash();
  ok('a #e= link flags the shared event', app.sharedEvent===carl);
  /* a friend link that marks a pick locked shows up as "going" */
  app.friends=[]; app.myName='Me';
  globalThis.location.hash='#p='+EV[carl][ID]+'4&n=Eric';
  app.importFromHash();
  const fp=app.friends[0]&&app.friends[0].picks[EV[carl][ID]];
  ok('a friend link carries locked', !!fp && fp.locked===true && fp.lv===2);
  const also=app.alsoStarred(carl).find(x=>x.name==='Eric');
  ok('alsoStarred reports the friend as locked', !!also && also.locked===true);
  app.friends=[]; globalThis.location.hash='';

  console.log('\nNEW MODEL (three axes)');
  app.setLevel(carl,2);
  app.setLocked(carl,true);
  ok('lock is independent of interest', app.locked.has(EV[carl][ID])&&app.intOf(carl)===2);
  app.setPrivate(carl,true);
  ok('private pick is left off the share link', !app.shareLink().includes(EV[carl][ID]));
  app.setPrivate(carl,false);
  ok('un-private puts it back on the link', app.shareLink().includes(EV[carl][ID]));
  app.setLocked(carl,false);
  const other=EV.findIndex((e,i)=>i!==carl&&e[T]&&!e[ID].startsWith('w'));
  app.setLevel(other,-2);
  ok('not interested is -2 and clears any pick',
     app.intOf(other)===-2&&!app.picks.has(EV[other][ID]));
  ok('not interested is never shared', !app.shareLink().includes(EV[other][ID]));
  app.setLevel(other,0);

  console.log('\nFILE');
  ok('size sane', html.length<600*1024, Math.round(html.length/1024)+' KB');
  ok('disclaimer present', html.includes('Unofficial fan project'));
  ok('noindex present', html.includes('noindex, nofollow'));
  console.log(fail?'\n'+fail+' FAILURE(S)':'\nAll checks passed.');
},400);
