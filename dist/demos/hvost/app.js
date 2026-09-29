(() => {
  const sizes = [
    { id: 'small', label: 'Маленький' },
    { id: 'medium', label: 'Средний' },
    { id: 'large', label: 'Крупный' },
  ];
  const coats = [
    { id: 'short', label: 'Короткая' },
    { id: 'long', label: 'Длинная' },
    { id: 'curly', label: 'Кудрявая' },
  ];
  const recommendations = {
    short: { title: 'Гигиена и блеск', description: 'Мытьё, сушка и мягкое расчёсывание — хорошая отправная точка для короткой шерсти.', times: { small: 'около 1 часа', medium: 'около 1–1,5 часа', large: 'около 1,5–2 часов' } },
    long: { title: 'Стрижка и форма', description: 'Расчёсывание, мытьё и оформление шерсти. Мастер уточнит желаемую длину перед работой.', times: { small: 'около 1,5 часа', medium: 'около 2 часов', large: 'около 2,5–3 часов' } },
    curly: { title: 'Кудри под контролем', description: 'Подготовка шерсти, мытьё и стрижка формы. Детали зависят от состояния шерсти.', times: { small: 'около 2 часов', medium: 'около 2,5 часов', large: 'около 3 часов' } },
  };
  const state = { size: null, coat: null };
  const sizeOptions = document.querySelector('#size-options');
  const coatOptions = document.querySelector('#coat-options');
  const resultTitle = document.querySelector('#result-title');
  const resultDescription = document.querySelector('#result-description');
  const resultTime = document.querySelector('#result-time');
  const saveChoice = document.querySelector('#save-choice');
  const savedMessage = document.querySelector('#saved-message');

  function renderOptions(container, options, field) {
    container.innerHTML = options.map(option => `<button type="button" class="option-button${state[field] === option.id ? ' selected' : ''}" data-${field}="${option.id}" aria-pressed="${state[field] === option.id}">${option.label}</button>`).join('');
  }
  function currentRecommendation() {
    if (!state.size || !state.coat) return null;
    const recommendation = recommendations[state.coat];
    return { size: state.size, coat: state.coat, title: recommendation.title, duration: recommendation.times[state.size], description: recommendation.description };
  }
  function render() {
    renderOptions(sizeOptions, sizes, 'size');
    renderOptions(coatOptions, coats, 'coat');
    const result = currentRecommendation();
    if (!result) {
      resultTitle.textContent = 'Выберите оба пункта';
      resultDescription.textContent = 'После выбора здесь появится примерный формат ухода.';
      resultTime.textContent = '';
      saveChoice.disabled = true;
      return;
    }
    resultTitle.textContent = result.title;
    resultDescription.textContent = `${result.description} Окончательное время зависит от собаки.`;
    resultTime.textContent = `Ориентир: ${result.duration}`;
    saveChoice.disabled = false;
  }
  sizeOptions.addEventListener('click', event => {
    const button = event.target.closest('[data-size]');
    if (!button) return;
    state.size = button.dataset.size;
    savedMessage.textContent = '';
    render();
  });
  coatOptions.addEventListener('click', event => {
    const button = event.target.closest('[data-coat]');
    if (!button) return;
    state.coat = button.dataset.coat;
    savedMessage.textContent = '';
    render();
  });
  document.querySelectorAll('.service-detail a[data-coat]').forEach(link => link.addEventListener('click', () => {
    state.coat = link.dataset.coat;
    savedMessage.textContent = '';
    render();
  }));
  saveChoice.addEventListener('click', () => {
    const result = currentRecommendation();
    if (!result) return;
    try {
      sessionStorage.setItem('hvost-demo-care', JSON.stringify({ size: state.size, coat: state.coat, savedAt: new Date().toISOString() }));
      savedMessage.textContent = 'Маршрут сохранён в этой вкладке. Настоящая запись не создана.';
    } catch {
      savedMessage.textContent = 'Подбор готов, но браузер не разрешил сохранить его в этой вкладке.';
    }
  });
  render();

  const context = document.modelContext;
  if (context?.registerTool) {
    const lifecycle = new AbortController();
    const register = tool => { try { Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {}); } catch { /* Optional browser API is unavailable. */ } };
    register({
      name: 'choose_hvost_demo_care', title: 'Подобрать уход для собаки',
      description: 'Choose dog size and coat in the visible demo selector. Does not book a visit or send information.',
      inputSchema: { type: 'object', properties: { size: { type: 'string', enum: sizes.map(item => item.id) }, coat: { type: 'string', enum: coats.map(item => item.id) } }, required: ['size', 'coat'], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (!input || !sizes.some(item => item.id === input.size) || !coats.some(item => item.id === input.coat) || Object.keys(input).some(key => !['size', 'coat'].includes(key))) throw new Error('Choose a listed dog size and coat.');
        state.size = input.size;
        state.coat = input.coat;
        savedMessage.textContent = '';
        render();
        return { ...currentRecommendation(), saved: false, sent: false };
      },
    });
    register({ name: 'read_hvost_demo_care', title: 'Текущий подбор', description: 'Read the currently displayed demo care recommendation. No data is sent.', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: false }, execute() { return { ...state, recommendation: currentRecommendation(), sent: false }; } });
    window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
  }
})();
