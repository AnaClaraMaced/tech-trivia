
document.addEventListener("DOMContentLoaded", function () {

  /* -------------------------------------------------------------
     PASSO 1 — Marcelo Ludin
     Pegar as 5 telas (sections) na ordem em que já estão no HTML
     e guardar numa lista. É essa ordem que o botão "próxima parte"
     vai seguir.
     ------------------------------------------------------------- */
     
  const ordemDasTelas = [
    "start-screen",
    "ready-screen",
    "quiz-screen",
    "resultado-screen",
    "ranking-screen"
  ];

  const telas = ordemDasTelas.map(function (id) {
    return document.getElementById(id);
  });

  /* -------------------------------------------------------------
     PASSO 2 — Marcelo Ludin
     Função central de navegação: esconde todas as telas e mostra
     só a tela pedida. Isso resolve o "clicar no botão e ir pra
     próxima parte da página certinho", sem duplicar HTML nenhum,
     só controlando o "display" de cada section por JS.
     ------------------------------------------------------------- */
  function mostrarTela(idTela) {
    telas.forEach(function (tela) {
      if (!tela) return;
      tela.style.display = (tela.id === idTela) ? "" : "none";
    });
    // sobe a rolagem pro topo sempre que troca de tela
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Ao carregar a página, só a primeira tela (start-screen) aparece.
  mostrarTela("start-screen");

  /* -------------------------------------------------------------
     PASSO 3 — Marcelo Ludin
     Tela 1 (start-screen): seleção de avatar.
     Comportamento tipo "abas": só um avatar fica marcado como
     selecionado por vez (classe .selecionado já existe no CSS).
     ------------------------------------------------------------- */
  const avatares = document.querySelectorAll("#start-screen .avatar-item");
  let avatarEscolhido = document.querySelector("#start-screen .avatar-item.selecionado");
  avatarEscolhido = avatarEscolhido ? avatarEscolhido.dataset.avatar : "👾";

  avatares.forEach(function (item) {
    item.addEventListener("click", function () {
      // tira a marcação de todos os outros avatares
      avatares.forEach(function (outro) {
        outro.classList.remove("selecionado");
      });
      // marca só o que foi clicado
      item.classList.add("selecionado");
      avatarEscolhido = item.dataset.avatar;
    });
  });

  /* -------------------------------------------------------------
     PASSO 4 — Marcelo Ludin
     Tela 1 (start-screen): botão "Continuar...".
     Impede o formulário de recarregar a página (comportamento
     padrão de <form>), pega o nome digitado e o avatar escolhido,
     personaliza a tela "ready-screen" (só troca o texto que já
     existe nos mesmos elementos) e avança para ela.
     ------------------------------------------------------------- */
  const formInicio = document.querySelector("#start-screen form");
  const campoNome = document.querySelector("#start-screen input[type='text']");

  // elementos da tela "ready-screen" que recebem o nome/avatar
  const avatarGrande = document.querySelector("#ready-screen .avatar-grande");
  const saudacao = document.querySelector("#ready-screen .saudacao");
  const terminalReady = document.querySelectorAll("#ready-screen .terminal-box .destaque");

  formInicio.addEventListener("submit", function (evento) {
    evento.preventDefault(); // não deixa a página recarregar

    const nomeDigitado = campoNome.value.trim() || "Usuário";

    // atualiza a tela "ready-screen" com os dados escolhidos
    if (avatarGrande) avatarGrande.textContent = avatarEscolhido;
    if (saudacao) saudacao.textContent = "Olá, " + nomeDigitado + "! 👋";
    if (terminalReady.length >= 2) {
      terminalReady[0].textContent = nomeDigitado;                     // linha "jogador:"
      terminalReady[1].textContent = avatarEscolhido + " selecionado"; // linha "avatar:"
    }

    mostrarTela("ready-screen");
  });

  /* -------------------------------------------------------------
     PASSO 5 — Marcelo Ludin
     Tela 2 (ready-screen): botão "--- Começar Quiz ---".
     Ao clicar, vai para a tela de perguntas e liga o cronômetro
     que já existe no HTML (span#tempo).
     ------------------------------------------------------------- */
  const botaoComecarQuiz = document.querySelector("#ready-screen button:not(.btn-secundario)"); // Correção — Marcelo Ludin: antes pegava "o 1º botão" qualquer
  const spanTempo = document.getElementById("tempo");
  let cronometro = null;
  let segundosPassados = 0;

  function iniciarCronometro() {
    pararCronometro(); // garante que não fica cronômetro duplicado
    segundosPassados = 0;
    if (spanTempo) spanTempo.textContent = "00:00";

    cronometro = setInterval(function () {
      segundosPassados++;
      const minutos = String(Math.floor(segundosPassados / 60)).padStart(2, "0");
      const segundos = String(segundosPassados % 60).padStart(2, "0");
      if (spanTempo) spanTempo.textContent = minutos + ":" + segundos;
    }, 1000);
  }

  function pararCronometro() {
    if (cronometro) {
      clearInterval(cronometro);
      cronometro = null;
    }
  }

  botaoComecarQuiz.addEventListener("click", function () {
    resetarQuiz(); // Alteração — Marcelo Ludin: começa sempre da pergunta 1
    mostrarTela("quiz-screen");
    iniciarCronometro();
  });

  /* -------------------------------------------------------------
     PASSO 6 — Marcelo Ludin
     Tela 3 (quiz-screen): alternativas (Verdadeiro/Falso).
     Só uma alternativa pode ficar selecionada por vez (efeito de
     "abrir" a escolha marcada e "fechar"/desmarcar as outras).
     A cor usada é a mesma variável do site (--cor-ambar), aplicada
     via JS mesmo (o arquivo style.css não é alterado).
     ------------------------------------------------------------- */
  const alternativas = document.querySelectorAll("#quiz-screen .alternativa");
  const botaoProxima = document.querySelector("#quiz-screen .btn-proxima");
  const corDestaque = getComputedStyle(document.documentElement)
    .getPropertyValue("--cor-ambar").trim() || "#e5a332";

  let respostaSelecionada = null;  // alternativa só MARCADA (ainda não confirmada)
  let respostaConfirmada = false;  // vira true depois de clicar em "Confirmar resposta"

  /* -------------------------------------------------------------
     ALTERAÇÃO 7 — Marcelo Ludin  (RQ06 e RQ07)
     Marcar x Confirmar. Mudança em relação à versão anterior:
       - clicar em Verdadeiro/Falso agora só MARCA a alternativa
         (destaque âmbar). NÃO mostra certo/errado, NÃO trava e dá
         pra trocar de ideia quantas vezes quiser;
       - foi criado por JS o botão "Confirmar resposta" (o HTML não
         foi alterado). Só ao clicar nele aparece:
           * verde na certa / vermelho na que o jogador marcou errado
           * se acertou ou errou
           * a explicação (curiosidade)
           * o link da fonte
         e só aí os pontos sobem e o botão "Próxima →" aparece;
       - a categoria da pergunta aparece em cima da pergunta.
     ------------------------------------------------------------- */
  const elExplicacao = document.getElementById("explicacao");

  // botão "Confirmar resposta" (criado aqui, logo abaixo das alternativas)
  const boxAlternativas = document.querySelector("#quiz-screen .alternativas");
  const botaoConfirmar = document.createElement("button");
  botaoConfirmar.type = "button";
  botaoConfirmar.className = "btn-primario btn-confirmar";
  botaoConfirmar.textContent = "Confirmar resposta";
  botaoConfirmar.style.width = "100%";
  botaoConfirmar.style.marginTop = "14px";
  boxAlternativas.insertAdjacentElement("afterend", botaoConfirmar);

  // categoria da pergunta (criada aqui, no topo da caixa da pergunta)
  const caixaPergunta = document.querySelector("#quiz-screen .pergunta-box");
  const elCategoria = document.createElement("p");
  elCategoria.className = "categoria-pergunta";
  elCategoria.style.cssText = "margin:0 0 10px 0;text-align:center;font-family:'JetBrains Mono',monospace;" +
    "font-size:13px;letter-spacing:0.04em;color:" + corDestaque + ";";
  caixaPergunta.insertBefore(elCategoria, caixaPergunta.firstChild);

  // cria o link da fonte (usado na explicação do quiz e no popup dos hexágonos)
  function criarLinkFonte(pergunta) {
    const a = document.createElement("a");
    a.href = pergunta.fonte.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = "🔗 Fonte: " + pergunta.fonte.texto;
    a.style.color = corDestaque;
    a.style.wordBreak = "break-word";
    return a;
  }

  // 1) clique na alternativa = só marca
  alternativas.forEach(function (botao) {
    botao.addEventListener("click", function () {
      if (respostaConfirmada) return; // depois de confirmar não muda mais
      alternativas.forEach(function (b) {
        b.style.borderColor = "";
        b.style.background = "";
      });
      botao.style.borderColor = corDestaque;
      botao.style.background = "rgba(229, 163, 50, 0.18)";
      respostaSelecionada = botao;
    });
  });

  // 2) clique em "Confirmar resposta" = revela o resultado
  botaoConfirmar.addEventListener("click", function () {
    if (respostaConfirmada) return;

    // não marcou nada: pisca o contorno vermelho e pede pra escolher
    if (!respostaSelecionada) {
      boxAlternativas.style.outline = "2px solid #e2665f";
      setTimeout(function () { boxAlternativas.style.outline = ""; }, 600);
      return;
    }
    respostaConfirmada = true;

    const escolheuVerdadeiro = respostaSelecionada.textContent.trim() === "Verdadeiro";
    const pergunta = perguntas[indicePergunta];
    const acertou = (escolheuVerdadeiro === pergunta.resposta);

    // guarda o resultado (e o que o jogador marcou) e soma os pontos
    resultados[indicePergunta] = acertou;
    escolhas[indicePergunta] = escolheuVerdadeiro;
    if (acertou) pontosTotal += 100;
    if (elPontuacao) elPontuacao.textContent = "⭐ Pontos: " + pontosTotal;

    // pinta: certa = verde; a marcada errada = vermelha; trava os dois botões
    alternativas.forEach(function (b) {
      const ehVerdadeiro = b.textContent.trim() === "Verdadeiro";
      b.style.borderColor = "";  // tira o destaque âmbar pra cor do CSS valer
      b.style.background = "";
      if (ehVerdadeiro === pergunta.resposta) {
        b.classList.add("certa");
      } else if (b === respostaSelecionada) {
        b.classList.add("errada");
      }
      b.disabled = true;
    });

    // explicação + fonte
    if (elExplicacao) {
      elExplicacao.textContent = "";
      const titulo = document.createElement("strong");
      titulo.textContent = acertou ? "✔ Você acertou!" : "✘ Você errou!";
      titulo.style.color = acertou ? "#5be8a0" : "#e2665f";
      elExplicacao.appendChild(titulo);
      elExplicacao.appendChild(document.createElement("br"));
      elExplicacao.appendChild(document.createTextNode(pergunta.explicacao));
      elExplicacao.appendChild(document.createElement("br"));
      elExplicacao.appendChild(criarLinkFonte(pergunta));
      elExplicacao.style.display = "block";
    }

    // troca "Confirmar" por "Próxima"
    botaoConfirmar.style.display = "none";
    botaoProxima.style.visibility = "visible";
  });

  /* -------------------------------------------------------------
     PASSO 7 — Marcelo Ludin
     Tela 3 (quiz-screen): botão "Próxima →".
     Só avança se uma alternativa tiver sido escolhida. Como no
     HTML só existe uma pergunta (a "Pergunta 1 de 10" que já vem
     escrita), seguindo a ordem das telas o próximo passo é a tela
     de resultado — sem inventar/criar novas perguntas no HTML.
     ------------------------------------------------------------- */
  botaoProxima.addEventListener("click", function () {
    // Alteração — Marcelo Ludin: agora exige resposta CONFIRMADA (não só marcada)
    if (!respostaConfirmada) {
      // pequeno aviso visual pra lembrar de responder antes de avançar
      const caixaAlternativas = document.querySelector("#quiz-screen .alternativas");
      if (caixaAlternativas) {
        caixaAlternativas.style.outline = "2px solid #e2665f";
        setTimeout(function () {
          caixaAlternativas.style.outline = "";
        }, 600);
      }
      return;
    }

    // Alteração — Marcelo Ludin: antes ia direto pro resultado; agora
    // registra acerto/erro e só vai pro resultado após a 10ª pergunta.
    registrarResposta();
  });

  /* -------------------------------------------------------------
     ALTERAÇÃO 1 — Marcelo Ludin
     Lista das 10 perguntas (verdadeiro/falso). O HTML só tinha a
     pergunta 1 escrita, então as outras ficam aqui no JS e o texto
     da mesma caixa de pergunta é trocado a cada "Próxima".
     "resposta: true" = Verdadeiro, "false" = Falso.
     ------------------------------------------------------------- */
  // Alteração — Marcelo Ludin: cada pergunta ganhou o campo "explicacao" (mostrado só após CONFIRMAR a resposta)
  // Alteração — Marcelo Ludin: cada pergunta agora tem também "categoria" e "fonte" (link)
  // além da "explicacao". São exibidos só depois de CONFIRMAR a resposta (RQ06/RQ07).
  const perguntas = [
    {
      texto: "Java é a mesma coisa que JavaScript?",
      resposta: false,
      categoria: "Linguagens de programação",
      explicacao: "São linguagens diferentes: o nome parecido foi só marketing. Java é compilada e usada em apps e servidores; JavaScript roda principalmente no navegador.",
      fonte: { texto: "Wikipédia — JavaScript", url: "https://pt.wikipedia.org/wiki/JavaScript" }
    },
    {
      texto: "HTML é considerado uma linguagem de programação?",
      resposta: false,
      categoria: "Web — HTML",
      explicacao: "HTML é uma linguagem de marcação: ela estrutura o conteúdo da página, mas não tem lógica como condições e laços.",
      fonte: { texto: "Wikipédia — HTML", url: "https://pt.wikipedia.org/wiki/HTML" }
    },
    {
      texto: "O primeiro \"bug\" de computador foi uma mariposa real, encontrada em um Harvard Mark II?",
      resposta: true,
      categoria: "História da computação",
      explicacao: "Em 1947 uma mariposa foi achada presa num relé do Harvard Mark II e colada no diário de bordo como o \"primeiro bug\" encontrado.",
      fonte: { texto: "Wikipedia — Software bug", url: "https://en.wikipedia.org/wiki/Software_bug" }
    },
    {
      texto: "O CSS serve para definir o estilo e a aparência de páginas web?",
      resposta: true,
      categoria: "Web — CSS",
      explicacao: "CSS controla cores, fontes, espaçamentos e layout das páginas.",
      fonte: { texto: "Wikipédia — CSS", url: "https://pt.wikipedia.org/wiki/Cascading_Style_Sheets" }
    },
    {
      texto: "O Linux foi criado por Linus Torvalds?",
      resposta: true,
      categoria: "Sistemas operacionais",
      explicacao: "Linus Torvalds criou o kernel Linux em 1991.",
      fonte: { texto: "Wikipédia — Linux", url: "https://pt.wikipedia.org/wiki/Linux" }
    },
    {
      texto: "A memória RAM guarda os dados para sempre, mesmo com o computador desligado?",
      resposta: false,
      categoria: "Hardware",
      explicacao: "A RAM é volátil: perde tudo ao desligar. Quem guarda dados de forma permanente é o SSD ou HD.",
      fonte: { texto: "Wikipédia — Memória RAM", url: "https://pt.wikipedia.org/wiki/Mem%C3%B3ria_de_acesso_aleat%C3%B3rio" }
    },
    {
      texto: "A linguagem Python recebeu esse nome por causa da cobra?",
      resposta: false,
      categoria: "Linguagens de programação",
      explicacao: "O nome vem do grupo de humor britânico Monty Python, e não da cobra.",
      fonte: { texto: "Wikipédia — Python", url: "https://pt.wikipedia.org/wiki/Python" }
    },
    {
      texto: "O primeiro domínio .com registrado foi symbolics.com?",
      resposta: true,
      categoria: "Internet",
      explicacao: "Foi registrado em 15 de março de 1985 e é considerado o primeiro domínio .com.",
      fonte: { texto: "Wikipedia — .com", url: "https://en.wikipedia.org/wiki/.com" }
    },
    {
      texto: "Um bit pode armazenar apenas o valor 0 ou o valor 1?",
      resposta: true,
      categoria: "Fundamentos da computação",
      explicacao: "Bit é a menor unidade de informação do computador e só assume 0 ou 1.",
      fonte: { texto: "Wikipédia — Bit", url: "https://pt.wikipedia.org/wiki/Bit" }
    },
    {
      texto: "Git e GitHub são exatamente a mesma coisa?",
      resposta: false,
      categoria: "Ferramentas de desenvolvimento",
      explicacao: "Git é o sistema de controle de versão; GitHub é uma plataforma online que hospeda repositórios Git.",
      fonte: { texto: "Wikipédia — Git", url: "https://pt.wikipedia.org/wiki/Git" }
    }
  ];

  // estado do quiz (reiniciado em resetarQuiz)
  let indicePergunta = 0;
  let resultados = [];      // true = acertou, false = errou (uma posição por pergunta)
  let escolhas = [];        // Alteração — Marcelo Ludin: true = marcou Verdadeiro, false = Falso, null = não respondeu
  let pontosTotal = 0;

  // elementos da tela de perguntas que passam a ser atualizados por JS
  const elContador = document.querySelector("#quiz-screen .contador-pergunta");
  const elPontuacao = document.querySelector("#quiz-screen .pontuacao");
  const elBarra = document.querySelector("#quiz-screen .progresso");
  const elTextoPergunta = document.querySelector("#quiz-screen .pergunta-box h2");

  function limparAlternativas() {
    // Alteração — Marcelo Ludin: além de limpar o estilo, remove as cores
    // (certa/errada), destrava os botões e esconde a explicação.
    alternativas.forEach(function (b) {
      b.style.borderColor = "";
      b.style.background = "";
      b.classList.remove("certa", "errada");
      b.disabled = false;
    });
    if (elExplicacao) elExplicacao.style.display = "none";
    respostaSelecionada = null;
    // Alteração — Marcelo Ludin: volta ao estado "ainda não confirmou"
    respostaConfirmada = false;
    botaoConfirmar.style.display = "";            // mostra o Confirmar
    botaoProxima.style.visibility = "hidden";     // esconde o Próxima até confirmar
  }

  // Alteração — Marcelo Ludin: limpa já na abertura da página, para tirar o
  // verde/vermelho e a explicação que vinham fixos no HTML.
  limparAlternativas();

  // mostra a pergunta atual (texto, contador, barra de progresso e pontos)
  function carregarPergunta() {
    const numero = indicePergunta + 1;
    const total = perguntas.length;
    if (elContador) elContador.textContent = "Pergunta " + numero + " de " + total;
    if (elPontuacao) elPontuacao.textContent = "⭐ Pontos: " + pontosTotal;
    if (elBarra) elBarra.style.width = (numero / total * 100) + "%";
    if (elTextoPergunta) {
      elTextoPergunta.textContent = String(numero).padStart(2, "0") + "-) " + perguntas[indicePergunta].texto;
    }
    // Alteração — Marcelo Ludin: categoria da pergunta e texto do botão na última
    if (elCategoria) elCategoria.textContent = "🏷 Categoria: " + perguntas[indicePergunta].categoria;
    botaoProxima.textContent = (numero === total) ? "Ver resultado →" : "Próxima →";
    limparAlternativas();
  }

  function resetarQuiz() {
    indicePergunta = 0;
    resultados = [];
    escolhas = [];
    pontosTotal = 0;
    carregarPergunta();
  }

  // confere a resposta marcada, soma pontos e avança (ou finaliza)
  function registrarResposta() {
    // Alteração — Marcelo Ludin: o acerto/erro e os pontos (100 por acerto) agora
    // são computados ao clicar em "Confirmar resposta" (ALTERAÇÃO 7). Aqui só avança.
    if (indicePergunta < perguntas.length - 1) {
      indicePergunta++;
      carregarPergunta();
    } else {
      pararCronometro();
      atualizarResultado();
      mostrarTela("resultado-screen");
    }
  }

  /* -------------------------------------------------------------
     ALTERAÇÃO 2 — Marcelo Ludin
     Preenche a tela de resultado com os dados reais da partida:
     acertos, %, anel, nível, tempo, maior sequência, perguntas
     erradas e os quadradinhos verdes/vermelhos.
     ------------------------------------------------------------- */
  function atualizarResultado() {
    const total = perguntas.length;
    const acertos = resultados.filter(Boolean).length;
    const pct = Math.round(acertos / total * 100);
    const nome = (campoNome.value.trim() || "Usuário");

    // maior sequência de acertos e lista de perguntas erradas
    let maiorSequencia = 0, sequenciaAtual = 0, erradas = [];
    resultados.forEach(function (ok, i) {
      if (ok) {
        sequenciaAtual++;
        if (sequenciaAtual > maiorSequencia) maiorSequencia = sequenciaAtual;
      } else {
        sequenciaAtual = 0;
        erradas.push(String(i + 1).padStart(2, "0"));
      }
    });

    // número grande dentro do anel + percentual
    const elPontosAnel = document.querySelector("#resultado-screen .anel-pontos");
    const elPercentual = document.querySelector("#resultado-screen .anel-percentual");
    if (elPontosAnel) elPontosAnel.innerHTML = acertos + "<small>/" + total + "</small>";
    if (elPercentual) elPercentual.textContent = pct + "% de acerto";

    // preenchimento do anel (fórmula do CSS: 452 - 452 * %/100)
    const elAnel = document.querySelector("#resultado-screen .anel-progresso");
    if (elAnel) elAnel.style.strokeDashoffset = 452 - (452 * pct / 100);

    // frase e nível
    let frase = "Não desista", nivel = "estagiário de TI";
    if (pct >= 90) { frase = "Incrível"; nivel = "arquiteto de software"; }
    else if (pct >= 70) { frase = "Boa"; nivel = "debugger sênior"; }
    else if (pct >= 50) { frase = "Quase lá"; nivel = "dev júnior"; }
    const elBadge = document.querySelector("#resultado-screen .nivel-badge");
    if (elBadge) {
      // Correção — Marcelo Ludin: textContent no lugar de innerHTML (o nome vem do usuário)
      elBadge.textContent = frase + ", " + nome + "! ";
      const tagNivel = document.createElement("span");
      tagNivel.className = "tag-nivel";
      tagNivel.textContent = "nível: " + nivel;
      elBadge.appendChild(tagNivel);
    }

    // caixa de terminal (4 valores, na ordem em que estão no HTML)
    // Correção — Marcelo Ludin: o HTML passou a ter só 3 linhas (sem "Erros"), então
    // o código antigo (que exigia 4) não atualizava nada. Agora cada linha é achada
    // pelo texto do rótulo e, se alguma não existir, é simplesmente ignorada.
    document.querySelectorAll("#resultado-screen .terminal-box p").forEach(function (linha) {
      const valor = linha.querySelector(".destaque");
      if (!valor) return;
      const rotulo = linha.textContent;
      if (rotulo.indexOf("Corretas") !== -1) valor.textContent = acertos + "/" + total;
      else if (rotulo.indexOf("Tempo") !== -1) valor.textContent = spanTempo ? spanTempo.textContent : "00:00";
      else if (rotulo.indexOf("Sequência") !== -1) valor.textContent = maiorSequencia;
      else if (rotulo.indexOf("Erros") !== -1) valor.textContent = erradas.length ? erradas.join(", ") : "nenhum";
    });

    // quadradinhos da "Sua Sequência de Respostas"
    const itens = document.querySelectorAll("#resultado-screen .qitem");
    itens.forEach(function (item, i) {
      item.classList.remove("acerto", "erro");
      item.classList.add(resultados[i] ? "acerto" : "erro");
    });

    // Alteração — Marcelo Ludin: atualiza o ranking com a pontuação real
    atualizarRanking(nome);
  }

  /* -------------------------------------------------------------
     ALTERAÇÃO 5 — Marcelo Ludin
     Ranking dinâmico. Os outros jogadores são fixos (os mesmos do
     HTML + mais 5 para fechar os "12 jogadores" do banner). O
     jogador entra na lista com os pontos reais, a lista é ordenada
     e atualizamos:
       - o banner da tela de resultado (posição, total, pts pro pódio)
       - o pódio e a lista da tela de ranking
       - o texto do botão "Compartilhar Resultado"
     ------------------------------------------------------------- */
  const outrosJogadores = [
    { nome: "Kaique", avatar: "🤖", pontos: 1040 },
    { nome: "Marina", avatar: "🦋", pontos: 920 },
    { nome: "Bia",    avatar: "🐙", pontos: 870 },
    { nome: "Diego",  avatar: "🐶", pontos: 760 },
    { nome: "Lucas",  avatar: "🎮", pontos: 705 },
    { nome: "Aline",  avatar: "🌸", pontos: 640 },
    { nome: "Rafa",   avatar: "💻", pontos: 590 },
    { nome: "Julia",  avatar: "🚀", pontos: 520 },
    { nome: "Pedro",  avatar: "🕹️", pontos: 430 },
    { nome: "Tati",   avatar: "👾", pontos: 350 },
    { nome: "Caio",   avatar: "🦋", pontos: 260 }
  ];
  let textoCompartilhar = "";

  function atualizarRanking(nome) {
    // monta a lista com o jogador no meio e ordena (em empate, o jogador fica abaixo)
    const lista = outrosJogadores.map(function (j) { return j; });
    lista.push({ nome: nome, avatar: avatarEscolhido, pontos: pontosTotal, voce: true });
    lista.sort(function (a, b) { return b.pontos - a.pontos; });

    const posicao = lista.findIndex(function (j) { return j.voce; }) + 1;
    const total = lista.length;

    // --- banner da tela de resultado ---
    const elPosicao = document.getElementById("posicao");
    const elTotal = document.getElementById("total");
    const elFalta = document.querySelector("#resultado-screen .ranking-falta");
    if (elPosicao) elPosicao.textContent = posicao + "º lugar";
    if (elTotal) elTotal.textContent = total;
    if (elFalta) {
      if (posicao <= 3) {
        elFalta.textContent = "você está no pódio! 🎉";
      } else {
        const faltam = Math.max(lista[2].pontos - pontosTotal, 1);
        // recria a frase mantendo o span#pts-podio que já existe no HTML
        elFalta.textContent = "faltam ";
        const spanPts = document.createElement("span");
        spanPts.id = "pts-podio";
        spanPts.textContent = faltam;
        elFalta.appendChild(spanPts);
        elFalta.appendChild(document.createTextNode(" pts pro pódio"));
      }
    }

    // --- pódio (1º, 2º e 3º) ---
    const cartoes = [
      { seletor: ".podio-card.primeiro", indice: 0 },
      { seletor: ".podio-card.segundo",  indice: 1 },
      { seletor: ".podio-card.terceiro", indice: 2 }
    ];
    cartoes.forEach(function (c) {
      const card = document.querySelector("#ranking-screen " + c.seletor);
      const j = lista[c.indice];
      if (!card || !j) return;
      const elAvatar = card.querySelector(".podio-avatar");
      const elNome = card.querySelector(".podio-nome");
      const elPts = card.querySelector(".podio-pontos");
      if (elAvatar) elAvatar.textContent = j.avatar;
      if (elNome) elNome.textContent = j.voce ? j.nome + " (você)" : j.nome;
      if (elPts) elPts.textContent = j.pontos + " pts";
    });

    // --- lista dos demais (4º ao 7º). Se o jogador estiver abaixo do 7º,
    //     ele ocupa a última linha para sempre aparecer na tela. ---
    const elLista = document.querySelector("#ranking-screen .rank-lista");
    if (elLista) {
      let linhas = lista.slice(3, 7).map(function (j, i) {
        return { j: j, pos: i + 4 };
      });
      if (posicao > 7) linhas[linhas.length - 1] = { j: lista[posicao - 1], pos: posicao };

      elLista.textContent = "";
      linhas.forEach(function (l) {
        const linha = document.createElement("div");
        linha.className = "rank-linha" + (l.j.voce ? " voce" : "");

        const sPos = document.createElement("span");
        sPos.className = "rank-posicao";
        sPos.textContent = l.pos + "º";

        const sAv = document.createElement("span");
        sAv.className = "rank-avatar";
        sAv.textContent = l.j.avatar;

        const sNome = document.createElement("span");
        sNome.className = "rank-nome";
        sNome.textContent = l.j.nome + " ";
        if (l.j.voce) {
          const tag = document.createElement("span");
          tag.className = "tag-voce";
          tag.textContent = "você";
          sNome.appendChild(tag);
        }

        const sPts = document.createElement("span");
        sPts.className = "rank-pontos";
        sPts.textContent = l.j.pontos + " pts";

        linha.appendChild(sPos);
        linha.appendChild(sAv);
        linha.appendChild(sNome);
        linha.appendChild(sPts);
        elLista.appendChild(linha);
      });
    }

    // texto usado pelo botão "Compartilhar Resultado"
    const acertos = resultados.filter(Boolean).length;
    textoCompartilhar = "Joguei Verdade ou Bug (Tech Trivia): acertei " + acertos + "/" +
      perguntas.length + ", fiz " + pontosTotal + " pts e fiquei em " + posicao + "º lugar! 🚀";
  }

  /* -------------------------------------------------------------
     ALTERAÇÃO 10 — Marcelo Ludin
     Hexágonos 01–10 da tela de Performance clicáveis. Ao clicar (ou
     usar Enter/Espaço), abre um popup simples com: a pergunta, a
     categoria, se acertou/errou/não respondeu, o que o jogador
     marcou, a resposta certa, a explicação e o link da fonte.
     Fecha no botão "Fechar", clicando fora do quadro ou com ESC.
     Tudo criado por JS (HTML e CSS não foram alterados).
     ------------------------------------------------------------- */
  const hexagonos = document.querySelectorAll("#resultado-screen .qitem");
  let modalPergunta = null;
  let hexagonoAberto = null;

  function teclaDoModal(evento) {
    if (evento.key === "Escape") fecharModalPergunta();
  }

  function fecharModalPergunta() {
    if (!modalPergunta) return;
    modalPergunta.remove();
    modalPergunta = null;
    document.removeEventListener("keydown", teclaDoModal);
    if (hexagonoAberto) hexagonoAberto.focus(); // devolve o foco pro hexágono
  }

  // helper pra criar um parágrafo de texto simples dentro do popup
  function linhaModal(texto, estilo) {
    const el = document.createElement("p");
    el.textContent = texto;
    el.style.cssText = "margin:0 0 10px 0;line-height:1.5;font-size:14px;" + (estilo || "");
    return el;
  }

  function abrirModalPergunta(indice) {
    const pergunta = perguntas[indice];
    if (!pergunta || resultados[indice] === undefined) return; // ainda sem resultado
    fecharModalPergunta();

    const acertou = resultados[indice] === true;
    const naoRespondeu = escolhas[indice] === null || escolhas[indice] === undefined;
    const nomeOpcao = function (v) { return v ? "Verdadeiro" : "Falso"; };

    // fundo escuro que cobre a tela
    const fundo = document.createElement("div");
    fundo.style.cssText = "position:fixed;top:0;right:0;bottom:0;left:0;z-index:1000;display:flex;" +
      "align-items:center;justify-content:center;padding:20px;background:rgba(10,4,24,0.78);";
    fundo.addEventListener("click", function (evento) {
      if (evento.target === fundo) fecharModalPergunta(); // clicou fora do quadro
    });

    // quadro do popup
    const caixa = document.createElement("div");
    caixa.setAttribute("role", "dialog");
    caixa.setAttribute("aria-modal", "true");
    caixa.setAttribute("aria-label", "Pergunta " + (indice + 1));
    caixa.style.cssText = "width:100%;max-width:460px;max-height:85vh;overflow-y:auto;box-sizing:border-box;" +
      "padding:22px;border-radius:14px;color:#f6f5fc;font-family:'Inter',sans-serif;" +
      "background:#3b1566;border:1px solid rgba(245,240,230,0.2);box-shadow:0 20px 50px rgba(0,0,0,0.5);";

    caixa.appendChild(linhaModal("Pergunta " + String(indice + 1).padStart(2, "0") + " de " + perguntas.length,
      "font-family:'JetBrains Mono',monospace;font-size:13px;color:" + corDestaque + ";"));
    caixa.appendChild(linhaModal("🏷 Categoria: " + pergunta.categoria, "font-size:13px;opacity:0.85;"));
    caixa.appendChild(linhaModal(pergunta.texto, "font-size:19px;font-weight:bold;line-height:1.4;margin-bottom:14px;"));

    // situação: acertou / errou / não respondeu (desistiu)
    let situacao = acertou ? "✔ Você acertou!" : "✘ Você errou!";
    if (naoRespondeu) situacao = "✘ Não respondida (conta como errada)";
    caixa.appendChild(linhaModal(situacao, "font-weight:bold;color:" + (acertou ? "#5be8a0" : "#e2665f") + ";"));
    if (!naoRespondeu) caixa.appendChild(linhaModal("Sua resposta: " + nomeOpcao(escolhas[indice])));
    caixa.appendChild(linhaModal("Resposta correta: " + nomeOpcao(pergunta.resposta)));

    // explicação + fonte
    caixa.appendChild(linhaModal(pergunta.explicacao,
      "padding:12px 14px;border-left:3px solid " + corDestaque + ";border-radius:8px;background:rgba(245,240,230,0.07);"));
    const pFonte = linhaModal("");
    pFonte.appendChild(criarLinkFonte(pergunta));
    caixa.appendChild(pFonte);

    const botaoFechar = document.createElement("button");
    botaoFechar.type = "button";
    botaoFechar.className = "btn-primario";
    botaoFechar.textContent = "Fechar";
    botaoFechar.style.cssText = "width:100%;margin-top:6px;";
    botaoFechar.addEventListener("click", fecharModalPergunta);
    caixa.appendChild(botaoFechar);

    fundo.appendChild(caixa);
    document.body.appendChild(fundo);
    modalPergunta = fundo;
    document.addEventListener("keydown", teclaDoModal);
    botaoFechar.focus();
  }

  // deixa cada hexágono clicável (mouse, toque e teclado)
  hexagonos.forEach(function (hex, indice) {
    hex.style.cursor = "pointer";
    hex.setAttribute("role", "button");
    hex.setAttribute("tabindex", "0");
    hex.setAttribute("title", "Ver a pergunta " + (indice + 1));
    hex.addEventListener("click", function () {
      hexagonoAberto = hex;
      abrirModalPergunta(indice);
    });
    hex.addEventListener("keydown", function (evento) {
      if (evento.key === "Enter" || evento.key === " ") {
        evento.preventDefault();
        hexagonoAberto = hex;
        abrirModalPergunta(indice);
      }
    });
  });

  // dica discreta embaixo do título "Sua Sequência de Respostas"
  const tituloSequencia = document.querySelector("#resultado-screen .qlist-titulo");
  if (tituloSequencia) {
    const dica = document.createElement("p");
    dica.textContent = "Toque em um número para rever a pergunta e a explicação";
    dica.style.cssText = "margin:-4px 0 10px 0;text-align:center;font-size:12px;opacity:0.65;";
    tituloSequencia.insertAdjacentElement("afterend", dica);
  }

  /* -------------------------------------------------------------
     ALTERAÇÃO 3 — Marcelo Ludin
     Botão "Voltar" da ready-screen (não tinha nenhum evento):
     volta para a tela inicial para trocar nome/avatar.
     ------------------------------------------------------------- */
  const botaoVoltar = document.querySelector("#ready-screen .btn-secundario");
  if (botaoVoltar) {
    botaoVoltar.addEventListener("click", function () {
      mostrarTela("start-screen");
    });
  }

  /* -------------------------------------------------------------
     ALTERAÇÃO 4 — Marcelo Ludin (comportamento ATUALIZADO pela ALTERAÇÃO 8)
     Botão "Desistir" da quiz-screen (não tinha nenhum evento).
     Versão inicial: pedia confirmação e voltava pra tela inicial.
     Versão atual: vai direto pra tela de Performance (veja abaixo).
     ------------------------------------------------------------- */
  const botaoDesistir = document.querySelector("#quiz-screen .btn-desistir");
  if (botaoDesistir) {
    /* ---------------------------------------------------------
       ALTERAÇÃO 8 — Marcelo Ludin (corrige a ALTERAÇÃO 4)
       "Desistir" NÃO cancela o jogo e NÃO volta pro cadastro:
       finaliza antes da hora e mostra a tela de Performance com
       o resultado parcial. As perguntas sem resposta confirmada
       contam como ERRADAS (hexágono vermelho) e ficam como
       "não respondida" no popup.
       --------------------------------------------------------- */
    botaoDesistir.addEventListener("click", function () {
      pararCronometro();
      for (let i = 0; i < perguntas.length; i++) {
        if (resultados[i] === undefined) {
          resultados[i] = false;  // não respondida = errada
          escolhas[i] = null;     // guarda que ficou sem resposta
        }
      }
      atualizarResultado();
      mostrarTela("resultado-screen");
    });
  }

  /* -------------------------------------------------------------
     PASSO 8 — Marcelo Ludin
     Tela 4 (resultado-screen): os dois botões finais.
     "Ver ranking da sessão →" leva pra tela de ranking.
     "Tentar Novamente" volta pra tela "Começar Quiz" mantendo nome e
     avatar (ALTERAÇÃO 9 — Marcelo Ludin; antes reiniciava tudo).
     ------------------------------------------------------------- */
  const botaoVerRanking = document.querySelector("#resultado-screen .btn-primario");
  const botaoJogarNovamenteResultado = document.querySelector("#resultado-screen .btn-secundario");

  botaoVerRanking.addEventListener("click", function () {
    mostrarTela("ranking-screen");
  });

  botaoJogarNovamenteResultado.addEventListener("click", function () {
    /* ALTERAÇÃO 9 — Marcelo Ludin (corrige o PASSO 8)
       "Tentar Novamente" vai para a tela 2 ("Começar Quiz"), que já está
       com o nome e o avatar da pessoa. NÃO chama reiniciarJogo() (que
       apagava o nome e voltava pro cadastro). O quiz é zerado quando
       ela clicar em "Começar Quiz" (resetarQuiz). */
    mostrarTela("ready-screen");
  });

  /* -------------------------------------------------------------
     PASSO 9 — Marcelo Ludin
     Tela 5 (ranking-screen): os dois botões finais.
     "Jogar novamente" reinicia e volta pro começo.
     "Compartilhar resultado" copia um resumo pra área de
     transferência (interação simples, não altera nada no HTML).
     ------------------------------------------------------------- */
  const botaoJogarNovamenteRanking = document.querySelector("#ranking-screen .btn-primario");
  const botaoCompartilhar = document.querySelector("#ranking-screen .btn-secundario");

  botaoJogarNovamenteRanking.addEventListener("click", function () {
    // Alteração — Marcelo Ludin: este SIM volta pro cadastro (nome + avatar),
    // pois é o fluxo "jogar com outra pessoa" depois de ver o ranking.
    reiniciarJogo();
  });

  botaoCompartilhar.addEventListener("click", function () {
    // Correção — Marcelo Ludin: texto agora usa a pontuação real (antes era sempre "me saí bem")
    const textoResumo = textoCompartilhar || "Joguei o Tech Trivia (Verdade ou Bug)! 🚀";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textoResumo).then(function () {
        // Correção — Marcelo Ludin: avisa o usuário que copiou (antes não havia retorno nenhum)
        const textoOriginal = botaoCompartilhar.textContent;
        botaoCompartilhar.textContent = "Copiado! ✔";
        setTimeout(function () { botaoCompartilhar.textContent = textoOriginal; }, 1500);
      }).catch(function () {
        /* se o navegador bloquear a cópia, apenas ignora silenciosamente */
      });
    }
  });

  /* -------------------------------------------------------------
     PASSO 10 — Marcelo Ludin
     Função de reinício: volta tudo ao estado inicial (avatar
     padrão, campo de nome vazio, alternativas desmarcadas,
     cronômetro zerado) e mostra a start-screen de novo.
     ------------------------------------------------------------- */
  function reiniciarJogo() {
    pararCronometro();

    if (campoNome) campoNome.value = "";

    avatares.forEach(function (item) {
      item.classList.remove("selecionado");
    });
    const primeiroAvatar = avatares[0];
    if (primeiroAvatar) {
      primeiroAvatar.classList.add("selecionado");
      avatarEscolhido = primeiroAvatar.dataset.avatar;
    }

    alternativas.forEach(function (b) {
      b.style.borderColor = "";
      b.style.background = "";
    });
    respostaSelecionada = null;

    resetarQuiz(); // Alteração — Marcelo Ludin: zera perguntas, pontos e acertos

    mostrarTela("start-screen");
  }

});