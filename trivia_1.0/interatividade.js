
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
  const botaoComecarQuiz = document.querySelector("#ready-screen button");
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

    pararCronometro();
    mostrarTela("resultado-screen");
  });

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
    const textoResumo = "Joguei o Tech Trivia (Verdade ou Bug) e me saí bem! 🚀";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textoResumo).catch(function () {
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

    mostrarTela("start-screen");
  }

});