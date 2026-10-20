import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const context={window:{}};
vm.runInNewContext(readFileSync('dist/pricing.js','utf8'),context);
const {plans,estimate}=context.window.portfolioPricing;
const html=readFileSync('dist/index.html','utf8');
for(const [format,amount] of [['landing',20000],['business',50000],['automation',90000]]){
  assert.equal(plans[format].base,amount,format+' keeps the advertised package price');
  assert.ok(html.includes((amount/1000)+' 000 <small>₽</small>'),format+' price is visible');
}
for(const [design,min,max] of [['basic',20000,60000],['individual',30000,90000],['premium',50000,150000]]){
  assert.equal(estimate({design,blocks:5}).total,min);
  assert.equal(estimate({design,blocks:15}).total,max);
  let previous=0;
  for(let blocks=5;blocks<=15;blocks++){
    const q=estimate({design,blocks});
    assert.ok(q.total>=min&&q.total<=max&&q.total>previous,'Each extra block increases the price within the selected design cap');
    assert.equal(estimate({design,blocks,seo:false,analytics:false}).total,q.total,'Included settings must not create hidden charges');
    previous=q.total;
  }
}
assert.equal(estimate({blocks:8,design:'basic'}).total,32000);
assert.equal(estimate({blocks:8,design:'individual'}).total,48000);
assert.equal(estimate({blocks:8,design:'premium'}).total,80000);
assert.equal(estimate({blocks:999}).blocks,15);
assert.equal(estimate({blocks:-10}).blocks,5);
assert.equal(estimate({design:'unknown',blocks:'invalid'}).total,20000);
assert.equal(estimate({design:'__proto__'}).total,20000);
assert.equal(estimate({seo:false,analytics:false}).seo,false);
assert.equal(estimate({seo:false,analytics:false}).analytics,false);
assert.equal(plans.business.timing,'7–10 рабочих дней');
assert.ok(html.includes('data-brief="Сайт + автоматизация"'));
const calculator=html.slice(html.indexOf('<section class="project-calculator"'),html.indexOf('<div class="pricing-foot">'));
assert.ok(calculator.includes('max="15"'));
assert.ok(!/calc-format|calc-blocks-note|calculator-note|calculator-timing|\+5 000|\+3 000|<small/.test(calculator),'Calculator must retain the clean reference layout');
assert.ok(!html.includes('pricing-start-note'),'The removed timing paragraph must not return');
assert.ok(!/15 000|40 000|70 000|15–40|40–70/.test(html),'Retired package prices must not remain on the homepage');
const chat=readFileSync('dist/showcase.js','utf8');
assert.ok(!/15 000|40 000|70 000/.test(chat),'Chat must use current prices');
console.log('OK: package prices, 20/30/50k bases, 60/90/150k caps, 5–15 block boundaries, included settings and clean calculator markup.');
