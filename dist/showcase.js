(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const number = new Intl.NumberFormat('ru-RU');
  const percent = value => value.toLocaleString('ru-RU',{minimumFractionDigits:1,maximumFractionDigits:1})+'%';
  const periods = {
    month:{label:'30 дней',period:'месяц',conversion:4.8,before:1.6,visits:6500,services:3380,leads:312,clients:94,check:6400,checkGrowth:22,bars:[48,65,87,112],labels:['1','2','3','4'],chart:'Заявки по неделям'},
    quarter:{label:'Квартал',period:'квартал',conversion:5.4,before:1.8,visits:21000,services:11550,leads:1134,clients:340,check:6800,checkGrowth:27,bars:[312,378,444],labels:['1-й месяц','2-й месяц','3-й месяц'],chart:'Заявки по месяцам'},
    year:{label:'Год',period:'год',conversion:6,before:2,visits:92000,services:52440,leads:5520,clients:1656,check:7200,checkGrowth:32,bars:[1134,1290,1452,1644],labels:['I кв.','II кв.','III кв.','IV кв.'],chart:'Заявки по кварталам'}
  };
  let currentPeriod='month',counterFrame=0;
  let displayed={...periods.month};
  const periodButtons=[...document.querySelectorAll('[data-period]')];
  const counterKeys=['conversion','before','visits','services','leads','clients','check'];
  function paintCounters(values){
    $('#metric-conversion').textContent=percent(values.conversion);
    $('#metric-leads').textContent=number.format(Math.round(values.leads));
    $('#metric-check').textContent=number.format(Math.round(values.check))+' ₽';
    $('#conversion-before').textContent=percent(values.before);
    $('#conversion-after').textContent=percent(values.conversion);
    for(const key of ['visits','services','leads','clients'])document.querySelector(`[data-funnel="${key}"]`).textContent=number.format(Math.round(values[key]));
  }
  function updateBars(p){
    const chart=$('#leads-bars');
    while(chart.children.length>p.bars.length)chart.lastElementChild.remove();
    while(chart.children.length<p.bars.length){const column=document.createElement('div');column.className='chart-bar-column';column.innerHTML='<span class="chart-bar-value"></span><div class="chart-bar" style="--bar-height:0px"></div><span class="chart-bar-label"></span>';chart.append(column);}
    chart.style.gridTemplateColumns=`repeat(${p.bars.length},minmax(0,1fr))`;
    const max=Math.max(...p.bars);
    [...chart.children].forEach((column,i)=>{column.querySelector('.chart-bar-value').textContent=number.format(p.bars[i]);column.querySelector('.chart-bar-label').textContent=p.labels[i];column.querySelector('.chart-bar').style.setProperty('--bar-height',(p.bars[i]/max*140)+'px');});
    chart.setAttribute('aria-label',`${p.chart}: ${p.bars.map((v,i)=>`${p.labels[i]} — ${number.format(v)}`).join('; ')}`);
  }
  function selectPeriod(key,animate=true){
    if(!periods[key])return;
    cancelAnimationFrame(counterFrame);currentPeriod=key;
    $('.period-switch').style.setProperty('--period-index',String(Object.keys(periods).indexOf(key)));
    const p=periods[key],from={...displayed};
    periodButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.period===key)));
    $('#metric-leads-label').textContent=`Заявок за ${p.period}`;
    $('#metric-conversion-before').textContent=`было ${percent(p.before)}`;
    $('#metric-leads-before').textContent=`было ${number.format(Math.round(p.visits*p.before/100))}`;
    $('#metric-check-growth').textContent=`+${p.checkGrowth}%`;
    $('#leads-chart-title').textContent=p.chart;
    $('#funnel-period').textContent=`за ${p.period}`;
    $('#leads-growth').textContent=`+${Math.round((p.conversion/p.before-1)*100)}%`;
    updateBars(p);
    const rows=document.querySelectorAll('.funnel-row');
    ['visits','services','leads','clients'].forEach((name,i)=>rows[i].querySelector('.funnel-track i').style.width=p[name]/p.visits*100+'%');
    const finish=()=>{$('#dashboard-status').textContent=`Период: ${p.label}. Демонстрационная конверсия ${percent(p.conversion)}, ${number.format(p.leads)} заявок.`;};
    if(reduced.matches||!animate){displayed={...p};paintCounters(displayed);finish();return;}
    const started=performance.now();
    function frame(now){const t=Math.min(1,(now-started)/700),ease=1-Math.pow(1-t,3);for(const name of counterKeys)displayed[name]=from[name]+(p[name]-from[name])*ease;paintCounters(displayed);if(t<1)counterFrame=requestAnimationFrame(frame);else{displayed={...p};finish();}}
    counterFrame=requestAnimationFrame(frame);
  }
  periodButtons.forEach((button,i)=>{
    button.addEventListener('click',()=>selectPeriod(button.dataset.period));
    button.addEventListener('keydown',event=>{let target;if(event.key==='ArrowRight')target=(i+1)%3;if(event.key==='ArrowLeft')target=(i+2)%3;if(event.key==='Home')target=0;if(event.key==='End')target=2;if(target!==undefined){event.preventDefault();periodButtons[target].focus();selectPeriod(periodButtons[target].dataset.period);}});
  });
  selectPeriod('month',false);
  reduced.addEventListener('change',()=>selectPeriod(currentPeriod,false));

  const chat=$('#chat-log'),choices=$('#chat-choices'),lead=$('#lead-preview'),frame=$('.agent-demo');
  let mode='auto',paused=false,inView=false,started=false,controller=new AbortController(),demo={};
  const signalNow=()=>controller.signal;
  const allowed=()=>inView&&!document.hidden&&!paused;
  const abortError=()=>new DOMException('Demo reset','AbortError');
  const run=promise=>promise.catch(error=>{if(error.name!=='AbortError')console.error('Agent demo:',error);});
  function wait(ms,signal){
    if(signal.aborted)return Promise.reject(abortError());
    return new Promise((resolve,reject)=>{
      let id=0,last=performance.now(),elapsed=0;
      const cancel=()=>{cancelAnimationFrame(id);reject(abortError());};
      signal.addEventListener('abort',cancel,{once:true});
      function tick(now){if(signal.aborted)return;const delta=Math.min(70,now-last);last=now;if(allowed())elapsed+=delta;if(elapsed>=ms){signal.removeEventListener('abort',cancel);resolve();}else id=requestAnimationFrame(tick);}
      id=requestAnimationFrame(tick);
    });
  }
  function scrollChat(){chat.scrollTop=chat.scrollHeight;}
  function addMessage(text,user=false){
    const node=document.createElement('div');node.className='message'+(user?' user':'');
    const label=document.createElement('small');label.textContent=user?'КЛИЕНТ':'AI-АССИСТЕНТ';
    const body=document.createElement('span');body.textContent=text;node.append(label,body);chat.append(node);scrollChat();return {node,body};
  }
  async function typeText(body,text,signal){
    if(reduced.matches){body.textContent=text;scrollChat();return;}
    body.classList.add('type-cursor');body.setAttribute('aria-hidden','true');
    try{
      await new Promise((resolve,reject)=>{
        let id=0,last=performance.now(),elapsed=0,rendered=0;
        const cancel=()=>{cancelAnimationFrame(id);reject(abortError());};
        signal.addEventListener('abort',cancel,{once:true});
        function tick(now){if(signal.aborted)return;const delta=Math.min(70,now-last);last=now;if(allowed())elapsed+=delta;const count=Math.min(text.length,Math.floor(elapsed/19));if(count!==rendered){body.textContent=text.slice(0,count);rendered=count;scrollChat();}if(count===text.length){signal.removeEventListener('abort',cancel);resolve();}else id=requestAnimationFrame(tick);}
        id=requestAnimationFrame(tick);
      });
    }finally{body.classList.remove('type-cursor');body.removeAttribute('aria-hidden');}
  }
  async function respond(text,signal){
    if(signal.aborted)throw abortError();
    $('#agent-compose-label').textContent='Ассистент печатает…';
    chat.setAttribute('aria-busy','true');
    if(!reduced.matches){
      await wait(480,signal);
      const typing=document.createElement('div');typing.className='message typing-bubble';typing.setAttribute('aria-label','Ассистент печатает');typing.innerHTML='<i></i><i></i><i></i>';chat.append(typing);scrollChat();
      try{await wait(850,signal);}finally{typing.remove();}
    }
    const {body}=addMessage('');await typeText(body,text,signal);
    chat.setAttribute('aria-busy','false');
    $('#agent-compose-label').textContent=mode==='auto'?'Пример общения с клиентом':'Выберите ответ ниже';
    if(mode==='interactive')$('#agent-announcement').textContent=text;
  }
  function options(items,handler){
    choices.replaceChildren();choices.hidden=false;
    for(const [label,value] of items){
      const button=document.createElement('button');button.type='button';button.textContent=label;
      button.addEventListener('click',()=>{choices.hidden=true;choices.replaceChildren();addMessage(label,true);run(handler(value,signalNow()));},{once:true});choices.append(button);
    }
    $('#agent-compose-label').textContent='Выберите подходящий ответ';
  }
  function openBrief(format,task,timing){document.dispatchEvent(new CustomEvent('portfolio:brief',{detail:{format,task,timing}}));}
  function showLead(values){
    lead.replaceChildren();lead.hidden=false;
    const card=document.createElement('div');card.className='lead-card';
    const title=document.createElement('strong');title.textContent='ЗАДАЧА ПОДГОТОВЛЕНА';
    const text=document.createElement('p');text.textContent=`${values.format}. ${values.goal}. Срок: ${values.timing}.`;
    card.append(title,text);
    const button=document.createElement('button');button.type='button';button.className='button button-dark';button.id='use-demo-brief';button.textContent='Обсудить эту задачу с Кириллом';
    button.addEventListener('click',()=>openBrief(values.format,values.task||`Цель: ${values.goal}. `,values.timing));
    lead.append(card,button);chat.append(lead);scrollChat();
  }
  const autoplay=[
    ['Здравствуйте! Нужен сайт для студии ремонта. Сколько это стоит?',true],
    ['Здравствуйте! Для студии подойдёт сайт с услугами, проектами и заявкой. Стоимость — от 35 000 ₽. Какие задачи он должен решать?',false],
    ['Показывать наши работы и собирать заявки на ремонт.',true],
    ['Тогда соберём портфолио с подробностями проектов и короткую форму обращения. Можно добавить расчёт стоимости. Когда хотите запуститься?',false],
    ['В течение месяца.',true],
    ['Понял. Подготовил задачу для Кирилла: сайт студии ремонта, проекты и форма заявки, запуск в течение месяца. Можно перейти к обсуждению.',false]
  ];
  async function playAuto(signal){
    if(reduced.matches){for(const [text,user] of autoplay)addMessage(text,user);showLead({format:'Сайт для бизнеса',goal:'Проекты и форма заявки',timing:'В течение месяца',task:'Студия ремонта. Нужен сайт с проектами и формой обращения.'});return;}
    while(!signal.aborted){
      for(const [text,user] of autoplay){if(user){await wait(chat.children.length?1400:450,signal);addMessage(text,true);$('#agent-compose-label').textContent='Ассистент читает сообщение…';}else await respond(text,signal);}
      showLead({format:'Сайт для бизнеса',goal:'Проекты и форма заявки',timing:'В течение месяца',task:'Студия ремонта. Нужен сайт с проектами и формой обращения.'});
      $('#agent-compose-label').textContent='Задача готова к обсуждению';
      await wait(7500,signal);chat.replaceChildren();lead.hidden=true;
    }
  }
  async function interactiveStart(signal){
    await respond('Здравствуйте! Помогу выбрать формат сайта. Что вы хотите сделать?',signal);
    options([['Нужен сайт для бизнеса','site'],['Хочу навести порядок в заявках','crm'],['Сколько стоит сайт?','price']],chooseKind);
  }
  async function chooseKind(value,signal){
    if(value==='price'){await respond('Лендинг — от 15 000 ₽, сайт для бизнеса — от 35 000 ₽, веб-сервис с CRM — от 60 000 ₽. Точная стоимость зависит от задачи. Что для вас актуальнее?',signal);options([['Сайт с услугами','site'],['Сервис для команды','crm']],chooseKind);return;}
    demo.kind=value;
    await respond(value==='crm'?'Понятно. Что сейчас сложнее всего в работе с заявками?':'Хорошо. Какое главное действие должен сделать посетитель?',signal);
    options(value==='crm'?[['Не терять обращения','Не терять обращения'],['Планировать работу команды','Планировать работу команды'],['Собирать заказы с сайта','Собирать заказы с сайта']]:[['Оставить заявку','Оставить заявку'],['Выбрать услугу или товар','Выбрать услугу или товар'],['Рассчитать стоимость','Рассчитать стоимость']],chooseGoal);
  }
  async function chooseGoal(value,signal){
    demo.goal=value;
    await respond(demo.kind==='crm'?'Для такой задачи можно связать заказ, статус и ответственного в одном интерфейсе. Когда хотите запуститься?':'Тогда начнём с понятного предложения и короткого пути к этому действию. Когда хотите запуститься?',signal);
    options([['В течение месяца','В течение месяца'],['Через 1–2 месяца','Через 1–2 месяца'],['Пока изучаю варианты','Пока изучаю варианты']],finishInteractive);
  }
  async function finishInteractive(value,signal){
    demo.timing=value;demo.format=demo.kind==='crm'?'Веб-сервис / CRM':demo.goal==='Оставить заявку'?'Лендинг':'Сайт для бизнеса';
    const price=demo.kind==='crm'?'60 000':demo.format==='Лендинг'?'15 000':'35 000';
    await respond(`Отправная точка — ${demo.format}, от ${price} ₽. Собрал вашу задачу. Теперь можно обсудить детали с Кириллом.`,signal);
    showLead(demo);$('#agent-compose-label').textContent='Задача готова к обсуждению';
  }
  function reset(){
    controller.abort();controller=new AbortController();demo={};chat.replaceChildren();chat.setAttribute('aria-busy','false');choices.replaceChildren();choices.hidden=true;lead.replaceChildren();lead.hidden=true;paused=false;
    frame.classList.remove('is-paused');$('#pause-agent').textContent='Пауза';$('#pause-agent').setAttribute('aria-pressed','false');$('#pause-agent').hidden=reduced.matches||mode==='interactive';
    $('#agent-mode-label').textContent=mode==='auto'?'Пример диалога':'Ваш диалог';
    $('#agent-interact').textContent=mode==='auto'?'Попробовать диалог самому':'Смотреть пример диалога';
    $('#agent-compose-label').textContent='Ассистент знакомится с задачей…';
    if(mode==='auto')run(playAuto(signalNow()));else run(interactiveStart(signalNow()));
  }
  $('#pause-agent').addEventListener('click',()=>{paused=!paused;frame.classList.toggle('is-paused',paused);$('#pause-agent').textContent=paused?'Продолжить':'Пауза';$('#pause-agent').setAttribute('aria-pressed',String(paused));});
  $('#reset-agent').addEventListener('click',()=>{started=true;reset();});
  $('#agent-interact').addEventListener('click',()=>{mode=mode==='auto'?'interactive':'auto';started=true;reset();});
  const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(inView&&!started){started=true;reset();}},{threshold:.12});
  observer.observe(frame);
  reduced.addEventListener('change',()=>{if(started)reset();});
})();
