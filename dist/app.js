const projects = [
 {id:'lesno',name:'ЛЕСНО',type:'Ландшафтный дизайн',summary:'Природа. Архитектура. Вы.',color:'#d5e1ce',mark:'лесно',line:'Сады, в которых хочется остаться.',description:'Концепт сайта о ландшафтном дизайне: крупная фотография, спокойная типографика и истории садов. Сайт ведёт от знакомства с подходом команды к просмотру проектов и обсуждению своего участка.',features:['Проекты садов','Подход бюро','Адаптивная вёрстка']},
 {id:'yasno',name:'ЯСНО',type:'Клининг',summary:'Чистый дом. Новый старт.',color:'#dee8ec',mark:'ЯСНО.',line:'Клининг<br>после ремонта.',description:'Концепт клининга с понятным составом услуг и расчётом до первого сообщения. На сайте можно изменить площадь, проверить состав уборки и попробовать калькулятор.',features:['Калькулятор','Состав услуг','Демо-заявка']},
 {id:'liniya',name:'ЛИНИЯ',type:'Красота',summary:'Новая форма. Ваш характер.',color:'#e9dcd5',mark:'ЛИНИЯ',line:'Форма.<br>Характер.',description:'Концепт салона с акцентом на характер, услуги и работу мастеров. Фотография и крупная типографика создают настроение, а подбор услуги помогает найти следующий шаг.',features:['Услуги','Подбор образа','Мастера']},
 {id:'tiho',name:'ТИХО',type:'Кондиционеры',summary:'Комфорт, который продуман.',color:'#e5dfd0',mark:'ТИХО',line:'Тишина —<br>часть интерьера.',description:'Концепт сервиса подбора и установки кондиционеров. Вместо витрины оборудования — вопросы о комнате, ориентир по мощности и объяснение того, как проходит монтаж.',features:['Расчёт мощности','Модели систем','Монтаж по шагам']},
 {id:'mile',name:'MILE',type:'Английский язык',summary:'Новый город. Ваш язык.',color:'#d9e3e7',mark:'MILE.',line:'Make<br>your place.',description:'Концепт школы английского для жизни в новой стране. Тёплая редакционная подача соединяет программы, уровень языка и понятный маршрут к первому уроку.',features:['Программы','Выбор уровня','Первый урок']},
 {id:'hvost',name:'ХВОСТ',type:'Груминг',summary:'Чистые лапы. Довольный пёс.',color:'#d7e4d3',mark:'ХВОСТ.',line:'У каждого хвоста<br>свой характер.',description:'Концепт груминг-студии с дружелюбной подачей и вниманием к питомцу. Размер собаки и тип шерсти превращаются в понятный ориентир по программе ухода.',features:['Маршрут ухода','Программы','Демо-запись']},
 {id:'plan',name:'ПЛАН',type:'Девелопмент',summary:'Город начинается у вашего дома.',color:'#dce3e4',mark:'план.',line:'Место для<br>настоящей жизни.',description:'Концепт девелоперского сайта о доме и среде вокруг него. Архитектура задаёт визуальный ритм, а карточки проектов и подбор квартиры помогают перейти от впечатления к выбору.',features:['Жилые проекты','Подбор квартиры','Адаптивная вёрстка']},
 {id:'stebel',name:'СТЕБЕЛЬ',type:'Цветочная студия',summary:'Цветы к вашему моменту.',color:'#f0e1c6',mark:'СТЕБЕЛЬ',line:'Маленький повод.<br>Большое чувство.',description:'Иллюстрированный концепт цветочной студии. Подбор по поводу и бюджету, букеты и демо-корзина собраны в лёгкий сценарий выбора подарка.',features:['Подбор букета','Демо-корзина','Подписка']}
];
const $=s=>document.querySelector(s);
const arrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
// Two clipped rows per letter keep the identity readable while it rolls on hover.
const identity=$('.identity');
identity.setAttribute('aria-label','Кирилл Перих — Дизайн и разработка сайтов');
function identityLine(text){
 const line=document.createElement('span');line.className='identity-line';line.setAttribute('aria-hidden','true');
 [...text].forEach((letter,i)=>{
  const slot=document.createElement('span');slot.className='identity-letter';slot.style.setProperty('--letter-delay',`${i*12}ms`);
  const roll=document.createElement('span');roll.className='identity-roll';roll.textContent=letter;
  const echo=document.createElement('span');echo.className='identity-echo';echo.textContent=letter;
  roll.append(echo);slot.append(roll);line.append(slot);
 });return line;
}
const identityName=identity.querySelector('strong').firstChild;
identityName.replaceWith(identityLine(identityName.textContent));
const identityDescription=identity.querySelector(':scope > span');
identityDescription.replaceChildren(identityLine(identityDescription.textContent));
const coverArt={
 plan:{src:'demos/plan/assets/project-sad.webp',width:1600,height:2000},
 tiho:{src:'images/covers/tiho-interior-hq.webp',width:1536,height:1024},
 mile:{src:'images/covers/mile-art-v2.webp',width:1536,height:1024},
 liniya:{src:'images/covers/liniya-art-v2.webp',width:1536,height:1024},
 hvost:{src:'images/covers/hvost-art-v2.webp',width:1536,height:1024}
};
function cover(p,eager=false){const artwork=coverArt[p.id]||{src:`images/covers/${p.id}.webp`,width:1400,height:933};return `<div class="project-cover image-cover cover-${p.id}" aria-hidden="true"><img class="cover-image" ${eager?'src':'data-src'}="${artwork.src}" alt="" width="${artwork.width}" height="${artwork.height}" ${eager?'fetchpriority="high"':''}></div>`;}
function loadImages(root){root.querySelectorAll('[data-src]').forEach(el=>{el.src=el.dataset.src;el.removeAttribute('data-src');});}
$('#project-titles').innerHTML=projects.map((p,i)=>`<div class="project-title-block" ${i?'aria-hidden="true"':''}><h2>${p.name}</h2><p><span>${p.type}</span><span>Концепт / 2026</span><span class="project-role">Дизайн / Разработка</span></p></div>`).join('');
$('#project-cards').innerHTML=projects.map((p,i)=>`<article class="work-slide" data-index="${i}" ${i?'aria-hidden="true" inert':''}><div class="card-motion"><button class="showcase-card" data-project="${p.id}" aria-label="Посмотреть проект ${p.name} — ${p.type}" aria-haspopup="dialog">${cover(p,i===0)}<span class="cover-cursor" aria-hidden="true">Подробнее ${arrow}</span></button><div class="project-caption"><p>${p.summary}</p><button class="project-open" data-project="${p.id}" aria-haspopup="dialog">О проекте ${arrow}</button></div></div></article>`).join('');
$('#project-grid').innerHTML=projects.map(p=>`<button class="catalog-card" data-project="${p.id}" aria-label="Посмотреть проект ${p.name} — ${p.type}" aria-haspopup="dialog">${cover(p)}<span><strong>${p.name}</strong><small>${p.type}</small>${arrow}</span></button>`).join('');
const previewDialog=$('#preview-dialog'),briefDialog=$('#brief-dialog'),catalogDialog=$('#catalog-dialog');
const mobileToggle=$('#mobile-toggle'); // Optional: retained phone demo can be reused in a dedicated case study.
const focusOrigins=new WeakMap(),closeTickets=new WeakMap();
let currentProject=null,openingRect=null,openingRadius='28px',previewAnimation=null;
document.querySelectorAll('[data-project]').forEach(b=>b.addEventListener('click',()=>{const source=b.classList.contains('showcase-card')?b:b.closest('.work-slide')?.querySelector('.showcase-card')||b.querySelector('.project-cover')||b;if(catalogDialog.open){catalogDialog.close();$('#catalog-toggle').focus({preventScroll:true});}openPreview(b.dataset.project,true,source);}));
$('#catalog-toggle').setAttribute('aria-label','Все работы');
$('#catalog-toggle').addEventListener('click',()=>{loadImages($('#project-grid'));showDialog(catalogDialog);});

