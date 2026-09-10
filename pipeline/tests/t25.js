const fs=require('fs');
require('./domshim.js');
const {ids}=require('./domshim.js');
const js=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8')
  .match(/<script>([\s\S]*)<\/script>/)[1];
const app=new Function(js+'\n;return {set view(v){view=v},get view(){return view},render,'+
  'setLevel,get EV(){return EV},set listSort(v){listSort=v},set day(v){day=v},get day(){return day},'+
  'get hotels(){return hotels},get offTracks(){return offTracks},set query(v){query=v},'+
  'get query(){return query},activeFilters,set hidePast(v){hidePast=v}};')();
const times=()=>ids.main.children.filter(c=>c.className.startsWith('ev'))
  .map(c=>{const m=c.innerHTML.match(/class="hb">([^<]+)<\/span>/);return m?m[1]:'(none)';});
setTimeout(()=>{
  app.hidePast=false;
  console.log('--- END TIMES ---');
  for(const mode of ['time','interest','place']){
    app.listSort=mode; app.view='browse'; app.render();
    console.log('  browse/'+mode.padEnd(9)+' first rows:',JSON.stringify(times().slice(0,3)));
  }
  app.listSort='time';
  app.view='now'; app.render();
  console.log('  now             first rows:',JSON.stringify(times().slice(0,3)));
  // My Con slots
  const EV=app.EV;
  [200,201,202].forEach(i=>app.setLevel(i,1));
  app.view='mine'; app.render();
  const inSlot=[];
  ids.main.children.forEach(c=>{ if(c.className==='slotbody')
    c.children.forEach(k=>{ const m=k.innerHTML.match(/class="hb">([^<]+)<\/span>/);
      if(m) inSlot.push(m[1]); }); });
  console.log('  my con slots            :',JSON.stringify(inSlot.slice(0,3)));

  console.log('\n--- CLEAR FILTERS ---');
  app.view='browse'; app.day='Sat'; app.hotels.add('HIL'); app.hotels.add('HYA');
  app.offTracks.add(3); app.query='dragon'; app.render();
  console.log('  active filters:',app.activeFilters());
  console.log('  clear button  :',ids.clearBtn.textContent,'| shown:',ids.clearBtn.style.display!=='none');
  ids.clearBtn.onclick();
  console.log('  after clearing: day='+app.day+' hotels='+app.hotels.size+
    ' hiddenTracks='+app.offTracks.size+' query="'+app.query+'"');
  console.log('  clear button now:',ids.clearBtn.style.display==='none'?'hidden (correct)':'still showing');

  console.log('\n--- ALL CHIPS ---');
  app.view='browse'; app.day='Sat'; app.render();
  const dayAll=ids.days.children.find(c=>c.dataset.all);
  console.log('  "All days" pressed while a day is set:',dayAll.getAttribute('aria-pressed'));
  dayAll.onclick(); app.render();
  console.log('  after tapping it, day =',app.day,'| pressed:',dayAll.getAttribute('aria-pressed'));
  app.view='grid'; app.render();
  const hotAll=ids.hotels.children.find(c=>c.dataset.all);
  console.log('  "All hotels" on Grid  :',hotAll.style.display===''?'visible':'hidden (correct - grid needs one)');
},60);
