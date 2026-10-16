(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const arrow = ''; 
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const data = window.portfolioData;
  const copy = {
    nival:'Архитектура, атмосфера места и выбор резиденции — в одном последовательном знакомстве.',
    lesno:'От прогулки по саду в разные сезоны — к заданию на собственный участок.',
    poryadok:'Понятный расчёт уборки, оформление заказа и рабочее место администратора.',
    plan:'От генплана квартала — к фильтрам, сравнению и выбору своей квартиры.'
  };
  const urlFor = p => p.url || `demos/${p.id}/`;
  const card = p => `<article class="project-card"><a class="project-image" style="--project-color:${p.color}" href="${urlFor(p)}" target="_blank" rel="noopener" aria-label="Открыть сайт ${p.name}"><img src="images/project-screens/${p.id}-hero.webp" alt="${p.name} — первый экран сайта" loading="lazy" width="1440" height="900"><span class="image-cta">Открыть сайт</span></a><div class="project-meta"><h3>${p.name}</h3><span>${p.type} / Концепт</span></div><p class="project-description">${copy[p.id] || p.description}</p><div class="project-links"><button data-case="${p.id}">Разбор проекта ${arrow}</button><a href="${urlFor(p)}" target="_blank" rel="noopener">Открыть сайт ${arrow}</a></div></article>`;
  $('#featured-projects').innerHTML = data.projects.slice(0,4).map(card).join('');
  $('#more-grid').innerHTML = data.projects.slice(4).map(card).join('');
  $('#catalog-toggle').addEventListener('click', e => {
    const button = e.currentTarget, expanded = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(expanded));
    button.innerHTML = `${expanded ? 'Свернуть проекты' : 'Ещё 6 проектов'} <svg aria-hidden="true"><use href="#plus"/></svg>`;
    $('#more-grid').hidden = !expanded;
  });

  const menu = $('.menu-toggle');
  function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Открыть меню');$('#mobile-nav').hidden=true;}
  menu.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded',String(expanded));menu.setAttribute('aria-label',expanded?'Закрыть меню':'Открыть меню');$('#mobile-nav').hidden=!expanded;
  });
  $('#mobile-nav').addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  matchMedia('(min-width:701px)').addEventListener('change',e=>{if(e.matches)closeMenu();});

  const origins = new WeakMap();
  function show(dialog){origins.set(dialog,document.activeElement);dialog.showModal();document.body.classList.add('modal-open');dialog.scrollTop=0;}
  function removeCaseUrl(){const u=new URL(location.href);if(u.searchParams.has('project')){u.searchParams.delete('project');history.replaceState(null,'',u);}}
  function close(dialog){dialog.close();}
  document.querySelectorAll('dialog').forEach(dialog=>{
    dialog.addEventListener('close',()=>{if(dialog.id==='case-dialog')removeCaseUrl();if(!document.querySelector('dialog[open]')){document.body.classList.remove('modal-open');origins.get(dialog)?.focus({preventScroll:true});}});
    dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close(dialog);});
  });
  document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>close(document.getElementById(button.dataset.close))));
  function openCase(id,changeUrl=true){
    const p=data.projects.find(p=>p.id===id);if(!p)return;
    const c=data.cases[id];
    $('#case-content').innerHTML=`<div class="case-header"><p class="eyebrow">${p.type} / САМОСТОЯТЕЛЬНЫЙ КОНЦЕПТ</p><h2 id="case-title">${p.name}</h2><p>${p.description}</p><a class="button button-dark" href="${urlFor(p)}" target="_blank" rel="noopener">Открыть работающий сайт ${arrow}</a></div><img class="case-main-image" src="images/project-screens/${id}-hero.webp" alt="${p.name} — первый экран"><div class="case-body"><div class="case-context"><div><span>ЗАДАЧА</span><p>${c?.brief || p.description}</p></div><div><span>МОЯ РОЛЬ</span><p>Концепция, структура, дизайн, адаптивная вёрстка и разработка интерактивных сценариев.</p></div></div>${c ? c.decisions.map(([title,text],i)=>`<article class="case-decision"><h3>0${i+1} / ${title}</h3><p>${text}</p></article>`).join('') : `<div class="project-tags">${p.features.map(f=>`<span>${f}</span>`).join('')}</div>`}<p class="case-note">${c?.result || 'Самостоятельный концепт с работающим интерфейсом. Бренд и предложения вымышлены. Реальные клиентские заказы и показатели продаж не заявляются.'}</p><img class="case-detail-image" src="images/project-screens/${id}-detail.webp" loading="lazy" alt="${p.name} — интерактивные возможности сайта"><div class="case-footer"><a class="button button-dark" href="${urlFor(p)}" target="_blank" rel="noopener">Попробовать демо ${arrow}</a><button class="text-link" data-case-brief="${p.name}">Обсудить похожую задачу ${arrow}</button></div></div>`;
    if(!$('#case-dialog').open)show($('#case-dialog'));else $('#case-dialog').scrollTop=0;
    if(changeUrl){const u=new URL(location.href);u.searchParams.set('project',id);history.pushState(null,'',u);}
  }
  document.addEventListener('click',e=>{const b=e.target.closest('[data-case]');if(b)openCase(b.dataset.case);const c=e.target.closest('[data-case-brief]');if(c){close($('#case-dialog'));openBrief('Помогите выбрать формат',`Интересует решение в духе проекта ${c.dataset.caseBrief}. `);}});
  addEventListener('popstate',()=>{const id=new URL(location.href).searchParams.get('project');if(id)openCase(id,false);else if($('#case-dialog').open)close($('#case-dialog'));});
  const initialCase=new URL(location.href).searchParams.get('project');if(initialCase)openCase(initialCase,false);

  const form=$('#brief-form'), result=$('#brief-result');
  function openBrief(format,task){
    $('#brief-format').value=format;
    if(!$('#brief-format').value)$('#brief-format').value='Помогите выбрать формат';
    if(task)$('#brief-business').value=task;
    form.hidden=false;result.hidden=true;show($('#brief-dialog'));
  }
  document.querySelectorAll('[data-brief]').forEach(b=>b.addEventListener('click',()=>openBrief(b.dataset.brief)));
  const telegramLink=text=>`https://t.me/KiriwPerih?text=${encodeURIComponent(text)}`;
  function syncBriefLink(){$('#send-brief').href=telegramLink($('#brief-message').value);}
  $('#brief-business').addEventListener('input',e=>e.target.setCustomValidity(''));
  form.addEventListener('submit',e=>{
    e.preventDefault();const business=$('#brief-business').value.trim();
    if(business.length<5){$('#brief-business').setCustomValidity('Опишите задачу чуть подробнее — хотя бы 5 символов.');$('#brief-business').reportValidity();return;}
    const f=new FormData(form);
    $('#brief-message').value=`Кирилл, привет! Хочу обсудить проект.\n\nФормат: ${f.get('format')}\nЗадача: ${business}\nБюджет: ${f.get('budget')}\nЗапуск: ${f.get('time')}\n\nПодскажите, с чего лучше начать?`;
    syncBriefLink();form.hidden=true;result.hidden=false;$('#brief-dialog').scrollTop=0;$('#brief-message').focus();
    $('#brief-status').textContent='Проверьте сообщение и отправьте его в открывшемся чате.';
  });
  $('#brief-message').addEventListener('input',syncBriefLink);
  $('#edit-brief').addEventListener('click',()=>{form.hidden=false;result.hidden=true;$('#brief-business').focus();});
  $('#copy-brief').addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText($('#brief-message').value);$('#brief-status').textContent='Текст скопирован. Вставьте его в сообщение Кириллу.';}
    catch{$('#brief-message').focus();$('#brief-message').select();$('#brief-status').textContent='Выделил текст. Скопируйте его вручную.';}
  });

  document.addEventListener('portfolio:brief',e=>{
    openBrief(e.detail.format,e.detail.task);
    if(e.detail.timing && [...$('#brief-time').options].some(o=>o.value===e.detail.timing))$('#brief-time').value=e.detail.timing;
  });
})();