const track=$('#work'),slides=[...document.querySelectorAll('.work-slide')],titles=[...document.querySelectorAll('.project-title-block')];
let unit=innerHeight*.92,position=0,target=0,raf=0,lastTime=0,current=-1;
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const rgb=hex=>[1,3,5].map(n=>parseInt(hex.slice(n,n+2),16));
const colors=projects.map(p=>rgb(p.color));
function measure(){const height=$('.work-stage').clientHeight;unit=Math.max(450,height*.92);track.style.height=`${height+unit*7}px`;schedule();if(current===-1)position=target;}
function schedule(){target=clamp((scrollY-track.offsetTop)/unit,0,7);if(!raf){lastTime=0;raf=requestAnimationFrame(draw);}}
function draw(time){const dt=lastTime?Math.min(64,time-lastTime):16;lastTime=time;position=reduced.matches?target:position+(target-position)*(1-Math.exp(-dt/150));if(Math.abs(position-target)<.0004)position=target;
 const first=Math.floor(position),fraction=position-first,a=colors[first],b=colors[Math.min(7,first+1)];document.body.style.backgroundColor=`rgb(${a.map((c,i)=>Math.round(c+(b[i]-c)*fraction)).join(',')})`;
 document.body.style.setProperty('--gallery-color',document.body.style.backgroundColor);
 $('.work-stage').style.setProperty('--heading-opacity',String(clamp(1-Math.max(0,scrollY-track.offsetTop-7*unit)/40,0,1)));
 const active=Math.round(position);if(current!==active){current=active;$('#work-count').textContent=String(active+1).padStart(2,'0');}
 slides.forEach((slide,i)=>{const rawDelta=i-position,delta=Math.abs(rawDelta)<.002?0:rawDelta,visible=Math.abs(delta)<1.25;slide.style.visibility=visible?'visible':'hidden';slide.inert=i!==active;slide.setAttribute('aria-hidden',String(i!==active));titles[i].setAttribute('aria-hidden',String(i!==active));
  slide.style.willChange=position===target?'auto':'transform, opacity';
  if(visible){loadImages(slide);const height=$('#project-cards').clientHeight;const y=delta>0?delta*(height+90):delta*height*.16;const scale=delta>0?1-.08*delta:1+.07*delta;slide.style.transform=reduced.matches?'none':`translate3d(0,${y}px,0) scale(${scale})`;slide.style.opacity=reduced.matches?String(i===active?1:0):String(delta<0?clamp(1+delta*1.55,0,1):1);}
  titles[i].style.opacity=String(i===active?(reduced.matches?1:Math.max(.5,1-Math.abs(delta))):0);titles[i].style.transform=reduced.matches?'none':`translateY(${delta*35}px)`;
 });
 document.body.classList.toggle('in-contact',scrollY>track.offsetHeight-innerHeight*.7);
 if(position!==target)raf=requestAnimationFrame(draw);else{raf=0;lastTime=0;}
}
function jumpToProject(i){scrollTo({top:track.offsetTop+i*unit,behavior:reduced.matches?'instant':'smooth'});}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure);reduced.addEventListener('change',schedule);measure();

