const fs=require('fs');
require('./domshim.js');
const {ids}=require('./domshim.js');
const js=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8')
  .match(/<script>([\s\S]*)<\/script>/)[1];
const app=new Function(js+'\n;return {set view(v){view=v},render,setLevel,'+
  'get trip(){return trip},planTrips,get EV(){return EV},set hidePast(v){hidePast=v},'+
  'get picks(){return picks},syncTrip,missCost,laterRepeats};')();
setTimeout(()=>{
  app.hidePast=false;
  const EV=app.EV, START=1;
  // a full Saturday: morning, midday, the 4pm pile-up, evening
  const at=t=>EV.map((e,i)=>i).filter(i=>EV[i][START]===3*1440+t);
  at(10*60).slice(0,1).forEach(i=>app.setLevel(i,2));
  at(13*60).slice(0,2).forEach(i=>app.setLevel(i,1));
  at(16*60).slice(0,3).forEach(i=>app.setLevel(i,2));
  at(19*60).slice(0,2).forEach(i=>app.setLevel(i,2));
  at(20*60+30).slice(0,1).forEach(i=>app.setLevel(i,1));

  app.trip.on=true; app.syncTrip();
  const list=[...app.picks.keys()].map(id=>EV.findIndex(e=>e[8]===id))
    .filter(i=>i>=0).sort((a,b)=>EV[a][START]-EV[b][START]);

  console.log('SETTINGS: travel',app.trip.travel,'| home',app.trip.home,
    '| park',app.trip.park,'| dctv',app.trip.dctv);
  const plan=app.planTrips(list);
  const clock=m=>{const h=Math.floor((m%1440)/60),mm=m%60,ap=h<12?'am':'pm';
    return (h%12||12)+':'+String(mm).padStart(2,'0')+ap;};
  console.log('\nPLANNED TRIPS:');
  plan.forEach(t=>{
    if(t.impossible){ console.log('  ',t.day,t.meal,'-> IMPOSSIBLE'); return; }
    console.log(`   ${t.day} ${t.meal.padEnd(9)} leave ${clock(t.depart)} back ${clock(t.ret)}`
      +`  cost ${t.cost.toFixed(2)}  hits ${t.hit.length}`+(t.tight?'  TIGHT:'+t.tight:''));
  });

  console.log('\n--- parade blackout check: force dinner into Sat morning ---');
  app.trip.meals[1]={name:'Dinner',from:9*60,to:12*60+30};
  app.planTrips(list).filter(t=>t.meal==='Dinner'&&t.day==='Sat')
    .forEach(t=>console.log('   Sat Dinner ->',t.impossible?'blocked by the parade (correct)':clock(t.depart)));
  app.trip.meals[1]={name:'Dinner',from:18*60,to:21*60};

  console.log('\n--- rendered My Con ---');
  app.view='mine'; app.render();
  const kinds={};
  ids.main.children.forEach(c=>{const k=c.className.split(' ')[0]||'?';kinds[k]=(kinds[k]||0)+1;});
  console.log('  node types:',kinds);
  ids.main.querySelectorAll('.trip').forEach(t=>{
    const h=t.querySelector('.triph'), b=t.querySelector('.tripb');
    console.log('   TRIP:',h?h.textContent:'?');
    console.log('        ',(b?b.textContent:'').slice(0,150));
  });
  ids.main.querySelectorAll('.deciderow').forEach(r=>console.log('   DECIDE:',r.innerHTML));
},60);
