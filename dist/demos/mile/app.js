const questions = [
  { context: '01 / ЗНАКОМСТВО С КВАРТИРОЙ', title: 'Хозяин пишет: “The apartment is available next week.” Что это значит?', answers: ['Квартира освободится на следующей неделе.', 'Квартира уже занята.', 'Сдача возможна только на год.'], correct: 0 },
  { context: '02 / НА ПРИЁМЕ', title: 'Как вежливо попросить повторить сказанное?', answers: ['Say it again, now.', 'Could you say that again, please?', 'You speak too fast.'], correct: 1 },
  { context: '03 / НОВАЯ РАБОТА', title: 'Какая фраза естественно продолжит “I’ve been working here…”?', answers: ['since three months', 'for three months', 'at three months'], correct: 1 }
];

let questionIndex = 0;
let correctCount = 0;
const testStart = document.querySelector('#test-start');
const testQuestion = document.querySelector('#test-question');
const testResult = document.querySelector('#test-result');
const testCount = document.querySelector('#test-count');
const testProgress = document.querySelector('#test-progress-fill');
const testStep = document.querySelector('#test-step');

function renderQuestion() {
  const q = questions[questionIndex];
  testStep.textContent = 'СИТУАЦИЯ ИЗ ЖИЗНИ';
  testCount.textContent = `${String(questionIndex + 1).padStart(2, '0')} / 03`;
  testProgress.style.width = `${(questionIndex / questions.length) * 100}%`;
  document.querySelector('#question-context').textContent = q.context;
  document.querySelector('#question-title').textContent = q.title;
  const list = document.querySelector('#answer-list');
  list.replaceChildren();
  q.answers.forEach((answer, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    const number = document.createElement('span');
    number.textContent = String(index + 1).padStart(2, '0');
    button.append(number, document.createTextNode(answer));
    button.addEventListener('click', () => {
      if (index === q.correct) correctCount++;
      questionIndex++;
      if (questionIndex < questions.length) renderQuestion(); else showResult();
    });
    list.append(button);
  });
}

function showResult() {
  testQuestion.hidden = true;
  testResult.hidden = false;
  testStep.textContent = 'ГОТОВО';
  testCount.textContent = '03 / 03';
  testProgress.style.width = '100%';
  const result = correctCount <= 1
    ? ['Начните с простого', 'Ваш ориентир — стартовый уровень. На уроках можно спокойно собрать нужные фразы и привыкнуть говорить в бытовых ситуациях.']
    : correctCount === 2
      ? ['Разговор уже близко', 'У вас есть хорошая база. Следующий шаг — быстрее подбирать слова и увереннее отвечать в реальных диалогах.']
      : ['Можно двигаться дальше', 'Вы уверенно справились с этими ситуациями. Попробуйте более сложные разговоры о работе и жизни в новой среде.'];
  document.querySelector('#result-title').textContent = result[0];
  document.querySelector('#result-copy').textContent = `${result[1]} Это лишь ориентир по трём вопросам, не официальный уровень CEFR.`;
}

document.querySelector('#start-test').addEventListener('click', () => {
  questionIndex = 0; correctCount = 0;
  testStart.hidden = true; testResult.hidden = true; testQuestion.hidden = false;
  renderQuestion();
});
document.querySelector('#restart-test').addEventListener('click', () => {
  questionIndex = 0; correctCount = 0;
  testResult.hidden = true; testQuestion.hidden = false;
  renderQuestion();
});

const schedules = {
  online: [
    ['Everyday English', 'Пн / Ср · 19:00', 'A1–A2', 'Онлайн'],
    ['Work & Interviews', 'Вт / Чт · 20:00', 'B1', 'Онлайн'],
    ['One-to-one', 'По договорённости', 'Любой', 'Онлайн']
  ],
  offline: [
    ['Everyday English', 'Сб · 11:00', 'A1–A2', 'В классе'],
    ['Conversation Club', 'Сб · 14:00', 'A2–B1', 'В классе'],
    ['One-to-one', 'По договорённости', 'Любой', 'В классе']
  ]
};
function renderSchedule(format) {
  const holder = document.querySelector('#schedule-rows');
  holder.replaceChildren();
  schedules[format].forEach((row) => {
    const article = document.createElement('div'); article.className = 'schedule-row';
    row.forEach((value, index) => {
      const cell = document.createElement(index === 0 ? 'strong' : 'span');
      cell.textContent = value; article.append(cell);
    });
    holder.append(article);
  });
  document.querySelectorAll('[data-schedule-format]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.scheduleFormat === format)));
}
document.querySelectorAll('[data-schedule-format]').forEach(button => button.addEventListener('click', () => renderSchedule(button.dataset.scheduleFormat)));
renderSchedule('online');

const cabinetDialog = document.querySelector('#cabinet-dialog');
const trialDialog = document.querySelector('#trial-dialog');
document.querySelector('#open-cabinet').addEventListener('click', () => cabinetDialog.showModal());
document.querySelector('#open-trial').addEventListener('click', () => trialDialog.showModal());
document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); }));
document.querySelector('#show-trial-plan').addEventListener('click', () => {
  const goal = document.querySelector('#trial-goal').value;
  const title = {
    arrival: 'Первые дни: жильё, покупки, знакомство',
    work: 'Работа: рассказать о себе и задать вопрос',
    daily: 'Каждый день: попросить, уточнить, ответить'
  }[goal];
  document.querySelector('#trial-plan-title').textContent = title;
  document.querySelector('#trial-plan').hidden = false;
});
document.querySelectorAll('.mobile-nav nav a').forEach(link => link.addEventListener('click', () => { document.querySelector('.mobile-nav').open = false; }));
