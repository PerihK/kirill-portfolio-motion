const allProjects = [
 {id:'lesno',name:'ЛЕСНО',type:'Ландшафтный дизайн',summary:'Природа. Архитектура. Вы.',color:'#c8ceba',mark:'лесно',line:'Сады, в которых хочется остаться.',description:'Концепт сайта о ландшафтном дизайне: крупная фотография, спокойная типографика и истории садов. Сайт ведёт от знакомства с подходом команды к просмотру проектов и обсуждению своего участка.',features:['Проекты садов','Подход бюро','Адаптивная вёрстка']},
 {id:'yasno',name:'ЯСНО',type:'Клининг',summary:'Чистый дом. Новый старт.',color:'#cedde5',mark:'ЯСНО.',line:'Клининг<br>после ремонта.',description:'Концепт клининга с понятным составом услуг и расчётом до первого сообщения. На сайте можно изменить площадь, проверить состав уборки и попробовать калькулятор.',features:['Калькулятор','Состав услуг','Демо-заявка']},
 {id:'liniya',name:'ЛИНИЯ',type:'Красота',summary:'Новая форма. Ваш характер.',color:'#c9c5bc',mark:'ЛИНИЯ',line:'Форма.<br>Характер.',description:'Концепт салона с акцентом на характер, услуги и работу мастеров. Фотография и крупная типографика создают настроение, а подбор услуги помогает найти следующий шаг.',features:['Услуги','Подбор образа','Мастера']},
 {id:'tiho',name:'ТИХО',type:'Кондиционеры',summary:'Тишина — часть интерьера.',color:'#bdc7bc',mark:'ТИХО',line:'Тишина —<br>часть интерьера.',description:'Концепт сервиса подбора и установки кондиционеров. Вместо витрины оборудования — вопросы о комнате, ориентир по мощности и объяснение того, как проходит монтаж.',features:['Расчёт мощности','Модели систем','Монтаж по шагам']},
 {id:'mile',name:'MILE',type:'Английский язык',summary:'Новый город. Ваш язык.',color:'#e0d5bf',mark:'MILE.',line:'Make<br>your place.',description:'Концепт школы английского для жизни в новой стране. Тёплая редакционная подача соединяет программы, уровень языка и понятный маршрут к первому уроку.',features:['Программы','Выбор уровня','Первый урок']},
 {id:'hvost',name:'ХВОСТ',type:'Груминг',summary:'Чистые лапы. Довольный пёс.',color:'#e8dccb',mark:'ХВОСТ.',line:'У каждого хвоста<br>свой характер.',description:'Концепт груминг-студии с дружелюбной подачей и вниманием к питомцу. Размер собаки и тип шерсти превращаются в понятный ориентир по программе ухода.',features:['Маршрут ухода','Программы','Демо-запись']},
 {id:'plan',name:'ПЛАН',type:'Девелопмент',summary:'Город начинается у вашего дома.',color:'#c2b8a3',mark:'план.',line:'Место для<br>настоящей жизни.',description:'Концепт девелоперского сайта о доме и среде вокруг него. Архитектура задаёт визуальный ритм, а карточки проектов и подбор квартиры помогают перейти от впечатления к выбору.',features:['Жилые проекты','Подбор квартиры','Адаптивная вёрстка']},
 {id:'stebel',name:'СТЕБЕЛЬ',type:'Цветочная студия',summary:'Цветы к вашему моменту.',color:'#dfc59a',mark:'СТЕБЕЛЬ',line:'Маленький повод.<br>Большое чувство.',description:'Иллюстрированный концепт цветочной студии. Подбор по поводу и бюджету, букеты и демо-корзина собраны в лёгкий сценарий выбора подарка.',features:['Подбор букета','Демо-корзина','Подписка']}
];
allProjects.push({id:'nival',name:'NIVAL',type:'Горные резиденции',summary:'Свой мир. Выше.',color:'#c6c6b5',mark:'NIVAL',line:'Своя<br>высота.',description:'Концепт частных горных резиденций. Альпийские пейзажи, движение и архитектура ведут к выбору одного из трёх домов и исследованию его пространства.',features:['Три резиденции','Интерактивные планы','Сохранение выбора']});
const selectedIds=['nival','lesno','tiho','plan'];
const projects=selectedIds.map(id=>allProjects.find(p=>p.id===id));
const lastWork=projects.length-1;
const caseStudies={
 nival:{brief:'Передать ощущение жизни в горах и связать атмосферу места с выбором личного пространства.',audience:'Люди, рассматривающие загородный дом как место тишины, природы и уединения.',decisions:[['Пейзаж задаёт ритм','Реальные альпийские фотографии, крупный набор и движение при прокрутке раскрывают место. Переключатель первого экрана меняет вершины на озеро.'],['Три личных пространства','Выбор резиденции связывает фотографию, площадь, спальни, террасу и схему. Крупный план позволяет исследовать комнаты и их назначение.'],['Выбор можно сохранить','Дом и личные пожелания сохраняются в файле. Сайт остаётся самостоятельным концептом: объекты вымышлены, заявка девелоперу не отправляется.']]},
 lesno:{brief:'Показать ландшафт как пространство для жизни и помочь владельцу участка понять решения бюро.',audience:'Владельцы загородных участков, которым важны характер места и продуманная структура сада.',decisions:[['От вида к пространству','Первый экран ведёт в подробный лесной сад: четыре зоны на схеме объясняют, как устроены прогулка, отдых и переход от дома к лесу.'],['Сад в течение года','Переключение сезона меняет палитру схемы и рассказ о посадках. Постоянная структура остаётся видна.'],['От исследования к заданию','Коллекция раскрывает три разных сада в отдельных состояниях. Задание на свой участок связывает площадь, характер сада и привычки; его можно исправить и сохранить в файле.']]},
 tiho:{brief:'Помочь выбрать климатическую систему через параметры комнаты и расположение людей в ней.',audience:'Жители квартир, выбирающие систему для конкретного помещения и интерьера.',decisions:[['Сначала помещение','Площадь и солнечная сторона дают ориентир по классу. Ссылка открывает соответствующую систему; большой комнате предлагается индивидуальный подбор.'],['Поток становится видимым','Три положения блока на схеме показывают, где проходит линия воздуха относительно дивана и рабочего места. Это иллюстрация расположения, не физическая симуляция.'],['От выбора к заданию','Площадь, солнечная сторона, положение блока и выбранная система собираются в личное задание. Его можно отредактировать и скачать; данные остаются в браузере.']]},
 plan:{brief:'Связать впечатление от квартала с предметным выбором квартиры.',audience:'Покупатели, сравнивающие расположение, число спален, этаж и бюджет.',decisions:[['Дом связан с квартирой','Выбор корпуса открывает его доступные этажи и планировки. Корпус, этаж и бюджет работают в одном подборе.'],['Сравнение вместо памяти','Избранное хранится на устройстве. Два варианта можно рассмотреть рядом: схема, площадь, окружение и цена.'],['Стоимость выбранного варианта','Крупная планировка ведёт к расчёту для этой квартиры. Смена квартиры, взноса и срока пересчитывает условный платёж.']]},
 stebel:{brief:'Перевести эмоциональный выбор подарка в понятный подбор букета.',audience:'Люди, которым нужен букет под конкретный повод и сумму без долгого просмотра каталога.',decisions:[['Меньше визуального шума','Одна композиция на первом экране и более лёгкий набор сохраняют цветочный характер и дают тексту воздух.'],['Две палитры, шесть вариантов','Для каждой палитры доступны S, M и L. Повод и бюджет предлагают подходящий размер; открытка добавляется в карточке букета.'],['Корзина с настоящим поведением','Размер, слова открытки, количество и итог сохраняются на устройстве. Подбор можно скачать; заказ и оплата не создаются.']]}
};
const revised={lesno:{description:'Лесной сад раскрывается через план и четыре сезона. Коллекция помогает найти свой образ, а короткое задание собирает площадь участка, привычки и пожелания.',features:['Схема и сезоны','Коллекция садов','Задание на участок']},tiho:{description:'Подбор начинается с комнаты. Ориентир по мощности связан с системой, а схема показывает поток воздуха относительно мест отдыха и работы.',features:['Расчёт по комнате','Схема потока','Личное задание']},plan:{description:'Генплан, фильтры квартир, сравнение и условный расчёт покупки соединены в один сценарий выбора.',features:['Корпус и этаж','Сравнение квартир','Избранное и расчёт']},stebel:{description:'Выбор подарка по поводу и бюджету продолжается размером букета и личной открыткой. Корзина сохраняет подбор и пересчитывает количество.',features:['Палитра и размер','Открытка','Сохранение подбора']}};
for(const p of allProjects)Object.assign(p,revised[p.id]);
const catalogProjects=[...projects,...allProjects.filter(p=>!selectedIds.includes(p.id))];
function caseMarkup(p){const c=caseStudies[p.id];if(!c)return '';return `<div class="case-context"><div><span>ЗАДАЧА</span><p>${c.brief}</p></div><div><span>ДЛЯ КОГО</span><p>${c.audience}</p></div><div><span>МОЯ РОЛЬ</span><p>Концепция, структура, визуальная система, адаптивный интерфейс и frontend. Самостоятельная работа / 2026.</p></div></div><div class="case-decisions">${c.decisions.map(([title,copy],i)=>`<article><span>0${i+1} / РЕШЕНИЕ</span><h3>${title}</h3><p>${copy}</p></article>`).join('')}</div><p class="case-honesty">Результат — работающий адаптивный прототип с интерактивными состояниями. Концепт: бренды и предложения вымышлены; бизнес-метрики не заявляются.</p>`;}
const $=s=>document.querySelector(s);
const arrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
// Two clipped rows per letter keep the identity readable while it rolls on hover.
const identity=$('.identity');
identity.setAttribute('aria-label','Кирилл Перих — Дизайн / Frontend / Motion');
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
 nival:{src:'images/covers/nival.webp',width:1920,height:1280},
 plan:{src:'images/covers/plan-art-v2.webp',width:1536,height:1024},
 tiho:{src:'images/covers/tiho-interior-hq.webp',width:1536,height:1024},
 mile:{src:'images/covers/mile-art-v2.webp',width:1536,height:1024},
 liniya:{src:'images/covers/liniya-art-v2.webp',width:1536,height:1024},
 hvost:{src:'images/covers/hvost-art-v2.webp',width:1536,height:1024}
};
function screenDimensions(id,kind){const sizes={'lesno-hero':[1425,891],'lesno-detail':[1425,891],'nival-hero':[1425,891],'nival-detail':[1440,900],'plan-hero':[1425,891],'plan-detail':[1425,891],'stebel-hero':[1425,891],'stebel-detail':[1425,891],'tiho-detail':[1425,1060]};const [width,height]=sizes[id+'-'+kind]||[1425,900];return 'width="'+width+'" height="'+height+'"';}
function cover(p,eager=false){const prefix=`images/covers/${p.id}-optimized-`;return `<div class="project-cover image-cover cover-${p.id}" aria-hidden="true"><img class="cover-image" ${eager?'src':'data-src'}="${prefix}1400.webp" ${eager?'srcset':'data-srcset'}="${prefix}800.webp 800w, ${prefix}1400.webp 1400w" sizes="(max-width:600px) 90vw, (max-width:1050px) 88vw, min(84vw,1400px)" alt="" width="1400" height="933" ${eager?'fetchpriority="high"':''}></div>`;}
function loadImages(root){root.querySelectorAll('[data-src]').forEach(el=>{if(el.dataset.srcset){el.srcset=el.dataset.srcset;el.removeAttribute('data-srcset');}el.src=el.dataset.src;el.removeAttribute('data-src');});}
$('#project-titles').innerHTML=projects.map((p,i)=>`<div class="project-title-block" ${i?'aria-hidden="true"':''}><h2>${p.name}</h2><p><span>${p.type}</span><span>Концепт / 2026</span><span class="project-role">Дизайн / Разработка</span></p></div>`).join('');
$('#project-cards').innerHTML=projects.map((p,i)=>`<article class="work-slide" data-index="${i}" ${i?'aria-hidden="true" inert':''}><div class="card-motion"><button class="showcase-card" data-project="${p.id}" aria-label="Посмотреть проект ${p.name} — ${p.type}" aria-haspopup="dialog">${cover(p,i===0)}<span class="cover-cursor" aria-hidden="true">Подробнее ${arrow}</span></button><div class="project-caption"><p>${p.summary}</p><button class="project-open" data-project="${p.id}" aria-haspopup="dialog">О проекте ${arrow}</button></div></div></article>`).join('');
$('#project-grid').innerHTML=catalogProjects.map((p,i)=>` ${i===0?`<h3 class="catalog-group-label">Избранные работы / ${String(projects.length).padStart(2,'0')}</h3>`:i===projects.length?`<h3 class="catalog-group-label">Другие концепты / ${String(allProjects.length-projects.length).padStart(2,'0')}</h3>`:''}<button class="catalog-card" data-project="${p.id}" aria-label="Посмотреть проект ${p.name} — ${p.type}" aria-haspopup="dialog">${cover(p)}<span><strong>${p.name}</strong><small>${p.type}</small>${arrow}</span></button>`).join('');
const previewDialog=$('#preview-dialog'),briefDialog=$('#brief-dialog'),catalogDialog=$('#catalog-dialog');
const focusOrigins=new WeakMap(),closeTickets=new WeakMap();
let currentProject=null,previewScene=null,previewAnimations=[];
document.querySelectorAll('[data-project]').forEach(b=>b.addEventListener('click',()=>{const source=b.classList.contains('showcase-card')?b:b.closest('.work-slide')?.querySelector('.showcase-card')||b.querySelector('.project-cover')||b;openPreview(b.dataset.project,true,source);}));
$('#catalog-toggle').setAttribute('aria-label','Все работы');
$('#catalog-toggle').addEventListener('click',()=>{loadImages($('#project-grid'));showDialog(catalogDialog);});

