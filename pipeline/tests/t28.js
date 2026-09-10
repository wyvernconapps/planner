const fs=require('fs');
require('./domshim.js');
const {ids}=require('./domshim.js');
const js=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8')
  .match(/<script>([\s\S]*)<\/script>/)[1];
const app=new Function(js+'\n;return {set view(v){view=v},render,setLevel,levelOf,openSheet,'+
  'get EV(){return EV},get picks(){return picks},get ruled(){return ruled},isRuled,'+
  'set hidePast(v){hidePast=v}};')();
const rows=()=>{
  const out=[];
  ids.main.children.forEach(c=>{ if(c.className==='slotbody')
    c.children.forEach(k=>{ if(k.className.startsWith('ev')) out.push(k); }); });
  return out;
};
setTimeout(()=>{
  app.hidePast=false;
  const EV=app.EV, START=1;
  const slot=EV.map((e,i)=>i).filter(i=>EV[i][START]===3*1440+16*60).slice(0,3);
  slot.forEach((i,k)=>app.setLevel(i,k===0?2:1));
  app.view='mine'; app.render();
  const r=rows();
  console.log('rows rendered:',r.length);
  const seg=r[0].querySelector('.seg');
  console.log('first row has a segmented control:',!!seg,'| buttons:',seg?seg.children.length:0);
  console.log('  states:',seg.children.map(b=>b.className).join(' | '));

  console.log('\nTHE OLD BUG: trophy -> star must NOT delete the pick');
  const before=app.picks.size;
  const star=r[0].querySelector('.s1');
  star.onclick({stopPropagation(){}});
  console.log('  picks before',before,'after',app.picks.size,'| level now',app.levelOf(slot[0]));
  console.log('  row still in My Con:',app.picks.has(EV[slot[0]][8]));

  console.log('\nstar -> trophy, directly:');
  rows()[0].querySelector('.s2').onclick({stopPropagation(){}});
  console.log('  level:',app.levelOf(slot[0]),'| picks:',app.picks.size);

  console.log('\n✕ rules out without unstarring:');
  const rr=rows();
  const target=rr.find(x=>x.querySelector('.sx'));
  target.querySelector('.sx').onclick({stopPropagation(){}});
  console.log('  ruled:',app.ruled.size,'| picks still:',app.picks.size);

  console.log('\nsetting a level clears ruled-out:');
  rows().forEach(x=>{ if(x.className.includes('ruled')) x.querySelector('.s1').onclick({stopPropagation(){}}); });
  console.log('  ruled now:',app.ruled.size);

  console.log('\nremove lives in the sheet:');
  app.openSheet(slot[0]);
  const d=ids.sheetCard.querySelector('#sDrop');
  console.log('  Remove button present:',!!d);
  if(d){ d.onclick(); console.log('  after remove, picks:',app.picks.size); }
},60);
