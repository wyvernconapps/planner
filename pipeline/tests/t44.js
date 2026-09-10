const fs=require('fs');
require('./domshim.js');
const {ids}=require('./domshim.js');
const js=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8')
  .match(/<script>([\s\S]*)<\/script>/)[1];
const app=new Function(js+'\n;return {set view(v){view=v},render,get EV(){return EV},'+
  'get hotels(){return hotels},get DATA(){return DATA},set hidePast(v){hidePast=v},'+
  'set day(v){day=v},hotelLabel,roomOf};')();
setTimeout(()=>{
  app.hidePast=false; app.view='browse'; app.render();
  console.log('hotel chips:');
  ids.hotels.children.forEach(c=>console.log('   '+c.textContent+
    (c.dataset.members?'   -> '+c.dataset.members:'')));

  const other=ids.hotels.children.find(c=>c.dataset.hotel==='OTHER');
  other.onclick(); app.render();
  console.log('\nafter tapping Other:');
  console.log('   filter set   :',[...app.hotels].join(', '));
  console.log('   count line   :',ids.count.textContent);
  console.log('   chip pressed :',other.getAttribute('aria-pressed'));

  const EV=app.EV;
  const rows=ids.main.querySelectorAll('.ev').slice(0,4);
  console.log('\n   rows still name the real venue:');
  rows.forEach(r=>{const m=r.innerHTML.match(/color:var\(--(\w+)\)">([^<]+)</);
    if(m) console.log('      '+m[2]);});

  other.onclick();
  const cg=ids.hotels.children.find(c=>c.dataset.hotel==='CG');
  cg.onclick(); app.render();
  console.log('\nCourtland selected:');
  console.log('   count line:',ids.count.textContent);
  const r=ids.main.querySelectorAll('.ev')[0];
  const m=r&&r.innerHTML.match(/color:var\(--(\w+)\)">([^<]+)</);
  console.log('   row reads :',m?m[2]:'?');
  console.log('   grid divider check:');
  app.day='Sat'; app.view='grid'; app.render();
  const f=ids.main.querySelector('.gflabel');
  console.log('      '+(f?f.textContent:'?'));
},80);
