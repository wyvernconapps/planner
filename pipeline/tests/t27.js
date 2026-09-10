const fs=require('fs');
require('./domshim.js');
const {ids}=require('./domshim.js');
const js=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8')
  .match(/<script>([\s\S]*)<\/script>/)[1];
const app=new Function(js+'\n;return {set view(v){view=v},render,setLevel,levelOf,'+
  'get EV(){return EV},get picks(){return picks},get ruled(){return ruled},toggleRuled,'+
  'moveToRepeat,laterRepeats,isRuled,set hidePast(v){hidePast=v},get trip(){return trip},'+
  'planTrips,missCost,get DATA(){return DATA}};')();
setTimeout(()=>{
  app.hidePast=false;
  const EV=app.EV, START=1;
  const at=t=>EV.map((e,i)=>i).filter(i=>EV[i][START]===3*1440+t);
  const slot=at(16*60).slice(0,4);
  slot.forEach((i,k)=>app.setLevel(i,k===0?2:1));
  const readSlot=()=>{
    app.view='mine'; app.render();
    const h=ids.main.children.find(c=>c.className.startsWith('slot ')||c.className==='slot');
    return h?h.innerHTML:'(none)';
  };
  console.log('4 options, one trophy:');
  console.log('   ',readSlot());
  console.log('\nrule out two of the alternates...');
  app.toggleRuled(slot[1]); app.toggleRuled(slot[2]);
  console.log('   ',readSlot());
  console.log('   ruled set size:',app.ruled.size,'| picks still:',app.picks.size);
  console.log('   ruled events still starred?',slot.slice(1,3).every(i=>app.levelOf(i)>0));

  console.log('\ntrip cost ignores ruled-out:');
  const list=[...app.picks.keys()].map(id=>EV.findIndex(e=>e[8]===id)).filter(i=>i>=0)
    .sort((a,b)=>EV[a][START]-EV[b][START]);
  console.log('   missCost of a ruled-out pick:',app.missCost(slot[1]),'(must be 0)');
  console.log('   missCost of a live pick    :',app.missCost(slot[3]));

  console.log('\nput one back:');
  app.toggleRuled(slot[1]);
  console.log('   ',readSlot());

  console.log('\nmove a repeating pick to its later showing:');
  const rep=EV.map((e,i)=>i).find(i=>app.laterRepeats(i).length&&EV[i][START]<3*1440+20*60);
  const later=app.laterRepeats(rep)[0];
  app.setLevel(rep,2);
  const beforeId=EV[rep][8];
  app.moveToRepeat(rep,later);
  const target=EV.findIndex(e=>e[START]===later&&e[0]===EV[rep][0]);
  console.log('   original still picked:',app.picks.has(beforeId),'(should be false)');
  console.log('   later session picked :',app.picks.has(EV[target][8]),'level',app.levelOf(target));
},60);
