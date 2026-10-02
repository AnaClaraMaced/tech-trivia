
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

  let respostaSelecionada = null;

  alternativas.forEach(function (botao) {
    botao.addEventListener("click", function () {
      // desmarca visualmente todas as alternativas
      alternativas.forEach(function (b) {
        b.style.borderColor = "";
        b.style.background = "";
      });
      // marca visualmente só a clicada
      botao.style.borderColor = corDestaque;
      botao.style.background = "rgba(229, 163, 50, 0.18)";
      respostaSelecionada = botao;
    });
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
    if (!respostaSelecionada) {
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
  const perguntas = [
    { texto: "Java é a mesma coisa que JavaScript?", resposta: false },
    { texto: "HTML é considerado uma linguagem de programação?", resposta: false },
    { texto: "O primeiro \"bug\" de computador foi uma mariposa real, encontrada em um Harvard Mark II?", resposta: true },
    { texto: "O CSS serve para definir o estilo e a aparência de páginas web?", resposta: true },
    { texto: "O Linux foi criado por Linus Torvalds?", resposta: true },
    { texto: "A memória RAM guarda os dados para sempre, mesmo com o computador desligado?", resposta: false },
    { texto: "A linguagem Python recebeu esse nome por causa da cobra?", resposta: false },
    { texto: "O primeiro domínio .com registrado foi symbolics.com?", resposta: true },
    { texto: "Um bit pode armazenar apenas o valor 0 ou o valor 1?", resposta: true },
    { texto: "Git e GitHub são exatamente a mesma coisa?", resposta: false }
  ];

  // estado do quiz (reiniciado em resetarQuiz)
  let indicePergunta = 0;
  let resultados = [];      // true = acertou, false = errou (uma posição por pergunta)
  let pontosTotal = 0;

  // elementos da tela de perguntas que passam a ser atualizados por JS
  const elContador = document.querySelector("#quiz-screen .contador-pergunta");
  const elPontuacao = document.querySelector("#quiz-screen .pontuacao");
  const elBarra = document.querySelector("#quiz-screen .progresso");
  const elTextoPergunta = document.querySelector("#quiz-screen .pergunta-box h2");

  function limparAlternativas() {
    alternativas.forEach(function (b) {
      b.style.borderColor = "";
      b.style.background = "";
    });
    respostaSelecionada = null;
  }

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
    limparAlternativas();
  }

  function resetarQuiz() {
    indicePergunta = 0;
    resultados = [];
    pontosTotal = 0;
    carregarPergunta();
  }

  // confere a resposta marcada, soma pontos e avança (ou finaliza)
  function registrarResposta() {
    const escolheuVerdadeiro = respostaSelecionada.textContent.trim() === "Verdadeiro";
    const acertou = (escolheuVerdadeiro === perguntas[indicePergunta].resposta);

    resultados.push(acertou);
    if (acertou) pontosTotal += 100; // 100 pts por acerto (como diz a tela inicial)

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
     ALTERAÇÃO 4 — Marcelo Ludin
     Botão "Desistir" da quiz-screen (não tinha nenhum evento):
     pergunta se quer mesmo sair, para o cronômetro e reinicia o
     jogo voltando para a tela inicial.
     ------------------------------------------------------------- */
  const botaoDesistir = document.querySelector("#quiz-screen .btn-desistir");
  if (botaoDesistir) {
    botaoDesistir.addEventListener("click", function () {
      if (confirm("Tem certeza que deseja desistir do quiz?")) {
        reiniciarJogo();
      }
    });
  }

  /* -------------------------------------------------------------
     PASSO 8 — Marcelo Ludin
     Tela 4 (resultado-screen): os dois botões finais.
     "Ver ranking da sessão →" leva pra tela de ranking.
     "Jogar novamente" reinicia o estado e volta pro começo.
     ------------------------------------------------------------- */
  const botaoVerRanking = document.querySelector("#resultado-screen .btn-primario");
  const botaoJogarNovamenteResultado = document.querySelector("#resultado-screen .btn-secundario");

  botaoVerRanking.addEventListener("click", function () {
    mostrarTela("ranking-screen");
  });

  botaoJogarNovamenteResultado.addEventListener("click", function () {
    reiniciarJogo();
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