const track=$('#work'),slides=[...document.querySelectorAll('.work-slide')],titles=[...document.querySelectorAll('.project-title-block')];
$('.work-pagination').innerHTML=projects.map((p,i)=>`<button type="button" data-work-index="${i}" aria-label="${String(i+1).padStart(2,'0')} — Перейти к работе ${p.name}" aria-current="${i===0}"><span>${String(i+1).padStart(2,'0')}</span></button>`).join('');
document.querySelectorAll('[data-work-index]').forEach(button=>button.addEventListener('click',()=>jumpToProject(Number(button.dataset.workIndex))));
let unit=innerHeight*.92,position=0,target=0,raf=0,lastTime=0,current=-1;
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const rgb=hex=>[1,3,5].map(n=>parseInt(hex.slice(n,n+2),16));
const colors=projects.map(p=>rgb(p.color));
function measure(){const height=$('.work-stage').clientHeight;unit=Math.max(450,height*.92);track.style.height=`${height+unit*lastWork}px`;schedule();if(current===-1)position=target;}
function schedule(){target=clamp((scrollY-track.offsetTop)/unit,0,lastWork);if(!raf){lastTime=0;raf=requestAnimationFrame(draw);}}
function draw(time){const dt=lastTime?Math.min(64,time-lastTime):16;lastTime=time;position=reduced.matches?target:position+(target-position)*(1-Math.exp(-dt/150));if(Math.abs(position-target)<.0004)position=target;
 const first=Math.floor(position),fraction=position-first,a=colors[first],b=colors[Math.min(lastWork,first+1)];document.body.style.backgroundColor=`rgb(${a.map((c,i)=>Math.round(c+(b[i]-c)*fraction)).join(',')})`;
 document.body.style.setProperty('--gallery-color',document.body.style.backgroundColor);
 $('.work-stage').style.setProperty('--heading-opacity',String(clamp(1-Math.max(0,scrollY-track.offsetTop-lastWork*unit)/40,0,1)));
 const active=Math.round(position);if(current!==active){current=active;$('#work-count').textContent=String(active+1).padStart(2,'0');document.querySelectorAll('[data-work-index]').forEach((button,i)=>button.setAttribute('aria-current',i===active?'true':'false'));}
 slides.forEach((slide,i)=>{const rawDelta=i-position,delta=Math.abs(rawDelta)<.002?0:rawDelta,visible=Math.abs(delta)<1.25;slide.style.visibility=visible?'visible':'hidden';slide.inert=i!==active;slide.setAttribute('aria-hidden',String(i!==active));titles[i].setAttribute('aria-hidden',String(i!==active));
  slide.style.willChange=position===target?'auto':'transform, opacity';
  if(visible){loadImages(slide);const height=$('#project-cards').clientHeight;const y=delta>0?delta*(height+90):delta*height*.16;const scale=delta>0?1-.08*delta:1+.07*delta;slide.style.transform=reduced.matches?'none':`translate3d(0,${y}px,0) scale(${scale})`;slide.style.opacity=reduced.matches?String(i===active?1:0):String(delta<0?clamp(1+delta*1.55,0,1):1);}
  titles[i].style.opacity=String(i===active?(reduced.matches?1:Math.max(.5,1-Math.abs(delta))):0);titles[i].style.transform=reduced.matches?'none':`translateY(${delta*35}px)`;
 });
 document.body.classList.toggle('in-contact',scrollY>track.offsetHeight-innerHeight*.7);
 if(position!==target)raf=requestAnimationFrame(draw);else{raf=0;lastTime=0;}
}
const galleryInputCooldown=750;
function stopGalleryScroll(){scrollTo({top:scrollY,behavior:'instant'});}
function galleryScroll(top){scrollTo({top,behavior:reduced.matches?'instant':'smooth'});}
function jumpToProject(i){galleryScroll(track.offsetTop+clamp(i,0,lastWork)*unit);}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure);reduced.addEventListener('change',()=>{if(reduced.matches)stopGalleryScroll();schedule();});measure();