// One wheel / trackpad gesture moves one work. Momentum belongs to the same gesture.
let wheelLast=0,wheelDelta=0,wheelConsumed=false,wheelAnimatingUntil=0;
function galleryContact(){scrollTo({top:$('#contact').offsetTop-$('.masthead').offsetHeight-20,behavior:reduced.matches?'instant':'smooth'});}
function advanceWork(direction){const index=Math.round(target);if(direction>0&&index===7)galleryContact();else jumpToProject(clamp(index+direction,0,7));}
addEventListener('wheel',e=>{
 if(e.ctrlKey||e.defaultPrevented||document.body.classList.contains('modal-open')||Math.abs(e.deltaX)>Math.abs(e.deltaY)||!e.deltaY)return;
 const now=performance.now(),lastTop=track.offsetTop+7*unit;
 const inGallery=scrollY>=track.offsetTop-2&&scrollY<=lastTop+2;
 const returning=e.deltaY<0&&scrollY>lastTop&&scrollY<=$('#contact').offsetTop+innerHeight*.2;
 if(!inGallery&&!returning&&now>=wheelAnimatingUntil)return;
 e.preventDefault();
 if(now-wheelLast>180){wheelConsumed=false;wheelDelta=0;}
 wheelLast=now;
 if(wheelConsumed||now<wheelAnimatingUntil)return;
 const pixels=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);
 if(Math.sign(pixels)!==Math.sign(wheelDelta))wheelDelta=0;
 wheelDelta+=pixels;if(Math.abs(wheelDelta)<20)return;
 wheelConsumed=true;wheelAnimatingUntil=now+(reduced.matches?0:750);
 if(returning)jumpToProject(7);else advanceWork(Math.sign(wheelDelta));
},{passive:false});
addEventListener('keydown',e=>{
 if(e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey||document.body.classList.contains('modal-open')||e.target.closest('input,textarea,select,[contenteditable]'))return;
 if(scrollY<track.offsetTop-2||scrollY>track.offsetTop+7*unit+2)return;
 const direction=['ArrowDown','PageDown'].includes(e.key)?1:['ArrowUp','PageUp'].includes(e.key)?-1:0;
 if(!direction)return;e.preventDefault();if(e.repeat||performance.now()<wheelAnimatingUntil)return;
 wheelAnimatingUntil=performance.now()+(reduced.matches?0:750);advanceWork(direction);
});

