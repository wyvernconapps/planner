const fs=require('fs');
require('./domshim.js');
const {ids}=require('./domshim.js');
const js=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8')
  .match(/<script>([\s\S]*)<\/script>/)[1];
const app=new Function(js+'\n;return {set view(v){view=v},render,setLevel,levelOf,'+
  'get EV(){return EV},get picks(){return picks},get watch(){return watch},toggleWatch,'+
  'isWatch,dctvOf,set hidePast(v){hidePast=v},get DATA(){return DATA},roomOf,'+
  'get trip(){return trip},planTrips};')();
setTimeout(()=>{
  app.hidePast=false;
  const EV=app.EV, T=0,START=1,DUR=2,ID=8;
  const carl=EV.findIndex(e=>e[T].startsWith('New Achievement'));
  const air=app.dctvOf(carl).airs[0];
  console.log('panel  :',EV[carl][T].slice(0,50));
  console.log('runs   : Thu 7:00pm | DCTV replay at minute',air);

  // put a panel opposite the replay so the clash is real
  const opposite=EV.map((e,i)=>i).filter(i=>EV[i][START]===air&&i!==carl)[0];
  app.setLevel(opposite,2);
  console.log('also    :',EV[opposite][T].slice(0,44),'at the same time');

  console.log('\nadd the replay to my schedule...');
  app.toggleWatch(EV[carl][ID],air);
  const EV2=app.EV;
  const w=EV2.findIndex(e=>e[ID].startsWith('w'));
  console.log('  synthetic event created:',EV2[w][T].slice(0,46));
  console.log('  start matches airing   :',EV2[w][START]===air);
  console.log('  duration copied        :',EV2[w][DUR]===EV[carl][DUR],'('+EV2[w][DUR]+' min)');
  console.log('  room                   :',app.roomOf(w).name,'| hotel',app.DATA.hotels[EV2[w][3]]);
  console.log('  auto-starred           : level',app.levelOf(w));

  app.view='mine'; app.render();
  console.log('\n  My Con timeline:');
  ids.main.children.forEach(c=>{
    if(c.className.startsWith('slot ')||c.className==='slot')
      console.log('     SLOT  '+c.textContent);
    if(c.className==='slotbody')
      c.children.filter(k=>k.className.startsWith('ev')).forEach(k=>{
        const t=k.querySelector('.evtitle');
        console.log('           - '+(t?t.textContent:'?').slice(0,52)); });
  });

  console.log('\n  does it cost a dog trip? (walk to ONLINE should be 0)');
  const list=[...app.picks.keys()].map(id=>EV2.findIndex(e=>e[ID]===id)).filter(i=>i>=0)
    .sort((a,b)=>EV2[a][START]-EV2[b][START]);
  app.trip.on=true;
  console.log('  trips planned:',app.planTrips(list).filter(t=>!t.impossible).length);

  console.log('\nremove it again...');
  app.toggleWatch(EV[carl][ID],air);
  console.log('  watch list:',app.watch.length,'| synthetic events left:',
    app.EV.filter(e=>e[ID].startsWith('w')).length);
},60);
