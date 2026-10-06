const menuButton=document.querySelector('.menu-toggle');
const rail=document.querySelector('.rail');
function closeMenu(restore=false){rail.classList.remove('menu-open');menuButton.setAttribute('aria-expanded','false');if(restore)menuButton.focus();}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';rail.classList.toggle('menu-open',open);menuButton.setAttribute('aria-expanded',String(open));});
rail.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>closeMenu()));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&rail.classList.contains('menu-open'))closeMenu(true);});
document.addEventListener('click',event=>{if(!rail.contains(event.target))closeMenu();});
matchMedia('(min-width:761px)').addEventListener('change',()=>closeMenu());

const requestForm=document.querySelector('#request-form');
const result=document.querySelector('#request-result');
const summary=document.querySelector('#request-summary');
function selection(){return {area:areaInput.value,sunny:document.querySelector('[name=sun]:checked').value==='sunny',placement:roomOptions[roomChoice].name,model:models[selectedModelIndex].kicker,power:capacityOutput.textContent};}
function syncBriefSummary(){const s=selection();document.querySelector('#selection-summary').textContent=`${s.area} м² · ${s.sunny?'солнечная':'обычная'} сторона · ${s.model}. Блок: ${s.placement.toLowerCase()}.${parseFloat(models[selectedModelIndex].power.replace(',','.'))<Number(s.area)*(s.sunny?.12:.1)?' Для этой комнаты нужен более мощный класс.':''}`;}
for(const field of document.querySelectorAll('#area,#area-range,[name=sun]'))field.addEventListener('change',syncBriefSummary);
document.addEventListener('tiho:selection',syncBriefSummary);
document.querySelectorAll('[data-room]').forEach(button=>button.addEventListener('click',syncBriefSummary));
document.querySelector('.model-detail .text-link').addEventListener('click',()=>{requestForm.elements.request.value='Подобрать кондиционер';syncBriefSummary();});
requestForm.addEventListener('submit',event=>{
 event.preventDefault();
 const name=requestForm.elements.name;
 if(!name.value.trim()){name.setCustomValidity('Укажите имя.');name.reportValidity();return;}
 updateCalculator(areaInput,true);syncRoom();syncBriefSummary();
 const s=selection();
 const requested=Number(s.area)*(s.sunny?.12:.1);
 const selectedPower=parseFloat(models[selectedModelIndex].power.replace(',','.'));
 const lines=['ТИХО — задание на климатическую систему','',`Имя: ${name.value.trim()}`,`Задача: ${requestForm.elements.request.value}`,`Комната: ${s.area} м²`,`Сторона: ${s.sunny?'солнечная':'обычная'}`,`Ориентир по мощности: ${s.power}`,`Расположение блока: ${s.placement}`,`Выбранная система: ${s.model}`];
 if(selectedPower<requested)lines.push('Выбранный класс ниже предварительного ориентира — нужен дополнительный подбор.');
 if(requestForm.elements.contact.value.trim())lines.push(`Контакт: ${requestForm.elements.contact.value.trim()}`);
 if(requestForm.elements.notes.value.trim())lines.push('',`Пожелания: ${requestForm.elements.notes.value.trim()}`);
 lines.push('','Авторский концепт. Оценка предварительная; параметры уточняются специалистом. Заявка не отправлена.');
 summary.value=lines.join('\n');result.hidden=false;requestForm.hidden=true;document.querySelector('#result-title').focus();
});
requestForm.elements.name.addEventListener('input',()=>requestForm.elements.name.setCustomValidity(''));
document.querySelector('#edit-request').addEventListener('click',()=>{result.hidden=true;requestForm.hidden=false;requestForm.elements.name.focus();});
document.querySelector('#save-request').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob(['\uFEFF'+summary.value],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='ТИХО — задание.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),2000);document.querySelector('#save-status').textContent='Файл подготовлен. Данные никуда не отправлены.';});
syncBriefSummary();

document.querySelector('#copy-request').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(summary.value);document.querySelector('#save-status').textContent='Задание скопировано.';}catch{summary.focus();summary.select();document.querySelector('#save-status').textContent='Текст выделен. Скопируйте его вручную.';}});
