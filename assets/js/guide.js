// =============================================================================
// Seções de leitura: passos de "onde clicar", abas da rotina, mapa de Eris e tabela de missões.
// =============================================================================

(function () {
  const { store, $, escapeHtml } = window.TB;

  // Marca o elemento por um instante, para a animação de "cristalizar" rodar só no clique
  const flash = (el) => {
    el.dataset.just = '1';
    clearTimeout(el._just);
    el._just = setTimeout(() => delete el.dataset.just, 1000);
  };
  window.TB.flash = flash;

  // --- Passos clicáveis (marcados ficam salvos) ---
  const stepState = store.get('steps', {});
  document.querySelectorAll('.step').forEach((step) => {
    const id = step.dataset.k;
    if (stepState[id]) step.classList.add('done');
    step.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') return; // deixa links funcionarem
      step.classList.toggle('done');
      stepState[id] = step.classList.contains('done');
      store.set('steps', stepState);
      flash(step);
    });
  });

  // --- Abas (rotina por sessão) ---
  document.querySelectorAll('[data-tabs]').forEach((tabs) => {
    const buttons = [...tabs.querySelectorAll('button')];
    tabs.addEventListener('click', (e) => {
      const chosen = e.target.closest('button');
      if (!chosen) return;
      buttons.forEach((b) => {
        b.classList.toggle('on', b === chosen);
        $(b.dataset.t).classList.toggle('on', b === chosen);
      });
    });
  });

  // --- Missões: mapa de Eris + tabela, com o mesmo filtro ---
  const missions = window.TB_DATA.missions;
  const MAX_RATING = 5;

  // Posições no mapa (viewBox 600×400). A Praghasa fica no canto inferior esquerdo, como no jogo.
  const POS = { 'Zabala': [440, 118], 'Nimus': [170, 112], 'Xini': [486, 258], 'Kala-azar': [356, 334], 'Akkad': [178, 290], 'Oestrus': [292, 62], 'Locus Alerts': [528, 172] };
  const SHORT = { 'Locus Alerts': 'Alerts' };
  const ME = [48, 52], PG = [72, 354];
  const mapEl = $('emap');
  const panel = $('emapPanel');
  let selected = 'Zabala';
  let filter = 'all';

  const routePath = ([x2, y2]) => {
    const [x1, y1] = ME;
    return `M${x1},${y1} Q${(x1 + x2) / 2 - 40},${Math.min(y1, y2) + 140} ${x2},${y2}`;
  };

  // O SVG encolhe no celular; o texto cresce na mesma proporção para continuar legível
  function renderMap() {
    const scale = (mapEl.clientWidth || 600) / 600;
    const fs = Math.max(14, 11 / scale), small = Math.max(11, 9 / scale), r = Math.max(7, 5 / scale);
    const nodes = missions.map((m) => {
      const pos = POS[m.node];
      if (!pos) return '';
      const [x, y] = pos;
      const spores = Array.from({ length: m.rating }, (_, k) => {
        const a = (k / m.rating) * 6.283 + 0.5, R = r + 9;
        return `<circle class="sp" cx="${(x + Math.cos(a) * R).toFixed(1)}" cy="${(y + Math.sin(a) * R).toFixed(1)}" r="${(r * 0.36).toFixed(1)}" style="animation-delay:${-k * 0.45}s"/>`;
      }).join('');
      return `<g class="nd${m.node === 'Locus Alerts' ? ' al' : ''}" data-node="${escapeHtml(m.node)}" role="button" tabindex="0" aria-label="${escapeHtml(m.node)}, ${escapeHtml(m.type)}, rendimento ${m.rating} de ${MAX_RATING}">
        <circle class="hit" cx="${x}" cy="${y}" r="28"/>${spores}<circle class="dot" cx="${x}" cy="${y}" r="${r}"/>
        <text x="${x}" y="${y - r - 14}" text-anchor="middle" font-size="${fs}">${escapeHtml(SHORT[m.node] || m.node)}</text></g>`;
    }).join('');
    mapEl.innerHTML = `<svg viewBox="0 0 600 400" role="img" aria-label="Mapa de Eris com as missões do evento">
      <defs><radialGradient id="erisG" cx="38%" cy="32%"><stop offset="0" stop-color="var(--flesh)" stop-opacity=".55"/><stop offset=".55" stop-color="var(--crim)" stop-opacity=".35"/><stop offset="1" stop-color="var(--bg)"/></radialGradient></defs>
      <ellipse class="orb" cx="320" cy="200" rx="150" ry="82" transform="rotate(-10 320 200)"/>
      <ellipse class="orb" cx="320" cy="200" rx="250" ry="150" transform="rotate(-10 320 200)"/>
      <circle cx="320" cy="200" r="46" fill="url(#erisG)" stroke="var(--line2)"/>
      <text class="planet" x="320" y="206" text-anchor="middle" font-size="${fs + 2}">Eris</text>
      <path class="route flow"/>
      <g><circle class="me" cx="${ME[0]}" cy="${ME[1]}" r="5"/><text class="mel" x="${ME[0] + 12}" y="${ME[1] + 4}" font-size="${small}">VOCÊ</text></g>
      <g><path class="pg" d="M${PG[0]} ${PG[1] - 13} L${PG[0] + 10} ${PG[1] - 2} L${PG[0] + 4} ${PG[1] + 12} L${PG[0] - 9} ${PG[1] + 3} Z"/>
        <text class="pgl" x="${PG[0] + 18}" y="${PG[1] + 5}" font-size="${small + 1}">PRAGHASA</text></g>
      ${nodes}</svg>`;
    select(selected, false);
    applyFilter();
  }

  function select(name, draw) {
    const m = missions.find((x) => x.node === name);
    if (!m || !POS[name]) return;
    selected = name;
    mapEl.querySelectorAll('.nd').forEach((n) => n.setAttribute('aria-pressed', n.dataset.node === name));
    const route = mapEl.querySelector('.route');
    route.setAttribute('d', routePath(POS[name]));
    route.setAttribute('pathLength', 100);
    route.classList.remove('draw', 'flow');
    if (draw) {
      void route.getBBox();
      route.classList.add('draw');
      setTimeout(() => { route.classList.remove('draw'); route.classList.add('flow'); }, 720);
    } else route.classList.add('flow');
    panel.querySelector('h3').textContent = m.node;
    panel.querySelector('.ty').textContent = m.type;
    panel.querySelector('.yd').innerHTML = Array.from({ length: MAX_RATING }, (_, i) => `<i class="${i < m.rating ? 'on' : ''}"></i>`).join('');
    panel.querySelector('.yd').setAttribute('aria-label', `${m.rating} de ${MAX_RATING}`);
    panel.querySelector('[data-f=bonus]').textContent = m.bonus;
    panel.querySelector('[data-f=when]').textContent = m.when;
  }

  mapEl.addEventListener('click', (e) => {
    const node = e.target.closest('.nd');
    if (node) select(node.dataset.node, true);
  });
  mapEl.addEventListener('keydown', (e) => {
    const node = e.target.closest('.nd');
    if (node && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      select(node.dataset.node, true);
    }
  });
  let lastW = 0;
  new ResizeObserver(() => {
    if (Math.abs(mapEl.clientWidth - lastW) < 40) return;
    lastW = mapEl.clientWidth;
    renderMap();
  }).observe(mapEl);

  const matches = (m) => filter === 'all' || m.tags.includes(filter);

  function applyFilter() {
    mapEl.querySelectorAll('.nd').forEach((n) => {
      const m = missions.find((x) => x.node === n.dataset.node);
      n.dataset.dim = matches(m) ? '0' : '1';
    });
  }

  function ratingHtml(rating) {
    return `<span class="rating">${'◆'.repeat(rating)}<span class="rating-empty">${'◆'.repeat(MAX_RATING - rating)}</span></span>`;
  }

  const tbody = document.querySelector('#mtable tbody');
  function renderTable() {
    tbody.innerHTML = missions
      .filter(matches)
      .map((m) => `
        <tr>
          <td><b class="node">${escapeHtml(m.node)}</b></td>
          <td>${escapeHtml(m.type)}</td>
          <td>${ratingHtml(m.rating)}</td>
          <td>${escapeHtml(m.bonus)}</td>
          <td class="muted">${escapeHtml(m.when)}</td>
        </tr>`)
      .join('');
  }

  renderMap();
  renderTable();

  const filters = $('mfilters');
  filters.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    filters.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c === chip));
    filter = chip.dataset.f;
    renderTable();
    applyFilter();
    // Se a missão aberta saiu do filtro, abre a primeira que sobrou
    const current = missions.find((m) => m.node === selected);
    if (!matches(current)) {
      const first = missions.find((m) => matches(m) && POS[m.node]);
      if (first) select(first.node, true);
    }
  });
})();
