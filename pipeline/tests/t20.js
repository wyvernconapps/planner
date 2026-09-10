const fs=require('fs');
require('./domshim.js');
const {ids}=require('./domshim.js');
const js=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8')
  .match(/<script>([\s\S]*)<\/script>/)[1];
const app=new Function(js+'\n;return {set view(v){view=v},render,setLevel,openSheet,'+
  'get EV(){return EV},set hidePast(v){hidePast=v},get picks(){return picks},'+
  'LEVEL_MARK,LEVEL_NAME};')();
setTimeout(()=>{
  app.hidePast=false;
  const EV=app.EV, START=1;
  // a nasty Saturday: three must-sees at 4pm, five undecided at 1pm
  const at=t=>EV.map((e,i)=>i).filter(i=>EV[i][START]===3*1440+t);
  at(16*60).slice(0,3).forEach(i=>app.setLevel(i,2));
  at(13*60).slice(0,5).forEach(i=>app.setLevel(i,1));
  at(11*60).slice(0,1).forEach(i=>app.setLevel(i,2));
  app.view='mine'; app.render();

  const rows=ids.main.querySelectorAll('.deciderow');
  console.log('RANKED CONFLICTS (worst first):');
  rows.forEach(r=>{
    const b=r.children.find(c=>c.tagName==='B');
    const sp=r.children.find(c=>c.tagName==='SPAN');
    console.log('  '+(r.className.includes('hard')?'[!] ':'    ')+
      (b?b.textContent:'?').padEnd(10)+(sp?sp.textContent:''));
  });
  const slots=ids.main.querySelectorAll('.slot');
  console.log('\nSLOT HEADERS:');
  slots.forEach(s=>console.log('  '+JSON.stringify(s.innerHTML).slice(1,80)));

  console.log('\nSTAR MARKS:', JSON.stringify(app.LEVEL_MARK));
  console.log('STAR LABELS:', JSON.stringify(app.LEVEL_NAME));
  // sheet uses the same control
  app.openSheet(at(16*60)[0]);
  const cyc=ids.sheetCard.querySelector('.lvcycle');
  console.log('\nsheet control class:',cyc?cyc.className:'MISSING');
  console.log('sheet shows same star:',cyc?JSON.stringify(cyc.textContent):'-');
},50);
setTimeout(()=>{
  console.log('\n--- raw innerHTML, to see past the shim ---');
  ids.main.querySelectorAll('.deciderow').forEach(r=>console.log('  ',r.innerHTML));
  const c=ids.sheetCard.querySelector('.lvcycle');
  console.log('   sheet:',c?c.innerHTML:'-');
},120);
