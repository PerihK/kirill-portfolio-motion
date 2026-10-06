import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';

// Run the actual gallery controller against a browser fixture that rounds scrollY.
// A 727px stage puts the last stop 0.48px beyond its mathematical boundary.
const source=await readFile(new URL('dist/app.js',import.meta.url),'utf8');
const events=new Map(),frames=new Map();let now=0,nextFrame=0,lastScrollBehavior='';
const element=()=>({style:{setProperty(){}},classList:{contains(){return false;},toggle(){}},setAttribute(){},addEventListener(){},querySelector(){return element();}});
const track={...element(),offsetTop:0,get offsetHeight(){return parseFloat(this.style.height)||0;}};
const stage={...element(),clientHeight:727};
const slides=Array.from({length:4},element),titles=Array.from({length:4},element),buttons=Array.from({length:4},(_,i)=>({...element(),dataset:{workIndex:String(i)}}));
const nodes={'#work':track,'.work-stage':stage,'.work-pagination':element(),'#project-cards':{clientHeight:400},'#work-count':element(),'.masthead':{offsetHeight:80},'#contact':{get offsetTop(){return track.offsetHeight;}}};
const ctx=vm.createContext({
 projects:['#c8ceba','#bdc7bc','#c6c6b5','#c2b8a3'].map((color,i)=>({color,name:String(i)})),lastWork:3,innerHeight:727,scrollY:0,
 $:s=>nodes[s],loadImages(){},reduced:{matches:false,addEventListener(){}},performance:{now:()=>now},
 document:{body:element(),querySelectorAll:s=>s==='.work-slide'?slides:s==='.project-title-block'?titles:buttons},
 addEventListener:(name,fn)=>{events.set(name,[...(events.get(name)||[]),fn]);},
 requestAnimationFrame:fn=>{const id=++nextFrame;frames.set(id,fn);return id;},cancelAnimationFrame:id=>frames.delete(id),
 scrollTo:({top,behavior})=>{lastScrollBehavior=behavior;ctx.scrollY=Math.round(top);for(const fn of events.get('scroll')||[])fn();}
});
vm.runInContext(source.slice(source.indexOf("const track=$('#work')"),source.indexOf('// A vertical touch gesture')),ctx);
const run=js=>vm.runInContext(js,ctx);
function advance(ms){const end=now+ms;while(now<end){now=Math.min(end,now+16);const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn(now));}}
function wheel(delta){for(const fn of events.get('wheel')||[])fn({deltaY:delta,deltaX:0,deltaMode:0,preventDefault(){}});}
run('jumpToProject(3)');advance(3000);
assert.equal(run('current'),3);assert.ok(ctx.scrollY>run('lastWork*unit'));
wheel(-120);advance(3000);assert.equal(run('current'),2,'wheel up must leave the rounded last stop');
wheel(-120);advance(3000);assert.equal(run('current'),1);
wheel(-120);advance(3000);assert.equal(run('current'),0);
wheel(120);advance(500);wheel(-120);advance(3000);assert.equal(run('current'),0,'opposite input must interrupt the ongoing flight');
for(let i=0;i<38;i++){wheel(120);advance(100);}
assert.ok(run('current')>=2,'continued wheel input must not stay consumed forever');
run('jumpToProject(1)');assert.equal(lastScrollBehavior,'smooth','gallery must use ordinary browser scrolling');advance(3000);
assert.equal(run('current'),1);
ctx.reduced.matches=true;run('jumpToProject(3)');advance(32);
assert.equal(run('current'),3);assert.equal(lastScrollBehavior,'instant');
console.log('OK: rounded last stop, reverse input, continued scrolling, native scrolling, reduced motion.');
