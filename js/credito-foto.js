// Crédito fotográfico: ao passar o mouse, exibe o valor de data-credito
// na base da imagem como uma faixa semitransparente.
//
// Carrosseis (.carrossel): usa uma faixa única compartilhada que atualiza
// o texto conforme a foto ativa muda, evitando sobreposição de créditos.
// Outras imagens: cria a faixa individualmente em cada uma.
(function () {

  // ── Carrosseis ────────────────────────────────────────────────────────
  document.querySelectorAll('.carrossel').forEach(function (carrossel) {
    var fotos = Array.prototype.slice.call(
      carrossel.querySelectorAll('img[data-credito]')
    );
    if (!fotos.length) return;

    // Faixa única para todo o carrossel
    var faixa = document.createElement('span');
    faixa.className = 'credito-faixa';
    faixa.setAttribute('aria-hidden', 'true');
    carrossel.appendChild(faixa);

    function atualizar() {
      var ativa = carrossel.querySelector('.carrossel__img.is-ativo');
      var credito = ativa && ativa.getAttribute('data-credito');
      if (credito) {
        faixa.innerHTML = credito;
        faixa.hidden = false;
      } else {
        faixa.hidden = true;
      }
    }

    // Observa mudanças de classe nas fotos (is-ativo entra e sai)
    var observer = new MutationObserver(atualizar);
    fotos.forEach(function (foto) {
      observer.observe(foto, { attributes: true, attributeFilter: ['class'] });
    });

    atualizar(); // estado inicial
  });

  // ── Imagens fora de carrossel ─────────────────────────────────────────
  document.querySelectorAll('img[data-credito]').forEach(function (img) {
    // Pula as que já estão dentro de um carrossel (tratadas acima)
    if (img.closest('.carrossel')) return;
    if (img.dataset.creditoOk) return;
    img.dataset.creditoOk = '1';

    var pai = img.parentElement;
    if (getComputedStyle(pai).position === 'static') {
      var wrapper = document.createElement('span');
      wrapper.className = 'credito-wrapper';
      pai.insertBefore(wrapper, img);
      wrapper.appendChild(img);
      pai = wrapper;
    }

    var faixa = document.createElement('span');
    faixa.className = 'credito-faixa';
    faixa.setAttribute('aria-hidden', 'true');
    faixa.innerHTML = img.getAttribute('data-credito');
    pai.appendChild(faixa);
  });

})();