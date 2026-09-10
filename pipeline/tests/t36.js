const fs=require('fs');
require('./domshim.js');
const {ids}=require('./domshim.js');
const html=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8');
const js=html.match(/<script>([\s\S]*)<\/script>/)[1];
const app=new Function(js+'\n;return {set view(v){view=v},render,set listSort(v){listSort=v},'+
  'set hidePast(v){hidePast=v},set day(v){day=v},get hotels(){return hotels},get EV(){return EV}};')();
setTimeout(()=>{
  app.hidePast=false; app.day='Sun'; app.hotels.add('MAR');
  for(const mode of ['time','interest','place','near']){
    app.listSort=mode; app.view='browse'; app.render();
    const heads=ids.main.children.filter(c=>c.className==='timehead');
    const groups=ids.main.children.filter(c=>c.className==='grouped');
    const orphans=ids.main.children.filter(c=>c.className.startsWith('ev'));
    console.log(`  ${mode.padEnd(9)} headings ${String(heads.length).padStart(2)} | groups ${String(groups.length).padStart(2)} | rows outside a group ${orphans.length}`);
    if(heads.length!==groups.length) console.log('     MISMATCH');
  }
  // every row must live under a heading
  app.listSort='time'; app.render();
  const total=ids.main.children.filter(c=>c.className==='grouped')
    .reduce((n,g)=>n+g.children.filter(c=>c.className.startsWith('ev')).length,0);
  console.log('\n  rows nested under headings:',total);
  console.log('  first heading:',ids.main.children.find(c=>c.className==='timehead').textContent);
  console.log('\nCSS:');
  ['position:sticky;top:calc(var(--headh','.grouped{border-left']
    .forEach(c=>console.log('  '+(html.includes(c)?'ok  ':'MISSING ')+c.slice(0,44)));
},80);
