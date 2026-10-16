(() => {
  'use strict';
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const canvases=[...document.querySelectorAll('canvas[data-network]')];
  let frameId=0,lastFrame=0;
  const edges=[[0,1],[0,2],[0,4],[1,2],[1,3],[2,3],[2,4],[3,4],[3,5],[4,5]];
  const form=[[0,-116],[-24,-63],[17,-28],[-17,21],[39,73],[-6,140]];
  const fields=canvases.map((canvas,index)=>{
    const ctx=canvas.getContext('2d',{alpha:true});
    return ctx?{canvas,ctx,index,visible:false,time:index*17000,width:0,height:0,groups:[],stars:[]}:null;
  }).filter(Boolean);
  if(!fields.length)return;

  function resize(field){
    const section=field.canvas.parentElement;
    field.width=section.clientWidth;field.height=section.clientHeight;
    const ratio=Math.min(devicePixelRatio||1,1.5);
    field.canvas.width=Math.round(field.width*ratio);field.canvas.height=Math.round(field.height*ratio);
    field.ctx.setTransform(ratio,0,0,ratio,0,0);
    const anchors=field.width<650?[[.025,.2],[.98,.76]]:[[.04,.21],[.95,.18],[.965,.7],[.035,.83]];
    field.groups=anchors.map(([x,y],group)=>form.map(([dx,dy],i)=>({
      x:x*field.width+dx*(group%2?-1:1),y:y*field.height+dy,
      phase:group*1.8+i*1.37+field.index*.9,
      range:10+(i%3)*8,radius:i===0?1.25:.85+(i%2)*.25
    })));
    let seed=173+field.index*91;
    const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    field.stars=Array.from({length:field.width<650?9:19},()=>({x:random()*field.width,y:random()*field.height,radius:.65+random()*.6,phase:random()*6.28}));
    draw(field);
  }
  function draw(field){
    const {ctx,width,height,time}=field;
    ctx.clearRect(0,0,width,height);
    const t=time*.00012;
    for(const [groupIndex,group] of field.groups.entries()){
      const positions=group.map(p=>({x:p.x+Math.sin(t+p.phase)*p.range,y:p.y+Math.cos(t*.72+p.phase)*p.range*.9}));
      for(const [i,j] of edges){
        const a=positions[i],b=positions[j];
        const distance=Math.hypot(a.x-b.x,a.y-b.y);
        const opacity=(i===2&&j===4?.37:.20)*Math.max(.3,1-distance/440);
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
        ctx.strokeStyle=`rgba(${groupIndex%2?'65,112,157':'42,129,195'},${opacity})`;
        ctx.lineWidth=i===2&&j===4?1:.7;ctx.stroke();
      }
      positions.forEach((p,i)=>{ctx.beginPath();ctx.arc(p.x,p.y,group[i].radius,0,Math.PI*2);ctx.fillStyle=`rgba(216,229,241,${.45+Math.sin(t*.6+group[i].phase)*.12})`;ctx.fill();});
    }
    for(const star of field.stars){
      ctx.beginPath();ctx.arc(star.x+Math.sin(t*.35+star.phase)*5,star.y+Math.cos(t*.3+star.phase)*4,star.radius,0,Math.PI*2);
      ctx.fillStyle=`rgba(214,227,240,${.28+Math.sin(t*.5+star.phase)*.12})`;ctx.fill();
    }
  }
  function start(){
    if(frameId||motion.matches||document.hidden||!fields.some(f=>f.visible))return;
    lastFrame=performance.now();frameId=requestAnimationFrame(tick);
  }
  function tick(now){
    frameId=0;
    if(motion.matches||document.hidden||!fields.some(f=>f.visible))return;
    if(now-lastFrame>=1000/30){const elapsed=Math.min(70,now-lastFrame);lastFrame=now;for(const field of fields){if(!field.visible)continue;field.time+=elapsed;draw(field);}}
    frameId=requestAnimationFrame(tick);
  }
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries){const field=fields.find(f=>f.canvas===entry.target);field.visible=entry.isIntersecting;if(field.visible)draw(field);}
    start();
  },{rootMargin:'80px 0px',threshold:0});
  const sizeObserver=new ResizeObserver(entries=>{for(const entry of entries){const field=fields.find(f=>f.canvas.parentElement===entry.target);if(field)resize(field);}});
  for(const field of fields){resize(field);observer.observe(field.canvas);sizeObserver.observe(field.canvas.parentElement);}
  function refresh(){cancelAnimationFrame(frameId);frameId=0;for(const field of fields)draw(field);start();}
  motion.addEventListener('change',refresh);
  document.addEventListener('visibilitychange',refresh);
  addEventListener('pagehide',()=>{cancelAnimationFrame(frameId);frameId=0;});
  addEventListener('pageshow',start);
})();
