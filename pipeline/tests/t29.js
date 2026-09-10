const fs=require('fs');
require('./domshim.js');
const {ids}=require('./domshim.js');
const js=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8')
  .match(/<script>([\s\S]*)<\/script>/)[1];
const app=new Function(js+'\n;return {set view(v){view=v},render,setLevel,evNode,'+
  'get EV(){return EV},dctvBadge,repeatBadge,set hidePast(v){hidePast=v}};')();
setTimeout(()=>{
  app.hidePast=false;
  const EV=app.EV;
  const carl=EV.findIndex(e=>e[0].startsWith('New Achievement'));
  console.log('panel:',EV[carl][0].slice(0,54));
  console.log('badge:',app.dctvBadge(carl).replace(/<[^>]+>/g,''));
  const node=app.evNode(carl,{showEnd:true});
  const desc=node.querySelector('.evdesc');
  console.log('\nexpanded row text:\n');
  console.log('   '+desc.textContent.split('\n').filter(Boolean).slice(-1)[0]);
  // a repeating one
  const rep=EV.findIndex((e,i)=>app.repeatBadge(i)&&!e[0].includes('Joystick'));
  console.log('\nrepeat badge:',app.repeatBadge(rep).replace(/<[^>]+>/g,''),'-',EV[rep][0].slice(0,40));
  // live one
  const live=EV.findIndex((e,i)=>app.dctvBadge(i).includes('LIVE'));
  console.log('live badge  :',app.dctvBadge(live).replace(/<[^>]+>/g,''),'-',EV[live][0].slice(0,40));
},60);