// A vertical touch gesture advances exactly one work; taps and pinch zoom remain native.
const stage=$('.work-stage');
let gesture=null,suppressClickUntil=0;
stage.addEventListener('touchstart',e=>{
 if(e.touches.length!==1||document.body.classList.contains('modal-open')||scrollY<track.offsetTop-2||scrollY>track.offsetTop+7*unit+2){gesture=null;return;}
 const t=e.touches[0];gesture={x:t.clientX,y:t.clientY,axis:null,index:Math.round(target)};
},{passive:true});
stage.addEventListener('touchmove',e=>{
 if(!gesture)return;if(e.touches.length!==1){gesture=null;return;}
 const t=e.touches[0],dx=t.clientX-gesture.x,dy=t.clientY-gesture.y;
 if(!gesture.axis&&Math.max(Math.abs(dx),Math.abs(dy))>=8)gesture.axis=Math.abs(dy)>Math.abs(dx)?'vertical':'horizontal';
 if(gesture.axis==='vertical'){e.preventDefault();suppressClickUntil=performance.now()+500;}
},{passive:false});
stage.addEventListener('touchend',e=>{
 const g=gesture;gesture=null;if(!g||g.axis!=='vertical'||e.touches.length)return;
 const dy=e.changedTouches[0].clientY-g.y;
 if(Math.abs(dy)<32){jumpToProject(g.index);return;}
 if(dy<0&&g.index===7){galleryContact();return;}
 jumpToProject(clamp(g.index+(dy<0?1:-1),0,7));
},{passive:true});
stage.addEventListener('touchcancel',()=>{gesture=null;},{passive:true});
stage.addEventListener('click',e=>{if(performance.now()<suppressClickUntil){e.preventDefault();e.stopPropagation();}},{capture:true});
document.querySelectorAll('.showcase-card[data-project]').forEach(card=>{card.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=card.getBoundingClientRect();card.style.setProperty('--cursor-x',`${clamp(e.clientX-r.left,64,r.width-64)}px`);card.style.setProperty('--cursor-y',`${clamp(e.clientY-r.top,52,r.height-52)}px`);});});

function showDialog(dialog){if(dialog.open)return;focusOrigins.set(dialog,document.activeElement);dialog.showModal();document.body.classList.add('modal-open');dialog.scrollTop=0;}
function coverTransform(rect){return `translate(${rect.left}px,${rect.top}px) scale(${rect.width/innerWidth},${rect.height/innerHeight})`;}
function openPreview(id,changeUrl=true,source=null){const p=projects.find(p=>p.id===id);if(!p)return;closeTickets.delete(previewDialog);previewDialog.getAnimations().forEach(a=>a.cancel());delete previewDialog.dataset.closing;previewDialog.classList.remove('is-closing');phoneObserver?.disconnect();currentProject=p;previewDialog.classList.remove('show-mobile');if(mobileToggle){mobileToggle.setAttribute('aria-pressed','false');mobileToggle.textContent='Мобильная версия';}$('#preview-mobile').replaceChildren();$('#preview-mobile').hidden=true;$('#preview-title').textContent=p.name;$('#preview-niche').textContent=p.type;$('#preview-description').textContent=p.description;$('#preview-features').innerHTML=p.features.map(x=>`<span>${x}</span>`).join('');$('#preview-visit').href=`demos/${id}/`;$('#preview-backdrop').innerHTML=cover(p,true);openingRect=source?.getBoundingClientRect()||null;openingRadius=source?getComputedStyle(source).borderRadius:'var(--card-radius)';showDialog(previewDialog);
 previewAnimation?.cancel();if(!reduced.matches&&openingRect&&openingRect.width>0&&openingRect.top<innerHeight&&openingRect.bottom>0){previewAnimation=$('#preview-backdrop').animate([{transform:coverTransform(openingRect),borderRadius:openingRadius},{transform:'translate(0,0) scale(1)',borderRadius:'0px'}],{duration:1100,easing:'cubic-bezier(.22,1,.36,1)'});}
 if(changeUrl){const u=new URL(location.href);u.searchParams.set('project',id);if(u.href!==location.href)history.pushState({portfolioProject:true},'',u);}}
