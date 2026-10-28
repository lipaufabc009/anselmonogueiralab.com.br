// Filtros da página Publicações: Ano, Autor, Linha de pesquisa e Local de estudo.
// Aceita links vindos de outras páginas, como:
//   publicacoes.html?autor=matheus-siqueira
//   publicacoes.html?linha=defesa
//   publicacoes.html?local=diamantina&nome=Diamantina%20—%20MG
(function () {
  var lista = document.getElementById('lista-publicacoes');
  var caixa = document.getElementById('filtros');
  if (!lista || !caixa) return;

  var itens    = Array.prototype.slice.call(lista.querySelectorAll('li[data-ano]'));
  var selAno   = document.getElementById('filtro-ano');
  var selAutor = document.getElementById('filtro-autor');
  var selLinha = document.getElementById('filtro-linha');
  var selLocal = document.getElementById('filtro-local');
  var contador = document.getElementById('filtro-contador');
  var vazio    = document.getElementById('sem-resultados');
  var limpar   = document.getElementById('filtro-limpar');

  function tem(li, atributo, codigo) {
    return (li.getAttribute(atributo) || '').split(/\s+/).indexOf(codigo) !== -1;
  }

  function opcaoExiste(select, valor) {
    return Array.prototype.some.call(select.options, function (o) { return o.value === valor; });
  }

  function adicionar(select, valor, texto) {
    var o = document.createElement('option');
    o.value = valor;
    o.textContent = texto;
    select.appendChild(o);
  }

  // Anos: do mais recente ao mais antigo
  var anos = [];
  itens.forEach(function (li) {
    if (anos.indexOf(li.dataset.ano) === -1) anos.push(li.dataset.ano);
  });
  anos.sort(function (a, b) { return b - a; });
  anos.forEach(function (ano) { adicionar(selAno, ano, ano); });

  // Garante que códigos usados nos dados mas ausentes no HTML apareçam no select
  function garantir(select, atributo) {
    itens.forEach(function (li) {
      (li.getAttribute(atributo) || '').split(/\s+/).forEach(function (codigo) {
        if (!codigo || opcaoExiste(select, codigo)) return;
        var nome = codigo.replace(/-/g, ' ');
        adicionar(select, codigo, nome.charAt(0).toUpperCase() + nome.slice(1));
      });
    });
  }
  garantir(selAutor, 'data-autores');
  garantir(selLinha, 'data-linhas');
  if (selLocal) garantir(selLocal, 'data-locais');

  function aplicar() {
    var ano   = selAno.value;
    var autor = selAutor.value;
    var linha = selLinha.value;
    var local = selLocal ? selLocal.value : '';
    var visiveis = 0;

    itens.forEach(function (li) {
      var ok = (!ano   || li.dataset.ano === ano) &&
               (!autor || tem(li, 'data-autores', autor)) &&
               (!linha || tem(li, 'data-linhas', linha)) &&
               (!local || tem(li, 'data-locais', local));
      li.hidden = !ok;
      if (ok) visiveis++;
    });

    var total   = itens.length;
    var palavra = total === 1 ? ' publicação' : ' publicações';
    contador.textContent = visiveis === total
      ? total + palavra
      : 'Mostrando ' + visiveis + ' de ' + total + palavra;
    vazio.hidden  = visiveis > 0;
    limpar.hidden = !(ano || autor || linha || local);
  }

  var selects = [selAno, selAutor, selLinha];
  if (selLocal) selects.push(selLocal);
  selects.forEach(function (s) { s.addEventListener('change', aplicar); });

  limpar.addEventListener('click', function () {
    selAno.value = selAutor.value = selLinha.value = '';
    if (selLocal) selLocal.value = '';
    aplicar();
  });

  // Filtro vindo da URL (links dos locais de estudo)
  var params = new URLSearchParams(window.location.search);

  // Atualiza título da seção quando vem de um local ou linha específica
  var nomeParam = params.get('nome');
  if (nomeParam) {
    var h2 = document.querySelector('#publicacoes .titulo-secao');
    if (h2) h2.textContent = 'Publicações — ' + decodeURIComponent(nomeParam);
  }

  [['ano', selAno], ['autor', selAutor], ['linha', selLinha], ['local', selLocal]].forEach(function (par) {
    if (!par[1]) return;
    var valor = params.get(par[0]);
    if (valor && opcaoExiste(par[1], valor)) par[1].value = valor;
  });

  caixa.hidden = false;
  aplicar();
})();