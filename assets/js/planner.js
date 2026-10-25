// =============================================================================
// Planejamento: checklist da loja, seletor de arcanos e calculadora de tempo.
// As três partes compartilham estado, por isso ficam juntas e se atualizam via update().
// =============================================================================

(function () {
  const { store, $, fmt, escapeHtml } = window.TB;
  const { shop, arcanes, arcaneAmounts, arcaneDefaults } = window.TB_DATA;

  // ---------------------------------------------------------------------------
  // Loja
  // ---------------------------------------------------------------------------
  const owned = store.get('owned', {});
  const shopEl = $('shop');
  const TIER_TAG = { 1: 't-sent', 2: 't-gold', 3: 't-void', 4: 't-mut' };
  const FACETS = 20; // lascas da barra de progresso
  // cost: null = preço ainda não confirmado; entra como 0 nas somas
  const sum = (items) => items.reduce((total, item) => total + (item.cost || 0), 0);

  // Cada item é uma lasca: marcada = cristalizada (o texto do estado vem do CSS)
  function itemHtml(item) {
    const note = item.note ? `<small>${escapeHtml(item.note)}</small>` : '';
    return `
      <div class="item ${owned[item.id] ? 'on' : ''}" data-id="${item.id}" role="checkbox" tabindex="0" aria-checked="${!!owned[item.id]}">
        <div class="nm">${escapeHtml(item.name)}${note}</div>
        <div class="foot"><span class="cost">${item.cost == null ? '?' : item.cost}<small>MF</small></span><span class="st"></span></div>
      </div>`;
  }

  function renderShop() {
    shopEl.innerHTML = shop
      .map((group) => `
        <div class="group">
          <h3><span>${escapeHtml(group.title)}</span><span class="tag ${TIER_TAG[group.tier]}">${fmt(sum(group.items))} no total</span></h3>
          <div class="items${group.tier === 1 ? ' big' : ''}">${group.items.map(itemHtml).join('')}</div>
        </div>`)
      .join('');
  }

  function toggleItem(el) {
    const id = el.dataset.id;
    owned[id] = !owned[id];
    el.classList.toggle('on', owned[id]);
    el.setAttribute('aria-checked', owned[id]);
    if (owned[id]) window.TB.flash(el);
    store.set('owned', owned);
    update();
  }

  $('shopFac').innerHTML = '<i></i>'.repeat(FACETS);

  renderShop();
  shopEl.addEventListener('click', (e) => {
    const el = e.target.closest('.item');
    if (el) toggleItem(el);
  });
  shopEl.addEventListener('keydown', (e) => {
    const el = e.target.closest('.item');
    if (el && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      toggleItem(el);
    }
  });
  $('resetShop').addEventListener('click', () => {
    Object.keys(owned).forEach((k) => delete owned[k]);
    store.set('owned', owned);
    renderShop();
    update();
  });

  // ---------------------------------------------------------------------------
  // Arcanos
  // ---------------------------------------------------------------------------
  const arcaneState = store.get('arcs', arcaneDefaults);
  const arcEl = $('arcs');

  arcEl.innerHTML = arcanes
    .map((arc, i) => {
      const s = arcaneState[arc.name] || { on: false, q: 21 };
      const options = arcaneAmounts
        .map((a) => `<option value="${a.copies}" ${s.q === a.copies ? 'selected' : ''}>${a.label}</option>`)
        .join('');
      return `
        <div class="arc">
          <label><input type="checkbox" data-i="${i}" ${s.on ? 'checked' : ''}> ${escapeHtml(arc.name)}</label>
          <select data-i="${i}" aria-label="Quantidade de ${escapeHtml(arc.name)}">${options}</select>
          <small><span class="mf"></span>${arc.cost} cada${arc.note ? ' · ' + escapeHtml(arc.note) : ''}</small>
        </div>`;
    })
    .join('');

  arcEl.addEventListener('change', (e) => {
    const i = e.target.dataset.i;
    if (i === undefined) return;
    const row = e.target.closest('.arc');
    arcaneState[arcanes[i].name] = {
      on: row.querySelector('input').checked,
      q: Number(row.querySelector('select').value),
    };
    store.set('arcs', arcaneState);
    update();
  });

  // Selo do Melee Influence na seção do Xaku: atalho para a mesma linha da lista de arcanos
  const TRIB_ARCANE = 'Melee Influence';
  const trib = $('miTrib');
  const tribRow = () => arcEl.querySelectorAll('.arc')[arcanes.findIndex((a) => a.name === TRIB_ARCANE)];
  if (trib && tribRow()) {
    trib.addEventListener('click', () => {
      const box = tribRow().querySelector('input');
      box.checked = !box.checked;
      box.dispatchEvent(new Event('change', { bubbles: true }));
      if (box.checked) window.TB.flash(trib);
    });
  }

  const arcaneCost = () =>
    arcanes.reduce((total, arc) => {
      const s = arcaneState[arc.name];
      return total + (s && s.on ? arc.cost * s.q : 0);
    }, 0);

  // ---------------------------------------------------------------------------
  // Calculadora
  // ---------------------------------------------------------------------------
  const CALC_FIELDS = ['cHave', 'cTier', 'cArc', 'cMin', 'cRate', 'cAl', 'cSp'];
  const calcState = store.get('calc', {});

  CALC_FIELDS.forEach((id) => {
    const el = $(id);
    const isCheckbox = el.type === 'checkbox';
    if (calcState[id] !== undefined) {
      if (isCheckbox) el.checked = calcState[id];
      else el.value = calcState[id];
    }
    el.addEventListener('input', () => {
      calcState[id] = isCheckbox ? el.checked : el.value;
      store.set('calc', calcState);
      update();
    });
  });

  function setVerdict(kind, text) {
    const el = $('oVerdict');
    el.className = 'verdict v-' + kind;
    el.textContent = text;
  }

  // ---------------------------------------------------------------------------
  // Atualiza totais da loja, arcanos e calculadora
  // ---------------------------------------------------------------------------
  function update() {
    // Progresso da loja
    const allItems = shop.flatMap((g) => g.items);
    const total = sum(allItems);
    const missing = sum(allItems.filter((i) => !owned[i.id]));
    const pct = Math.round(((total - missing) / total) * 100);
    $('shopPct').textContent = pct + '%';
    const lit = Math.round((pct / 100) * FACETS);
    $('shopFac').querySelectorAll('i').forEach((f, i) => f.classList.toggle('on', i < lit));
    $('shopLeft').textContent = fmt(missing);

    // Arcanos
    const arcTotal = arcaneCost();
    $('arcTotal').textContent = fmt(arcTotal);
    if (trib) trib.setAttribute('aria-pressed', !!(arcaneState[TRIB_ARCANE] && arcaneState[TRIB_ARCANE].on));

    // Meta = itens não marcados até a prioridade escolhida (+ arcanos, se marcado)
    const maxTier = Number($('cTier').value);
    let goal = sum(shop.filter((g) => g.tier <= maxTier).flatMap((g) => g.items).filter((i) => !owned[i.id]));
    if ($('cArc').checked) goal += arcTotal;

    const have = Number($('cHave').value) || 0;
    const left = Math.max(0, goal - have);

    const minutes = Number($('cMin').value);
    const rate = Number($('cRate').value);
    const alerts = Number($('cAl').value);
    const alertReward = Number($('cSp').value);
    $('cMinV').textContent = minutes;
    $('cRateV').textContent = rate;
    $('cAlV').textContent = alerts;

    const perDay = minutes * rate + alerts * alertReward;
    const daysNeeded = perDay > 0 ? left / perDay : Infinity;
    const daysLeft = window.TB.daysLeft();

    $('oGoal').textContent = fmt(goal);
    $('oLeft').textContent = fmt(left);
    $('oDay').textContent = '~' + fmt(perDay) + ' / dia';
    $('oDays').textContent = left === 0 ? '0' : isFinite(daysNeeded) ? daysNeeded.toFixed(1) : '∞';

    if (left === 0) {
      setVerdict('ok', 'Meta batida. Gaste a sobra em Endo e Kuva.');
    } else if (daysNeeded <= daysLeft * 0.6) {
      setVerdict('ok', `Tranquilo: dá para terminar em ~${Math.ceil(daysNeeded)} dias, e restam ${Math.floor(daysLeft)}.`);
    } else if (daysNeeded <= daysLeft) {
      setVerdict('warn', `Apertado: ~${Math.ceil(daysNeeded)} dias para ${Math.floor(daysLeft)} restantes. Não pule dias.`);
    } else {
      setVerdict('bad', `Não fecha: você precisaria de ~${fmt(left / daysLeft)}/dia. Baixe a prioridade ou aumente o tempo.`);
    }
  }

  update();
  setInterval(update, 60000); // os dias restantes mudam com o tempo
})();