async function closeDialog(dialog,changeUrl=true){if(!dialog.open||dialog.dataset.closing)return;dialog.dataset.closing='true';const ticket=Symbol();closeTickets.set(dialog,ticket);dialog.classList.add('is-closing');previewAnimation?.cancel();if(!reduced.matches){const animations=[dialog.animate([{opacity:1},{opacity:0}],{duration:dialog===previewDialog?700:350,easing:'ease-in-out'})];if(dialog===previewDialog&&openingRect){animations.push($('#preview-backdrop').animate([{transform:'translate(0,0) scale(1)',borderRadius:'0px'},{transform:coverTransform(openingRect),borderRadius:openingRadius}],{duration:700,easing:'cubic-bezier(.22,1,.36,1)'}));}await Promise.all(animations.map(a=>a.finished.catch(()=>{})));}if(closeTickets.get(dialog)!==ticket)return;closeTickets.delete(dialog);dialog.close();delete dialog.dataset.closing;dialog.classList.remove('is-closing');if(dialog===previewDialog){phoneObserver?.disconnect();phoneObserver=null;$('#preview-mobile').replaceChildren();if(changeUrl){const u=new URL(location.href);u.searchParams.delete('project');history.replaceState(null,'',u);}}if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');const origin=focusOrigins.get(dialog);if(origin?.isConnected)origin.focus({preventScroll:true});}
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeDialog(document.getElementById(b.dataset.close))));
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('cancel',e=>{e.preventDefault();closeDialog(d);}));
function phoneMarkup(p){if(p.id==='yasno')return `<div class="real-phone"><div class="mobile-stage" id="mobile-stage"><div class="mobile-artboard" id="mobile-artboard"><img class="phone-poster" src="images/yasno-phone.png" alt="ЯСНО — живой сайт в телефоне" width="1448" height="1086"><span class="poster-number-cover" aria-hidden="true"></span><div class="phone-cutout"><div class="phone-glass"><div class="phone-screen"><img class="phone-fallback" src="images/yasno-mobile.webp" alt="Мобильная версия ЯСНО" width="414" height="882"><iframe src="demos/yasno/?embedded=1" title="Мобильный сайт ЯСНО — прокрутка и калькулятор уборки"></iframe></div></div></div></div></div></div><p>Живой сайт — листайте и попробуйте расчёт.</p>`;return `<div class="preview-handset"><span class="handset-speaker" aria-hidden="true"></span><div class="handset-viewport" tabindex="0" aria-label="Мобильное превью ${p.name}, можно прокручивать"><img src="images/${p.id}-mobile.webp" alt="Актуальный мобильный экран сайта ${p.name}" width="375" height="690"></div></div><p>Мобильный экран. Полный сайт — по кнопке ниже.</p>`;}
let phoneObserver=null;
mobileToggle?.addEventListener('click',()=>{const active=!previewDialog.classList.contains('show-mobile');previewDialog.classList.toggle('show-mobile',active);$('#mobile-toggle').setAttribute('aria-pressed',String(active));$('#mobile-toggle').textContent=active?'К описанию':'Мобильная версия';$('#preview-mobile').hidden=!active;if(!active)return;if(!$('#preview-mobile').children.length){$('#preview-mobile').innerHTML=phoneMarkup(currentProject);if(currentProject.id==='yasno'){phoneObserver?.disconnect();phoneObserver=new ResizeObserver(([entry])=>{const scale=entry.contentRect.width/550;$('#mobile-artboard').style.transform=`matrix(${scale},0,0,${scale},${-485*scale},${-5*scale})`;});phoneObserver.observe($('#mobile-stage'));$('.phone-screen iframe').addEventListener('load',()=>{try{$('.phone-screen iframe').contentDocument.addEventListener('keydown',e=>{if(e.key==='Escape'&&!e.defaultPrevented){e.preventDefault();$('#mobile-toggle').click();$('#mobile-toggle').focus();}});}catch{}});}}});
addEventListener('popstate',()=>{const id=new URL(location.href).searchParams.get('project');if(id)openPreview(id,false);else if(previewDialog.open)closeDialog(previewDialog,false);});
const initialProject=new URL(location.href).searchParams.get('project');if(initialProject)openPreview(initialProject,false);

