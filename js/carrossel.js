// Carrossel de fotos: uma foto por vez, com setas e passagem automática.
(function () {
  // Tempo entre uma foto e outra, em milissegundos (5000 = 5 segundos)
  var INTERVALO = 3000;

  document.querySelectorAll('.carrossel').forEach(function (carrossel) {
    var fotos = carrossel.querySelectorAll('.carrossel__img');
    var atual = 0;
    var timer = null;
    var emHover = false; // mouse em cima do carrossel
    var emFoco = false;  // navegando pelo teclado dentro do carrossel

    // Com uma foto só, não precisa de setas nem de passagem automática
    if (fotos.length < 2) return;

    carrossel.classList.add('carrossel--ativo');

    function mostrar(indice) {
      atual = (indice + fotos.length) % fotos.length; // volta ao início depois da última
      fotos.forEach(function (foto, i) {
        foto.classList.toggle('is-ativo', i === atual);
        foto.setAttribute('aria-hidden', i === atual ? 'false' : 'true');
      });
    }

    // Passagem automática (desligada para quem pediu menos animação no sistema)
    var menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function parar() {
      clearInterval(timer);
      timer = null;
    }
    function iniciar() {
      if (menosMovimento || emHover || emFoco || timer) return;
      timer = setInterval(function () { mostrar(atual + 1); }, INTERVALO);
    }
    function reiniciar() { // depois de um clique, a contagem recomeça do zero
      parar();
      iniciar();
    }

    carrossel.querySelectorAll('.carrossel__btn').forEach(function (botao) {
      botao.addEventListener('click', function () {
        mostrar(atual + Number(botao.dataset.dir));
        reiniciar();
      });
    });

    // Setas do teclado também funcionam
    carrossel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { mostrar(atual - 1); reiniciar(); }
      if (e.key === 'ArrowRight') { mostrar(atual + 1); reiniciar(); }
    });

    // Pausa enquanto o mouse está em cima ou o teclado está em uso no carrossel
    carrossel.addEventListener('mouseenter', function () { emHover = true; parar(); });
    carrossel.addEventListener('mouseleave', function () { emHover = false; iniciar(); });
    carrossel.addEventListener('focusin', function (e) {
      emFoco = e.target.matches(':focus-visible');
      if (emFoco) parar();
    });
    carrossel.addEventListener('focusout', function () { emFoco = false; iniciar(); });

    mostrar(0);
    iniciar();
  });
})();