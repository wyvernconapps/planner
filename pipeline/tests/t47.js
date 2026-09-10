const fs=require('fs');
require('./domshim.js');
const {ids}=require('./domshim.js');
const js=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8')
  .match(/<script>([\s\S]*)<\/script>/)[1];
const app=new Function(js+'\n;return {set view(v){view=v},render,get days(){return days},'+
  'get offKinds(){return offKinds},kindsOf,get EV(){return EV},set hidePast(v){hidePast=v},'+
  'get showRunning(){return showRunning},activeFilters};')();
setTimeout(()=>{
  app.hidePast=false; app.view='browse';
  console.log('MULTI-SELECT DAYS');
  app.days.clear(); app.render();
  console.log('   none selected :',ids.count.textContent);
  ['Fri','Sat','Sun'].forEach(d=>app.days.add(d)); app.render();
  console.log('   Fri+Sat+Sun   :',ids.count.textContent);
  console.log('   counts as 1 filter:',app.activeFilters()===1);
  const chips=ids.days.children.filter(c=>!c.dataset.all);
  console.log('   chips pressed :',chips.filter(c=>c.getAttribute('aria-pressed')==='true')
    .map(c=>c.textContent).join(', '));
  app.days.clear();

  console.log('\nEXTRA FEE');
  const paid=app.EV.map((e,i)=>i).filter(i=>app.kindsOf(i).includes('paid'));
  console.log('   tagged:',paid.length);
  paid.slice(0,3).forEach(i=>console.log('      '+app.EV[i][0].slice(0,56)));
  const chip=ids.kgrid.children.find(c=>c.dataset.kind==='paid');
  console.log('   filter chip exists:',!!chip);
  ['actor','author','artist','musician','costumer','creator','scientist',
   'writer','performer','expert','party','fan'].forEach(k=>app.offKinds.add(k));
  app.render();
  const rows=ids.main.querySelectorAll('.ev');
  console.log('   showing only extra-fee:',rows.length,'rows, all tagged:',
    rows.every(r=>r.innerHTML.includes('EXTRA FEE')));
  app.offKinds.clear();

  console.log('\nALREADY RUNNING in Browse');
  const fold=ids.main.children.find(c=>c.className.includes('fold'));
  console.log('   fold present:',!!fold,fold?'-> '+fold.textContent.replace(/\s+/g,' '):'(none, con is over)');
},80);
