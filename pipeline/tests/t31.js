const fs=require('fs');
require('./domshim.js');
const {ids}=require('./domshim.js');
const js=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8')
  .match(/<script>([\s\S]*)<\/script>/)[1];
const app=new Function(js+'\n;return {set view(v){view=v},render,setLevel,'+
  'get EV(){return EV},get trip(){return trip},set hidePast(v){hidePast=v},'+
  'get hidePast(){return hidePast},syncTrip,planTrips,get picks(){return picks}};')();
setTimeout(()=>{
  const EV=app.EV, START=1;
  // mimic her: star broadly across Saturday
  const sat=EV.map((e,i)=>i).filter(i=>Math.floor(EV[i][START]/1440)===3);
  sat.slice(0,90).forEach((i,k)=>app.setLevel(i,k<2?2:1));
  app.trip.on=true;

  console.log('meal windows after reset-to-default:');
  console.log('   breakfast',app.trip.meals[0].from/60+'h to '+app.trip.meals[0].to/60+'h');
  console.log('   dinner   ',app.trip.meals[1].from/60+'h to '+app.trip.meals[1].to/60+'h');
  const plan=app.planTrips([...app.picks.keys()].map(id=>EV.findIndex(e=>e[8]===id)).filter(i=>i>=0));
  const clock=m=>{const h=Math.floor((m%1440)/60),mm=m%60;return (h%12||12)+':'+String(mm).padStart(2,'0')+(h<12?'am':'pm');};
  console.log('   first breakfast run departs',clock(plan.find(t=>t.meal==='Breakfast'&&!t.impossible).depart),'(should be 6:30am)');

  for(const hp of [false,true]){
    app.hidePast=hp; app.view='mine'; app.render();
    const trips=ids.main.querySelectorAll('.trip');
    const clear=trips.filter(t=>t.className.includes('clear'));
    console.log('\nhidePast='+hp+':');
    console.log('   trip blocks shown:',trips.length,'| collapsed as clear:',clear.length);
    trips.slice(0,3).forEach(t=>console.log('      '+t.querySelector('.triph').textContent));
    const dec=ids.main.querySelector('.decide');
    if(dec){
      console.log('   decisions header:',dec.querySelector('.decideh').textContent);
      dec.querySelectorAll('.deciderow').forEach(r=>{
        const b=r.querySelector('b'), sp=r.querySelector('span');
        console.log('      '+(b.textContent||'       ').padEnd(11)+sp.textContent.slice(0,72));
      });
    }
  }
},80);
