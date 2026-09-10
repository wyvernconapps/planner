const fs=require('fs');
require('./domshim.js');
const {ids}=require('./domshim.js');
const js=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8')
  .match(/<script>([\s\S]*)<\/script>/)[1];
const app=new Function(js+'\n;return {set view(v){view=v},render,set listSort(v){listSort=v},'+
  'get here(){return here},set here(v){here=v},whereAmI,get HOTEL_ORDER(){return HOTEL_ORDER},'+
  'set hidePast(v){hidePast=v},minsAway,get EV(){return EV},get DATA(){return DATA}};')();
setTimeout(()=>{
  app.hidePast=false;
  console.log('chip order (should read like the walk):');
  app.view='browse'; app.render();
  console.log('   '+ids.hotels.children.map(c=>c.textContent.replace(/📍/,'')).join(' · '));
  console.log('\nHOTEL_ORDER used by Place sort and the Grid:');
  console.log('   '+app.HOTEL_ORDER.join(' > '));

  const pins=ids.hotels.querySelectorAll('.pin');
  console.log('\npins: '+pins.length+' (one per real hotel, none on All/Online/Other)');
  console.log('   on:',pins.map(p=>p.dataset.pin).join(', '));

  app.listSort='near'; app.render();
  console.log('\nDistance sort:');
  console.log('   hint:',ids.hereHint.textContent);
  console.log('   hotels row has .pinning:',ids.hotels.classList.contains('pinning'));
  const cg=pins.find(p=>p.dataset.pin==='CG');
  cg.onclick({stopPropagation(){}});
  app.render();
  console.log('   after tapping the Courtland pin:');
  console.log('      here =',app.here,'| whereAmI =',app.whereAmI());
  console.log('      hint:',ids.hereHint.textContent);
  console.log('      pin lit:',ids.hotels.querySelectorAll('.pin').find(p=>p.dataset.pin==='CG').classList.contains('on'));
  const hil=app.EV.findIndex(e=>app.DATA.hotels[e[3]]==='HIL');
  console.log('      Courtland -> Hilton walk:',app.minsAway(hil),'min');
  cg.onclick({stopPropagation(){}});
  console.log('   tapping again clears it:',app.here===null);

  app.listSort='time'; app.render();
  console.log('\nback in Time sort, pins hidden:',!ids.hotels.classList.contains('pinning'));
},80);
