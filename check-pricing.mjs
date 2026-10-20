import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const context={window:{}};
vm.runInNewContext(readFileSync('dist/pricing.js','utf8'),context);
const {plans,estimate}=context.window.portfolioPricing;
const html=readFileSync('dist/index.html','utf8');
for(const [format,amount] of [['landing',20000],['business',50000],['automation',90000]]){
  assert.equal(estimate({format}).total,amount,format+' starts at the advertised price');
  assert.ok(html.includes((amount/1000)+' 000 <small>₽</small>'),format+' price is visible');
  let previous=0;
  for(let blocks=5;blocks<=20;blocks++){
    const q=estimate({format,blocks});
    assert.ok(q.total>=amount&&q.total>=previous,'Adding blocks must not lower the price');
    previous=q.total;
    assert.ok(estimate({format,blocks,design:'individual'}).total>=q.total);
    assert.ok(estimate({format,blocks,design:'premium'}).total>=estimate({format,blocks,design:'individual'}).total);
  }
}
assert.equal(estimate({seo:true,analytics:true}).total,28000);
assert.equal(estimate({blocks:8,design:'premium',seo:true,analytics:true}).total,52000);
assert.equal(estimate({format:'automation',blocks:20,design:'premium',seo:true,analytics:true}).total,208000);
assert.equal(estimate({blocks:999}).blocks,20);
assert.equal(estimate({blocks:-10}).blocks,5);
assert.equal(estimate({format:'unknown',design:'unknown',blocks:'invalid'}).total,20000);
assert.equal(plans.business.timing,'7–10 рабочих дней');
assert.ok(html.includes('data-brief="Сайт + автоматизация"'));
assert.ok(!/15 000|40 000|70 000|15–40|40–70/.test(html),'Retired package prices must not remain on the homepage');
const chat=readFileSync('dist/showcase.js','utf8');
assert.ok(!/15 000|40 000|70 000/.test(chat),'Chat must use current prices');
console.log('OK: all package floors, calculator boundaries/add-ons, monotonic estimates and visible/chat price consistency.');
