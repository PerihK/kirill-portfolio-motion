/* Shared estimates for the project calculator. All amounts are RUB. */
(() => {
  'use strict';
  const plans = {
    landing: {label:'Лендинг',base:20000,includedBlocks:5,blockRate:2500,timing:'3–5 рабочих дней'},
    business: {label:'Сайт для бизнеса',base:50000,includedBlocks:10,blockRate:3000,timing:'7–10 рабочих дней'},
    automation: {label:'Сайт + автоматизация',base:90000,includedBlocks:10,blockRate:3500,timing:'По задаче'}
  };
  const designs = {
    basic: {label:'Лаконичный',factor:1},
    individual: {label:'Индивидуальный',factor:1.25},
    premium: {label:'Премиум',factor:1.6}
  };
  function estimate({format='landing',blocks,design='basic',seo=false,analytics=false}={}) {
    const plan=plans[format]||plans.landing;
    const style=designs[design]||designs.basic;
    const count=Number.isFinite(Number(blocks))?Math.min(20,Math.max(5,Math.round(Number(blocks)))):plan.includedBlocks;
    const structure=plan.base+Math.max(0,count-plan.includedBlocks)*plan.blockRate;
    return {plan,design:style,blocks:count,seo:Boolean(seo),analytics:Boolean(analytics),total:Math.ceil((structure*style.factor+(seo?5000:0)+(analytics?3000:0))/1000)*1000};
  }
  window.portfolioPricing={plans,designs,estimate};
})();
