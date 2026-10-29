// Carrossel de fotos e vídeos: uma mídia por vez, com setas e passagem automática.
// Vídeos tocam automaticamente com som; navegadores podem bloquear autoplay com som
// até que o usuário interaja com a página.
(function () {
  var INTERVALO = 3000;

  document.querySelectorAll('.carrossel').forEach(function (carrossel) {
    var midias = Array.prototype.slice.call(
      carrossel.querySelectorAll('.carrossel__img')
    );
    var atual = 0;
    var timer = null;
    var emHover = false;
    var emFoco = false;

    if (midias.length < 2) return;
    carrossel.classList.add('carrossel--ativo');

    function ehVideo(el) { return el.tagName === 'VIDEO'; }

    function pararTimer() { clearInterval(timer); timer = null; }

    function iniciarTimer() {
      if (emHover || emFoco || timer) return;
      if (!ehVideo(midias[atual])) {
        timer = setInterval(function () { mostrar(atual + 1); }, INTERVALO);
      }
    }

    function reiniciarTimer() { pararTimer(); iniciarTimer(); }

    function mostrar(indice) {
      var anterior = midias[atual];
      if (ehVideo(anterior)) {
        anterior.pause();
        anterior.currentTime = 0;
      }

      atual = (indice + midias.length) % midias.length;

      midias.forEach(function (m, i) {
        var ativo = i === atual;
        m.classList.toggle('is-ativo', ativo);
        m.setAttribute('aria-hidden', ativo ? 'false' : 'true');
      });

      var novo = midias[atual];
      if (ehVideo(novo) && !emHover && !emFoco) {
        novo.muted = false;
        novo.play().catch(function () {
          // Se o navegador bloquear com som, tenta sem som
          novo.muted = true;
          novo.play().catch(function () {});
        });
      }

      reiniciarTimer();
    }

    midias.forEach(function (m) {
      if (ehVideo(m)) {
        m.addEventListener('ended', function () { mostrar(atual + 1); });
      }
    });

    carrossel.querySelectorAll('.carrossel__btn[data-dir]').forEach(function (botao) {
      botao.addEventListener('click', function () {
        mostrar(atual + Number(botao.dataset.dir));
      });
    });

    carrossel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { mostrar(atual - 1); }
      if (e.key === 'ArrowRight') { mostrar(atual + 1); }
    });

    carrossel.addEventListener('mouseenter', function () {
      emHover = true;
      pararTimer();
      var m = midias[atual];
      if (ehVideo(m)) m.pause();
    });
    carrossel.addEventListener('mouseleave', function () {
      emHover = false;
      var m = midias[atual];
      if (ehVideo(m)) m.play().catch(function () {});
      else iniciarTimer();
    });
    carrossel.addEventListener('focusin', function (e) {
      emFoco = e.target.matches(':focus-visible');
      if (emFoco) pararTimer();
    });
    carrossel.addEventListener('focusout', function () {
      emFoco = false;
      iniciarTimer();
    });

    mostrar(0);
  });
})();