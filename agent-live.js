(() => {
  'use strict';
  const configured=window.portfolioAgentConfig?.apiUrl;
  const local=['127.0.0.1','localhost'].includes(location.hostname);
  const preview=local&&new URLSearchParams(location.search).get('assistant')==='live';
  if(!configured&&!preview)return;
  let api;
  try{api=new URL(configured||'http://127.0.0.1:4190');if(api.protocol!=='https:'&&!(local&&api.protocol==='http:'))return;}catch{return;}
  const frame=document.querySelector('.agent-demo');if(!frame)return;
  window.portfolioLiveAgent=true;
  const log=frame.querySelector('#chat-log');
  const choices=frame.querySelector('#chat-choices');
  const lead=frame.querySelector('#lead-preview');
  const announcement=frame.querySelector('#agent-announcement');
  frame.querySelector('#pause-agent').hidden=true;
  frame.querySelector('#reset-agent').setAttribute('aria-label','Начать диалог заново');
  frame.querySelector('#agent-mode-label').textContent='Консультант по вашему проекту';
  frame.querySelector('.agent-compose').hidden=true;
  frame.querySelector('#agent-interact').textContent='Обсудить проект с Кириллом';
  frame.querySelector('.agent-demo-footer > span').textContent='AI может ошибаться · условия подтверждает Кирилл';
  choices.hidden=true;
  log.setAttribute('aria-label','Диалог с AI-консультантом');
  for(const item of document.querySelectorAll('details')){
    if(item.querySelector('summary')?.textContent.includes('AI-ассистент на этой странице настоящий?')){
      item.querySelector('p').textContent='В этом режиме сообщения обрабатывает AI-модель по информации об услугах Кирилла. Она помогает уточнить задачу и подготовить черновик заявки. Условия и итоговую стоимость подтверждает Кирилл; перед отправкой вы проверяете текст сами.';
    }
  }
  const form=document.createElement('form');form.className='live-agent-form';
  const input=document.createElement('textarea');input.maxLength=2000;input.rows=2;input.placeholder='Расскажите, какой сайт вам нужен…';input.setAttribute('aria-label','Сообщение AI-консультанту');
  const button=document.createElement('button');button.type='submit';button.textContent='Отправить';
  form.append(input,button);
  const status=document.createElement('p');status.className='live-agent-status';status.setAttribute('role','status');
  const note=document.createElement('p');note.className='live-agent-note';note.textContent='Сообщения обрабатывает AI-сервис. Не вводите пароли и платёжные данные. Заявку вы проверяете и отправляете сами.';
  frame.insertBefore(note,log);frame.insertBefore(form,frame.querySelector('.agent-demo-footer'));form.after(status);
  let sessionId,request=null,generation=0,busy=false;
  function scroll(){log.scrollTop=log.scrollHeight;}
  function message(text,user=false){
    const item=document.createElement('div');item.className='message'+(user?' user':'');
    const label=document.createElement('small');label.textContent=user?'ВЫ':'AI-КОНСУЛЬТАНТ';
    const body=document.createElement('span');body.textContent=text;item.append(label,body);log.append(item);scroll();return item;
  }
  function showError(text){
    status.replaceChildren(document.createTextNode(text+' '));
    const link=document.createElement('a');link.href='https://t.me/KiriwPerih';link.target='_blank';link.rel='noopener';link.textContent='Написать Кириллу';status.append(link);
  }
  function setBusy(value){busy=value;button.disabled=value;input.readOnly=value;log.setAttribute('aria-busy',String(value));button.textContent=value?'Думаю…':'Отправить';}
  function reset(){
    generation++;request?.abort();request=null;sessionId=undefined;setBusy(false);log.replaceChildren();lead.replaceChildren();lead.hidden=true;status.textContent='';input.value='';
    message('Здравствуйте! Я AI-консультант Кирилла. Помогу разобраться в форматах сайта, стоимости и подготовить задачу. Что хотите сделать?');
  }
  function renderBrief(brief){
    if(!brief||!['format','task','timing','budget'].every(key=>typeof brief[key]==='string'))return;
    lead.replaceChildren();lead.hidden=false;
    const card=document.createElement('div');card.className='lead-card';
    const title=document.createElement('strong');title.textContent='ЧЕРНОВИК ЗАЯВКИ';
    const text=document.createElement('p');text.textContent=`${brief.format}. ${brief.task}\nСрок: ${brief.timing}. Бюджет: ${brief.budget}.`;
    const action=document.createElement('button');action.type='button';action.className='button button-dark';action.textContent='Проверить и отправить Кириллу';
    action.addEventListener('click',()=>document.dispatchEvent(new CustomEvent('portfolio:brief',{detail:{format:brief.format,task:`${brief.task}\nЖелаемый срок: ${brief.timing}. Бюджет: ${brief.budget}.`,timing:brief.timing}})));
    card.append(title,text);lead.append(card,action);log.append(lead);scroll();
  }
  form.addEventListener('submit',async(event)=>{
    event.preventDefault();const text=input.value.trim();if(!text||busy)return;
    const ownGeneration=generation;const userMessage=message(text,true);setBusy(true);status.textContent='Ассистент готовит ответ…';request=new AbortController();
    const timeout=setTimeout(()=>request?.abort(),110000);
    try{
      const response=await fetch(new URL('/api/chat',api),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text,...(sessionId?{sessionId}:{})}),signal:request.signal});
      const result=await response.json();if(ownGeneration!==generation)return;
      if(!response.ok){if(response.status===410)sessionId=undefined;throw new Error(result.error||'Не удалось получить ответ.');}
      if(typeof result.reply!=='string'||typeof result.sessionId!=='string')throw new Error('Не удалось прочитать ответ.');
      sessionId=result.sessionId;input.value='';message(result.reply);renderBrief(result.brief);announcement.textContent=result.reply;status.textContent='';
    }catch(error){
      if(ownGeneration!==generation)return;
      userMessage.remove();showError(error.name==='AbortError'?'Ответ задерживается. Попробуйте снова.':error instanceof TypeError?'Сервис временно недоступен. Попробуйте позже.':error.message);
    }finally{clearTimeout(timeout);if(ownGeneration===generation){request=null;setBusy(false);input.focus({preventScroll:true});}}
  });
  input.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();form.requestSubmit();}});
  frame.querySelector('#reset-agent').addEventListener('click',()=>{reset();input.focus({preventScroll:true});});
  frame.querySelector('#agent-interact').addEventListener('click',()=>document.dispatchEvent(new CustomEvent('portfolio:brief',{detail:{format:'Помогите выбрать формат',task:'Хочу обсудить проект с Кириллом.'}})));
  reset();
})();