// One wheel / trackpad gesture moves one work. Momentum belongs to the same gesture.
let wheelLast=0,wheelDelta=0,wheelDirection=0,wheelConsumed=false,wheelAnimatingUntil=0;
function galleryContact(){galleryScroll($('#contact').offsetTop-$('.masthead').offsetHeight-20);}
function advanceWork(direction){const index=Math.round(target);if(direction>0&&index===lastWork)galleryContact();else jumpToProject(clamp(index+direction,0,lastWork));}
addEventListener('wheel',e=>{
 if(e.ctrlKey||e.defaultPrevented||document.body.classList.contains('modal-open')||Math.abs(e.deltaX)>Math.abs(e.deltaY)||!e.deltaY)return;
 const now=performance.now(),lastTop=track.offsetTop+lastWork*unit;
 const inGallery=scrollY>=track.offsetTop-2&&scrollY<=lastTop+2;
 const returning=e.deltaY<0&&scrollY>lastTop+2&&scrollY<=$('#contact').offsetTop+innerHeight*.2;
 if(!inGallery&&!returning&&now>=wheelAnimatingUntil)return;
 e.preventDefault();
 const direction=Math.sign(e.deltaY),reversing=wheelDirection!==0&&direction!==wheelDirection;
 if(now-wheelLast>180||reversing||(wheelConsumed&&now>wheelAnimatingUntil+220)){wheelConsumed=false;wheelDelta=0;}
 if(reversing){stopGalleryScroll();wheelAnimatingUntil=0;}
 wheelDirection=direction;
 wheelLast=now;
 if(wheelConsumed||now<wheelAnimatingUntil)return;
 const pixels=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);
 if(Math.sign(pixels)!==Math.sign(wheelDelta))wheelDelta=0;
 wheelDelta+=pixels;if(Math.abs(wheelDelta)<20)return;
 wheelConsumed=true;wheelAnimatingUntil=now+(reduced.matches?0:galleryInputCooldown);
 if(returning)jumpToProject(lastWork);else advanceWork(Math.sign(wheelDelta));
},{passive:false});
addEventListener('keydown',e=>{
 if(e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey||document.body.classList.contains('modal-open')||e.target.closest('input,textarea,select,[contenteditable]'))return;
 if(scrollY<track.offsetTop-2||scrollY>track.offsetTop+lastWork*unit+2)return;
 const direction=['ArrowDown','PageDown'].includes(e.key)?1:['ArrowUp','PageUp'].includes(e.key)?-1:0;
 if(!direction)return;e.preventDefault();if(e.repeat)return;
 const reversing=wheelDirection!==0&&direction!==wheelDirection;
 if(!reversing&&performance.now()<wheelAnimatingUntil)return;
 if(reversing)stopGalleryScroll();wheelDirection=direction;
 wheelAnimatingUntil=performance.now()+(reduced.matches?0:galleryInputCooldown);advanceWork(direction);
});

