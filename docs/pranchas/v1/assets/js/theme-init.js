// Aplica o tema salvo antes de a página aparecer (evita "piscar" claro/escuro).
// Carregado no <head>, sem defer. A chave é a mesma usada em header.js.
(function () {
  var theme;
  // ?tema=light|dark força o tema sem salvar (usado pela prancha 0 em docs/pranchas)
  var forced = /[?&]tema=(light|dark)\b/.exec(location.search);
  if (forced) theme = forced[1];
  else try {
    theme = localStorage.getItem('warframe-taubound-theme-v1');
  } catch (e) {}
  if (!theme) theme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
})();
