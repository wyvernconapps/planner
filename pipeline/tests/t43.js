const fs=require('fs');
require('./domshim.js');
const js=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8')
  .match(/<script>([\s\S]*)<\/script>/)[1];
const mk=()=>new Function(js+'\n;return {setLevel,shareLink,importFromHash,'+
  'set myName(v){myName=v},get friends(){return friends},get EV(){return EV},'+
  'get picks(){return picks},set picks(v){picks=v}};')();
const lauren=mk(), eric=mk();
setTimeout(()=>{
  const send=(from,name,idxs)=>{
    from.myName=name; from.picks=new Map();
    idxs.forEach(i=>from.setLevel(i,2));
    const url=from.shareLink();
    globalThis.location.hash=url.slice(url.indexOf('#'));
    lauren.importFromHash();
  };
  lauren.myName='Lauren';
  send(eric,'Eric',[2,5,9]);
  console.log('after his first link :',lauren.friends.map(f=>f.name+' ('+Object.keys(f.picks).length+' picks)'));
  send(eric,'Eric',[2,5,9,14,20,25]);
  console.log('after his updated one:',lauren.friends.map(f=>f.name+' ('+Object.keys(f.picks).length+' picks)'));
  console.log('  -> one entry, replaced not merged:',lauren.friends.length===1);

  console.log('\nedge cases:');
  send(eric,'eric',[2,5]);
  console.log('  lowercase "eric"   :',lauren.friends.map(f=>f.name),'-> entries:',lauren.friends.length);
  send(eric,'Eric ',[2,5]);
  console.log('  trailing space     :',JSON.stringify(lauren.friends.map(f=>f.name)),'-> entries:',lauren.friends.length);
  send(eric,'Eric R',[2,5]);
  console.log('  different spelling :',lauren.friends.map(f=>f.name),'-> entries:',lauren.friends.length);
},80);
