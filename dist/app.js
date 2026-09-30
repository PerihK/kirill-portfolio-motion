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
const index=$('#project-index');
const mobile=window.matchMedia('(max-width: 760px)');
let selected=0;
index.innerHTML = featuredProjects.map((p,i)=>`<button class="project-tab" id="tab-${p.id}" role="tab" aria-selected="${i===0}" aria-controls="project-panel" tabindex="${i===0?0:-1}" data-index="${i}"><span class="tab-number">${String(i+1).padStart(2,'0')}</span><span class="tab-name">${p.name}</span><span class="tab-type">${p.type}</span><img class="mobile-preview" src="images/${p.id}.webp" alt="Сайт ${p.name}" loading="lazy" width="1250" height="668"></button>`).join('');
function setIndexMode(){
 index.setAttribute('role',mobile.matches?'group':'tablist');
 if(mobile.matches)index.removeAttribute('aria-orientation');else index.setAttribute('aria-orientation','vertical');
 index.querySelectorAll('button').forEach((b,i)=>{b.setAttribute('role',mobile.matches?'button':'tab');b.tabIndex=mobile.matches?0:(i===selected?0:-1);if(mobile.matches){b.removeAttribute('aria-selected');b.removeAttribute('aria-controls');b.setAttribute('aria-haspopup','dialog');}else{b.setAttribute('aria-selected',String(i===selected));b.setAttribute('aria-controls','project-panel');b.removeAttribute('aria-haspopup');}});
}
function selectProject(i){
 selected=(i+featuredProjects.length)%featuredProjects.length;const p=featuredProjects[selected];
 const panel=$('#project-panel');panel.setAttribute('aria-labelledby','tab-'+p.id);
 $('#preview-image').src=`images/${p.id}.webp`;$('#preview-image').alt='Первый экран сайта '+p.name;
 $('#viewer-name').textContent=p.name;$('#viewer-niche').textContent=p.type;
 $('#preview-open').setAttribute('aria-label','Открыть сайт '+p.name);
 panel.classList.remove('switching');requestAnimationFrame(()=>panel.classList.add('switching'));setIndexMode();
}
index.addEventListener('click',e=>{const b=e.target.closest('[data-index]');if(!b)return;const i=Number(b.dataset.index);selectProject(i);if(mobile.matches)openSite(featuredProjects[i].id);});
index.addEventListener('keydown',e=>{if(mobile.matches)return;let i=selected;if(e.key==='ArrowDown')i++;else if(e.key==='ArrowUp')i--;else if(e.key==='Home')i=0;else if(e.key==='End')i=featuredProjects.length-1;else return;e.preventDefault();selectProject(i);$('#tab-'+featuredProjects[selected].id).focus();});
mobile.addEventListener('change',setIndexMode);setIndexMode();
$('#preview-open').addEventListener('click',()=>openSite(featuredProjects[selected].id));
document.querySelectorAll('[data-project]').forEach(b=>b.addEventListener('click',()=>openSite(b.dataset.project)));

$('#viewer-demo').addEventListener('click',()=>openSite(featuredProjects[selected].id));

const siteDialog=$('#site-dialog'),briefDialog=$('#brief-dialog');
const siteFrame=$('#site-frame');
let returnFocus=null;
const phoneStage=$('#mobile-stage'),phoneArtboard=$('#mobile-artboard');
new ResizeObserver(([entry])=>{phoneArtboard.style.transform=`scale(${entry.contentRect.width/1448})`;}).observe(phoneStage);
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
