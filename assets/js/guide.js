// =============================================================================
// Seções de leitura: passos de "onde clicar", abas da rotina e tabela de missões.
// =============================================================================

(function () {
  const { store, $, escapeHtml } = window.TB;

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

  // --- Tabela de missões com filtro ---
  const missions = window.TB_DATA.missions;
  const tbody = document.querySelector('#mtable tbody');
  const MAX_RATING = 5;

  function ratingHtml(rating) {
    return `<span class="rating">${'◆'.repeat(rating)}<span class="rating-empty">${'◆'.repeat(MAX_RATING - rating)}</span></span>`;
  }

  function renderMissions(filter) {
    tbody.innerHTML = missions
      .filter((m) => filter === 'all' || m.tags.includes(filter))
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
  renderMissions('all');

  const filters = $('mfilters');
  filters.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    filters.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c === chip));
    renderMissions(chip.dataset.f);
  });
})();
