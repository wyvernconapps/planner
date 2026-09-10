const fs=require('fs');
require('./domshim.js');
const {ids}=require('./domshim.js');
const js=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8')
  .match(/<script>([\s\S]*)<\/script>/)[1];
const app=new Function(js+'\n;return {set view(v){view=v},render,get days(){return days},'+
  'get day(){return day},get hotels(){return hotels},set hidePast(v){hidePast=v},'+
  'get EV(){return EV},refMin};')();
setTimeout(()=>{
  app.hidePast=false;
  app.view='grid'; app.render();
  console.log('days set   :',[...app.days].join(',')||'(empty)');
  console.log('grid day   :',app.day);
  console.log('hotels     :',[...app.hotels].join(','));
  console.log('count line :',ids.count.textContent);
  console.log('nodes      :',ids.main.children.length);
  const em=ids.main.querySelector('.empty');
  if(em) console.log('empty state:',em.textContent.slice(0,90));
  console.log('\nnow selecting Saturday explicitly:');
  app.days.clear(); app.days.add('Sat'); app.render();
  console.log('   grid day:',app.day,'| count:',ids.count.textContent,
    '| nodes:',ids.main.children.length);
},80);
