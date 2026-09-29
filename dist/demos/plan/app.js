const projectInfo = {
  'Остров': { description: 'Квартал рядом с водой: прогулочный маршрут, закрытый двор и разные форматы квартир — от компактных до семейных.', facts: ['Приморский район', 'IV кв. 2027', 'от 11,8 млн ₽'] },
  'Ритм': { description: 'Клубный дом для тех, кто любит быть в центре событий и возвращаться в камерное пространство.', facts: ['Петроградская сторона', 'II кв. 2028', 'от 13,2 млн ₽'] },
  'Сад': { description: 'Семейный квартал с зелёным маршрутом, местами для игр и привычными делами поблизости.', facts: ['Московский район', 'I кв. 2029', 'от 9,9 млн ₽'] }
};

const apartments = [
  { id: 'А-24', rooms: 1, area: '35,8', floor: 6, price: '11,8 млн ₽', priceNumber: 11800000, feature: 'Кухня-гостиная и место для хранения', plan: 1 },
  { id: 'А-76', rooms: 2, area: '56,4', floor: 8, price: '16,2 млн ₽', priceNumber: 16200000, feature: 'Два окна в гостиной', plan: 2 },
  { id: 'Б-31', rooms: 2, area: '64,7', floor: 4, price: '18,4 млн ₽', priceNumber: 18400000, feature: 'Мастер-спальня и два санузла', plan: 3 },
  { id: 'В-18', rooms: 3, area: '82,1', floor: 10, price: '23,6 млн ₽', priceNumber: 23600000, feature: 'Три спальни и общая гостиная', plan: 4 }
];

const planWalls = {
  1: '<path d="M30 26H205V135H30Z M121 26V82 M121 82H205 M30 85H121"/>',
  2: '<path d="M23 25H213V137H23Z M110 25V137 M110 75H213 M23 87H110 M159 75V137"/>',
  3: '<path d="M22 25H215V136H22Z M91 25V136 M91 83H215 M158 25V83 M158 83V136"/>',
  4: '<path d="M18 22H218V140H18Z M83 22V140 M147 22V140 M83 77H218 M18 90H83 M147 109H218"/>'
};

function planSvg(type) {
  return `<svg viewBox="0 0 240 160" aria-hidden="true" focusable="false"><rect x="8" y="8" width="224" height="144" fill="#fdfdf9"/><g fill="none" stroke="#596e7e" stroke-width="5" stroke-linecap="square" stroke-linejoin="miter">${planWalls[type]}</g><g fill="none" stroke="#aabbbd" stroke-width="2"><path d="M32 39h43 M41 130h39 M170 135h28"/></g><g fill="#dce8e9"><rect x="41" y="35" width="28" height="23"/><rect x="168" y="92" width="26" height="20"/></g></svg>`;
}

const grid = document.getElementById('apartment-grid');
const filterButtons = [...document.querySelectorAll('.filter-btn')];
const resultCount = document.getElementById('result-count');
const projectDialog = document.getElementById('project-dialog');
const dialogTitle = document.getElementById('dialog-project-title');
const dialogCopy = document.getElementById('dialog-project-copy');
const dialogFacts = document.getElementById('dialog-project-facts');
const dialogAction = projectDialog.querySelector('.button');

function renderApartments(filter = 'all') {
  const visible = apartments.filter(item => filter === 'all' || String(item.rooms) === filter);
  grid.innerHTML = visible.map(item => `<article class="apartment-card"><div class="apartment-art">${planSvg(item.plan)}</div><div class="apartment-body"><span>Квартал «Остров» / ${item.id}</span><h3>${item.area} м²</h3><p>${item.rooms}-комнатная · ${item.floor} этаж<br>${item.feature}</p><div class="apartment-bottom"><b>${item.price}</b><button type="button" data-apartment="${item.id}" aria-label="Подробнее о квартире ${item.id}">Подробнее</button></div></div></article>`).join('');
  resultCount.textContent = `${visible.length} ${visible.length === 1 ? 'вариант' : visible.length < 5 ? 'варианта' : 'вариантов'}`;
}
renderApartments();

