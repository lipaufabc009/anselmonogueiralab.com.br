// Carrossel horizontal de fotos para a página Locais de Estudo.
// Cada .galeria-local__faixa desliza para a esquerda/direita com setas.
// As setas somem quando não há mais fotos naquela direção.
(function () {

  document.querySelectorAll('.galeria-local').forEach(function (galeria) {
    var faixa   = galeria.querySelector('.galeria-local__faixa');
    var btnPrev = galeria.querySelector('.galeria-local__btn--prev');
    var btnNext = galeria.querySelector('.galeria-local__btn--next');
    if (!faixa || !btnPrev || !btnNext) return;

    // Quanto deslocar a cada clique: largura de um item (foto ou wrapper de vídeo) + gap
    function passo() {
      /* tenta primeiro uma imagem normal, depois o wrapper de vídeo, depois o próprio item */
      var ref = faixa.querySelector('img.galeria-local__foto') ||
                faixa.querySelector('.galeria-local__video-wrapper') ||
                faixa.querySelector('.galeria-local__item');
      if (!ref) return faixa.offsetWidth;
      var style = window.getComputedStyle(faixa);
      var gap = parseFloat(style.gap || style.columnGap) || 16;
      return ref.offsetWidth + gap;
    }

    function atualizar() {
      var max = faixa.scrollWidth - faixa.clientWidth;
      btnPrev.hidden = faixa.scrollLeft <= 1;
      btnNext.hidden = faixa.scrollLeft >= max - 1;
    }

    btnPrev.addEventListener('click', function () {
      faixa.scrollBy({ left: -passo(), behavior: 'smooth' });
    });
    btnNext.addEventListener('click', function () {
      faixa.scrollBy({ left: passo(), behavior: 'smooth' });
    });

    faixa.addEventListener('scroll', atualizar, { passive: true });
    window.addEventListener('resize', atualizar);
    atualizar();
  });

})();