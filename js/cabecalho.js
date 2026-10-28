// Barra do topo.
// - Páginas normais: o nome do laboratório fica sempre visível; o menu some ao rolar a página
//   para baixo e volta assim que se rola um pouco para cima.
// - Páginas de alunos, alumni, colaboradores e projetos (cabeçalho com a classe "topo--compacto"):
//   barra fina com um botão de três barras que abre e fecha o menu.
(function () {
  var cabecalho = document.querySelector('.topo');
  if (!cabecalho) return;

  if (cabecalho.classList.contains('topo--compacto')) {
    iniciarMenuCompacto(cabecalho);
    return;
  }

  var LIMITE_TOPO = 80;   // perto do topo da página, o menu fica sempre visível (em pixels)
  var SENSIBILIDADE = 8;  // quanto é preciso rolar para valer como "subiu" ou "desceu" (em pixels)

  var ultimo = window.pageYOffset;
  var aguardando = false;

  function atualizar() {
    var atual = window.pageYOffset;
    var diferenca = atual - ultimo;

    if (atual <= LIMITE_TOPO) {
      cabecalho.classList.remove('topo--recolhido');
      ultimo = atual;
    } else if (diferenca > SENSIBILIDADE) {
      cabecalho.classList.add('topo--recolhido');    // descendo: esconde o menu
      ultimo = atual;
    } else if (diferenca < -SENSIBILIDADE) {
      cabecalho.classList.remove('topo--recolhido'); // subindo: mostra o menu
      ultimo = atual;
    }
    aguardando = false;
  }

  window.addEventListener('scroll', function () {
    if (aguardando) return;
    aguardando = true;
    window.requestAnimationFrame(atualizar);
  }, { passive: true });

  // Quem navega pelo teclado (Tab) precisa enxergar o menu
  cabecalho.addEventListener('focusin', function () {
    cabecalho.classList.remove('topo--recolhido');
  });

  // ---------- menu de três barras (páginas individuais) ----------
  function iniciarMenuCompacto(cab) {
    var painel = cab.querySelector('nav');
    if (!painel) return;
    if (!painel.id) painel.id = 'menu-principal';

    // O botão é criado aqui, então as páginas só precisam da classe "topo--compacto"
    var botao = cab.querySelector('.menu-botao');
    if (!botao) {
      botao = document.createElement('button');
      botao.type = 'button';
      botao.className = 'menu-botao';
      botao.setAttribute('aria-controls', painel.id);
      botao.innerHTML = '<span class="menu-botao__barras" aria-hidden="true"></span>';
      cab.insertBefore(botao, painel);
    }

    function definir(aberto) {
      cab.classList.toggle('topo--aberto', aberto);
      botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    }
    definir(false);

    botao.addEventListener('click', function () {
      definir(!cab.classList.contains('topo--aberto'));
    });

    // Fecha ao clicar fora, ao apertar Esc ou ao escolher um link
    document.addEventListener('click', function (e) {
      if (!cab.contains(e.target)) definir(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && cab.classList.contains('topo--aberto')) {
        definir(false);
        botao.focus();
      }
    });
    painel.addEventListener('click', function (e) {
      if (e.target.closest('a')) definir(false);
    });
  }
})();