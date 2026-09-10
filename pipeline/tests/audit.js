const fs=require('fs');
require('./domshim.js');
const {ids,root}=require('./domshim.js');
const js=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8')
  .match(/<script>([\s\S]*)<\/script>/)[1];
const app=new Function(js+'\n;return {set view(v){view=v},render,setLevel,openSheet,'+
  'get EV(){return EV},set listSort(v){listSort=v},set hidePast(v){hidePast=v},'+
  'get trip(){return trip},toggleWatch,dctvOf,get picks(){return picks}};')();
let fails=0;
const go=(what,fn)=>{ try{ fn(); }catch(e){ fails++;
  console.log('  THREW  '+what+'  ->  '+e.constructor.name+': '+e.message); } };

setTimeout(()=>{
  app.hidePast=false;
  console.log('Clicking every control in every view:\n');
  for(const v of ['now','browse','grid','mine']){
    app.view=v; go('render '+v,()=>app.render());
    // header controls
    ['clearBtn','sortBtn','pastBtn','trackBtn','kindBtn','tripBtn','toTop',
     'tpAll','tpNone','kpAll','kpNone','tReset'].forEach(id=>{
      const el=ids[id];
      if(el&&el.onclick) go(v+' #'+id,()=>{ el.onclick(); app.render(); });
    });
    // every chip
    [...ids.days.children,...ids.hotels.children].forEach((c,n)=>{
      if(c.onclick) go(v+' chip'+n,()=>{ c.onclick(); app.render(); });
    });
    ids.hotels.querySelectorAll('.pin').forEach(p=>{
      go(v+' pin',()=>{ p.onclick({stopPropagation(){}}); app.render(); });
    });
    [...ids.tgrid.children.slice(0,3),...ids.kgrid.children].forEach(c=>{
      if(c.onclick) go(v+' filterchip',()=>{ c.onclick(); app.render(); });
    });
    // trip settings
    ['tOn','tDctv'].forEach(id=>{ if(ids[id]&&ids[id].onchange)
      go(v+' '+id,()=>{ ids[id].checked=true; ids[id].onchange({target:ids[id]}); }); });
    ['tTravel','tHome','tBuf','tB1','tB2','tD1','tD2'].forEach(id=>{
      if(ids[id]&&ids[id].oninput) go(v+' '+id,()=>{
        ids[id].value='60'; ids[id].oninput({target:{value:'60'}}); }); });
    ids.tPark.children.forEach(b=>{ if(b.onclick) go(v+' park',()=>b.onclick()); });
    // rows: star, expand, seg buttons, watch
    ids.main.querySelectorAll('.ev').slice(0,6).forEach(r=>{
      const st=r.querySelector('.star');
      if(st) go(v+' star',()=>st.onclick({stopPropagation(){}}));
      const bd=r.querySelector('.evbody');
      if(bd) go(v+' expand',()=>bd.onclick());
      r.querySelectorAll('.seg button').forEach(b=>
        go(v+' seg',()=>b.onclick({stopPropagation(){}})));
      r.querySelectorAll('.watchbtn').forEach(b=>
        go(v+' watch',()=>b.onclick({stopPropagation(){}})));
    });
    go(v+' rerender',()=>app.render());
  }
  // the sheet, for several event kinds
  const EV=app.EV;
  const pick=f=>EV.findIndex(f);
  [pick(e=>true), pick((e,i)=>app.dctvOf(i)), pick(e=>e[6]&&e[6].includes(','))]
    .filter(i=>i>=0).forEach(i=>{
      go('openSheet',()=>app.openSheet(i));
      ['sStar','sClose','sDrop'].forEach(id=>{
        const b=ids.sheetCard.querySelector('#'+id);
        if(b&&b.onclick) go('sheet #'+id,()=>b.onclick());
      });
      ids.sheetCard.querySelectorAll('.watchbtn').forEach(b=>
        go('sheet watch',()=>b.onclick()));
    });
  // sort modes across views
  for(const m of ['time','interest','place','near']){
    app.listSort=m;
    for(const v of ['now','browse']){ app.view=v; go(m+'/'+v,()=>app.render()); }
  }
  console.log(fails?`\n${fails} FAILURE(S)`:'\nEvery control fired without throwing.');
},80);
