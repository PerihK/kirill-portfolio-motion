(() => {
  'use strict';
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const linkDistance=132,pointerDistance=190;
  const fields=[...document.querySelectorAll('canvas[data-network]')].map(canvas=>{
    const ctx=canvas.getContext('2d');
    return ctx?{canvas,ctx,points:[],width:0,height:0,ready:false,visible:false,pointer:{x:-9999,y:-9999,active:false}}:null;
  }).filter(Boolean);
  let frameId=0;
  if(!fields.length)return;

  function resize(field){
    const rect=field.canvas.getBoundingClientRect();
    if(rect.width<1||rect.height<1)return;
    field.width=rect.width;field.height=rect.height;
    const ratio=Math.min(2,devicePixelRatio||1);
    field.canvas.width=Math.round(field.width*ratio);field.canvas.height=Math.round(field.height*ratio);
    field.ctx.setTransform(ratio,0,0,ratio,0,0);
    const count=Math.max(12,Math.min(58,Math.round(field.width*field.height/15000)));
    while(field.points.length<count)field.points.push({x:Math.random()*field.width,y:Math.random()*field.height,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28});
    if(field.points.length>count)field.points.length=count;
    for(const p of field.points){if(p.x>field.width)p.x=field.width;if(p.y>field.height)p.y=field.height;}
    field.ready=true;draw(field,false);
  }
  function draw(field,advance=true){
    if(!field.ready)return;
    const {ctx,width,height,points,pointer}=field;
    ctx.clearRect(0,0,width,height);
    if(advance&&!motion.matches){
      // Match the reference's per-frame drift and constant-speed attraction.
      // No orbit targets, home springs, collision forces or capture/link caps.
      for(const p of points){
        p.x+=p.vx;p.y+=p.vy;
        if(p.x<0||p.x>width)p.vx*=-1;
        if(p.y<0||p.y>height)p.vy*=-1;
        if(pointer.active){
          const dx=pointer.x-p.x,dy=pointer.y-p.y,distance=Math.hypot(dx,dy);
          if(distance<pointerDistance&&distance>.01){p.x+=dx/distance*.35;p.y+=dy/distance*.35;}
        }
      }
    }
    for(let i=0;i<points.length;i++){
      for(let j=i+1;j<points.length;j++){
        const a=points[i],b=points[j],distance=Math.hypot(a.x-b.x,a.y-b.y);
        if(distance<linkDistance){
          ctx.strokeStyle='rgba(150,190,255,'+(.22*(1-distance/linkDistance)).toFixed(3)+')';
          ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
        }
      }
    }
    if(pointer.active){
      for(const p of points){
        const distance=Math.hypot(pointer.x-p.x,pointer.y-p.y);
        if(distance<pointerDistance){
          ctx.strokeStyle='rgba(41,151,255,'+(.62*(1-distance/pointerDistance)).toFixed(3)+')';
          ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pointer.x,pointer.y);ctx.lineTo(p.x,p.y);ctx.stroke();
        }
      }
    }
    for(const p of points){
      ctx.fillStyle='rgba(255,255,255,0.72)';ctx.beginPath();ctx.arc(p.x,p.y,1.5,0,6.2832);ctx.fill();
    }
  }
  function start(){
    if(frameId||motion.matches||document.hidden||!fields.some(f=>f.visible))return;
    frameId=requestAnimationFrame(tick);
  }
  function tick(){
    frameId=0;
    if(motion.matches||document.hidden||!fields.some(f=>f.visible))return;
    for(const field of fields){if(field.visible)draw(field);}
    frameId=requestAnimationFrame(tick);
  }
  function release(field){field.pointer={x:-9999,y:-9999,active:false};}
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries){const field=fields.find(f=>f.canvas.parentElement===entry.target);field.visible=entry.isIntersecting;}
    start();
  },{rootMargin:'120px',threshold:0});
  const sizeObserver=new ResizeObserver(entries=>{for(const entry of entries){const field=fields.find(f=>f.canvas===entry.target);if(field)resize(field);}});
  for(const field of fields){
    const section=field.canvas.parentElement;
    section.addEventListener('pointermove',event=>{
      if(event.pointerType==='touch'||motion.matches){release(field);return;}
      const rect=field.canvas.getBoundingClientRect();
      field.pointer={x:event.clientX-rect.left,y:event.clientY-rect.top,active:true};
    },{passive:true});
    section.addEventListener('pointerleave',()=>release(field),{passive:true});
    section.addEventListener('pointercancel',()=>release(field),{passive:true});
    resize(field);sizeObserver.observe(field.canvas);observer.observe(section);
  }
  function refresh(){cancelAnimationFrame(frameId);frameId=0;for(const field of fields){if(motion.matches)release(field);draw(field,false);}start();}
  motion.addEventListener('change',refresh);
  document.addEventListener('visibilitychange',refresh);
  addEventListener('blur',()=>{for(const field of fields)release(field);});
  addEventListener('pagehide',()=>{cancelAnimationFrame(frameId);frameId=0;});
  addEventListener('pageshow',start);
})();
