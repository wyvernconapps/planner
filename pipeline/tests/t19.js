const fs=require('fs');
require('./domshim.js');
const {ids}=require('./domshim.js');
const html=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8');
const js=html.match(/<script>([\s\S]*)<\/script>/)[1];
const app=new Function(js+'\n;return {get view(){return view},set view(v){view=v},render,setLevel,'+
  'shareLink,importFromHash,get picks(){return picks},set picks(v){picks=v},'+
  'get EV(){return EV},get ID(){return ID},set hidePast(v){hidePast=v},'+
  'get offTracks(){return offTracks}};')();

setTimeout(()=>{
  app.hidePast=false;
  // simulate the laptop: star a realistic spread including a 4pm pile-up
  const EV=app.EV, ID=app.ID, START=1;
  const fourPM=EV.map((e,i)=>i).filter(i=>EV[i][START]===3*1440+16*60).slice(0,5);
  const others=[100,500,1200];
  fourPM.forEach((i,k)=>app.setLevel(i,k===0?2:1));
  others.forEach(i=>app.setLevel(i,2));
  app.offTracks.add(3); app.offTracks.add(11);
  console.log('laptop has',app.picks.size,'picks and',app.offTracks.size,'hidden tracks');

  const url=app.shareLink();
  console.log('\nlink length:',url.length,'chars');
  console.log(url.slice(0,110)+'...');

  // render My Con and inspect the slot grouping
  app.view='mine'; app.render();
  const kinds={};
  ids.main.children.forEach(c=>{ const k=c.className.split(' ')[0]||'?';
    kinds[k]=(kinds[k]||0)+1; });
  console.log('\nMy Con node types:',kinds);
  const slots=ids.main.children.filter(c=>c.className.startsWith('slot ')||c.className==='slot');
  slots.forEach(s=>console.log('   slot:',JSON.stringify(s.innerHTML).slice(0,90)));

  // simulate the phone: fresh device, open the link
  console.log('\n--- phone: empty, opens the link ---');
  app.picks=new Map();
  globalThis.location.hash=url.slice(url.indexOf('#'));  // browsers include the '#'
  const n=app.importFromHash();
  console.log('imported:',n,'picks | now holds',app.picks.size);
  const same=[...app.picks.entries()].every(([id,lv])=>lv===1||lv===2);
  console.log('all levels valid:',same);
  app.view='mine';
  try{ app.render(); console.log('My Con renders on the phone: OK,',ids.main.children.length,'nodes'); }
  catch(e){ console.log('THREW:',e.message); }
},50);
