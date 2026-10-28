// Gerenciamento de idioma: português (pt) e inglês (en).
// - Detecta o idioma preferido do navegador na primeira visita.
// - Salva a escolha do usuário em localStorage.
// - Troca todos os textos com data-pt / data-en ao clicar no botão.
(function () {

  // ─── 1. Determinar idioma ────────────────────────────────────────────────
  var CHAVE = 'lipa-idioma';
  var salvo = localStorage.getItem(CHAVE);
  var navegador = (navigator.language || navigator.userLanguage || 'pt').toLowerCase();
  var idioma = salvo || (navegador.startsWith('pt') ? 'pt' : 'en');

  // ─── 2. Criar o botão PT | EN e inseri-lo no cabeçalho ──────────────────
  function criarBotao() {
    var topo = document.querySelector('.topo');
    if (!topo) return;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'btn-idioma';
    btn.setAttribute('aria-label', 'Switch language / Mudar idioma');

    // O botão fica na barra do nome, à direita
    var nome = topo.querySelector('.topo__nome');
    if (nome && nome.parentNode === topo) {
      // Envolve nome + botão num flex-container para ficarem na mesma linha
      var faixa = document.createElement('div');
      faixa.className = 'topo__faixa';
      topo.insertBefore(faixa, nome);
      faixa.appendChild(nome);
      faixa.appendChild(btn);
    } else {
      topo.appendChild(btn);
    }

    btn.addEventListener('click', function () {
      aplicar(idioma === 'pt' ? 'en' : 'pt', true);
    });
  }

  // ─── 3. Aplicar idioma: traduzir textos, atualizar html lang e botão ─────
  function aplicar(novo, salvar) {
    idioma = novo;
    if (salvar) localStorage.setItem(CHAVE, idioma);

    // Atualiza o atributo lang do documento
    document.documentElement.lang = idioma === 'en' ? 'en' : 'pt-BR';

    // Troca todos os elementos que têm data-pt e data-en
    document.querySelectorAll('[data-pt][data-en]').forEach(function (el) {
      // Preserva elementos-filhos (ex.: <strong>, <em>, <a>) se o atributo não os contiver
      el.innerHTML = el.getAttribute('data-' + idioma);
    });

    // Troca placeholders de inputs
    document.querySelectorAll('[data-pt-placeholder][data-en-placeholder]').forEach(function (el) {
      el.placeholder = el.getAttribute('data-' + idioma + '-placeholder');
    });

    // Troca atributo aria-label de elementos que o declarem
    document.querySelectorAll('[data-pt-label][data-en-label]').forEach(function (el) {
      el.setAttribute('aria-label', el.getAttribute('data-' + idioma + '-label'));
    });

    // Atualiza o texto do botão
    var btn = document.getElementById('btn-idioma');
    if (btn) btn.textContent = idioma === 'pt' ? 'EN' : 'PT';

    // Atualiza o título da aba
    var tituloPt = document.documentElement.getAttribute('data-titulo-pt');
    var tituloEn = document.documentElement.getAttribute('data-titulo-en');
    if (tituloPt && tituloEn) {
      document.title = idioma === 'pt' ? tituloPt : tituloEn;
    }
  }

  // ─── 4. Inicializar após o DOM estar pronto ───────────────────────────────
  function init() {
    criarBotao();
    aplicar(idioma, false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
