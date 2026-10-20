/* Shared estimates for the project calculator. All amounts are RUB. */
(() => {
  'use strict';
  const plans = {
    landing: {label:'Лендинг',base:20000,timing:'3–5 рабочих дней'},
    business: {label:'Сайт для бизнеса',base:50000,timing:'7–10 рабочих дней'},
    automation: {label:'Сайт + автоматизация',base:90000,timing:'По задаче'}
  };
  const designs = {
    basic: {label:'Лаконичный',base:20000},
    individual: {label:'Индивидуальный',base:30000},
    premium: {label:'Премиум',base:50000}
  };
  function estimate({blocks=5,design='basic',seo=true,analytics=true}={}) {
    const style=Object.hasOwn(designs,design)?designs[design]:designs.basic;
    const count=Number.isFinite(Number(blocks))?Math.min(15,Math.max(5,Math.round(Number(blocks)))):5;
    return {design:style,blocks:count,seo:Boolean(seo),analytics:Boolean(analytics),total:style.base*count/5};
  }
  window.portfolioPricing={plans,designs,estimate};
})();
