// cabecalho.js
// Injeta o botão de hambúrguer no cabeçalho e controla abertura/fechamento do menu.
//
// Funciona em DOIS tipos de cabeçalho:
//   1. .topo--compacto  — páginas de alunos, pós-docs e projetos (SEMPRE hamburger)
//   2. .topo normal     — páginas principais (Home, Equipe, etc.) → hamburger só em mobile
//      O CSS oculta o botão em telas largas via media query; o JS apenas o injeta.
(function () {

  // ─── Cria o botão de hambúrguer ─────────────────────────────────────────────
  function criarBotao(labelAbrir, labelFechar) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'menu-botao';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', labelAbrir);

    var barras = document.createElement('span');
    barras.className = 'menu-botao__barras';
    barras.setAttribute('aria-hidden', 'true');
    btn.appendChild(barras);

    btn.addEventListener('click', function () {
      var topo = btn.closest('.topo');
      var aberto = topo.classList.toggle('topo--aberto');
      btn.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      btn.setAttribute('aria-label', aberto ? labelFechar : labelAbrir);
    });

    return btn;
  }

  // ─── Fecha o menu ao clicar fora dele ───────────────────────────────────────
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.topo.topo--aberto').forEach(function (topo) {
      if (!topo.contains(e.target)) {
        topo.classList.remove('topo--aberto');
        var btn = topo.querySelector('.menu-botao');
        if (btn) {
          btn.setAttribute('aria-expanded', 'false');
          btn.setAttribute('aria-label', btn.dataset.labelAbrir || 'Abrir menu');
        }
      }
    });
  });

  // ─── Fecha o menu ao pressionar Escape ──────────────────────────────────────
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.topo.topo--aberto').forEach(function (topo) {
      topo.classList.remove('topo--aberto');
      var btn = topo.querySelector('.menu-botao');
      if (btn) {
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', btn.dataset.labelAbrir || 'Abrir menu');
        btn.focus();
      }
    });
  });

  // ─── Fecha o menu ao clicar num link do menu ────────────────────────────────
  document.querySelectorAll('.topo .menu a').forEach(function (link) {
    link.addEventListener('click', function () {
      var topo = link.closest('.topo');
      if (topo) {
        topo.classList.remove('topo--aberto');
        var btn = topo.querySelector('.menu-botao');
        if (btn) {
          btn.setAttribute('aria-expanded', 'false');
          btn.setAttribute('aria-label', btn.dataset.labelAbrir || 'Abrir menu');
        }
      }
    });
  });

  // ─── Inicialização ───────────────────────────────────────────────────────────
  function init() {
    var topos = document.querySelectorAll('.topo');

    topos.forEach(function (topo) {
      var nav = topo.querySelector('nav');
      if (!nav) return;

      var isCompacto = topo.classList.contains('topo--compacto');

      // Rótulos do botão (PT/EN detectado pelo idioma atual da página)
      var lang = document.documentElement.lang || 'pt';
      var labelAbrir = lang.startsWith('en') ? 'Open menu' : 'Abrir menu';
      var labelFechar = lang.startsWith('en') ? 'Close menu' : 'Fechar menu';

      var btn = criarBotao(labelAbrir, labelFechar);
      btn.dataset.labelAbrir = labelAbrir;

      if (isCompacto) {
        // Páginas compactas: botão vai diretamente no .topo, após a faixa nome+idioma
        topo.appendChild(btn);
      } else {
        // Páginas principais: botão vai dentro da .topo__faixa (ao lado do botão PT/EN)
        // A .topo__faixa é criada pelo idioma.js; se ainda não existir, aguardamos um frame
        var faixa = topo.querySelector('.topo__faixa');
        if (faixa) {
          faixa.appendChild(btn);
        } else {
          // idioma.js ainda não rodou — aguarda o próximo frame de layout
          requestAnimationFrame(function () {
            var f = topo.querySelector('.topo__faixa');
            if (f) {
              f.appendChild(btn);
            } else {
              // fallback: appenda direto no topo
              topo.insertBefore(btn, nav);
            }
          });
        }
      }
    });
  }

  // ─── Recolhe/mostra a nav ao rolar (somente .topo normal, não .topo--compacto) ─
  function initScroll() {
    var topo = document.querySelector('.topo:not(.topo--compacto)');
    if (!topo) return;

    var ultimoScroll = 0;
    var LIMIAR = 80; // px antes de começar a recolher

    window.addEventListener('scroll', function () {
      var atual = window.scrollY;

      if (atual <= LIMIAR) {
        // Próximo ao topo: sempre mostra
        topo.classList.remove('topo--recolhido');
      } else if (atual > ultimoScroll) {
        // Rolando para baixo: recolhe
        topo.classList.add('topo--recolhido');
        // Fecha o menu se estiver aberto
        if (topo.classList.contains('topo--aberto')) {
          topo.classList.remove('topo--aberto');
          var btn = topo.querySelector('.menu-botao');
          if (btn) {
            btn.setAttribute('aria-expanded', 'false');
            btn.setAttribute('aria-label', btn.dataset.labelAbrir || 'Abrir menu');
          }
        }
      } else {
        // Rolando para cima: mostra
        topo.classList.remove('topo--recolhido');
      }

      ultimoScroll = atual;
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(); initScroll(); });
  } else {
    init();
    initScroll();
  }

})();