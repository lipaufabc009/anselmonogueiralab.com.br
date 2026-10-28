// Proteção por senha.
// Redireciona para senha.html se o acesso não estiver liberado na sessão.
// Coloque <script src="js/acesso.js"> como PRIMEIRO script de cada página,
// antes de qualquer outro — assim o redirecionamento é imediato.
(function () {
  // Páginas que não precisam de proteção
  var PAGINAS_LIVRES = ['senha.html'];
  var pagina = location.pathname.split('/').pop() || 'index.html';
  if (PAGINAS_LIVRES.indexOf(pagina) !== -1) return;

  if (sessionStorage.getItem('lipa-acesso') !== '1') {
    location.replace('senha.html');
  }
})();
