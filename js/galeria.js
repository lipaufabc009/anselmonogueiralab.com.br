// Galeria: ao clicar em uma foto, ela abre ampliada em uma janela sobre a página.
(function () {
  var janela = document.getElementById('lightbox');
  if (!janela || typeof janela.showModal !== 'function') return; // sem suporte: o link abre a foto normalmente

  var imagem = janela.querySelector('img');
  var legenda = janela.querySelector('.lightbox__legenda');

  document.querySelectorAll('.galeria__item').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var miniatura = link.querySelector('img');
      var texto = link.parentNode.querySelector('p');
      imagem.src = link.getAttribute('href');
      imagem.alt = miniatura ? miniatura.alt : '';
      legenda.textContent = texto ? texto.textContent : '';
      janela.showModal();
    });
  });

  janela.querySelector('.lightbox__fechar').addEventListener('click', function () { janela.close(); });

  // Clicar fora da foto também fecha (a tecla Esc já fecha sozinha)
  janela.addEventListener('click', function (e) { if (e.target === janela) janela.close(); });
})();
