(() => {
  'use strict';
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const canvases=[...document.querySelectorAll('canvas[data-network]')];
  let frameId=0,lastFrame=0;
  const fields=canvases.map((canvas,index)=>{
    const ctx=canvas.getContext('2d',{alpha:true});
    let seed=173+index*91;
    const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    return ctx?{canvas,ctx,random,visible:false,width:0,height:0,points:[],pointer:{x:0,y:0,active:false},focus:{x:0,y:0}}:null;
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
    while(points.length<total){
      const x=random()*field.width,y=random()*field.height,driftX=(random()-.5)*.36,driftY=(random()-.5)*.36;
      points.push({x,y,driftX,driftY,vx:driftX,vy:driftY,orbit:72+random()*100,influence:0,separateX:0,separateY:0});
    }
    if(points.length>total)points.length=total;
    for(const p of points){p.x=Math.max(0,Math.min(field.width,p.x));p.y=Math.max(0,Math.min(field.height,p.y));}
    draw(field,0);
  }
  function draw(field,elapsed){
    const {ctx,width,height,pointer,focus,points}=field;
    const step=elapsed/(1000/60),blend=1-Math.exp(-elapsed/320);
    ctx.clearRect(0,0,width,height);
    if(pointer.active){
      const follow=1-Math.exp(-elapsed/140);
      focus.x+=(pointer.x-focus.x)*follow;focus.y+=(pointer.y-focus.y)*follow;
    }
    const orbiters=new Set(pointer.active?points
      .map(p=>({p,distance:Math.hypot(p.x-focus.x,p.y-focus.y)}))
      .filter(p=>p.distance<250)
      .sort((a,b)=>(a.distance-a.p.influence*180)-(b.distance-b.p.influence*180))
      .slice(0,9).map(({p})=>p):[]);
    for(const p of points){p.separateX=0;p.separateY=0;}
    // Keep orbiting vertices apart, so their links describe open polygons.
    for(let i=0;i<points.length;i++){
      const a=points[i];if(a.influence<.1)continue;
      for(let j=i+1;j<points.length;j++){
        const b=points[j];if(b.influence<.1)continue;
        const dx=a.x-b.x,dy=a.y-b.y,distance=Math.hypot(dx,dy);
        if(distance>.01&&distance<44){
          const force=(1-distance/44)*.4*Math.min(a.influence,b.influence);
          const x=dx/distance*force,y=dy/distance*force;
          a.separateX+=x;a.separateY+=y;b.separateX-=x;b.separateY-=y;
        }
      }
    }
    for(const p of points){
      if(step&&!motion.matches){
        const dx=p.x-focus.x,dy=p.y-focus.y,distance=Math.hypot(dx,dy);
        const captured=orbiters.has(p);
        p.influence+=((captured?1:0)-p.influence)*blend;
        let targetX=p.driftX,targetY=p.driftY;
        if(p.influence>.001&&distance>.01){
          const ux=dx/distance,uy=dy/distance;
          // Gentle radial correction + tangential movement give a full orbit,
          // rather than collapsing every vertex into the cursor itself.
          const radial=Math.max(-.48,Math.min(.48,(p.orbit-distance)*.012));
          const tangent=Math.min(1,distance*.0065);
          targetX=targetX*(1-p.influence)+(ux*radial-uy*tangent)*p.influence+p.separateX;
          targetY=targetY*(1-p.influence)+(uy*radial+ux*tangent)*p.influence+p.separateY;
        }
        p.vx+=(targetX-p.vx)*blend;p.vy+=(targetY-p.vy)*blend;
        const speed=Math.hypot(p.vx,p.vy);
        if(speed>.98){p.vx*=.98/speed;p.vy*=.98/speed;}
        p.x+=p.vx*step;p.y+=p.vy*step;
        // Orbits may pass behind a section edge; free particles drift back in.
        if(p.influence<.05){
          if(p.x<0){p.driftX=Math.abs(p.driftX);p.vx=Math.abs(p.vx);}
          if(p.x>width){p.driftX=-Math.abs(p.driftX);p.vx=-Math.abs(p.vx);}
          if(p.y<0){p.driftY=Math.abs(p.driftY);p.vy=Math.abs(p.vy);}
          if(p.y>height){p.driftY=-Math.abs(p.driftY);p.vy=-Math.abs(p.vy);}
        }
      }
    }
    const cursorLinks=new Set(pointer.active?points
      .map(p=>({p,distance:Math.hypot(p.x-pointer.x,p.y-pointer.y)}))
      .filter(p=>p.distance<230).sort((a,b)=>a.distance-b.distance)
      .slice(0,3).map(({p})=>p):[]);
    const drawn=new Set();
    for(let i=0;i<points.length;i++){
      const a=points[i];
      const neighbors=points.map((b,j)=>({b,j,distance:Math.hypot(a.x-b.x,a.y-b.y)}))
        .filter(n=>n.j!==i&&n.distance<155).sort((a,b)=>a.distance-b.distance).slice(0,3);
      for(const {b,j,distance} of neighbors){
        const key=Math.min(i,j)*points.length+Math.max(i,j);
        if(drawn.has(key))continue;drawn.add(key);
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
        ctx.strokeStyle=`rgba(150,190,255,${(.24*(1-distance/155)).toFixed(3)})`;
        ctx.lineWidth=1;ctx.stroke();
      }
      const distance=pointer.active?Math.hypot(pointer.x-a.x,pointer.y-a.y):Infinity;
      if(cursorLinks.has(a)){
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(pointer.x,pointer.y);
        ctx.strokeStyle=`rgba(41,151,255,${(.56*(1-distance/230)).toFixed(3)})`;ctx.lineWidth=1;ctx.stroke();
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
    if(event.pointerType==='touch'||motion.matches){release();return;}
    for(const field of fields){
      if(!field.visible){field.pointer.active=false;continue;}
      const rect=field.canvas.parentElement.getBoundingClientRect();
      const x=event.clientX-rect.left,y=event.clientY-rect.top;
      const active=x>=0&&x<=rect.width&&y>=0&&y<=rect.height;
      if(active&&!field.pointer.active){field.focus.x=x;field.focus.y=y;}
      field.pointer={x,y,active};
    }
  },{passive:true});
  addEventListener('pointerout',event=>{if(!event.relatedTarget)release();},{passive:true});
  addEventListener('pointercancel',release,{passive:true});
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
