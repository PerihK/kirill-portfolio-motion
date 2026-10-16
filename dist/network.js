(() => {
  'use strict';
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const canvases=[...document.querySelectorAll('canvas[data-network]')];
  let frameId=0,lastFrame=0;
  const fields=canvases.map((canvas,index)=>{
    const ctx=canvas.getContext('2d',{alpha:true});
    let seed=173+index*91;
    const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    return ctx?{canvas,ctx,random,visible:false,width:0,height:0,points:[],pointer:{x:0,y:0,active:false}}:null;
  }).filter(Boolean);
  if(!fields.length)return;

  function resize(field){
    const section=field.canvas.parentElement;
    field.width=section.clientWidth;field.height=section.clientHeight;
    const ratio=Math.min(devicePixelRatio||1,1.5);
    field.canvas.width=Math.round(field.width*ratio);field.canvas.height=Math.round(field.height*ratio);
    field.ctx.setTransform(ratio,0,0,ratio,0,0);
    field.pointer.active=false;
    const {random,points}=field;
    const total=Math.max(12,Math.min(58,Math.round(field.width*field.height/15000)));
    while(points.length<total)points.push({x:random()*field.width,y:random()*field.height,vx:(random()-.5)*.28,vy:(random()-.5)*.28});
    if(points.length>total)points.length=total;
    for(const p of points){p.x=Math.max(0,Math.min(field.width,p.x));p.y=Math.max(0,Math.min(field.height,p.y));}
    draw(field,0);
  }
  function draw(field,elapsed){
    const {ctx,width,height,pointer,points}=field;
    const step=elapsed/(1000/60);
    ctx.clearRect(0,0,width,height);
    for(const p of points){
      if(step&&!motion.matches){
        p.x+=p.vx*step;p.y+=p.vy*step;
        if(p.x<0||p.x>width)p.vx*=-1;
        if(p.y<0||p.y>height)p.vy*=-1;
        if(pointer.active){
          const dx=pointer.x-p.x,dy=pointer.y-p.y,distance=Math.hypot(dx,dy);
          // Fixed, slow attraction: speed never grows with cursor distance.
          if(distance<190&&distance>.01){p.x+=dx/distance*.35*step;p.y+=dy/distance*.35*step;}
        }
      }
    }
    for(let i=0;i<points.length;i++){
      const a=points[i];
      for(let j=i+1;j<points.length;j++){
        const b=points[j],distance=Math.hypot(a.x-b.x,a.y-b.y);
        if(distance>=132)continue;
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
        ctx.strokeStyle=`rgba(150,190,255,${(.22*(1-distance/132)).toFixed(3)})`;
        ctx.lineWidth=1;ctx.stroke();
      }
      const distance=pointer.active?Math.hypot(pointer.x-a.x,pointer.y-a.y):Infinity;
      if(distance<190){
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(pointer.x,pointer.y);
        ctx.strokeStyle=`rgba(41,151,255,${(.62*(1-distance/190)).toFixed(3)})`;ctx.lineWidth=1;ctx.stroke();
      }
    }
    for(const p of points){
      ctx.beginPath();ctx.arc(p.x,p.y,1.5,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,.72)';ctx.fill();
    }
  }
  function start(){
    if(frameId||motion.matches||document.hidden||!fields.some(f=>f.visible))return;
    lastFrame=performance.now();frameId=requestAnimationFrame(tick);
  }
  function tick(now){
    frameId=0;
    if(motion.matches||document.hidden||!fields.some(f=>f.visible))return;
    const elapsed=Math.min(40,now-lastFrame);lastFrame=now;
    for(const field of fields){if(field.visible)draw(field,elapsed);}
    frameId=requestAnimationFrame(tick);
  }
  function release(){for(const field of fields)field.pointer.active=false;}
  // Listen above the canvas so period controls, links and chat remain clickable.
  addEventListener('pointermove',event=>{
    if(event.pointerType==='touch'||motion.matches)return;
    for(const field of fields){
      if(!field.visible){field.pointer.active=false;continue;}
      const rect=field.canvas.parentElement.getBoundingClientRect();
      const x=event.clientX-rect.left,y=event.clientY-rect.top;
      field.pointer={x,y,active:x>=0&&x<=rect.width&&y>=0&&y<=rect.height};
    }
  },{passive:true});
  addEventListener('pointerout',event=>{if(!event.relatedTarget)release();},{passive:true});
  addEventListener('blur',release);
  addEventListener('scroll',release,{passive:true});
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries){const field=fields.find(f=>f.canvas===entry.target);field.visible=entry.isIntersecting;if(!field.visible)field.pointer.active=false;}
    start();
  },{rootMargin:'80px 0px',threshold:0});
  const sizeObserver=new ResizeObserver(entries=>{for(const entry of entries){const field=fields.find(f=>f.canvas.parentElement===entry.target);if(field)resize(field);}});
  for(const field of fields){resize(field);observer.observe(field.canvas);sizeObserver.observe(field.canvas.parentElement);}
  function refresh(){cancelAnimationFrame(frameId);frameId=0;release();for(const field of fields)draw(field,0);start();}
  motion.addEventListener('change',refresh);
  document.addEventListener('visibilitychange',refresh);
  addEventListener('pagehide',()=>{cancelAnimationFrame(frameId);frameId=0;release();});
  addEventListener('pageshow',start);
})();
