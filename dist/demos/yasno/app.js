(() => {
  'use strict';
  const services = {deep:{name:'Генеральная уборка',rate:110},renovation:{name:'После ремонта',rate:180},moving:{name:'Перед переездом',rate:85}};
  const extras = {windows:{name:'Мытьё окон',price:1200},balcony:{name:'Балкон',price:1500},fridge:{name:'Холодильник внутри',price:600}};
  const form=document.querySelector('#estimate-form');
  const range=document.querySelector('#area');
  const number=document.querySelector('#area-number');
  const dialog=document.querySelector('#request-dialog');
  const content=document.querySelector('#request-content');
  const money=new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB',maximumFractionDigits:0});
  let lastRequest=null;
  let pendingEstimate=null;
  const getEstimate=()=>{
    const service=form.elements.service.value;
    const area=Number(range.value);
    const selected=[...form.querySelectorAll('[name="extra"]:checked')].map(x=>x.value);
    const base=Math.max(4500,area*services[service].rate);
    return {service,serviceName:services[service].name,area,rate:services[service].rate,extras:selected,base,total:base+selected.reduce((sum,key)=>sum+extras[key].price,0)};
  };
  const update=()=>{
    const e=getEstimate();
    document.querySelector('#total').textContent=money.format(e.total);
    document.querySelector('#estimate-detail').textContent=e.area*e.rate<4500?'Минимум 4 500 ₽'+(e.extras.length?' + доп. услуги':''):`${e.area} м² × ${e.rate} ₽`+(e.extras.length?' + доп. услуги':'');
    range.setAttribute('aria-valuetext',`${e.area} квадратных метров`);
    return e;
  };
  range.addEventListener('input',()=>{number.value=range.value;update();});
  number.addEventListener('input',()=>{if(number.validity.valid&&number.value!==''){range.value=number.value;update();}});
  number.addEventListener('change',()=>{const value=Number(number.value);number.value=String(Math.min(250,Math.max(20,Number.isFinite(value)&&number.value!==''?Math.round(value):60)));range.value=number.value;update();});
  form.addEventListener('change',update);
  document.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{
    form.querySelector(`input[value="${button.dataset.service}"]`).checked=true;update();
    document.querySelector('#calculator').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    form.querySelector('input[name="service"]:checked').focus({preventScroll:true});
  }));
  const receiptHTML=e=>`<div class="receipt"><div class="receipt-row"><span>Уборка</span><span>${e.serviceName}</span></div><div class="receipt-row"><span>Площадь</span><span>${e.area} м²</span></div>${e.extras.map(key=>`<div class="receipt-row"><span>${extras[key].name}</span><span>${money.format(extras[key].price)}</span></div>`).join('')}<div class="receipt-row receipt-total"><span>Итого</span><span>${money.format(e.total)}</span></div></div>`;
  const openPreview=()=>{
    pendingEstimate=getEstimate();
    content.innerHTML=`<span class="modal-eyebrow">ТЕСТОВЫЙ СЦЕНАРИЙ</span><h2 class="modal-title" id="request-title">Вот так выглядит<br>ваша заявка.</h2><p class="modal-description">Проверьте расчёт и создайте тестовую заявку. Контактные данные не нужны — это демонстрация.</p>${receiptHTML(pendingEstimate)}<button type="button" id="create-demo" class="button button-blue full-width">Создать тестовую заявку <span aria-hidden="true">↗</span></button><p class="demo-note">Сохранение только в этой вкладке. Никому не отправляется.</p>`;
    if(!dialog.open)dialog.showModal();
    document.querySelector('#create-demo').addEventListener('click',completeDemo);
  };
  const completeDemo=()=>{
    if(!pendingEstimate)return lastRequest;
    const request={id:`DEMO-${Date.now().toString(36).toUpperCase()}`,createdAt:new Date().toISOString(),demo:true,status:'local-demo',...pendingEstimate};
    pendingEstimate=null;lastRequest=request;
    let saved=true;
    try{sessionStorage.setItem('yasno-demo-request',JSON.stringify(request));}catch{saved=false;}
    content.innerHTML=`<div class="success-mark" aria-hidden="true">✓</div><span class="modal-eyebrow">${request.id}</span><h2 class="modal-title" id="request-title">Пример готов.</h2><p class="modal-description">${saved?'Тестовая заявка сохранена в этой вкладке.':'Заявка создана в памяти страницы. Браузер запретил сохранение — скачайте расчёт, чтобы оставить копию.'} В рабочем сервисе на этом шаге она поступит менеджеру.</p>${receiptHTML(request)}<ol class="demo-flow" aria-label="Этапы демонстрации"><li>Расчёт ✓</li><li>Заявка ✓</li><li>Передача — демо</li></ol><div class="modal-actions"><button type="button" class="button button-blue" id="download-estimate">Скачать расчёт</button><button type="button" class="button button-outline" id="finish-demo">Вернуться</button></div><p class="receipt-status" role="status">Реальный заказ не создан. Telegram и CRM не подключены.</p>`;
    document.querySelector('#download-estimate').addEventListener('click',()=>{
      const lines=['ЯСНО — ДЕМОНСТРАЦИОННЫЙ РАСЧЁТ',`Номер: ${request.id}`,`Дата: ${new Date(request.createdAt).toLocaleString('ru-RU')}`,`Услуга: ${request.serviceName}`,`Площадь: ${request.area} м²`,`База: ${money.format(request.base)}`,...request.extras.map(key=>`${extras[key].name}: ${money.format(extras[key].price)}`),`Итого: ${money.format(request.total)}`,'','Демонстрация для портфолио. Реальная услуга не заказана. Данные никуда не отправлены.'];
      const url=URL.createObjectURL(new Blob(['\uFEFF'+lines.join('\n')],{type:'text/plain;charset=utf-8'}));
      const a=document.createElement('a');a.href=url;a.download=`yasno-${request.id}.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    });
    document.querySelector('#finish-demo').addEventListener('click',()=>dialog.close());
    document.querySelector('#download-estimate').focus();
    return request;
  };
  form.addEventListener('submit',event=>{event.preventDefault();if(form.reportValidity())openPreview();});
  document.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{pendingEstimate=null;});
  update();

  // The structured interface shares calculator state with the visible controls.
  const context=document.modelContext;
  if(context?.registerTool){
    const lifecycle=new AbortController();
    const register=tool=>{try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{/* Unsupported experimental API: the ordinary interface remains available. */}};
    register({name:'configure_cleaning_estimate',title:'Рассчитать уборку',description:'Set cleaning type, area and optional extras in the visible demo calculator. Does not create or send a request.',inputSchema:{type:'object',properties:{service:{type:'string',enum:Object.keys(services)},area:{type:'integer',minimum:20,maximum:250},extras:{type:'array',items:{type:'string',enum:Object.keys(extras)},uniqueItems:true}},required:['service','area','extras'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){
      if(!input||typeof input!=='object'||!Object.hasOwn(services,input.service)||!Number.isInteger(input.area)||input.area<20||input.area>250||!Array.isArray(input.extras)||input.extras.some(key=>!Object.hasOwn(extras,key))||new Set(input.extras).size!==input.extras.length||Object.keys(input).some(key=>!['service','area','extras'].includes(key)))throw new Error('Invalid estimate: choose a supported service, area 20–250 and valid unique extras.');
      form.querySelector(`input[name="service"][value="${input.service}"]`).checked=true;range.value=number.value=input.area;form.querySelectorAll('[name="extra"]').forEach(x=>{x.checked=input.extras.includes(x.value);});return update();
    }});
    register({name:'read_cleaning_estimate',title:'Текущий расчёт',description:'Read the currently displayed cleaning estimate. No data is sent or saved.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute(){return getEstimate();}});
    window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
  }
})();
