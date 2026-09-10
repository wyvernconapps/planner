const fs=require('fs');
require('./domshim.js');
const {ids}=require('./domshim.js');
const html=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8');
const js=html.match(/<script>([\s\S]*)<\/script>/)[1];
let fail=0;
const ok=(label,cond,extra='')=>{ if(!cond) fail++;
  console.log('  '+(cond?'ok  ':'FAIL')+'  '+label+(extra?'  '+extra:'')); };

const app=new Function(js+'\n;return {set view(v){view=v},render,setLevel,levelOf,openSheet,'+
 'get EV(){return EV},get picks(){return picks},get ruled(){return ruled},get watch(){return watch},'+
 'toggleWatch,toggleRuled,dctvOf,laterRepeats,isWatch,shareLink,importFromHash,'+
 'set hidePast(v){hidePast=v},set listSort(v){listSort=v},set day(v){day=v},get day(){return day},'+
 'get hotels(){return hotels},get days(){return days},get offTracks(){return offTracks},set query(v){query=v},'+
 'get query(){return query},activeFilters,get trip(){return trip},planTrips,roomOf,'+
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
  app.setLevel(carl,2); ok('star to trophy', app.levelOf(carl)===2);
  app.setLevel(carl,1); ok('trophy to star keeps the pick', app.picks.has(EV[carl][ID]));
  app.toggleRuled(carl); ok('rule out keeps the star', app.ruled.size===1&&app.picks.size===1);
  app.toggleRuled(carl); ok('un-rule', app.ruled.size===0);
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

  console.log('\nTRIPS');
  app.trip.on=true;
  const list=[...app.picks.keys()].map(id=>app.EV.findIndex(e=>e[ID]===id)).filter(i=>i>=0);
  const plan=app.planTrips(list);
  ok('two meals planned per day', plan.length>=2, plan.length+' trips');
  ok('trips have a cost', plan.every(t=>t.impossible||typeof t.cost==='number'));
  app.trip.meals[1]={name:'Dinner',from:9*60,to:12*60+30};
  ok('parade blocks Sat morning',
     app.planTrips(list).some(t=>t.day==='Sat'&&t.meal==='Dinner'&&t.impossible));
  app.trip.meals[1]={name:'Dinner',from:18*60,to:21*60};

  console.log('\nSYNC');
  const url=app.shareLink();
  const saved=new Map(app.picks);
  app.picks=new Map();
  globalThis.location.hash=url.slice(url.indexOf('#'));
  const n=app.importFromHash();
  ok('picks survive the link', n===saved.size&&app.picks.size===saved.size);

  console.log('\nFILE');
  ok('size sane', html.length<600*1024, Math.round(html.length/1024)+' KB');
  ok('disclaimer present', html.includes('Unofficial fan-made project'));
  ok('noindex present', html.includes('noindex, nofollow'));
  console.log(fail?'\n'+fail+' FAILURE(S)':'\nAll checks passed.');
},80);
