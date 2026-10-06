const areaInput = document.querySelector('#area');
const areaRange = document.querySelector('#area-range');
const capacityOutput = document.querySelector('#capacity');
const explanation = document.querySelector('#calc-explain');

function updateCalculator(source, commit=false) {
  let area = Number(source.value);
  if (!commit && (source.value.trim() === '' || !Number.isFinite(area) || area < 8 || area > 100)) { explanation.textContent = 'Укажите площадь от 8 до 100 м².'; return; }
  if (!source.value.trim() || !Number.isFinite(area)) area = 24;
  area = Math.round(Math.min(100, Math.max(8, area))*10)/10;
  areaInput.value = String(area);
  areaRange.value = String(area);
  const sunny = document.querySelector('input[name="sun"]:checked')?.value === 'sunny';
  const estimate = area * (sunny ? 0.12 : 0.1);
  const classes = [2, 2.5, 3.5, 5, 7, 10, 12];
  const selected = classes.find(item => item >= estimate) ?? 12;
  capacityOutput.textContent = `≈ ${String(selected).replace('.', ',')} кВт`;
  explanation.textContent = `Ориентир — класс ${String(selected).replace('.', ',')} кВт. Уточним после оценки комнаты.`;
}

areaInput.addEventListener('input', () => updateCalculator(areaInput));
areaInput.addEventListener('change', () => updateCalculator(areaInput,true));
areaRange.addEventListener('input', () => updateCalculator(areaRange));
document.querySelectorAll('input[name="sun"]').forEach(input => input.addEventListener('change', () => updateCalculator(areaInput)));
updateCalculator(areaInput);

const models = [
  { kicker: 'ТИХО / 25', title: 'Для комнаты,\nгде хочется тишины.', text: 'Компактный класс для спальни, кабинета или небольшой гостиной. Подбор начинаем с тепловой нагрузки, а не с размера корпуса.', power: '2,5 кВт', area: 'до 25 м²', image: 'assets/ac-unit-transparent.webp', alt: 'Белый округлый настенный блок модели ТИХО 25', caption: 'ТИХАЯ ФОРМА В ИНТЕРЬЕРЕ' },
  { kicker: 'ТИХО / 35', title: 'Для жизни\nв общем пространстве.', text: 'Универсальный класс для гостиной или просторной комнаты. Обсудим расположение блока, чтобы поток воздуха не мешал привычным сценариям.', power: '3,5 кВт', area: 'до 35 м²', image: 'assets/ac-unit-35.webp', alt: 'Светлый тонкий настенный блок модели ТИХО 35 с тёмной верхней линией', caption: 'ТОНКИЙ ПРОФИЛЬ ДЛЯ ГОСТИНОЙ' },
  { kicker: 'ТИХО / 50', title: 'Для пространства\nс запасом задачи.', text: 'Класс повышенной мощности для больших комнат. Здесь особенно важны окна, высота потолка и фактическая тепловая нагрузка.', power: '5,0 кВт', area: 'до 50 м²', image: 'assets/ac-unit-50.webp', alt: 'Графитовый угловатый настенный блок модели ТИХО 50', caption: 'ГРАФИТОВЫЙ АКЦЕНТ В ИНТЕРЬЕРЕ' }
];

let selectedModelIndex=0;
const modelTabs = [...document.querySelectorAll('.model-tab')];
models.forEach(model => { const preload = new Image(); preload.src = model.image; });
function selectModel(index) {
  const model = models[index];
  selectedModelIndex=index;
  document.querySelector('#model-kicker').textContent = model.kicker;
  document.querySelector('#model-title').textContent = model.title;
  document.querySelector('#model-text').textContent = model.text;
  document.querySelector('#model-power').textContent = model.power;
  document.querySelector('#model-area').textContent = model.area;
  const visual = document.querySelector('.model-visual');
  visual.dataset.model = String(index);
  const modelImage = document.querySelector('#model-image');
  modelImage.src = model.image;
  modelImage.alt = model.alt;
  document.querySelector('#model-caption').textContent = model.caption;
  document.querySelector('.model-visual-bottom span:last-child').textContent = `0${index + 1} / 03`;
  modelTabs.forEach((tab, tabIndex) => {
    tab.classList.toggle('active', tabIndex === index);
    tab.setAttribute('aria-selected', String(tabIndex === index));
    tab.tabIndex = tabIndex === index ? 0 : -1;
  });
  document.dispatchEvent(new Event('tiho:selection'));
}
modelTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectModel(index));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? modelTabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + modelTabs.length) % modelTabs.length;
    selectModel(next);
    modelTabs[next].focus();
  });
});


selectModel(0);
