const projects = [
 {id:'lesno',name:'ЛЕСНО',type:'Ландшафт'},
 {id:'plan',name:'ПЛАН',type:'Девелопмент'},
 {id:'mile',name:'MILE',type:'Образование'},
 {id:'tiho',name:'ТИХО',type:'Климат'},
 {id:'liniya',name:'ЛИНИЯ',type:'Красота'},
 {id:'hvost',name:'ХВОСТ',type:'Груминг'},
 {id:'yasno',name:'ЯСНО',type:'Клининг'},
 {id:'stebel',name:'СТЕБЕЛЬ',type:'Цветочная студия'}
];
const featuredProjects=projects.slice(0,6);
const $=s=>document.querySelector(s);
const grid=$('#project-grid');
grid.innerHTML=featuredProjects.map((p,i)=>`<button class="project-card project-${p.id}" data-project="${p.id}" aria-label="Открыть сайт ${p.name} — ${p.type}" aria-haspopup="dialog"><span class="project-art"><span class="project-window"><span class="project-chrome" aria-hidden="true"><span>● ● ●</span><span>${p.name.toLowerCase()}</span><span>↗</span></span><picture><source media="(max-width: 600px)" srcset="images/${p.id}-mobile.webp"><img src="images/${p.id}.webp" alt="Первый экран сайта ${p.name}" loading="${i===0?'eager':'lazy'}" width="1250" height="668"></picture></span><span class="project-open" aria-hidden="true">Открыть сайт ↗</span></span><span class="project-caption"><span class="project-name">${p.name}</span><span class="project-niche">${p.type}</span><span class="project-arrow" aria-hidden="true">↗</span></span></button>`).join('');
document.querySelectorAll('[data-project]').forEach(b=>b.addEventListener('click',()=>openSite(b.dataset.project)));

const siteDialog=$('#site-dialog'),briefDialog=$('#brief-dialog');
const siteFrame=$('#site-frame');
let returnFocus=null;
const phoneStage=$('#mobile-stage'),phoneArtboard=$('#mobile-artboard');
// The narrow composition crops the same artboard, so the live site keeps its scroll position.
new ResizeObserver(([entry])=>{
 const narrow=window.matchMedia('(max-width: 600px)').matches;
 const scale=entry.contentRect.width/(narrow?550:1448);
 phoneArtboard.style.transform=narrow?`matrix(${scale},0,0,${scale},${-485*scale},${-5*scale})`:`scale(${scale})`;
}).observe(phoneStage);
function showDialog(dialog){if(dialog.open)return;returnFocus=document.activeElement;dialog.showModal();document.body.classList.add('modal-open');dialog.scrollTop=0;}
function closeDialog(dialog,changeUrl=true){dialog.close();if(dialog===siteDialog){siteFrame.removeAttribute('src');$('#site-loading').hidden=false;if(changeUrl){const u=new URL(location.href);u.searchParams.delete('project');history.replaceState(null,'',u);}}if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});}
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
