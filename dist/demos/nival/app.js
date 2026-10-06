import { createLandscape } from './scene.js?v=20261004-2';

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const motion = matchMedia('(prefers-reduced-motion: reduce)');
// Explicit anchor motion leaves native focus and modal scrolling immediate.
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const target=$(a.getAttribute('href'));if(!target)return;
  e.preventDefault();target.scrollIntoView({behavior:motion.matches?'instant':'smooth'});
  history.replaceState(null,'',a.getAttribute('href'));
}));
const homes = [
  {name:'Скала', kind:'Тишина для двоих', area:112, beds:1, terrace:38, description:'Камерное пространство для двоих. Отдельная спальня, открытая гостиная и терраса для долгих вечеров.'},
  {name:'Гребень', kind:'Пространство для близких', area:148, beds:2, terrace:54, description:'Две спальни, общая гостиная и открытая кухня. Пространство, в котором у каждого есть свой угол тишины.'},
  {name:'Горизонт', kind:'Свобода быть вместе', area:196, beds:3, terrace:76, description:'Три спальни и большой зал с панорамным остеклением. Открытая терраса продолжает дом в сторону озера.'}
];
const roomInfo = {
  living:['Гостиная','Открытая гостиная с камином. Панорамное стекло обращено к озеру.'],
  kitchen:['Кухня','Остров из камня, встроенная кухня и большой стол для неспешных завтраков.'],
  bedroom:['Спальни','Отдельные комнаты отдыха с видом на склон и мягким утренним светом.'],
  bath:['Ванная','Тёплый камень, просторная душевая и скрытые места хранения.'],
  terrace:['Терраса','Открытая площадка над рельефом. Место для ужина, солнца и воздуха.']
};
let home = 0, room = 'living', scene = -1, galleryIndex = 0;
const gallery = [
  ['hero','Сассолунго, Доломиты · Michiel Ronde'],
  ['chalet','Лез-Же, Франция · Guillaume Hankenne'],
  ['interior','Альпийский интерьер · Valentin Ducrettet'],
  ['warm','Вечер в деревянном доме · Jonathan Borba'],
  ['lake','Озеро Брайес, Италия · Luca Bravo'],
  ['summit','Хребет Сечеда · Pascal Debrunner'],
  ['forest','Свет и открытая терраса · Jonathan Borba']
];

// Each home has a different arrangement; these are conceptual, not construction plans.
function planSvg(index, interactive = false) {
  const n = homes[index].beds;
  const end = 370, bedroomWidth = 128 / n;
  const rooms = [
    ['living',35,38,170,125], ['kitchen',205,38,165,125],
    ...Array.from({length:n},(_,i)=>['bedroom',35+i*bedroomWidth,163,bedroomWidth,85]),
    ['bath',163,163,70,85], ['terrace',35,258,335,48]
  ];
  const attrs = key => interactive ? `data-room="${key}" class="plan-room${key===room?' selected':''}"` : 'class="plan-room"';
  return `<svg viewBox="0 0 405 330" role="img" aria-label="Концептуальный план резиденции ${homes[index].name}"><path class="plan-outside" d="M35 258h335v48H35z"/>${rooms.map(([key,x,y,w,h])=>`<rect ${attrs(key)} x="${x}" y="${y}" width="${w}" height="${h}"/>`).join('')}<path class="plan-furniture" d="M55 65h95v22H55zM55 87v37h20V87M95 99h50v28H95zM222 48h129v17H222zM257 85h56v30h-56zM243 128h85v20h-85zM179 180h37v50h-37zM244 177h112v58H244zM274 177v58M244 210h112"/>${Array.from({length:n},(_,i)=>{const x=43+i*bedroomWidth,w=bedroomWidth-16;return `<path class="plan-furniture" d="M${x} 178h${w}v51h-${w}zM${x} 191h${w}M${x+w/2} 178v13"/>`;}).join('')}<path class="plan-window" d="M40 38h155M215 38h150M370 43v113M40 248h117M244 248h120"/><path class="plan-furniture" d="M45 272h80v20H45zM320 275h28v20h-28z"/><text class="plan-label" x="110" y="150" text-anchor="middle">ГОСТИНАЯ</text><text class="plan-label" x="285" y="151" text-anchor="middle">КУХНЯ</text><text class="plan-label" x="202" y="323" text-anchor="middle">ОЗЕРО / ГОРИЗОНТ</text></svg>`;
}
function selectHome(index) {
  home = clamp(Number(index),0,2);
  const h = homes[home];
  $$('[data-home-image]').forEach(img=>{const active=Number(img.dataset.homeImage)===home;img.classList.toggle('active',active);img.setAttribute('aria-hidden',!active);});
  $$('[data-home]').forEach(b=>{const active=Number(b.dataset.home)===home;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});
  $$('[data-home-tab]').forEach(b=>{const active=Number(b.dataset.homeTab)===home;b.setAttribute('aria-selected',active);b.tabIndex=active?0:-1;});
  $('#home-panel').setAttribute('aria-labelledby',`home-tab-${home}`);
  $('#home-kind').textContent=h.kind; $('#home-name').textContent=h.name;
  $('#home-description').textContent=h.description; $('#home-area').textContent=h.area;
  $('#home-bedrooms').textContent=h.beds; $('#home-bedrooms').nextElementSibling.textContent=h.beds===1?'спальня':'спальни';
  $('#home-terrace').textContent=h.terrace;
  $('#plan-preview').innerHTML=planSvg(home); $('#plan-preview').setAttribute('aria-label',`План резиденции ${h.name}`);
}
$$('[data-home]').forEach(b=>b.addEventListener('click',()=>selectHome(b.dataset.home)));
$$('[data-home-tab]').forEach(b=>{
  b.addEventListener('click',()=>selectHome(b.dataset.homeTab));
  b.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(home+1)%3;if(e.key==='ArrowLeft')next=(home+2)%3;if(e.key==='Home')next=0;if(e.key==='End')next=2;if(next!==undefined){e.preventDefault();selectHome(next);$(`[data-home-tab="${next}"]`).focus();}});
});
function openDialog(id){const d=$(`#${id}`);if(!d.open)d.showModal();}
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>$(`#${b.dataset.close}`).close()));
$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
$('[data-menu]').addEventListener('click',()=>openDialog('menu-dialog'));
$$('#menu-dialog a').forEach(a=>a.addEventListener('click',()=>$('#menu-dialog').close()));

