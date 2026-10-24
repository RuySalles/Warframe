// =============================================================================
// Base compartilhada por todos os scripts: progresso salvo, avisos e formatação.
// Tudo fica em window.TB para os outros arquivos usarem.
// =============================================================================

(function () {
  // O prefixo e o sufixo -v1 nunca mudam: é o que mantém o progresso de quem já usa o guia.
  const PREFIX = 'warframe-taubound';
  const keyOf = (name) => `${PREFIX}-${name}-v1`;
  const isOurs = (k) => k.startsWith(PREFIX + '-');

  // --- Armazenamento (nunca quebra se o navegador bloquear o localStorage) ---
  const store = {
    get(name, fallback) {
      try {
        const raw = localStorage.getItem(keyOf(name));
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) {
        return fallback;
      }
    },
    set(name, value) {
      try {
        localStorage.setItem(keyOf(name), JSON.stringify(value));
      } catch (e) {}
    },
    clearAll() {
      try {
        Object.keys(localStorage).filter(isOurs).forEach((k) => localStorage.removeItem(k));
      } catch (e) {}
    },
  };

  // --- Aviso rápido no rodapé da tela ---
  let toastTimer;
  function toast(message) {
    let el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (el.hidden = true), 2600);
  }

  // --- Exportar / importar o progresso (mesmo formato dos outros guias) ---
  function exportSave() {
    const data = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (isOurs(k)) data[k] = localStorage.getItem(k);
      }
    } catch (e) {}

    const file = { guia: PREFIX, exportado: new Date().toISOString(), dados: data };
    const blob = new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${PREFIX}-progresso.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    toast('Progresso exportado.');
  }

  function importSave() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.addEventListener('change', async () => {
      const file = input.files[0];
      if (!file) return;
      try {
        const json = JSON.parse(await file.text());
        const entries = Object.entries(json.dados || {}).filter(
          ([k, v]) => isOurs(k) && typeof v === 'string'
        );
        if (json.guia !== PREFIX || !entries.length) {
          toast('Este arquivo não é um progresso deste guia.');
          return;
        }
        entries.forEach(([k, v]) => {
          try {
            localStorage.setItem(k, v);
          } catch (e) {}
        });
        toast('Progresso importado. Recarregando…');
        setTimeout(() => location.reload(), 700);
      } catch (e) {
        toast('Não foi possível ler o arquivo.');
      }
    });
    input.click();
  }

  // --- Utilidades ---
  const $ = (id) => document.getElementById(id);
  const fmt = (n) => Math.round(n).toLocaleString('pt-BR');
  const pad2 = (n) => String(n).padStart(2, '0');
  const escapeHtml = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  window.TB = { store, keyOf, toast, exportSave, importSave, $, fmt, pad2, escapeHtml };
})();
