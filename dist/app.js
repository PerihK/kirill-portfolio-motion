const projects = [
 {id:'lesno',name:'ЛЕСНО',type:'Ландшафтное бюро',summary:'Природа. Архитектура. Вы.',color:'#e5e7dc'},
 {id:'plan',name:'ПЛАН',type:'Девелопмент',summary:'Город начинается у вашего дома.',color:'#dce3ed'},
 {id:'mile',name:'MILE',type:'Образование',summary:'Новый город. Ваш язык.',color:'#f0e5db'},
 {id:'tiho',name:'ТИХО',type:'Климат',summary:'Комфорт, который продуман.',color:'#dbe6e2'},
 {id:'liniya',name:'ЛИНИЯ',type:'Красота',summary:'Новая форма. Ваш характер.',color:'#eee2dc'},
 {id:'hvost',name:'ХВОСТ',type:'Груминг',summary:'Чистые лапы. Довольный пёс.',color:'#e9e6da'},
 {id:'yasno',name:'ЯСНО',type:'Клининг',summary:'Чистый дом. Новый старт.',color:'#e5e7e0'},
 {id:'stebel',name:'СТЕБЕЛЬ',type:'Цветочная студия',summary:'Цветы к вашему моменту.',color:'#f3e7d1'}
];
const $=s=>document.querySelector(s);
const arrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';
$('#project-titles').innerHTML=projects.map((p,i)=>`<div class="project-title-block" ${i?'aria-hidden="true"':''}><h2>${p.name}</h2><p>${p.type}<span>·</span>Концепт / 2026</p></div>`).join('');
const phone=`<div class="mobile-stage" id="mobile-stage"><div class="mobile-artboard" id="mobile-artboard"><img class="phone-poster" data-src="images/yasno-phone.png" alt="ЯСНО — живой сайт в телефоне" width="1448" height="1086"><span class="poster-number-cover" aria-hidden="true"></span><div class="phone-cutout"><div class="phone-glass"><div class="phone-screen"><img class="phone-fallback" data-src="images/yasno-mobile.webp" alt="Первый экран мобильного сайта ЯСНО" width="414" height="882"><iframe data-src="demos/yasno/?embedded=1" title="Мобильный сайт ЯСНО — прокрутка и калькулятор уборки"></iframe></div></div></div></div></div>`;
$('#project-cards').innerHTML=projects.map((p,i)=>`<article class="work-slide ${p.id==='yasno'?'phone-slide':''}" data-index="${i}" ${i?'aria-hidden="true" inert':''}><div class="card-motion">${p.id==='yasno'?`<div class="showcase-card phone-composition">${phone}</div>`:`<button class="showcase-card" data-project="${p.id}" aria-label="Открыть сайт ${p.name} — ${p.type}" aria-haspopup="dialog"><picture><source media="(max-width:600px)" data-srcset="images/${p.id}-mobile.webp"><img ${i===0?'src':'data-src'}="images/${p.id}.webp" alt="Первый экран сайта ${p.name}" width="1250" height="668" ${i===0?'fetchpriority="high"':''}></picture><span class="cover-cursor" aria-hidden="true">Смотреть ${arrow}</span></button>`}<div class="project-caption"><p>${p.id==='yasno'?'Листайте сайт внутри телефона.':p.summary}</p><button class="project-open" data-project="${p.id}" aria-haspopup="dialog">Открыть сайт ${arrow}</button></div></div></article>`).join('');
$('#project-nav').innerHTML=projects.map((p,i)=>`<button data-jump="${i}" aria-label="Перейти к проекту ${p.name}" ${i===0?'aria-current="true"':''}><img src="images/${p.id}.webp" alt="" width="56" height="32"><span>${p.name}</span></button>`).join('');
$('#project-grid').innerHTML=projects.map(p=>`<button class="catalog-card" data-project="${p.id}" aria-label="Открыть сайт ${p.name} — ${p.type}" aria-haspopup="dialog"><img src="images/${p.id}.webp" alt="Первый экран сайта ${p.name}" loading="lazy" width="1250" height="668"><span><strong>${p.name}</strong><small>${p.type}</small>${arrow}</span></button>`).join('');
const siteDialog=$('#site-dialog'),briefDialog=$('#brief-dialog'),catalogDialog=$('#catalog-dialog'),siteFrame=$('#site-frame');
let returnFocus=null;
document.querySelectorAll('[data-project]').forEach(b=>b.addEventListener('click',()=>{if(catalogDialog.open){catalogDialog.close();$('#catalog-toggle').focus({preventScroll:true});}openSite(b.dataset.project);}));
$('#catalog-toggle').setAttribute('aria-label','Все работы');
$('#catalog-toggle').addEventListener('click',()=>showDialog(catalogDialog));
const phoneStage=$('#mobile-stage'),phoneArtboard=$('#mobile-artboard');
new ResizeObserver(([entry])=>{const narrow=matchMedia('(max-width:600px)').matches;const scale=entry.contentRect.width/(narrow?550:1448);phoneArtboard.style.transform=narrow?`matrix(${scale},0,0,${scale},${-485*scale},${-5*scale})`:`scale(${scale})`;}).observe(phoneStage);
const track=$('#work'),slides=[...document.querySelectorAll('.work-slide')],titles=[...document.querySelectorAll('.project-title-block')],jumps=[...document.querySelectorAll('[data-jump]')];
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
let unit=innerHeight*.92,position=0,target=0,raf=0,lastTime=0,current=-1;
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const rgb=hex=>[1,3,5].map(n=>parseInt(hex.slice(n,n+2),16));
const colors=projects.map(p=>rgb(p.color));
function measure(){unit=Math.max(450,innerHeight*.92);track.style.height=`${innerHeight+unit*7}px`;schedule();}
function schedule(){target=clamp((scrollY-track.offsetTop)/unit,0,7);if(!raf){lastTime=0;raf=requestAnimationFrame(draw);}}
function draw(time){const dt=lastTime?Math.min(64,time-lastTime):16;lastTime=time;position=reduced.matches?target:position+(target-position)*(1-Math.exp(-dt/75));if(Math.abs(position-target)<.0004)position=target;
 const first=Math.floor(position),fraction=position-first,a=colors[first],b=colors[Math.min(7,first+1)];document.body.style.backgroundColor=`rgb(${a.map((c,i)=>Math.round(c+(b[i]-c)*fraction)).join(',')})`;
 const active=Math.round(position);if(current!==active){current=active;$('.work-stage').classList.toggle('has-phone',projects[active].id==='yasno');$('#work-count').textContent=String(active+1).padStart(2,'0');jumps.forEach((b,i)=>i===active?b.setAttribute('aria-current','true'):b.removeAttribute('aria-current'));}
 slides.forEach((slide,i)=>{const delta=i-position,visible=Math.abs(delta)<1.25;slide.style.visibility=visible?'visible':'hidden';slide.inert=i!==active;slide.setAttribute('aria-hidden',String(i!==active));titles[i].setAttribute('aria-hidden',String(i!==active));
  if(visible){slide.querySelectorAll('[data-srcset]').forEach(el=>{el.srcset=el.dataset.srcset;el.removeAttribute('data-srcset');});slide.querySelectorAll('[data-src]').forEach(el=>{el.src=el.dataset.src;el.removeAttribute('data-src');});const height=$('#project-cards').clientHeight;const y=delta>0?delta*(height+90):delta*height*.16;const scale=delta>0?1-.08*delta:1+.07*delta;slide.style.transform=reduced.matches?'none':`translate3d(0,${y}px,0) scale(${scale})`;slide.style.opacity=reduced.matches?String(i===active?1:0):String(delta<0?clamp(1+delta*1.55,0,1):1);}
  titles[i].style.opacity=String(i===active?(reduced.matches?1:Math.max(.5,1-Math.abs(delta))):0);titles[i].style.transform=reduced.matches?'none':`translateY(${delta*35}px)`;
 });
 document.body.classList.toggle('in-contact',scrollY>track.offsetHeight-innerHeight*.7);
 if(position!==target)raf=requestAnimationFrame(draw);else{raf=0;lastTime=0;}
}
jumps.forEach((button,i)=>button.addEventListener('click',()=>{scrollTo({top:track.offsetTop+i*unit,behavior:reduced.matches?'instant':'smooth'});}));
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure);reduced.addEventListener('change',schedule);measure();
document.querySelectorAll('.showcase-card[data-project]').forEach(card=>{card.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=card.getBoundingClientRect();card.style.setProperty('--cursor-x',`${clamp(e.clientX-r.left,64,r.width-64)}px`);card.style.setProperty('--cursor-y',`${clamp(e.clientY-r.top,52,r.height-52)}px`);});});

