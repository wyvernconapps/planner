/* Minimal DOM good enough to run the app for real.
   node --check only parses; it cannot catch a const reassignment or a
   temporal-dead-zone read. This executes every view instead. */

class El {
  constructor(tag='div'){
    this.tagName=tag.toUpperCase(); this.children=[]; this.parent=null;
    this._cls=new Set(); this.dataset={}; this.attrs={};
    this._text=''; this.style={setProperty(){},removeProperty(){}};
    this.onclick=null; this.hidden=false; this.title=''; this.value='';
    this.offsetHeight=180; this.scrollLeft=0;
    this.clientWidth=380; this.scrollWidth=380;
  }
  get className(){ return [...this._cls].join(' '); }
  set className(v){ this._cls=new Set(String(v).split(/\s+/).filter(Boolean)); }
  get classList(){ const c=this._cls; return {
    add:(...x)=>x.forEach(v=>c.add(v)),
    remove:(...x)=>x.forEach(v=>c.delete(v)),
    contains:x=>c.has(x),
    toggle:(x,f)=>{ const on=f===undefined?!c.has(x):f; on?c.add(x):c.delete(x); return on; }
  };}
  get textContent(){
    return this._text || this.children.map(c=>c.textContent).join('');
  }
  set textContent(v){ this._text=String(v); this.children=[]; }
  get innerHTML(){ return this._html||''; }
  set innerHTML(v){
    this._html=String(v); this.children=[]; this._text='';
    /* real nesting, so querySelector('.seg button') behaves like a browser */
    const VOIDT=new Set(['br','img','input','meta','link','hr','source']);
    const stack=[this];
    const re=/<(\/?)(\w+)((?:[^>"']|"[^"]*"|'[^']*')*)>|([^<]+)/g;
    let m;
    while((m=re.exec(String(v)))){
      const [,close,tag,attrs,text]=m;
      const top=stack[stack.length-1];
      if(text!==undefined){
        const t=text.replace(/&[a-z]+;|&#\d+;/g,x=>({'&amp;':'&','&lt;':'<','&gt;':'>',
          '&quot;':'"','&middot;':'\u00b7','&ndash;':'\u2013','&rarr;':'\u2192',
          '&mdash;':'\u2014'}[x]||x));
        if(t.trim()){ const n=new El('#text'); n._text=t; n.parent=top; top.children.push(n); }
        continue;
      }
      if(close){ if(stack.length>1&&stack[stack.length-1].tagName===tag.toUpperCase()) stack.pop();
        continue; }
      const e=new El(tag);
      const get=k=>{ const r=new RegExp(k+'="([^"]*)"').exec(attrs||''); return r?r[1]:null; };
      const cls=get('class'); if(cls) e.className=cls;
      const id=get('id'); if(id){ e.attrs.id=id; e.id=id; }
      (attrs||'').replace(/data-([\w-]+)="([^"]*)"/g,(_,k,val)=>{
        e.dataset[k.replace(/-(\w)/g,(_,c)=>c.toUpperCase())]=val; return ''; });
      const al=get('aria-label'); if(al) e.attrs['aria-label']=al;
      e.parent=top; top.children.push(e);
      if(!VOIDT.has(tag.toLowerCase())&&!(attrs||'').trim().endsWith('/')) stack.push(e);
    }
  }
  appendChild(c){
    if(c._isFragment){ c.children.forEach(k=>{k.parent=this;this.children.push(k);});
      c.children=[]; return c; }
    c.parent=this; this.children.push(c); return c;
  }
  prepend(c){ c.parent=this; this.children.unshift(c); return c; }
  after(c){ const p=this.parent; if(!p) return c;
    p.children.splice(p.children.indexOf(this)+1,0,c); c.parent=p; return c; }
  before(c){ const p=this.parent; if(!p) return c;
    p.children.splice(p.children.indexOf(this),0,c); c.parent=p; return c; }
  setAttribute(k,v){ this.attrs[k]=String(v); }
  getAttribute(k){ return this.attrs[k]??null; }
  removeAttribute(k){ delete this.attrs[k]; }
  remove(){ const p=this.parent; if(p) p.children=p.children.filter(c=>c!==this); }
  addEventListener(){}
  _walk(out=[]){ for(const c of this.children){ out.push(c); c._walk(out); } return out; }
  _match(sel){
    sel=sel.trim();
    if(sel.startsWith('.')) return this._cls.has(sel.slice(1));
    if(sel.startsWith('#')) return this.id===sel.slice(1);
    if(sel.includes('[')){
      const [base,attr]=sel.split('[');
      const [k,v]=attr.replace(']','').split('=');
      const want=v?v.replace(/"/g,''):null;
      const ok=k.startsWith('data-')
        ? this.dataset[k.slice(5).replace(/-(\w)/g,(_,c)=>c.toUpperCase())]===want
        : this.attrs[k]===want;
      return ok && (!base || this._match(base));
    }
    return this.tagName===sel.toUpperCase();
  }
  querySelectorAll(sel){
    const parts=sel.split(/\s+/).filter(Boolean);
    let pool=this._walk();
    if(parts.length===1) return pool.filter(e=>e._match(parts[0]));
    const heads=pool.filter(e=>e._match(parts[0]));
    const out=[];
    heads.forEach(h=>h._walk().forEach(e=>{ if(e._match(parts[1])) out.push(e); }));
    return out;
  }
  querySelector(sel){ return this.querySelectorAll(sel)[0]||null; }
}