filterButtons.forEach(button => button.addEventListener('click', () => {
  filterButtons.forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
  renderApartments(button.dataset.filter);
}));

function openProject(name) {
  const item = projectInfo[name];
  dialogTitle.textContent = name;
  dialogCopy.textContent = item.description;
  dialogFacts.innerHTML = item.facts.map(fact => `<span>${fact}</span>`).join('');
  dialogAction.textContent = name === 'Остров' ? 'Смотреть квартиры' : 'Обсудить проект';
  dialogAction.href = name === 'Остров' ? '#apartments' : '#visit';
  projectDialog.showModal();
  document.body.classList.add('modal-open');
}

document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => openProject(button.dataset.project)));
grid.addEventListener('click', event => {
  const button = event.target.closest('[data-apartment]');
  if (!button) return;
  const item = apartments.find(apartment => apartment.id === button.dataset.apartment);
  dialogTitle.textContent = `${item.area} м²`;
  dialogCopy.textContent = item.feature;
  dialogFacts.innerHTML = [`Квартира ${item.id}`, `${item.rooms}-комнатная`, `${item.floor} этаж`, item.price].map(fact => `<span>${fact}</span>`).join('');
  dialogAction.textContent = 'Записаться на просмотр';
  dialogAction.href = '#visit';
  projectDialog.showModal();
  document.body.classList.add('modal-open');
});

const buildingInfo = {
  a: { letter: 'А', name: 'Ближе к воде', description: 'Из окон — вид на прогулочный маршрут вдоль набережной. Внизу — тихий двор и вход с улицы.', floors: '12', flats: '84', date: 'IV кв. 2027' },
  b: { letter: 'Б', name: 'Рядом с зелёным двором', description: 'Корпус для тех, кто любит видеть из окна деревья и первым выходить на утреннюю прогулку.', floors: '9', flats: '63', date: 'IV кв. 2027' },
  c: { letter: 'В', name: 'В ритме квартала', description: 'Рядом с городским входом и повседневными маршрутами, но со своим спокойным пространством внутри.', floors: '14', flats: '112', date: 'II кв. 2028' }
};
document.querySelectorAll('.building').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.building').forEach(item => { const selected = item === button; item.classList.toggle('selected', selected); item.setAttribute('aria-pressed', String(selected)); });
  const data = buildingInfo[button.dataset.building];
  for (const key of ['letter', 'name', 'description', 'floors', 'flats', 'date']) document.getElementById(`building-${key}`).textContent = data[key];
}));

const price = 11800000;
const down = document.getElementById('down-payment');
const years = document.getElementById('loan-years');
const formatMoney = amount => `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(amount)} ₽`;
function updateCalculator() {
  const downFraction = Number(down.value) / 100;
  const principal = price * (1 - downFraction);
  const rate = .12 / 12;
  const periods = Number(years.value) * 12;
  const payment = principal * rate / (1 - Math.pow(1 + rate, -periods));
  document.getElementById('down-output').textContent = `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(price * downFraction / 1000000)} млн ₽`;
  document.getElementById('years-output').textContent = `${years.value} лет`;
  document.getElementById('monthly-payment').textContent = formatMoney(Math.round(payment));
}
[down, years].forEach(input => input.addEventListener('input', updateCalculator));
updateCalculator();

const visitDialog = document.getElementById('visit-dialog');
document.getElementById('open-visit').addEventListener('click', () => { visitDialog.showModal(); document.body.classList.add('modal-open'); });
document.querySelectorAll('[data-close]').forEach(control => control.addEventListener('click', () => control.closest('dialog').close()));
for (const dialog of [visitDialog, projectDialog]) {
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
  dialog.addEventListener('cancel', () => document.body.classList.remove('modal-open'));
}
document.getElementById('visit-form').addEventListener('submit', event => {
  event.preventDefault();
  event.currentTarget.hidden = true;
  document.getElementById('visit-success').hidden = false;
});

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
function closeMenu() { menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Открыть меню'); mobileNav.hidden = true; }
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  mobileNav.hidden = !open;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => { if (window.innerWidth > 800) closeMenu(); });