function showDialog(dialog){if(dialog.open)return;returnFocus=document.activeElement;dialog.showModal();document.body.classList.add('modal-open');dialog.scrollTop=0;}
async function closeDialog(dialog,changeUrl=true){if(!dialog.open||dialog.dataset.closing)return;dialog.dataset.closing='true';if(!reduced.matches){await dialog.animate([{opacity:1,transform:'translateY(0) scale(1)'},{opacity:0,transform:'translateY(20px) scale(.97)'}],{duration:220,easing:'cubic-bezier(.22,1,.36,1)'}).finished.catch(()=>{});}dialog.close();delete dialog.dataset.closing;if(dialog===siteDialog){siteFrame.removeAttribute('src');$('#site-loading').hidden=false;if(changeUrl){const u=new URL(location.href);u.searchParams.delete('project');history.replaceState(null,'',u);}}if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});}
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeDialog(document.getElementById(b.dataset.close))));
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('cancel',e=>{e.preventDefault();closeDialog(d);}));
siteFrame.addEventListener('load',()=>{if(!siteFrame.hasAttribute('src'))return;$('#site-loading').hidden=true;try{const doc=siteFrame.contentDocument;doc.addEventListener('keydown',e=>{if(e.key==='Escape'&&!e.defaultPrevented&&!doc.querySelector('dialog[open]')){e.preventDefault();closeDialog(siteDialog);}});}catch{}});
function openSite(id,changeUrl=true){const p=projects.find(p=>p.id===id);if(!p)return;$('#site-title').textContent=p.name;$('#site-niche').textContent=p.type;$('#site-external').href=`demos/${id}/`;siteFrame.title='Сайт '+p.name;$('#site-loading').hidden=false;showDialog(siteDialog);siteFrame.src=`demos/${id}/?embedded=1`;if(changeUrl){const u=new URL(location.href);u.searchParams.set('project',id);if(u.href!==location.href)history.pushState({portfolioSite:true},'',u);}}
window.addEventListener('popstate',()=>{const id=new URL(location.href).searchParams.get('project');if(id)openSite(id,false);else if(siteDialog.open)closeDialog(siteDialog,false);});
const initialProject=new URL(location.href).searchParams.get('project');if(initialProject)openSite(initialProject,false);

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
