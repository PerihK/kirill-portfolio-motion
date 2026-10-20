(() => {
  const services = [
    { id: 'cut', name: 'Стрижка и форма', duration: '≈ 1,5 часа' },
    { id: 'color', name: 'Цвет и тон', duration: '≈ 3 часа' },
    { id: 'style', name: 'Укладка', duration: '≈ 45 минут' },
  ];
  const slots = ['10:00', '12:30', '15:00', '18:00'];
  const dates = Array.from({ length: 4 }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + index + 1);
    return date;
  });
  const weekday = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' });
  const fullDate = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' });
  const state = { service: null, date: null, time: null };
  const serviceChoices = document.querySelector('#service-choices');
  const dateChoices = document.querySelector('#date-choices');
  const timeChoices = document.querySelector('#time-choices');
  const summary = document.querySelector('#booking-summary');
  const review = document.querySelector('#review-booking');
  const dialog = document.querySelector('#review-dialog');
  const toast = document.querySelector('#toast');
  let toastTimer;

  const dateKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const selectedService = () => services.find(item => item.id === state.service);
  const selectedDate = () => dates.find(date => dateKey(date) === state.date);
  const selectionText = () => `${selectedService().name} · ${fullDate.format(selectedDate())} в ${state.time}`;

  function render() {
    serviceChoices.innerHTML = services.map(item => `<button type="button" class="choice-button${state.service === item.id ? ' selected' : ''}" data-choice-service="${item.id}" aria-pressed="${state.service === item.id}"><strong>${item.name}</strong><small>${item.duration}</small></button>`).join('');
    dateChoices.innerHTML = dates.map(date => `<button type="button" class="date-button${state.date === dateKey(date) ? ' selected' : ''}" data-choice-date="${dateKey(date)}" aria-pressed="${state.date === dateKey(date)}" aria-label="${fullDate.format(date)}"><small>${weekday.format(date)}</small><strong>${date.getDate()}</strong></button>`).join('');
    timeChoices.innerHTML = slots.map(time => `<button type="button" class="time-button${state.time === time ? ' selected' : ''}" data-choice-time="${time}" aria-pressed="${state.time === time}">${time}</button>`).join('');
    const ready = !!(selectedService() && selectedDate() && state.time);
    summary.textContent = ready ? selectionText() : state.service ? 'Выберите день и время' : 'Выберите услугу и время';
    review.disabled = !ready;
  }

  serviceChoices.addEventListener('click', event => {
    const button = event.target.closest('[data-choice-service]');
    if (!button) return;
    state.service = button.dataset.choiceService;
    render();
  });
  dateChoices.addEventListener('click', event => {
    const button = event.target.closest('[data-choice-date]');
    if (!button) return;
    state.date = button.dataset.choiceDate;
    state.time = null;
    render();
  });
  timeChoices.addEventListener('click', event => {
    const button = event.target.closest('[data-choice-time]');
    if (!button) return;
    state.time = button.dataset.choiceTime;
    render();
  });
  document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
    state.service = link.dataset.service;
    render();
  }));
  review.addEventListener('click', () => {
    if (review.disabled) return;
    document.querySelector('#dialog-selection').textContent = selectionText();
    dialog.showModal();
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close('cancel');
  });
  dialog.addEventListener('close', () => {
    if (dialog.returnValue !== 'save') return;
    try { sessionStorage.setItem('liniya-demo-booking', JSON.stringify({ ...state, savedAt: new Date().toISOString() })); }
    catch { /* The visible demo still works when browser storage is disabled. */ }
    toast.textContent = 'Выбор сохранён в этой вкладке. Настоящая запись не создана.';
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 5000);
  });
  render();

  const context = document.modelContext;
  if (context?.registerTool) {
    const lifecycle = new AbortController();
    const register = tool => { try { Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {}); } catch { /* Browser does not support this optional API. */ } };
    register({
      name: 'choose_liniya_demo_booking', title: 'Выбрать пробную запись',
      description: 'Select a service, date, and time in the visible demo booking interface. Does not reserve or send a booking.',
      inputSchema: { type: 'object', properties: { service: { type: 'string', enum: services.map(item => item.id) }, date: { type: 'string', enum: dates.map(dateKey) }, time: { type: 'string', enum: slots } }, required: ['service', 'date', 'time'], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (!input || !services.some(item => item.id === input.service) || !dates.some(date => dateKey(date) === input.date) || !slots.includes(input.time) || Object.keys(input).some(key => !['service', 'date', 'time'].includes(key))) throw new Error('Choose a listed service, date, and time.');
        Object.assign(state, input);
        render();
        return { selection: selectionText(), saved: false, sent: false };
      },
    });
    register({ name: 'read_liniya_demo_booking', title: 'Текущий выбор', description: 'Read the currently displayed demo selection. No data is sent.', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: false }, execute() { return { service: state.service, date: state.date, time: state.time, sent: false }; } });
    window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
  }
})();
