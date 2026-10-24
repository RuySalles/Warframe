// =============================================================================
// Topo da página: contagem regressiva, tema claro/escuro e menu ⋯ (exportar/importar).
// =============================================================================

(function () {
  const { store, keyOf, $, pad2, exportSave, importSave } = window.TB;

  // --- Contagem regressiva até o fim do evento ---
  const END = window.TB_DATA.event.endsAtUtc;
  const DAY = 864e5, HOUR = 36e5, MINUTE = 6e4;

  function tick() {
    let left = Math.max(0, END - Date.now());
    const days = Math.floor(left / DAY); left %= DAY;
    const hours = Math.floor(left / HOUR); left %= HOUR;
    const minutes = Math.floor(left / MINUTE);
    const seconds = Math.floor((left % MINUTE) / 1000);
    $('cdD').textContent = days;
    $('cdH').textContent = pad2(hours);
    $('cdM').textContent = pad2(minutes);
    $('cdS').textContent = pad2(seconds);
  }
  tick();
  setInterval(tick, 1000);

  // Usado pela calculadora
  window.TB.daysLeft = () => Math.max(0, (END - Date.now()) / DAY);

  // --- Tema (o tema inicial é aplicado por theme-init.js, antes da pintura) ---
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeMeta.setAttribute('content', theme === 'dark' ? '#0b0a0f' : '#f4efe9');
  }
  applyTheme(document.documentElement.getAttribute('data-theme') || 'dark');

  $('themeBtn').addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    // Gravado como texto puro (não JSON), porque theme-init.js lê antes de qualquer script
    try {
      localStorage.setItem(keyOf('theme'), next);
    } catch (e) {}
  });

  // --- Menu ⋯ ---
  const menu = $('more');
  menu.addEventListener('click', (e) => {
    if (e.target.closest('.menu button')) menu.open = false;
  });
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target)) menu.open = false;
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') menu.open = false;
  });

  $('btnExport').addEventListener('click', exportSave);
  $('btnImport').addEventListener('click', importSave);
  $('btnResetAll').addEventListener('click', () => {
    if (!confirm('Apagar todo o progresso salvo deste guia neste navegador?')) return;
    store.clearAll();
    location.reload();
  });
})();
