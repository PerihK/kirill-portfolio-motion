const products = {
  coral: { name: 'Тёплый привет', price: 3200, image: './images/bouquet-coral.png', description: 'Лёгкий букет для дня, которому хочется добавить цвета.' },
  blue: { name: 'Синяя история', price: 4200, image: './images/bouquet-blue.png', description: 'Нежный букет для слов, которые хочется запомнить.' }
};
const formatPrice = value => new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
let occasion = 'just';
let budget = '3500';
let recommended = 'coral';
let plan = 'twice';
let bag = [];
const bagDialog = document.querySelector('#bag-dialog');

function setPressed(selector, selected) {
  document.querySelectorAll(selector).forEach(button => {
    const key = button.dataset.occasion ?? button.dataset.budget ?? button.dataset.plan;
    button.setAttribute('aria-pressed', String(key === selected));
  });
}
function updateRecommendation() {
  recommended = budget === '3500' ? 'coral' : ['birthday','love'].includes(occasion) ? 'blue' : 'coral';
  const product = products[recommended];
  document.querySelector('#result-name').textContent = product.name;
  document.querySelector('#result-description').textContent = product.description;
  document.querySelector('#result-price').textContent = formatPrice(product.price);
  document.querySelector('#result-image').style.backgroundImage = `url('${product.image}')`;
}
document.querySelectorAll('[data-occasion]').forEach(button => button.addEventListener('click', () => {
  occasion = button.dataset.occasion;
  setPressed('[data-occasion]', occasion);
  updateRecommendation();
}));
document.querySelectorAll('[data-budget]').forEach(button => button.addEventListener('click', () => {
  budget = button.dataset.budget;
  setPressed('[data-budget]', budget);
  updateRecommendation();
}));

function renderBag() {
  const container = document.querySelector('#bag-items');
  container.replaceChildren();
  document.querySelector('#bag-count').textContent = String(bag.length);
  document.querySelector('#bag-count').setAttribute('aria-label', `${bag.length} букетов`);
  document.querySelector('#bag-controls').hidden = bag.length === 0;
  document.querySelector('#order-message').hidden = true;
  if (!bag.length) {
    const empty = document.createElement('div');
    empty.className = 'bag-empty';
    empty.append('Пока здесь пусто. Выберите букет, который хочется подарить.');
    const link = document.createElement('a'); link.href = '#catalog'; link.textContent = 'Посмотреть букеты ↗';
    link.addEventListener('click', () => bagDialog.close());
    empty.append(document.createElement('br'), link);
    container.append(empty);
    return;
  }
  bag.forEach((id, index) => {
    const product = products[id];
    const item = document.createElement('div'); item.className = 'bag-item';
    const image = document.createElement('img'); image.src = product.image; image.alt = '';
    const name = document.createElement('div');
    const strong = document.createElement('strong'); strong.textContent = product.name;
    const small = document.createElement('small'); small.textContent = 'Иллюстрированный букет';
    name.append(strong, small);
    const price = document.createElement('span'); price.textContent = formatPrice(product.price);
    const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Убрать';
    remove.setAttribute('aria-label', `Убрать «${product.name}»`);
    remove.addEventListener('click', () => { bag.splice(index,1); renderBag(); });
    item.append(image,name,price,remove); container.append(item);
  });
  document.querySelector('#bag-total').textContent = formatPrice(bag.reduce((sum,id) => sum + products[id].price, 0));
}
function addToBag(id) {
  bag.push(id);
  renderBag();
  if (!bagDialog.open) bagDialog.showModal();
}
document.querySelector('#add-recommended').addEventListener('click', () => addToBag(recommended));
document.querySelectorAll('[data-add]').forEach(button => button.addEventListener('click', () => addToBag(button.dataset.add)));
document.querySelector('#open-bag').addEventListener('click', () => { renderBag(); bagDialog.showModal(); });
document.querySelector('#clear-bag').addEventListener('click', () => { bag = []; renderBag(); });
document.querySelector('#demo-order').addEventListener('click', () => {
  const handoff = document.querySelector('input[name="handoff"]:checked').value;
  const message = document.querySelector('#order-message');
  message.textContent = `Это демонстрация. Заказ (${handoff === 'delivery' ? 'доставка' : 'самовывоз'}) не создан и оплата не требуется.`;
  message.hidden = false;
});

const plans = {
  twice: { detail: '2 букета в месяц', price: '5 600 ₽', copy: 'Два сезонных букета в месяц. Каждый раз — новая композиция по настроению сезона.' },
  monthly: { detail: '1 букет в месяц', price: '3 200 ₽', copy: 'Один сезонный букет в месяц. Небольшой красивый ритуал для дома.' }
};
document.querySelectorAll('[data-plan]').forEach(button => button.addEventListener('click', () => {
  plan = button.dataset.plan;
  setPressed('[data-plan]', plan);
  document.querySelector('#plan-detail').textContent = plans[plan].detail;
  document.querySelector('#plan-price').firstChild.textContent = plans[plan].price;
}));
document.querySelector('#open-subscription').addEventListener('click', () => {
  document.querySelector('#subscription-dialog-copy').textContent = plans[plan].copy;
  document.querySelector('#subscription-dialog').showModal();
});
document.querySelector('#open-event').addEventListener('click', () => document.querySelector('#event-dialog').showModal());
document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); }));
document.querySelectorAll('.mobile-nav nav a').forEach(link => link.addEventListener('click', () => { document.querySelector('.mobile-nav').open = false; }));
updateRecommendation();
renderBag();
