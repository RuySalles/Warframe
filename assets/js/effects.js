// =============================================================================
// Efeitos visuais e navegação: menu ativo, títulos que se decifram, animação de entrada,
// botão de topo, fotos do Xaku, ampliação da galeria e esporos do topo.
// =============================================================================

(function () {
  const { $ } = window.TB;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Destaca no menu a seção que está na tela ---
  const links = [...document.querySelectorAll('#nav a')];
  const sectionObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
      }),
    { rootMargin: '-45% 0px -50% 0px' }
  );
  document.querySelectorAll('main section').forEach((s) => sectionObserver.observe(s));

  // --- Sinal da Praghasa: o texto chega em glifos Sentient e se decifra ---
  // Troca só os nós de texto, então <em>, <b> etc. continuam no lugar.
  const GLYPHS = '◇◆△▽⟁⧫⬡⬢⌬⏃⏚⍜';
  function decode(el) {
    if (reduceMotion) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push({ node: walker.currentNode, text: walker.currentNode.textContent });
    const total = nodes.reduce((n, t) => n + t.text.length, 0);
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      let offset = 0;
      nodes.forEach((t) => {
        t.node.textContent = [...t.text]
          .map((c, i) => (offset + i < frame / 2 || c.trim() === '' ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join('');
        offset += t.text.length;
      });
      if (frame / 2 >= total) {
        clearInterval(timer);
        nodes.forEach((t) => (t.node.textContent = t.text));
      }
    }, 40);
  }
  const decodeObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        decode(e.target);
        decodeObserver.unobserve(e.target);
      }),
    { threshold: 0.6 }
  );
  // A seção do Xaku é Orokin, não Sentient: o título dela não se decifra.
  document.querySelectorAll('[data-decode], main section:not(.ok) h2').forEach((el) => decodeObserver.observe(el));

  // --- Entrada suave dos blocos .reveal ---
  const revealObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        revealObserver.unobserve(e.target);
      }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  // --- Botão "voltar ao topo" ---
  const topBtn = $('top');
  addEventListener('scroll', () => topBtn.classList.toggle('on', scrollY > 600), { passive: true });
  topBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  // --- Fotos do Xaku: trocar a foto passa uma folha de ouro pelo arco ---
  const showcase = $('xshow');
  if (showcase) {
    const arch = showcase.querySelector('.arch');
    showcase.querySelector('.xthumbs').addEventListener('click', (e) => {
      if (e.target.tagName !== 'IMG') return;
      $('xbig').src = e.target.src;
      showcase.querySelectorAll('.xthumbs img').forEach((img) => img.classList.toggle('on', img === e.target));
      arch.classList.remove('shine');
      void arch.offsetWidth; // reinicia a animação
      arch.classList.add('shine');
    });
  }

  // --- Galeria: clique para ampliar ---
  const lightbox = $('lb');
  $('gal').addEventListener('click', (e) => {
    const img = e.target.closest('figure')?.querySelector('img');
    if (!img) return;
    lightbox.querySelector('img').src = img.src;
    lightbox.classList.add('on');
  });
  lightbox.addEventListener('click', () => lightbox.classList.remove('on'));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.classList.remove('on');
  });

  // --- Esporos de Moonflesh e Void subindo pela arte do topo ---
  // As cores vêm dos tokens do tema (--flesh e --void), então mudam com o tema.
  const canvas = $('pt');
  const ctx = canvas.getContext('2d');
  const TOKENS = ['--flesh', '--void'];
  let spores = [];
  let width = 0, height = 0;

  function resize() {
    const ratio = devicePixelRatio || 1;
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    spores = Array.from({ length: Math.round(Math.min(80, width / 14)) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.6 + 0.8,
      speed: Math.random() * 0.3 + 0.08,
      phase: Math.random() * 6.28,
      token: TOKENS[Math.random() < 0.55 ? 0 : 1],
    }));
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    const styles = getComputedStyle(document.documentElement);
    const color = Object.fromEntries(TOKENS.map((t) => [t, styles.getPropertyValue(t).trim()]));
    spores.forEach((p) => {
      p.y -= p.speed;
      p.x += Math.sin(time / 1400 + p.phase) * 0.25;
      if (p.y < -8) {
        p.y = height + 8;
        p.x = Math.random() * width;
      }
      const c = color[p.token];
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
      glow.addColorStop(0, c);
      glow.addColorStop(0.35, c + 'aa');
      glow.addColorStop(1, c + '00');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.fill();
    });
    if (!reduceMotion) requestAnimationFrame(draw);
  }

  resize();
  addEventListener('resize', resize);
  requestAnimationFrame(draw);
})();
