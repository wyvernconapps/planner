const fs=require('fs');
require('./domshim.js');
const {ids,nav}=require('./domshim.js');
const html=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8');
const js=html.match(/<script>([\s\S]*)<\/script>/)[1];

// run the real app, top to bottom, exactly as a browser would
const run=new Function(js+'\n;return {get view(){return view},set view(v){view=v},'+
  'render,cycle,setLevel,openSheet,get picks(){return picks},'+
  'get EV(){return EV},get hidePast(){return hidePast},set hidePast(v){hidePast=v},'+
  'get hotels(){return hotels},'+
  'get day(){return day},set day(v){day=v},get ID(){return ID}};');
let app;
try{ app=run(); }catch(e){ console.log('TOP-LEVEL THROW:',e.message); process.exit(1); }

setTimeout(()=>{
  const views=['now','browse','grid','mine'];
  let fails=0;
  console.log('Rendering every view for real:\n');
  for(const v of views){
    app.view=v;
    try{
      app.render();
      const n=ids.main.children.length;
      const txt=ids.count.textContent;
      console.log(`  ${v.padEnd(7)} OK   ${String(n).padStart(3)} nodes | count: "${txt}"`);
      if(n===0){ console.log('         ^^ rendered nothing'); fails++; }
    }catch(e){ fails++; console.log(`  ${v.padEnd(7)} THREW  ${e.constructor.name}: ${e.message}`); }
  }

  // now with picks, which is the path My Con actually cares about
  console.log('\nWith picks set (2 must-see, 2 maybe):');
  [40,41,900,901].forEach((i,k)=>app.setLevel(i,k<2?2:1));
  for(const v of views){
    app.view=v;
    try{ app.render();
      console.log(`  ${v.padEnd(7)} OK   ${String(ids.main.children.length).padStart(3)} nodes | "${ids.count.textContent}"`);
    }catch(e){ fails++; console.log(`  ${v.padEnd(7)} THREW  ${e.constructor.name}: ${e.message}`); }
  }

  // and with filters engaged
  console.log('\nWith a hotel filter + hidePast off:');
  app.render(); app.hidePast=false; app.day='Sat';
  for(const v of views){
    app.view=v;
    try{ app.render();
      console.log(`  ${v.padEnd(7)} OK   ${String(ids.main.children.length).padStart(3)} nodes`);
    }catch(e){ fails++; console.log(`  ${v.padEnd(7)} THREW  ${e.constructor.name}: ${e.message}`); }
  }
  console.log(fails? `\n${fails} FAILURE(S)` : '\nAll views render without throwing.');
},50);
