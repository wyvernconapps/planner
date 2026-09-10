const fs=require('fs');
require('./domshim.js');
const {ids}=require('./domshim.js');
const js=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8')
  .match(/<script>([\s\S]*)<\/script>/)[1];
const app=new Function(js+'\n;return {set view(v){view=v},render,setLevel,'+
  'get EV(){return EV},set listSort(v){listSort=v},set here(v){here=v},get here(){return here},'+
  'whereAmI,minsAway,set hidePast(v){hidePast=v},get DATA(){return DATA},refMin,'+
  'get picks(){return picks},set day(v){day=v}};')();
const bands=()=>ids.main.children.filter(c=>c.className==='timehead')
  .map(c=>c.querySelector('div').textContent);
setTimeout(()=>{
  app.hidePast=false;
  const EV=app.EV, START=1, DUR=2, HOT=3;
  console.log('with nothing starred, whereAmI() =',app.whereAmI(),'(expect null)');

  // put a pick in progress right now, in the Hilton
  const n=app.refMin();
  const running=EV.map((e,i)=>i).find(i=>app.DATA.hotels[EV[i][HOT]]==='HIL'
    &&EV[i][START]<=n&&EV[i][START]+EV[i][DUR]>n);
  if(running!==undefined){
    app.setLevel(running,2);
    console.log('starred something running now in the Hilton');
    console.log('  whereAmI() =',app.whereAmI(),'(expect HIL)');
  }
  app.listSort='near'; app.view='browse'; app.day=null; app.render();
  console.log('\nBROWSE sorted by distance, headings:');
  bands().slice(0,7).forEach(b=>console.log('   '+b));
  console.log('\n  hint reads:',ids.hereHint.textContent);

  console.log('\noverride to the Westin:');
  app.here='WES'; app.render();
  console.log('  whereAmI() =',app.whereAmI());
  bands().slice(0,6).forEach(b=>console.log('   '+b));
  console.log('  hint reads:',ids.hereHint.textContent);

  console.log('\nrow shows the estimate:');
  const row=ids.main.querySelectorAll('.ev')[0];   // rows nest inside .grouped now
  const m=row&&row.innerHTML.match(/class="away">([^<]+)</);
  console.log('  ',m?m[1].trim():'(missing)');

  console.log('\nsanity: Westin->Westin should be smallest');
  console.log('  WES->WES',app.minsAway(EV.findIndex(e=>app.DATA.hotels[e[HOT]]==='WES')));
  console.log('  WES->CG ',app.minsAway(EV.findIndex(e=>app.DATA.hotels[e[HOT]]==='CG')));
},80);
