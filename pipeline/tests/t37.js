const fs=require('fs');
require('./domshim.js');
const {ids}=require('./domshim.js');
const js=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8')
  .match(/<script>([\s\S]*)<\/script>/)[1];
const app=new Function(js+'\n;return {set view(v){view=v},render,get EV(){return EV},'+
  'get showStarted(){return showStarted},set showStarted(v){showStarted=v},'+
  'set hidePast(v){hidePast=v},refMin,GRACE};')();
const heads=()=>ids.main.children.filter(c=>c.className.startsWith('timehead'))
  .map(c=>c.textContent.replace(/\s+/g,' ').trim());
const rowsIn=()=>ids.main.children.filter(c=>c.className==='grouped')
  .reduce((n,g)=>n+g.children.filter(c=>c.className.startsWith('ev')).length,0);
setTimeout(()=>{
  app.hidePast=false;
  app.view='now';
  console.log('grace period:',app.GRACE,'minutes\n');
  app.showStarted=false; app.render();
  console.log('COLLAPSED (default):');
  heads().forEach(h=>console.log('   '+h));
  console.log('   rows shown:',rowsIn());
  const fold=ids.main.children.find(c=>c.className.includes('fold'));
  console.log('   fold is a button:',fold?fold.tagName==='BUTTON':'no fold');

  if(fold){
    fold.onclick();
    console.log('\nEXPANDED (after tapping it):');
    heads().forEach(h=>console.log('   '+h));
    console.log('   rows shown:',rowsIn());
    console.log('   state persisted:',app.showStarted);
  }
  // the "min in" markers should be present and increasing
  const marks=[];
  ids.main.querySelectorAll('.remain').forEach(e=>marks.push(e.className+' = '+e.textContent));
  console.log('\n   lateness markers found:',marks.length);
  marks.slice(0,6).forEach(m=>console.log('      '+m));
},80);
