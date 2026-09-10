const fs=require('fs');
require('./domshim.js');
const {ids}=require('./domshim.js');
const js=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8')
  .match(/<script>([\s\S]*)<\/script>/)[1];
const mk=()=>new Function(js+'\n;return {set view(v){view=v},render,setLevel,'+
  'get EV(){return EV},get picks(){return picks},set picks(v){picks=v},'+
  'set myName(v){myName=v},get myName(){return myName},get friends(){return friends},'+
  'set friends(v){friends=v},shareLink,importFromHash,alsoStarred,sharedCount,'+
  'set hidePast(v){hidePast=v},set onlyShared(v){onlyShared=v}};')();

const lauren=mk(), eric=mk();
setTimeout(()=>{
  const EV=lauren.EV, START=1, ID=8;
  const sat=EV.map((e,i)=>i).filter(i=>Math.floor(EV[i][START]/1440)===3);

  // Eric builds his list on his phone
  eric.myName='Eric';
  [sat[0],sat[3],sat[7],sat[12]].forEach((i,k)=>eric.setLevel(i,k<2?2:1));
  const ericLink=eric.shareLink();
  console.log("Eric's link:",ericLink.slice(0,84)+'...');
  console.log('  carries his name:',ericLink.includes('&n=Eric'));

  // Lauren has her own list, overlapping on two
  lauren.myName='Lauren'; lauren.hidePast=false;
  [sat[0],sat[3],sat[20],sat[25],sat[30]].forEach((i,k)=>lauren.setLevel(i,k===0?2:1));
  console.log('\nLauren has',lauren.picks.size,'picks | Eric shared 4');

  globalThis.location.hash=ericLink.slice(ericLink.indexOf('#'));
  const merged=lauren.importFromHash();
  console.log('\nafter importing his link:');
  console.log('  merged into her own picks:',merged,'(must be 0)');
  console.log('  her picks unchanged      :',lauren.picks.size===5);
  console.log('  friends stored           :',lauren.friends.map(f=>f.name).join(', '));
  console.log('  panels both starred      :',lauren.sharedCount());
  console.log('  overlap is correct       :',lauren.sharedCount()===2);

  lauren.view='mine'; lauren.render();
  const badges=[];
  ids.main.querySelectorAll('.ev').forEach(r=>{
    const m=r.innerHTML.match(/class="mate">([^<]+)</);
    const t=r.querySelector('.evtitle');
    if(m) badges.push(m[1]+'  \u2014  '+(t?t.textContent:'').slice(0,40));
  });
  console.log('\n  rows badged with his name:');
  badges.forEach(b=>console.log('     '+b));

  console.log('\n  "show only shared" filter:');
  lauren.onlyShared=true; lauren.render();
  const rows=ids.main.querySelectorAll('.ev').length;
  console.log('     rows shown:',rows,'(expect 2)');

  // his own device must not treat his own link as a friend
  globalThis.location.hash=ericLink.slice(ericLink.indexOf('#'));
  const self=eric.importFromHash();
  console.log('\n  Eric opening his own link: friends =',eric.friends.length,'(must be 0)');
},80);
