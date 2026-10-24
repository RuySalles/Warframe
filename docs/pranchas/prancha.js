// =============================================================================
// Moldura comum das pranchas de conceito do guia Taubound.
// Cada conceito-N.html chama PR.init({...}) com a paleta, as fontes, as peças
// e duas funções: render(root, size) desenha o recorte; update(root) atualiza
// os medidores quando algo é marcado. Os dados vêm do assets/js/data.js real.
// As marcações daqui ficam só na memória (não tocam no progresso salvo do site).
// =============================================================================
(function () {
  const D = window.TB_DATA;
  const PR = window.PR = {
    D,
    state: { crim: true },
    TOTAL: 6,
    roots: [],
    cfg: null,
    fmt: n => n.toLocaleString('pt-BR'),
    pad: n => String(n).padStart(2, '0'),
    p1: () => D.shop.find(g => g.tier === 1).items,
    mission: name => D.missions.find(m => m.node === name),
    goal: () => PR.p1().reduce((s, i) => s + i.cost, 0),
    got: () => PR.p1().filter(i => PR.state[i.id]).reduce((s, i) => s + i.cost, 0),
    left: () => PR.goal() - PR.got(),
    pct: () => PR.got() / PR.goal(),
    cd() {
      const t = Math.max(0, Math.floor((D.event.endsAtUtc - Date.now()) / 1000));
      return { d: Math.floor(t / 86400), h: Math.floor(t % 86400 / 3600), m: Math.floor(t % 3600 / 60), s: t % 60 };
    },
  };

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function palette(p) {
    return `<div class="pr-pal"><b>${esc(p.nome)}</b><span class="pr-pal-sub">${esc(p.sub)}</span><div class="pr-sws">${
      p.cores.map(([n, h]) => `<span class="pr-sw"><i style="background:${h}"></i><small>${esc(n)}<br><code>${h}</code></small></span>`).join('')
    }</div></div>`;
  }

  PR.sync = function (id, just) {
    document.querySelectorAll(`.rc [data-item="${id}"]`).forEach(el => {
      el.dataset.on = PR.state[id] ? '1' : '0';
      el.setAttribute('aria-pressed', PR.state[id] ? 'true' : 'false');
      if (just) {
        el.dataset.just = '1';
        clearTimeout(el._just);
        el._just = setTimeout(() => delete el.dataset.just, 1600);
      }
    });
    PR.roots.forEach(r => PR.cfg.update && PR.cfg.update(r, just));
  };

  function setTheme(t) {
    document.documentElement.dataset.theme = t;
    document.querySelectorAll('.pr-seg button').forEach(b => b.setAttribute('aria-pressed', b.dataset.t === t));
    if (PR.cfg && PR.cfg.theme) PR.cfg.theme(t);
  }

  PR.init = function (cfg) {
    PR.cfg = cfg;
    document.title = `Prancha ${cfg.n} · ${cfg.nome}`;
    const b = document.createElement('div');
    b.className = 'pr-board';
    b.innerHTML = `
      <header class="pr-top">
        <div class="pr-head">
          <div class="pr-kick">Prancha ${cfg.n} ${cfg.n ? 'de ' + PR.TOTAL : '· ponto de partida'} · Guia Taubound · ${esc(cfg.fonte)}</div>
          <h1>${esc(cfg.nome)}</h1>
          <p class="pr-frase">${cfg.frase}</p>
        </div>
        <div class="pr-ctrl">
          <div class="pr-seg" role="group" aria-label="Tema do recorte">
            <button type="button" data-t="dark">${esc(cfg.paletas.dark.nome)}</button>
            <button type="button" data-t="light">${esc(cfg.paletas.light.nome)}</button>
          </div>
          <nav class="pr-nav" aria-label="Pranchas">
            <a href="index.html">Todas</a>
            ${cfg.n > 0 ? `<a href="conceito-${cfg.n - 1}.html">← ${cfg.n - 1}</a>` : ''}
            ${cfg.n < PR.TOTAL ? `<a href="conceito-${cfg.n + 1}.html">${cfg.n + 1} →</a>` : ''}
          </nav>
        </div>
      </header>
      <section class="pr-stage">
        <figure class="pr-fig"><figcaption>Recorte real · desktop</figcaption><div class="pr-desk"><div class="rc" data-size="desk"></div></div></figure>
        <figure class="pr-fig"><figcaption>Mesmo recorte · 375 px</figcaption><div class="pr-phone"><div class="rc" data-size="phone"></div></div></figure>
      </section>
      <section class="pr-info">
        <div><h2>Paleta</h2>${palette(cfg.paletas.dark)}${palette(cfg.paletas.light)}</div>
        <div><h2>Tipografia</h2>${cfg.fontes.map(f => `
          <div class="pr-font"><span class="pr-font-am" style="font-family:${f.css}">${esc(f.amostra)}</span>
          <small><b>${esc(f.nome)}</b> · ${esc(f.uso)}</small></div>`).join('')}
        </div>
        <div><h2>Momento de assinatura</h2><p>${cfg.assinatura}</p><p class="pr-hint"><b>Experimente:</b> ${cfg.experimente}</p></div>
      </section>
      <section class="pr-pecas"><h2>Cada peça do guia neste mundo</h2>
        <table><thead><tr><th>Peça</th><th>Vira</th></tr></thead><tbody>${
          cfg.pecas.map(([a, c]) => `<tr><td>${esc(a)}</td><td>${c}</td></tr>`).join('')
        }</tbody></table>
      </section>
      ${cfg.extra || ''}
      <footer class="pr-foot">${cfg.rodape || 'Dados reais de <code>assets/js/data.js</code> e contagem regressiva ao vivo. As marcações desta prancha não são salvas.'}</footer>`;
    document.body.appendChild(b);

    b.querySelectorAll('.pr-seg button').forEach(btn => btn.addEventListener('click', () => setTheme(btn.dataset.t)));
    setTheme(location.hash === '#claro' ? 'light' : 'dark');

    PR.roots = [...b.querySelectorAll('.rc')];
    PR.roots.forEach(r => cfg.render(r, r.dataset.size));
    Object.keys(D.shop.reduce((o, g) => (g.items.forEach(i => o[i.id] = 1), o), {})).forEach(id => PR.sync(id, false));
    PR.roots.forEach(r => cfg.update && cfg.update(r, false));

    const tick = () => { const c = PR.cd(); PR.roots.forEach(r => cfg.tick && cfg.tick(r, c)); };
    tick();
    setInterval(tick, 1000);

    document.addEventListener('click', e => {
      const t = e.target.closest('.rc [data-item]');
      if (!t) return;
      const id = t.dataset.item;
      PR.state[id] = !PR.state[id];
      PR.sync(id, true);
    });
  };
})();
