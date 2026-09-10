const fs=require('fs');
require('./domshim.js');
const {ids}=require('./domshim.js');
const js=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8')
  .match(/<script>([\s\S]*)<\/script>/)[1];
const app=new Function(js+'\n;return {set view(v){view=v},render,setLevel,'+
  'get EV(){return EV},set hidePast(v){hidePast=v},get picks(){return picks},'+
  'set picks(v){picks=v},get DATA(){return DATA}};')();
const decisions=()=>{
  const d=ids.main.querySelector('.decide'); if(!d) return ['(none)'];
  return d.querySelectorAll('.deciderow').map(r=>
    (r.querySelector('b').textContent||'      ').padEnd(11)+r.querySelector('span').textContent.slice(0,66));
};
setTimeout(()=>{
  app.hidePast=false;
  const EV=app.EV, START=1;
  // her situation: lots of maybes, a couple of must-sees
  const sat=EV.map((e,i)=>i).filter(i=>Math.floor(EV[i][START]/1440)===3);
  sat.slice(0,90).forEach(i=>app.setLevel(i,1));
  app.view='mine'; app.render();
  console.log('90 INTERESTED, NOTHING COMMITTED:');
  decisions().forEach(x=>console.log('   '+x));

  // now commit to two that genuinely cannot be walked between
  console.log('\nNOW COMMIT TO TWO THAT CLASH ON DISTANCE:');
  app.picks=new Map();
  const a=sat.find(i=>app.DATA.hotels[EV[i][3]]==='WES');
  const aEnd=EV[a][START]+EV[a][2];
  const b=sat.find(i=>app.DATA.hotels[EV[i][3]]==='CG'&&EV[i][START]>=aEnd&&EV[i][START]<aEnd+15);
  if(a!=null&&b!=null){
    app.setLevel(a,2); app.setLevel(b,2);
    app.render();
    console.log('   Westin '+EV[a][0].slice(0,26)+' -> Courtland '+EV[b][0].slice(0,26));
    decisions().forEach(x=>console.log('   '+x));
  } else console.log('   (no such pair in the data)');
},80);
