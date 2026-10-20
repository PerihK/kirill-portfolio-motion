// Small pointer depth and a lens ripple only while changing the real landscape.
// Static images remain underneath, including when WebGL is unavailable.
export async function createLandscape(canvas, dayImage, nightImage, motion) {
  if(motion.matches || !matchMedia('(pointer:fine)').matches) return null;
  const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});
  if(!gl)return null;
  await Promise.all([dayImage.decode(),nightImage.decode()]);
  const compile=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error('Shader unavailable');return s;};
  const program=gl.createProgram();
  gl.attachShader(program,compile(gl.VERTEX_SHADER,'attribute vec2 a_position; varying vec2 v_uv; void main(){v_uv=(a_position+1.0)*0.5;gl_Position=vec4(a_position,0.0,1.0);}'));
  gl.attachShader(program,compile(gl.FRAGMENT_SHADER,`precision mediump float;
    varying vec2 v_uv; uniform sampler2D u_day; uniform sampler2D u_night;
    uniform vec2 u_scale; uniform vec2 u_pointer; uniform float u_time; uniform float u_blend;
    void main(){vec2 uv=(v_uv-.5)*u_scale+.5;uv=uv*.97+.015;
    float depth=1.0-smoothstep(.12,.85,uv.y);uv+=u_pointer*.004*depth;
    float change=sin(u_blend*3.14159265);float dist=length(uv-.5);
    uv+=(uv-.5)*sin(dist*16.0-u_blend*9.0)*.028*change;
    gl_FragColor=mix(texture2D(u_day,uv),texture2D(u_night,uv),u_blend);}`));
  gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return null;
  gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const pos=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
  for(const [i,img] of [dayImage,nightImage].entries()){gl.activeTexture(gl.TEXTURE0+i);const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.uniform1i(gl.getUniformLocation(program,i?'u_night':'u_day'),i);}
  const uniforms=Object.fromEntries(['scale','pointer','time','blend'].map(k=>[k,gl.getUniformLocation(program,'u_'+k)]));
  let targetNight=0,blend=0,px=0,py=0,x=0,y=0,visible=true,last=0,frame;
  const resize=()=>{const dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(canvas.clientWidth*dpr);canvas.height=Math.round(canvas.clientHeight*dpr);gl.viewport(0,0,canvas.width,canvas.height);const imageRatio=dayImage.naturalWidth/dayImage.naturalHeight,ratio=canvas.width/canvas.height;gl.uniform2f(uniforms.scale,Math.min(1,ratio/imageRatio),Math.min(1,imageRatio/ratio));};
  resize();addEventListener('resize',resize);
  addEventListener('pointermove',e=>{px=e.clientX/innerWidth*2-1;py=1-e.clientY/innerHeight*2;},{passive:true});
  const draw=t=>{frame=undefined;if(!visible||document.hidden||motion.matches)return;if(t-last<32){frame=requestAnimationFrame(draw);return;}last=t;x+=(px-x)*.035;y+=(py-y)*.035;blend+=(targetNight-blend)*.055;gl.uniform2f(uniforms.pointer,x,y);gl.uniform1f(uniforms.time,t*.001);gl.uniform1f(uniforms.blend,blend);gl.drawArrays(gl.TRIANGLES,0,6);frame=requestAnimationFrame(draw);};
  const restart=()=>{if(!frame&&visible&&!document.hidden&&!motion.matches)frame=requestAnimationFrame(draw);};
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;restart();},{threshold:0}).observe(canvas);
  document.addEventListener('visibilitychange',restart);motion.addEventListener('change',()=>{document.body.classList.toggle('scene-ready',!motion.matches);restart();});
  canvas.addEventListener('webglcontextlost',()=>{visible=false;document.body.classList.remove('scene-ready');});
  document.body.classList.add('scene-ready');restart();return {setNight(value){targetNight=value?1:0;restart();}};
}