// Depth-based entrance: a level stack settles into the gallery, without sideways rotation.
async function intro(){
 if(reduced.matches||initialProject||location.hash==='#contact')return;
 const overlay=$('#intro-screen'),deck=$('#intro-deck');
 const activeIndex=Math.round(target),order=projects.filter((_,i)=>i!==activeIndex).reverse();order.push(projects[activeIndex]);
 const frame=slides[activeIndex].querySelector('.showcase-card').getBoundingClientRect();if(frame.top<0||frame.bottom>innerHeight)return;
 function align(){const r=slides[activeIndex].querySelector('.showcase-card').getBoundingClientRect();Object.assign(deck.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});}
 align();deck.innerHTML=order.map(p=>'<div class="intro-card">'+cover(p)+'</div>').join('');loadImages(deck);overlay.style.backgroundColor=getComputedStyle(document.body).backgroundColor;overlay.hidden=false;document.body.classList.add('intro-playing');
 let finished=false;const animations=[],events=['wheel','touchstart','keydown'],entranceWidth=innerWidth;
 function resized(){if(innerWidth!==entranceWidth)finish();else align();}
 function finish(){if(finished)return;finished=true;animations.forEach(a=>a.cancel());overlay.hidden=true;deck.replaceChildren();document.body.classList.remove('intro-playing');events.forEach(e=>removeEventListener(e,finish));removeEventListener('resize',resized);reduced.removeEventListener('change',finish);$('#intro-skip').removeEventListener('click',finish);}
 events.forEach(e=>addEventListener(e,finish,{passive:true,once:true}));addEventListener('resize',resized);reduced.addEventListener('change',finish);$('#intro-skip').addEventListener('click',finish);
 await Promise.race([Promise.all([...deck.querySelectorAll('img')].map(im=>im.decode().catch(()=>{}))),new Promise(resolve=>setTimeout(resolve,500))]);if(finished)return;
 const cards=[...deck.children],ease='cubic-bezier(.785,.135,.15,.86)';
 // Use the actual card as the scene ruler. The gallery caps its width on large
 // monitors; viewport-based depth used to keep growing past that cap and reverse
 // the first leg of the flight. All depths now move consistently towards camera.
 const sceneWidth=frame.width/.83125,sceneHeight=Math.min(innerHeight,frame.height/.50705);
 const perspective=sceneWidth*.5208;
 const pose=(y,z,angle)=>`perspective(${perspective}px) translate3d(0,${y}px,${z}px) rotateX(${angle}deg)`;
 const front=pose(sceneHeight*.417,sceneWidth*.026,-10),level=pose(-sceneHeight*.1389,0,0),rest=pose(0,0,0);
 const passes=cards.map((card,i)=>{
  // Cards are opaque throughout the pass; only depth and position reveal the stack.
  // Project each card independently. A shared preserve-3d scene lets tilted
  // planes intersect and exposes slices of another image on large cards.
  card.style.zIndex=String(i+1);
  return card.animate([
   {offset:0,transform:pose(-sceneHeight*4/9,-sceneWidth*5/9,30),visibility:'visible'},
   {offset:.3,transform:pose(-sceneHeight*.046,-sceneWidth*.365,10),visibility:'visible'},
   {offset:.6,transform:pose(sceneHeight*.056,-sceneWidth*.26,0),visibility:'visible'},
   {offset:1,transform:front,visibility:'visible'}
  ],{duration:2000,delay:(cards.length-1-i)*1000/(cards.length-1),easing:ease,fill:'forwards'});
 });
 animations.push(...passes);await Promise.all(passes.map(a=>a.finished.catch(()=>{})));if(finished)return;
 // Only the chosen work lands: the completed stack cannot leak through the front card.
 cards.slice(0,-1).forEach(card=>card.remove());const landingCard=cards.at(-1);
 const settle=[landingCard.animate([{transform:front},{transform:level}],{duration:1000,easing:ease,fill:'forwards'})];
 animations.push(...settle);await Promise.all(settle.map(a=>a.finished.catch(()=>{})));if(finished)return;
 await new Promise(resolve=>setTimeout(resolve,500));if(finished)return;
 const land=[landingCard.animate([{transform:level},{transform:rest}],{duration:1000,easing:ease,fill:'forwards'})];
 animations.push(...land);await Promise.all(land.map(a=>a.finished.catch(()=>{})));if(finished)return;
 document.body.classList.remove('intro-playing');const fade=overlay.animate([{opacity:1},{opacity:0}],{duration:1000,fill:'forwards'});animations.push(fade);await fade.finished.catch(()=>{});finish();
}
requestAnimationFrame(()=>requestAnimationFrame(intro));