// A vertical touch gesture advances exactly one work; taps and pinch zoom remain native.
const stage=$('.work-stage');
let gesture=null,suppressClickUntil=0;
stage.addEventListener('touchstart',e=>{
 if(e.touches.length!==1||document.body.classList.contains('modal-open')||scrollY<track.offsetTop-2||scrollY>track.offsetTop+lastWork*unit+2){gesture=null;return;}
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
 if(dy<0&&g.index===lastWork){galleryContact();return;}
 jumpToProject(clamp(g.index+(dy<0?1:-1),0,lastWork));
},{passive:true});
stage.addEventListener('touchcancel',()=>{gesture=null;},{passive:true});
stage.addEventListener('click',e=>{if(performance.now()<suppressClickUntil){e.preventDefault();e.stopPropagation();}},{capture:true});
document.querySelectorAll('.showcase-card[data-project]').forEach(card=>{card.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=card.getBoundingClientRect();card.style.setProperty('--cursor-x',`${clamp(e.clientX-r.left,64,r.width-64)}px`);card.style.setProperty('--cursor-y',`${clamp(e.clientY-r.top,52,r.height-52)}px`);});});

function showDialog(dialog){if(dialog.open)return;stopGalleryScroll();if(!document.body.classList.contains('modal-open'))document.body.style.setProperty('--page-width',document.body.getBoundingClientRect().width+'px');focusOrigins.set(dialog,document.activeElement);dialog.showModal();document.body.classList.add('modal-open');dialog.scrollTop=0;}
const previewEase='cubic-bezier(.45,0,.2,1)';
function cancelPreviewAnimations(){previewAnimations.forEach(a=>a.cancel());previewAnimations=[];}
function scenePose(x,y,scale=1){return `translate3d(${x}px,${y}px,0) scale(${scale})`;}
// Keep the gallery card's axis: the page excludes the scrollbar, the viewport does not.
function fullPreviewPose(scene){const centerX=innerWidth*scene.centerRatio;const scale=Math.max(2*Math.max(centerX,innerWidth-centerX)/scene.width,innerHeight/scene.height);return scenePose(centerX-scene.width*scale/2,(innerHeight-scene.height*scale)/2,scale);}
function openPreview(id,changeUrl=true,source=null){
 const p=allProjects.find(p=>p.id===id);if(!p)return;
 closeTickets.delete(previewDialog);cancelPreviewAnimations();delete previewDialog.dataset.closing;previewDialog.classList.remove('is-closing');currentProject=p;
 $('#preview-title').textContent=p.name;$('#preview-niche').textContent=p.type;$('#preview-description').textContent=p.description;$('#preview-features').innerHTML=p.features.map(x=>`<span>${x}</span>`).join('');$('#preview-visit').href=`demos/${id}/`;$('#preview-case').innerHTML=caseMarkup(p);$('#preview-case').hidden=!caseStudies[id];
 const detailLabels={nival:'Пространство и план резиденции',lesno:'Задание на свой участок',yasno:'Расчёт уборки',liniya:'Выбор услуги и запись',tiho:'Положение блока и поток воздуха',mile:'Проверка уровня',hvost:'Подбор ухода',plan:'Выбор и сравнение квартир',stebel:'Размер букета и открытка'};
 $('#preview-visual').innerHTML=`<a href="demos/${id}/" target="_blank" rel="noopener" aria-label="Открыть сайт ${p.name}"><img src="images/project-screens/${id}-hero.webp" alt="${p.name} — дизайн первого экрана" ${screenDimensions(id,'hero')} decoding="async"></a><figcaption><span>01 / Интерфейс</span><span>Дизайн в действии ${arrow}</span></figcaption>`;
 const next=catalogProjects[(catalogProjects.findIndex(project=>project.id===id)+1)%catalogProjects.length];
 $('#next-project').dataset.next=next.id;$('#next-project').setAttribute('aria-label',`Следующая работа — ${next.name}`);$('#next-project-name').textContent=next.name;$('#next-project-type').textContent=next.type;
 $('#preview-shots').innerHTML=['hero','detail'].map((kind,i)=>`<figure><img src="images/project-screens/${id}-${kind}.webp" alt="${p.name} — ${i?detailLabels[id]:'первый экран сайта'}" ${screenDimensions(id,kind)} loading="lazy" decoding="async"><figcaption><span>${i?'02':'01'}</span>${i?detailLabels[id]:'Первый экран'}</figcaption></figure>`).join('');
 previewDialog.style.setProperty('--preview-color',p.color);
 previewDialog.style.setProperty('--preview-tone',rgb(p.color).map(c=>Math.round(c*.94)).join(' '));
 const backdrop=$('#preview-backdrop');backdrop.innerHTML=cover(p,true);
 const rect=source?.getBoundingClientRect(),valid=rect&&rect.width>0&&rect.height>0&&rect.top<innerHeight&&rect.bottom>0;
 previewScene={source:valid?source:null,width:valid?rect.width:innerWidth,height:valid?rect.height:innerHeight,radius:valid?getComputedStyle(source).borderRadius:'0px',gallery:valid&&source.classList.contains('showcase-card'),centerRatio:valid&&source.classList.contains('showcase-card')?(rect.left+rect.width/2)/innerWidth:.5};
 const scene=previewScene;Object.assign(backdrop.style,{width:scene.width+'px',height:scene.height+'px',transform:fullPreviewPose(scene),borderRadius:'0px'});
 previewDialog.style.width=innerWidth+'px';showDialog(previewDialog);previewDialog.scrollTop=0;document.body.classList.add('preview-open');
 if(!reduced.matches&&valid){
  previewAnimations.push(backdrop.animate([
   {transform:scenePose(rect.left,rect.top),borderRadius:scene.radius},
   {transform:fullPreviewPose(scene),borderRadius:'0px'}
  ],{duration:950,easing:previewEase,fill:'backwards'}));
  previewAnimations.push($('.preview-scrim').animate([{opacity:0,offset:0},{opacity:0,offset:.15},{opacity:1,offset:1}],{duration:950,easing:'ease-in-out',fill:'backwards'}));
  for(const [selector,delay] of [['.preview-copy',340],['.preview-top',390],['.preview-visual',420],['.preview-case',450],['.preview-screens',450],['.case-next',450]])previewAnimations.push($(selector).animate([{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,delay,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'}));
 }
 if(changeUrl){const u=new URL(location.href);u.searchParams.set('project',id);if(u.href!==location.href)history.pushState({portfolioProject:true},'',u);}
}
async function closeDialog(dialog,changeUrl=true){
 if(!dialog.open||dialog.dataset.closing)return;
 dialog.dataset.closing='true';const ticket=Symbol();closeTickets.set(dialog,ticket);
 const isPreview=dialog===previewDialog,animations=[];
 if(isPreview){
  const backdrop=$('#preview-backdrop'),currentTransform=getComputedStyle(backdrop).transform,currentRadius=getComputedStyle(backdrop).borderRadius;
  const fading=['.preview-copy','.preview-top','.preview-visual','.preview-case','.preview-screens','.case-next','.preview-scrim'].map(selector=>({element:$(selector),opacity:getComputedStyle($(selector)).opacity}));
  cancelPreviewAnimations();dialog.classList.add('is-closing');
  if(!reduced.matches){
   for(const {element,opacity} of fading)animations.push(element.animate([{opacity},{opacity:0}],{duration:element.classList.contains('preview-scrim')?650:400,easing:'ease-in-out',fill:'forwards'}));
   const scene=previewScene,rect=scene?.source?.getBoundingClientRect(),valid=rect&&rect.width>0&&rect.top<innerHeight&&rect.bottom>0&&Math.abs(rect.width/rect.height-scene.width/scene.height)<.05;
   if(valid){const scale=rect.width/scene.width;animations.push(backdrop.animate([
    {transform:currentTransform,borderRadius:currentRadius},
    {transform:scenePose(rect.left,rect.top,scale),borderRadius:scene.radius}
   ],{duration:700,easing:previewEase,fill:'forwards'}));}
   else animations.push(backdrop.animate([{transform:currentTransform,opacity:1},{transform:currentTransform,opacity:0}],{duration:650,easing:'ease-in-out',fill:'forwards'}));
   previewAnimations=animations;
  }
 }else{dialog.classList.add('is-closing');if(!reduced.matches)animations.push(dialog.animate([{opacity:1},{opacity:0}],{duration:260,easing:'ease-in-out'}));}
 await Promise.all(animations.map(a=>a.finished.catch(()=>{})));
 if(closeTickets.get(dialog)!==ticket)return;
 closeTickets.delete(dialog);dialog.close();delete dialog.dataset.closing;dialog.classList.remove('is-closing');
 if(isPreview){cancelPreviewAnimations();previewScene=null;document.body.classList.remove('preview-open');if(changeUrl){const u=new URL(location.href);u.searchParams.delete('project');history.replaceState(null,'',u);}}
 if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');const origin=focusOrigins.get(dialog);if(origin?.isConnected)origin.focus({preventScroll:true});
}
addEventListener('resize',()=>{if(!previewDialog.open||previewDialog.dataset.closing||!previewScene)return;cancelPreviewAnimations();previewDialog.style.width=innerWidth+'px';$('#preview-backdrop').style.transform=fullPreviewPose(previewScene);});
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeDialog(document.getElementById(b.dataset.close))));
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('cancel',e=>{e.preventDefault();closeDialog(d);}));
$('#next-project').addEventListener('click',()=>{openPreview($('#next-project').dataset.next);const heading=$('#preview-title');heading.tabIndex=-1;heading.focus({preventScroll:true});});
addEventListener('popstate',()=>{const id=new URL(location.href).searchParams.get('project');if(id)openPreview(id,false);else if(previewDialog.open)closeDialog(previewDialog,false);});
const initialProject=new URL(location.href).searchParams.get('project');if(initialProject)openPreview(initialProject,false);

// Depth-based entrance: a level stack settles into the gallery, without sideways rotation.
async function intro(){
 if(reduced.matches||initialProject||location.hash==='#contact'){document.body.classList.remove('intro-pending');return;}
 const overlay=$('#intro-screen'),deck=$('#intro-deck');
 const activeIndex=Math.round(target),order=projects.filter((_,i)=>i!==activeIndex).reverse();order.push(projects[activeIndex]);
 const frame=slides[activeIndex].querySelector('.showcase-card').getBoundingClientRect();if(frame.top<0||frame.bottom>innerHeight){document.body.classList.remove('intro-pending');return;}
 function align(){const r=slides[activeIndex].querySelector('.showcase-card').getBoundingClientRect();Object.assign(deck.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});}
 align();deck.innerHTML=order.map(p=>'<div class="intro-card">'+cover(p)+'</div>').join('');loadImages(deck);overlay.style.backgroundColor=getComputedStyle(document.body).backgroundColor;overlay.hidden=false;document.body.classList.add('intro-playing');document.body.classList.remove('intro-pending');
 let finished=false;const animations=[],events=['wheel','touchstart','keydown'],entranceWidth=innerWidth;
 function resized(){if(innerWidth!==entranceWidth)finish();else align();}
 function finish(){if(finished)return;finished=true;animations.forEach(a=>a.cancel());overlay.hidden=true;deck.replaceChildren();document.body.classList.remove('intro-playing','intro-pending');events.forEach(e=>removeEventListener(e,finish));removeEventListener('resize',resized);reduced.removeEventListener('change',finish);}
 events.forEach(e=>addEventListener(e,finish,{passive:true,once:true}));addEventListener('resize',resized);reduced.addEventListener('change',finish);
 await Promise.race([Promise.all([...deck.querySelectorAll('img')].map(im=>im.decode().catch(()=>{}))),new Promise(resolve=>setTimeout(resolve,100))]);if(finished)return;
 const cards=[...deck.children],ease='cubic-bezier(.45,0,.2,1)',introSpeed=1.25;
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
  ],{duration:2000/introSpeed,delay:(cards.length-1-i)*1000/(Math.max(1,cards.length-1)*introSpeed),easing:ease,fill:'forwards'});
 });
 animations.push(...passes);await Promise.all(passes.map(a=>a.finished.catch(()=>{})));if(finished)return;
 // Only the chosen work lands: the completed stack cannot leak through the front card.
 cards.slice(0,-1).forEach(card=>card.remove());const landingCard=cards.at(-1);
 const settle=[landingCard.animate([{transform:front},{transform:level}],{duration:1000/introSpeed,easing:ease,fill:'forwards'})];
 animations.push(...settle);await Promise.all(settle.map(a=>a.finished.catch(()=>{})));if(finished)return;
 await new Promise(resolve=>setTimeout(resolve,100/introSpeed));if(finished)return;
 const land=[landingCard.animate([{transform:level},{transform:rest}],{duration:1000/introSpeed,easing:ease,fill:'forwards'})];
 animations.push(...land);await Promise.all(land.map(a=>a.finished.catch(()=>{})));if(finished)return;
 document.body.classList.remove('intro-playing');const fade=overlay.animate([{opacity:1},{opacity:0}],{duration:1000/introSpeed,fill:'forwards'});animations.push(fade);await fade.finished.catch(()=>{});finish();
}
requestAnimationFrame(()=>requestAnimationFrame(intro));