function selectRoom(key){
  room=key;const [name,description]=roomInfo[key];
  $('#room-name').textContent=name;$('#room-description').textContent=description;
  $$('[data-room]').forEach(el=>el.classList.toggle('selected',el.dataset.room===key));
  $$('[data-room-button]').forEach(el=>el.setAttribute('aria-pressed',el.dataset.roomButton===key));
}
$('#open-plan').addEventListener('click',()=>{
  const h=homes[home]; room='living';
  $('#plan-eyebrow').textContent=`NIVAL / Резиденция 0${home+1}`;$('#plan-kind').textContent=h.kind;
  $('#plan-title').textContent=h.name;$('#plan-description').textContent=h.description;
  $('#plan-facts').innerHTML=`<div><span>Внутреннее пространство</span><span>${h.area} м²</span></div><div><span>Спальни</span><span>${h.beds}</span></div><div><span>Открытая терраса</span><span>${h.terrace} м²</span></div>`;
  $('#large-plan').innerHTML=planSvg(home,true);
  $('#room-legend').innerHTML=Object.entries(roomInfo).map(([key,[name]])=>`<button data-room-button="${key}" aria-pressed="${key===room}">${name}</button>`).join('');
  $$('[data-room]', $('#large-plan')).forEach(el=>el.addEventListener('click',()=>selectRoom(el.dataset.room)));
  $$('[data-room-button]').forEach(b=>b.addEventListener('click',()=>selectRoom(b.dataset.roomButton)));
  selectRoom(room);openDialog('plan-dialog');
});
function openChoice(){
  $('#plan-dialog').close();$(`input[name="residence"][value="${home}"]`).checked=true;
  $('#choice-status').textContent='';openDialog('choice-dialog');
}
$('#choose-home').addEventListener('click',openChoice);
$$('[data-open-choice]').forEach(b=>b.addEventListener('click',openChoice));
$('#choice-form').addEventListener('submit',e=>{
  e.preventDefault();const data=new FormData(e.currentTarget),h=homes[Number(data.get('residence'))];
  const content=`NIVAL — моя высота\nРезиденция: ${h.name}\nПлощадь: ${h.area} м²\nСпальни: ${h.beds}\nТерраса: ${h.terrace} м²\n\nМои пожелания:\n${data.get('note')||'Пока без заметок.'}\n\nАвторский концепт. Архитектура и место вымышлены.\nhttps://nival-residences.vercel.app/\n`;
  const url=URL.createObjectURL(new Blob(['\uFEFF'+content],{type:'text/plain;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download=`NIVAL-${['skala','greben','horizon'][Number(data.get('residence'))]}.txt`;a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);$('#choice-status').textContent='Ваш выбор сохранён. Файл доступен в загрузках.';
});
function showGallery(index){galleryIndex=(index+gallery.length)%gallery.length;const [asset,caption]=gallery[galleryIndex];const image=$('#gallery-image');image.src=`assets/photos-v2/${asset}.webp`;image.alt=caption;image.style.aspectRatio='auto';$('#gallery-caption').textContent=caption;$('#gallery-count').textContent=`0${galleryIndex+1} / 0${gallery.length}`;}
$$('[data-gallery]').forEach(b=>b.addEventListener('click',()=>{showGallery(Number(b.dataset.gallery));openDialog('gallery-dialog');}));
$('#gallery-prev').addEventListener('click',()=>showGallery(galleryIndex-1));$('#gallery-next').addEventListener('click',()=>showGallery(galleryIndex+1));
$('#gallery-dialog').addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();showGallery(galleryIndex-1);}if(e.key==='ArrowRight'){e.preventDefault();showGallery(galleryIndex+1);}});