const form=$('#brief-form');form.noValidate=true;let step=0;
function renderStep(){form.querySelectorAll('.brief-step').forEach((s,i)=>s.hidden=i!==step);document.querySelectorAll('.brief-progress li').forEach((li,i)=>{li.classList.toggle('current',i===step);li.classList.toggle('complete',i<step);});$('#brief-back').hidden=step===0;$('#brief-back').textContent=step===4?'Изменить ответы':'Назад';$('#brief-next').hidden=step===4;$('#brief-next').textContent=step===3?'Собрать описание':'Дальше +';$('#form-error').textContent='';}
document.querySelectorAll('[data-brief]').forEach(b=>b.addEventListener('click',()=>{renderStep();showDialog(briefDialog);}));
function validateStep(){const fields=[...form.querySelector(`[data-step="${step}"]`).querySelectorAll('[required]')];let invalid=fields.find(f=>!f.checkValidity());if(step===0&&!$('#business').value.trim())invalid=$('#business');if(invalid){$('#form-error').textContent=step===0?'Напишите пару слов о бизнесе или идее.':'Выберите один из вариантов.';invalid.focus();return false;}return true;}
function makeBrief(){const d=new FormData(form);const business=d.get('business').trim();const site=d.get('site').trim();const materials=d.getAll('materials');const extra=d.get('extra').trim();
 const lines=['Кирилл, здравствуйте! Хочу обсудить сайт.','',`Бизнес / идея: ${business}`,`Формат: ${d.get('format')}`,`Основная задача: ${d.get('goal')}`,`Материалы: ${materials.length?materials.join(', '):'обсудим, что потребуется подготовить'}`,`Желаемый срок: ${d.get('timing')}`];if(site)lines.push(`Текущий сайт: ${site}`);if(extra)lines.push('',`Дополнительно: ${extra}`);lines.push('','Подскажите, с чего лучше начать и какой объём работы вы видите.');$('#brief-result').value=lines.join('\n');
 const goal=d.get('goal');const recommendations={'Рассчитать стоимость':'На старте обсудим правила расчёта и то, что посетителю нужно знать до заявки.','Записаться на услугу':'На старте обсудим услуги и способ записи: мессенджер или подключённая система.','Выбрать товар или услугу':'На старте обсудим структуру каталога, параметры выбора и следующий шаг после выбора.','Познакомиться с компанией и работами':'На старте обсудим содержание и проекты, которые лучше всего представят вашу компанию.'};$('#brief-recommendation').textContent=recommendations[goal]||'На старте обсудим предложение, содержание и удобный способ обращения.';$('#copy-status').textContent='';
}
form.addEventListener('submit',e=>{e.preventDefault();if(step>=4)return;if(!validateStep())return;if(step===3)makeBrief();step++;renderStep();briefDialog.scrollTop=0;const heading=form.querySelector(`[data-step="${step}"] h3`);heading.tabIndex=-1;heading.focus({preventScroll:true});});
$('#brief-back').addEventListener('click',()=>{step=Math.max(0,step-1);renderStep();briefDialog.scrollTop=0;});
$('#copy-brief').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#brief-result').value);$('#copy-status').textContent='Скопировано. Теперь откройте мессенджер и вставьте описание.';}catch{$('#brief-result').focus();$('#brief-result').select();$('#copy-status').textContent='Выделили текст. Скопируйте его вручную или скачайте файл.';}});
$('#download-brief').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob(['\uFEFF'+$('#brief-result').value],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Задача-на-сайт.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);$('#copy-status').textContent='Описание подготовлено для скачивания. Бриф не отправлен.';});