const form=$('#brief-form');form.noValidate=true;let step=0;
function updateBriefTelegram(){
 const text=$('#brief-result').value;
 $('#telegram-brief').href=`https://t.me/KiriwPerih?text=${encodeURIComponent(text)}`;
}
$('#brief-result').addEventListener('input',updateBriefTelegram);
$('#telegram-brief').addEventListener('click',e=>{
 if(!$('#brief-result').value.trim()){e.preventDefault();$('#copy-status').textContent='Добавьте описание задачи перед переходом в Telegram.';$('#brief-result').focus();return;}
 updateBriefTelegram();
});
function renderStep(){form.querySelectorAll('.brief-step').forEach((s,i)=>s.hidden=i!==step);document.querySelectorAll('.brief-progress li').forEach((li,i)=>{li.classList.toggle('current',i===step);li.classList.toggle('complete',i<step);});$('#brief-back').hidden=step===0;$('#brief-back').textContent=step===4?'Изменить ответы':'Назад';$('#brief-next').hidden=step===4;$('#brief-next').textContent=step===3?'Собрать описание':'Дальше +';$('#form-error').textContent='';}
document.querySelectorAll('[data-brief]').forEach(b=>b.addEventListener('click',()=>{renderStep();showDialog(briefDialog);}));
function validateStep(){const fields=[...form.querySelector(`[data-step="${step}"]`).querySelectorAll('[required]')];let invalid=fields.find(f=>!f.checkValidity());if(step===0&&!$('#business').value.trim())invalid=$('#business');if(invalid){$('#form-error').textContent=step===0?'Напишите пару слов о бизнесе или идее.':'Выберите один из вариантов.';invalid.focus();return false;}return true;}
function makeBrief(){const d=new FormData(form);const business=d.get('business').trim();const site=d.get('site').trim();const materials=d.getAll('materials');const extra=d.get('extra').trim();
 const lines=['Кирилл, здравствуйте! Хочу обсудить сайт.','',`Бизнес / идея: ${business}`,`Формат: ${d.get('format')}`,`Основная задача: ${d.get('goal')}`,`Материалы: ${materials.length?materials.join(', '):'обсудим, что потребуется подготовить'}`,`Желаемый срок: ${d.get('timing')}`];if(site)lines.push(`Текущий сайт: ${site}`);if(extra)lines.push('',`Дополнительно: ${extra}`);lines.push('','Подскажите, с чего лучше начать и какой объём работы вы видите.');$('#brief-result').value=lines.join('\n');updateBriefTelegram();
 const goal=d.get('goal');const recommendations={'Рассчитать стоимость':'На старте обсудим правила расчёта и то, что посетителю нужно знать до заявки.','Записаться на услугу':'На старте обсудим услуги и способ записи: мессенджер или подключённая система.','Выбрать товар или услугу':'На старте обсудим структуру каталога, параметры выбора и следующий шаг после выбора.','Познакомиться с компанией и работами':'На старте обсудим содержание и проекты, которые лучше всего представят вашу компанию.'};$('#brief-recommendation').textContent=recommendations[goal]||'На старте обсудим предложение, содержание и удобный способ обращения.';$('#copy-status').textContent='';
}
form.addEventListener('submit',e=>{e.preventDefault();if(step>=4)return;if(!validateStep())return;if(step===3)makeBrief();step++;renderStep();briefDialog.scrollTop=0;const heading=form.querySelector(`[data-step="${step}"] h3`);heading.tabIndex=-1;heading.focus({preventScroll:true});});
$('#brief-back').addEventListener('click',()=>{step=Math.max(0,step-1);renderStep();briefDialog.scrollTop=0;});
$('#copy-brief').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#brief-result').value);$('#copy-status').textContent='Описание скопировано.';}catch{$('#brief-result').focus();$('#brief-result').select();$('#copy-status').textContent='Выделили текст. Скопируйте его вручную или скачайте файл.';}});
$('#download-brief').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob(['\uFEFF'+$('#brief-result').value],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Задача-на-сайт.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);$('#copy-status').textContent='Описание подготовлено для скачивания. Бриф не отправлен.';});