const root=new El('body');
const ids={};
function mk(id,tag='div',parent=root){
  const e=new El(tag); e.id=id; ids[id]=e; parent.appendChild(e); return e;
}

/* Build the element list from the real HTML rather than a hardcoded list.
   A stub that invents elements the page does not have will happily let a
   null-reference bug through - which is how a reference to a non-existent
   "hereRow" survived a passing test run. */
const fs=require('fs');
const HTML=fs.readFileSync(require('path').join(__dirname,'..','..','index.html'),'utf8');
const realIds=[...HTML.matchAll(/<(\w+)[^>]*\bid="([^"]+)"/g)].map(m=>[m[2],m[1]]);
realIds.forEach(([id,tag])=>mk(id,tag));

/* nav and the sheet scrim are addressed by selector, not id */
const nav=new El('nav'); root.appendChild(nav);
['now','browse','grid','mine'].forEach(v=>{
  const b=new El('button'); b.dataset.view=v; nav.appendChild(b);
});
if(ids['sheet']){
  const scrim=new El('div'); scrim.className='scrim'; ids['sheet'].appendChild(scrim);
}
['trackPanel','tripPanel','kindPanel'].forEach(id=>{
  if(ids[id]) ids[id].dataset.open='0';
});

globalThis.document={
  getElementById:id=>ids[id]||null,
  createElement:t=>new El(t),
  createTextNode:t=>{ const e=new El('#text'); e.textContent=String(t); return e; },
  createDocumentFragment:()=>{
    const f=new El('#fragment');
    /* a real fragment empties itself into its new parent */
    f._isFragment=true;
    return f;
  },
  querySelector:s=>root.querySelector(s),
  querySelectorAll:s=>root.querySelectorAll(s),
  documentElement:{style:{setProperty(){},removeProperty(){}}},
  body:root
};
globalThis.window={addEventListener(){},scrollTo(){},storage:null,scrollY:0,pageYOffset:0};
globalThis.requestAnimationFrame=fn=>fn();
globalThis.setInterval=()=>0;
globalThis.localStorage={_d:{},getItem(k){return this._d[k]??null;},
  setItem(k,v){this._d[k]=v;},removeItem(k){delete this._d[k];}};
globalThis.addEventListener=()=>{};
globalThis.location={origin:'https://wyvernconapps.github.io',
  pathname:'/planner/',hash:'',href:'https://wyvernconapps.github.io/planner/'};
globalThis.history={replaceState(){}};
globalThis.navigator={clipboard:{writeText:()=>Promise.resolve()}};
globalThis.setTimeout=globalThis.setTimeout;

module.exports={root,ids,El,nav,realIds};
