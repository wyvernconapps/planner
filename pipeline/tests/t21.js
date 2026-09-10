const fs=require('fs');
require('./domshim.js');
const {ids}=require('./domshim.js');
const js=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8')
  .match(/<script>([\s\S]*)<\/script>/)[1];
const app=new Function(js+'\n;return {set view(v){view=v},render,setLevel,'+
  'get EV(){return EV},get hotels(){return hotels},set day(v){day=v},'+
  'set hidePast(v){hidePast=v},repeatsOf,laterRepeats,get DATA(){return DATA}};')();
setTimeout(()=>{
  app.hidePast=false; app.day='Sat';
  console.log('--- MULTI-HOTEL GRID ---');
  app.hotels.clear(); app.hotels.add('HIL'); app.hotels.add('HYA');
  app.view='grid'; app.render();
  console.log('count:',ids.count.textContent);
  const wrap=ids.main.querySelectorAll('.gfloor');
  console.log('floor/hotel dividers:',wrap.length);
  wrap.slice(0,8).forEach(f=>{
    const l=f.querySelector('.gflabel');
    console.log('   ',l?l.textContent:'?');
  });
  console.log('\n--- MULTI-HOTEL BROWSE ---');
  app.view='browse'; app.render();
  console.log('count:',ids.count.textContent);

  console.log('\n--- REPEATS ---');
  const rep=app.DATA.repeats;
  console.log('events flagged as repeating:',Object.keys(rep).length);
  const EV=app.EV;
  let shown=0;
  EV.forEach((e,i)=>{
    if(shown>=3) return;
    const later=app.laterRepeats(i);
    if(later.length>=2){ shown++;
      console.log('  ',e[0].slice(0,44),'-> also at',later.length,'later times'); }
  });
  // a repeat must never point at itself or at the same time+room
  let bad=0;
  EV.forEach((e,i)=>{ const r=app.repeatsOf(i); if(!r) return;
    if(r.includes(e[1])) bad++; });
  console.log('repeats pointing at their own start time:',bad,'(must be 0)');
},60);
