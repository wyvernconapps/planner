const fs=require('fs');
require('./domshim.js');
const {ids}=require('./domshim.js');
const js=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8')
  .match(/<script>([\s\S]*)<\/script>/)[1];
const app=new Function(js+'\n;return {set view(v){view=v},render,get EV(){return EV},'+
  'get DATA(){return DATA},get offTracks(){return offTracks},get offKinds(){return offKinds},'+
  'set hidePast(v){hidePast=v},set day(v){day=v},interest,shareLink,importFromHash,'+
  'get picks(){return picks}};')();
setTimeout(()=>{
  app.hidePast=false; app.view='browse'; app.render();
  const n=()=>ids.count.textContent;
  console.log('start (nothing hidden):', n());

  console.log('\nisolate one track in two taps:');
  ids.tpNone.onclick();
  console.log('   after "Hide all"   :', n());
  const chip=ids.tgrid.children.find(c=>c.textContent==='BritTrack');
  chip.onclick();
  console.log('   after tapping BritTrack:', n());
  console.log('   chip pressed:',chip.getAttribute('aria-pressed'),'| state:',chip.dataset.state);

  console.log('\nboth panels behave the same:');
  const t=ids.tgrid.children[0], k=ids.kgrid.children[0];
  console.log('   track chip states:',[...new Set(ids.tgrid.children.map(c=>c.dataset.state))]);
  console.log('   kind panel has Show all / Hide all:',
    !!ids.kpAll && !!ids.kpNone);
  ids.kpNone.onclick();
  console.log('   kinds hidden:',app.offKinds.size,'| count line:',n());
  ids.kpAll.onclick(); ids.tpAll.onclick();

  console.log('\ncuration now feeds the interest weight:');
  const i=0;
  console.log('   nothing hidden -> weight',app.interest(i));
  ids.tpNone.onclick(); chip.onclick();
  const brit=app.EV.findIndex(e=>app.DATA.tracks[e[5]]==='BritTrack');
  console.log('   BritTrack kept  -> weight',app.interest(brit));
  const other=app.EV.findIndex(e=>app.DATA.tracks[e[5]]!=='BritTrack');
  console.log('   hidden track    -> weight',app.interest(other));

  console.log('\nshare link carries the filter:');
  const url=app.shareLink();
  console.log('   has t= :',/[&#]t=/.test(url));
},80);