let landscape;
$$('[data-time]').forEach(b=>b.addEventListener('click',()=>{const night=b.dataset.time==='night';document.body.classList.toggle('night-mode',night);$$('[data-time]').forEach(x=>x.setAttribute('aria-pressed',x===b));landscape?.setNight(night);}));
function setScene(index){if(index===scene)return;scene=index;$$('[data-scene-image]').forEach(el=>el.classList.toggle('active',Number(el.dataset.sceneImage)===index));$$('[data-scene-text]').forEach(el=>{const active=Number(el.dataset.sceneText)===index;el.classList.toggle('active',active);el.setAttribute('aria-hidden',!active);});$$('[data-scene]').forEach(el=>el.setAttribute('aria-pressed',Number(el.dataset.scene)===index));$('#scene-label').textContent=['ДЕРЕВО. КАМЕНЬ. СВЕТ.','ПРОСТРАНСТВО. СВЕТ. ТЕПЛО.','МЕДЛЕННОЕ ВРЕМЯ.'][index];$$('.image-expand,.architecture-visuals').forEach(el=>el.dataset.gallery=[1,2,3][index]);}
const architecture=$('#architecture');
$$('[data-scene]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.scene);if(motion.matches)setScene(i);else{const travel=architecture.offsetHeight-innerHeight;window.scrollTo({top:architecture.offsetTop+travel*((i+.35)/3),behavior:'smooth'});}}));
const title=$('[data-reveal-words]');
title.innerHTML=title.innerHTML.split(/(<br\s*\/?\s*>)/i).map(part=>part.startsWith('<')?part:part.trim().split(/\s+/).map(word=>`<span class="word-reveal">${word}</span>`).join(' ')).join('');
const words=$$('.word-reveal');const hero=$('#top'),portrait=$('.landscape-portrait'),horizon=$('#horizon');
let ticking=false;
function updateScroll(){
  ticking=false;const height=innerHeight;
  const hr=hero.getBoundingClientRect();const hp=motion.matches?0:clamp(-hr.top/(hero.offsetHeight-height));hero.style.setProperty('--hero-progress',hp.toFixed(4));
  const ar=architecture.getBoundingClientRect();const ap=clamp(-ar.top/(architecture.offsetHeight-height||1));architecture.style.setProperty('--arch-progress',ap.toFixed(4));if(!motion.matches)setScene(Math.min(2,Math.floor(ap*3)));
  const tr=title.getBoundingClientRect(),reveal=clamp((height*.9-tr.top)/(height*.65));words.forEach((w,i)=>w.classList.toggle('lit',motion.matches||reveal>(i/words.length)*.65));
  if(!motion.matches){const pr=portrait.getBoundingClientRect();portrait.style.setProperty('--portrait-y',`${clamp((height/2-pr.top)*.035,-18,18)}px`);const zr=horizon.getBoundingClientRect();horizon.style.setProperty('--horizon-open',clamp(-zr.top/(horizon.offsetHeight-height||1)).toFixed(4));}
  const underHeaderY=100;const darkInk=['#place','#residences','#contact'].some(s=>{const r=$(s).getBoundingClientRect();return r.top<=underHeaderY&&r.bottom>underHeaderY;});$('#header').classList.toggle('is-dark',darkInk);
}
function requestUpdate(){if(!ticking){ticking=true;requestAnimationFrame(updateScroll);}}
addEventListener('scroll',requestUpdate,{passive:true});addEventListener('resize',requestUpdate);motion.addEventListener('change',requestUpdate);
if(matchMedia('(pointer:fine)').matches){const cursor=$('#custom-cursor');addEventListener('pointermove',e=>{cursor.style.left=`${e.clientX}px`;cursor.style.top=`${e.clientY}px`;cursor.classList.toggle('visible',!!e.target.closest('.architecture-visuals')&&!$('dialog[open]')&&!motion.matches);});addEventListener('pointerout',e=>{if(!e.relatedTarget)cursor.classList.remove('visible');});}
selectHome(0);setScene(0);updateScroll();
createLandscape($('#hero-canvas'),$('#hero-image'),$('#hero-night'),motion).then(result=>{landscape=result;result?.setNight(document.body.classList.contains('night-mode'));}).catch(()=>{});
