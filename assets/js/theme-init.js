// Aplica o tema salvo antes de a página aparecer (evita "piscar" claro/escuro).
// Carregado no <head>, sem defer. A chave é a mesma usada em header.js.
(function () {
  var theme;
  try {
    theme = localStorage.getItem('warframe-taubound-theme-v1');
  } catch (e) {}
  if (!theme) theme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
})();
