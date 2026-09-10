const fs=require('fs');
require('./domshim.js');
const {ids}=require('./domshim.js');
const js=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8')
  .match(/<script>([\s\S]*)<\/script>/)[1];
const app=new Function(js+'\n;return {set view(v){view=v},render,kindsOf,'+
  'get EV(){return EV},get DATA(){return DATA},get offKinds(){return offKinds},'+
  'syncKinds,set hidePast(v){hidePast=v},set day(v){day=v},matches};')();
setTimeout(()=>{
  app.hidePast=false; app.day='Sat';
  const EV=app.EV;
  const count=k=>EV.filter((e,i)=>app.kindsOf(i).includes(k)).length;
  console.log('tag counts: guest',count('guest'),'| expert',count('expert'),'| party',count('party'));
  console.log('untagged (fan panels):',EV.filter((e,i)=>!app.kindsOf(i).length).length);

  console.log('\nsample GUEST panels:');
  EV.map((e,i)=>i).filter(i=>app.kindsOf(i).includes('guest')).slice(0,4)
    .forEach(i=>console.log('   '+EV[i][0].slice(0,44).padEnd(46)+(EV[i][6]||'').slice(0,38)));
  console.log('\nsample PARTY:');
  EV.map((e,i)=>i).filter(i=>app.kindsOf(i).includes('party')).slice(0,4)
    .forEach(i=>console.log('   '+EV[i][0].slice(0,44).padEnd(46)+app.DATA.tracks[EV[i][5]]));
  console.log('\nsample EXPERT:');
  EV.map((e,i)=>i).filter(i=>app.kindsOf(i).includes('expert')).slice(0,4)
    .forEach(i=>console.log('   '+EV[i][0].slice(0,44).padEnd(46)+app.DATA.tracks[EV[i][5]]));

  console.log('\nfilter: hide everything except guest panels');
  ['expert','party','fan'].forEach(k=>app.offKinds.add(k));
  app.view='browse'; app.render();
  const rows=ids.main.querySelectorAll('.ev');
  const allGuest=rows.every(r=>r.innerHTML.includes('k-guest'));
  console.log('   rows shown:',rows.length,'| all carry a GUEST badge:',allGuest);
  console.log('   first:',rows[0]?rows[0].querySelector('.evtitle').textContent.slice(0,46):'-');
  app.offKinds.clear();
},80);
