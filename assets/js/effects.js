// =============================================================================
// Efeitos visuais e navegação: menu ativo, animação de entrada, botão de topo,
// fotos do loadout, ampliação da galeria e partículas do topo.
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
  topBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // --- Miniaturas do Xaku ---
  const showcase = $('xshow');
  if (showcase) {
    showcase.querySelector('.xthumbs').addEventListener('click', (e) => {
      if (e.target.tagName !== 'IMG') return;
      $('xbig').src = e.target.src;
      showcase.querySelectorAll('.xthumbs img').forEach((img) => img.classList.toggle('on', img === e.target));
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

  // --- Partículas de Void no topo ---
  const canvas = $('pt');
  const ctx = canvas.getContext('2d');
  const COLORS = ['95,224,208', '229,138,151']; // void e moonflesh
  let particles = [];

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const count = Math.min(70, canvas.width / 18);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.4,
      speed: Math.random() * 0.35 + 0.08,
      rgb: COLORS[Math.random() < 0.5 ? 0 : 1],
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.y -= p.speed;
      if (p.y < -5) {
        p.y = canvas.height + 5;
        p.x = Math.random() * canvas.width;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.rgb},.7)`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${p.rgb},1)`;
      ctx.fill();
    });
    if (!reduceMotion) requestAnimationFrame(draw);
  }

  resize();
  addEventListener('resize', resize);
  draw();
})();
