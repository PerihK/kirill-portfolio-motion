(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const data = window.portfolioData;
  const flow={id:'flow',name:'FLOW',type:'Веб-сервис / CRM',url:'https://flow-web-lime.vercel.app/',description:'Рабочее пространство для заказов, расписания и выездных команд. Самостоятельный проект с демонстрационными данными.'};
  const projectById=id=>id==='flow'?flow:data.projects.find(p=>p.id===id);
  const caseUrl=id=>{const u=new URL(document.querySelector('link[rel="canonical"]').href);u.searchParams.set('project',id);u.hash='works';return u.href;};
  const copy = {
    nival:'Архитектура, атмосфера места и выбор резиденции — в одном последовательном знакомстве.',
    lesno:'От прогулки по саду в разные сезоны — к заданию на собственный участок.',
    poryadok:'Понятный расчёт уборки, оформление заказа и рабочее место администратора.',
    plan:'От генплана квартала — к фильтрам, сравнению и выбору своей квартиры.'
  };
  const urlFor = p => p.url || `demos/${p.id}/`;
  const card = p => `<article class="project-card" id="project-${p.id}"><a class="project-image" style="--project-color:${p.color}" href="${urlFor(p)}" target="_blank" rel="noopener" aria-label="Открыть сайт ${p.name}"><img src="images/project-screens/${p.id}-hero.webp" alt="${p.name} — первый экран сайта" loading="lazy" width="1440" height="900"><span class="image-cta">Открыть сайт</span></a><div class="project-meta"><h3>${p.name}</h3><span>${p.type} / Концепт</span></div><p class="project-description">${copy[p.id] || p.description}</p><div class="project-links"><a href="?project=${p.id}#works" data-case="${p.id}">Разбор проекта</a><a href="${urlFor(p)}" target="_blank" rel="noopener">Открыть сайт</a></div></article>`;
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
    const p=projectById(id);if(!p)return;
    const c=id==='flow'?{
      brief:'Собрать в одном интерфейсе работу сервисной команды: заказы, рабочие статусы, расписание и назначение бригад.',
      decisions:[['От обзора к заказу','На рабочем столе видны заказы и загрузка команды. Из обзора можно перейти к конкретной задаче.'],['Единая рабочая среда','Заказы, сотрудники и расписание связаны в одном интерфейсе — можно оценить логику сервиса, а не только его первый экран.']],
      result:'FLOW — самостоятельный проект. Заказы и данные в демо вымышлены; интерфейс не подтверждает наличие коммерческого внедрения, защищённой серверной CRM или результатов продаж.'
    }:data.cases[id];
    const image=id==='flow'?'images/commercial/flow.webp':`images/project-screens/${id}-hero.webp`;
    $('#case-content').innerHTML=`<div class="case-header"><p class="eyebrow">${p.type} / САМОСТОЯТЕЛЬНЫЙ ПРОЕКТ</p><h2 id="case-title">${p.name}</h2><p>${p.description}</p><div class="case-actions"><a class="button button-dark" href="${urlFor(p)}" target="_blank" rel="noopener">Открыть работающий сайт</a><button class="text-link" data-case-brief="${id}">Обсудить похожую задачу</button></div><button class="text-link case-share" data-copy-case="${id}">Скопировать ссылку на проект</button><input class="case-permalink" aria-label="Прямая ссылка на проект" readonly value="${caseUrl(id)}" hidden><p class="fine-print" id="case-share-status" role="status"></p></div><img class="case-main-image" src="${image}" alt="${p.name} — первый экран"><div class="case-body"><div class="case-context"><div><span>ЗАДАЧА</span><p>${c?.brief || p.description}</p></div><div><span>МОЯ РОЛЬ</span><p>Концепция, структура, дизайн, адаптивная вёрстка и разработка интерактивных сценариев.</p></div></div>${c ? c.decisions.map(([title,text],i)=>`<article class="case-decision"><h3>0${i+1} / ${title}</h3><p>${text}</p></article>`).join('') : `<div class="project-tags">${p.features.map(f=>`<span>${f}</span>`).join('')}</div>`}<p class="case-note">${c?.result || 'Самостоятельный концепт с работающим интерфейсом. Бренд и предложения вымышлены. Реальные клиентские заказы и показатели продаж не заявляются.'}</p>${id==='flow'?'':`<img class="case-detail-image" src="images/project-screens/${id}-detail.webp" loading="lazy" alt="${p.name} — интерактивные возможности сайта">`}<div class="case-footer"><a class="button button-dark" href="${urlFor(p)}" target="_blank" rel="noopener">Попробовать демо</a><button class="text-link" data-case-brief="${id}">Обсудить похожую задачу</button></div></div>`;
    if(!$('#case-dialog').open)show($('#case-dialog'));else $('#case-dialog').scrollTop=0;
    if(changeUrl){const u=new URL(location.href);u.searchParams.set('project',id);u.hash='works';history.pushState(null,'',u);}
  }
  document.addEventListener('click',async e=>{
    const b=e.target.closest('[data-case]');
    if(b&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey&&e.button===0){e.preventDefault();openCase(b.dataset.case);}
    const c=e.target.closest('[data-case-brief]');
    if(c){const id=c.dataset.caseBrief;const p=projectById(id);close($('#case-dialog'));openBrief(id==='flow'?'Веб-сервис / CRM':'Помогите выбрать формат',`Интересует решение в духе проекта ${p.name}. `,id);}
    const share=e.target.closest('[data-copy-case]');
    if(share){try{await navigator.clipboard.writeText(caseUrl(share.dataset.copyCase));$('#case-share-status').textContent='Ссылка скопирована. Она сразу откроет этот проект.';}catch{const input=$('.case-permalink');input.hidden=false;input.focus();input.select();$('#case-share-status').textContent='Скопируйте выделенную ссылку вручную.';}}
  });
  addEventListener('popstate',()=>{const id=new URL(location.href).searchParams.get('project');if(projectById(id))openCase(id,false);else if($('#case-dialog').open)close($('#case-dialog'));});
  const initialCase=new URL(location.href).searchParams.get('project');if(initialCase)openCase(initialCase,false);

  const form=$('#brief-form'), result=$('#brief-result');
  let briefProject='',preparedFromContact=false;
  function openBrief(format,task,project=''){
    briefProject=project;preparedFromContact=false;
    $('#brief-title').textContent='С чего начнём?';
    $('#edit-brief').textContent='Изменить ответы';
    $('#brief-format').value=format;
    if(!$('#brief-format').value)$('#brief-format').value='Помогите выбрать формат';
    if(task)$('#brief-business').value=task;
    form.hidden=false;result.hidden=true;show($('#brief-dialog'));
  }
  document.querySelectorAll('[data-brief]').forEach(b=>b.addEventListener('click',()=>openBrief(b.dataset.brief,b.dataset.task,b.closest('#flow')?'flow':'')));
  const telegramLink=text=>`https://t.me/KiriwPerih?text=${encodeURIComponent(text)}`;
  function syncBriefLink(){$('#send-brief').href=telegramLink($('#brief-message').value);}
  function showPreparedMessage(message,fromContact=false){
    preparedFromContact=fromContact;
    $('#brief-message').value=message;
    syncBriefLink();form.hidden=true;result.hidden=false;
    $('#brief-title').textContent='Проверьте сообщение';
    $('#edit-brief').textContent=fromContact?'Изменить контакты':'Изменить ответы';
    if(!$('#brief-dialog').open)show($('#brief-dialog'));
    $('#brief-dialog').scrollTop=0;$('#brief-message').focus();
    $('#brief-status').textContent='Проверьте сообщение и отправьте его в открывшемся чате.';
  }
  $('#brief-business').addEventListener('input',e=>e.target.setCustomValidity(''));
  form.addEventListener('submit',e=>{
    e.preventDefault();const business=$('#brief-business').value.trim();
    if(business.length<5){$('#brief-business').setCustomValidity('Опишите задачу чуть подробнее — хотя бы 5 символов.');$('#brief-business').reportValidity();return;}
    const f=new FormData(form);
    const site=String(f.get('site')||'').trim();
    showPreparedMessage(`Кирилл, привет! Хочу обсудить проект.\n\nФормат: ${f.get('format')}${site?`\nМой сайт: ${site}`:''}${briefProject?`\nПример из портфолио: ${caseUrl(briefProject)}`:''}\nЗадача: ${business}\nБюджет: ${f.get('budget')}\nЗапуск: ${f.get('time')}\n\nПодскажите, с чего лучше начать?`);
  });
  $('#brief-message').addEventListener('input',syncBriefLink);
  $('#edit-brief').addEventListener('click',()=>{
    if(preparedFromContact){origins.set($('#brief-dialog'),$('#contact-handle'));close($('#brief-dialog'));return;}
    form.hidden=false;result.hidden=true;$('#brief-title').textContent='С чего начнём?';$('#brief-business').focus();
  });
  $('#copy-brief').addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText($('#brief-message').value);$('#brief-status').textContent='Текст скопирован. Вставьте его в сообщение Кириллу.';}
    catch{$('#brief-message').focus();$('#brief-message').select();$('#brief-status').textContent='Выделил текст. Скопируйте его вручную.';}
  });

  $('#contact-handle').addEventListener('input',e=>e.target.setCustomValidity(''));
  $('#contact-form').addEventListener('submit',e=>{
    e.preventDefault();
    const name=$('#contact-name').value.trim(),contact=$('#contact-handle').value.trim();
    if(contact.length<3){$('#contact-handle').setCustomValidity('Укажите телефон или Telegram для связи.');$('#contact-handle').reportValidity();return;}
    showPreparedMessage(`Кирилл, привет! Хочу обсудить сайт: что мешает заявкам и с чего лучше начать.${name?`\n\nИмя: ${name}`:'\n'}\nКонтакт для связи: ${contact}`,true);
  });
  $('#contact-form button[type="submit"]').disabled=false;

  document.addEventListener('portfolio:brief',e=>{
    openBrief(e.detail.format,e.detail.task);
    if(e.detail.timing && [...$('#brief-time').options].some(o=>o.value===e.detail.timing))$('#brief-time').value=e.detail.timing;
  });
})();
