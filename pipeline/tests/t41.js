const fs=require('fs');
require('./domshim.js');
const {ids}=require('./domshim.js');
const js=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8')
  .match(/<script>([\s\S]*)<\/script>/)[1];
const app=new Function(js+'\n;return {set view(v){view=v},render,setLevel,'+
  'get EV(){return EV},get DATA(){return DATA},get hotels(){return hotels},'+
  'set listSort(v){listSort=v},set hidePast(v){hidePast=v},refMin,'+
  'get offKinds(){return offKinds}};')();
const picksHead=()=>{
  const h=ids.main.children.find(c=>c.className.startsWith('timehead')&&
    c.textContent.includes('YOUR NEXT PICKS'));
  return h?h.textContent.replace(/\s+/g,' '):'(no picks section)';
};
const picksRows=()=>{
  let on=false; const out=[];
  ids.main.children.forEach(c=>{
    if(c.className.startsWith('timehead')){ on=c.textContent.includes('YOUR NEXT PICKS'); return; }
    if(on&&c.className.startsWith('ev')){
      const h=c.innerHTML.match(/color:var\(--(\w+)\)">([^<]+)</);
      const s=c.innerHTML.match(/class="star (lv\d)/);
      out.push((s?s[1]:'lv0')+'  '+(h?h[2]:'?'));
    }
  });
  return out;
};
setTimeout(()=>{
  app.hidePast=false;
  const EV=app.EV, START=1, HOT=3;
  const n=app.refMin();
  const win=EV.map((e,i)=>i).filter(i=>EV[i][START]>=n&&EV[i][START]<n+120);
  const byHotel={};
  win.forEach(i=>{const h=app.DATA.hotels[EV[i][HOT]];(byHotel[h]=byHotel[h]||[]).push(i);});
  Object.values(byHotel).forEach((v,k)=>v.slice(0,2).forEach((i,j)=>app.setLevel(i,(k+j)%2?1:2)));

  app.view='now';
  app.listSort='interest'; app.render();
  console.log('no filter, sort=interest');
  console.log('   '+picksHead());
  picksRows().slice(0,6).forEach(r=>console.log('      '+r));

  app.listSort='place'; app.render();
  console.log('\nsort=place');
  picksRows().slice(0,6).forEach(r=>console.log('      '+r));

  app.hotels.add('HIL'); app.render();
  console.log('\nfiltered to Hilton');
  console.log('   '+picksHead());
  picksRows().forEach(r=>console.log('      '+r));

  app.hotels.clear(); app.hotels.add('PARK'); app.render();
  console.log('\nfiltered to somewhere with none of my picks');
  const em=ids.main.querySelector('.empty');
  console.log('   '+(em?em.textContent.replace(/\s+/g,' ').slice(0,120):picksHead()));
},80);
