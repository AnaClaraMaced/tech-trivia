document.addEventListener("DOMContentLoaded", function () {

  const API_URL = "https://duelquiz-backend.onrender.com";

  /* -------------------------------------------------------------
     PASSO 1 — Marcelo Ludin
     Pegar as 5 telas (sections) na ordem em que já estão no HTML
     e guardar numa lista. É essa ordem que o fluxo do jogo vai seguir.
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
     só a tela pedida sem precisar recarregar a página, controlando
     o "display" de cada section por JS.
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

  /* ==========================================================================
     ESTADO GLOBAL DO JOGO
     ========================================================================== */
  let usuarioAtual = { id: null, nome: "Usuário", icone: 1 };
  let avatarEscolhido = 1;
  let perguntas = [];       
  let indicePergunta = 0;
  let resultados = [];      
  let escolhas = [];        
  let pontosTotal = 0;

  /* -------------------------------------------------------------
     CARREGAMENTO DINÂMICO DE ÍCONES (API / Supabase)
     Busca os avatares cadastrados no banco de dados e monta as opções
     na tela inicial.
     ------------------------------------------------------------- */
  async function carregarIconesDinamicos() {
    const containerAvatares = document.querySelector("#start-screen .avatar-opcoes");
    if (!containerAvatares) return;

    try {
      const response = await fetch(`${API_URL}/api/icons`);
      if (!response.ok) return;
      const icones = await response.json();

      containerAvatares.innerHTML = ""; 

      icones.forEach((icone, index) => {
        const item = document.createElement("span");
        item.className = "avatar-item" + (index === 0 ? " selecionado" : "");
        item.setAttribute("data-avatar", icone.icon_id);
        item.setAttribute("role", "img");

        if (icone.icon_url && icone.icon_url.startsWith("http")) {
          const img = document.createElement("img");
          img.src = icone.icon_url;
          img.alt = icone.icon_name || "Avatar";
          
          /* -------------------------------------------------------------
             📐 AJUSTE DE TAMANHO: Ícones na Grade da Tela Inicial
             ------------------------------------------------------------- */
          img.style.width = "46px";
          img.style.height = "46px";
          img.style.objectFit = "contain";
          item.appendChild(img);
        } else {
          item.textContent = icone.icon_name || "👾";
        }

        containerAvatares.appendChild(item);
      });

      const primeiro = containerAvatares.querySelector(".avatar-item.selecionado");
      avatarEscolhido = primeiro ? parseInt(primeiro.dataset.avatar, 10) : 1;

      ativarSelecaoAvatares();

    } catch (err) {
      console.error("Erro ao carregar ícones dinâmicos:", err);
    }
  }

  /* -------------------------------------------------------------
     PASSO 3 — Marcelo Ludin
     Seleção de avatar na Tela 1 (start-screen).
     Comportamento tipo "abas": só um avatar fica marcado como
     selecionado por vez.
     ------------------------------------------------------------- */
  function ativarSelecaoAvatares() {
    const avatares = document.querySelectorAll("#start-screen .avatar-item");
    avatares.forEach(function (item) {
      item.addEventListener("click", function () {
        // tira a marcação de todos os outros avatares
        avatares.forEach(function (outro) {
          outro.classList.remove("selecionado");
        });
        // marca só o que foi clicado
        item.classList.add("selecionado");
        avatarEscolhido = parseInt(item.dataset.avatar, 10);
      });
    });
  }

  carregarIconesDinamicos();

  /* -------------------------------------------------------------
     PASSO 4 — Marcelo Ludin
     Tela 1 (start-screen): botão "Continuar...".
     Impede o formulário de recarregar a página, pega o nome digitado,
     cadastra o usuário no backend e personaliza a tela de preparo.
     ------------------------------------------------------------- */
  const formInicio = document.querySelector("#start-screen form");
  const campoNome = document.querySelector("#start-screen input[type='text']");

  const avatarGrande = document.querySelector("#ready-screen .avatar-grande");
  const saudacao = document.querySelector("#ready-screen .saudacao");
  const terminalReady = document.querySelectorAll("#ready-screen .terminal-box .destaque");

  formInicio.addEventListener("submit", async function (evento) {
    evento.preventDefault(); // não deixa a página recarregar

    const nomeDigitado = campoNome.value.trim() || "Usuário";
    usuarioAtual.nome = nomeDigitado;
    usuarioAtual.icone = avatarEscolhido; 

    // Envia os dados para salvar o usuário na API
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nomeDigitado, icone_id: avatarEscolhido })
      });

      if (response.ok) {
        const dadosUsuario = await response.json();
        usuarioAtual.id = dadosUsuario.id;
      }
    } catch (err) {
      console.error("Erro ao cadastrar usuário na API:", err);
    }

    const itemAvatarSel = document.querySelector("#start-screen .avatar-item.selecionado");
    
    if (avatarGrande && itemAvatarSel) {
      avatarGrande.innerHTML = itemAvatarSel.innerHTML;
      const imgNoGrande = avatarGrande.querySelector("img");
      
      /* -------------------------------------------------------------
         📐 AJUSTE DE TAMANHO: Avatar Grande na Tela de Preparo (ready-screen)
         ------------------------------------------------------------- */
      if (imgNoGrande) {
        imgNoGrande.style.width = "64px";
        imgNoGrande.style.height = "64px";
        imgNoGrande.style.objectFit = "contain";
      }
    }

    if (saudacao) saudacao.textContent = "Olá, " + nomeDigitado + "! 👋";
    if (terminalReady.length >= 2) {
      terminalReady[0].textContent = nomeDigitado;                     
      terminalReady[1].textContent = "Avatar ID " + avatarEscolhido + " selecionado"; 
    }

    mostrarTela("ready-screen");
  });

  /* -------------------------------------------------------------
     CORREÇÃO / IMPLEMENTAÇÃO — Botão "Voltar" (ready-screen)
     Permite retornar à tela inicial para alterar nome ou avatar.
     ------------------------------------------------------------- */
  const botaoVoltar = document.querySelector("#ready-screen .btn-secundario");
  if (botaoVoltar) {
    botaoVoltar.addEventListener("click", function () {
      mostrarTela("start-screen");
    });
  }

  /* -------------------------------------------------------------
     PASSO 5 — Marcelo Ludin
     Tela 2 (ready-screen): botão "--- Começar Quiz ---".
     Ao clicar, busca as perguntas aleatórias via API, liga o cronômetro
     e avança para a tela de perguntas.
     ------------------------------------------------------------- */
  const botaoComecarQuiz = document.querySelector("#ready-screen button:not(.btn-secundario)"); 
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

  botaoComecarQuiz.addEventListener("click", async function () {
    botaoComecarQuiz.textContent = "Carregando...";
    try {
      const response = await fetch(`${API_URL}/api/questions/random`);
      if (response.ok) {
        const dados = await response.json();
        perguntas = dados.map(q => {
          const altCorreta = q.alternativas ? q.alternativas.find(a => a.correta) : null;
          const textoCorreta = altCorreta ? altCorreta.texto_alternativa : "Verdadeiro";
          
          /* -------------------------------------------------------------
             PONTUAÇÃO DINÂMICA (Tabela nivel)
             Lê os pontos do nível vindo do banco ou aplica o fallback pelo nivel_id:
             Nível 1 (Fácil) = 50 | Nível 2 (Médio) = 75 | Nível 3 (Difícil) = 100
             ------------------------------------------------------------- */
          const pontosValor = (q.nivel && q.nivel.pontos)
            ? q.nivel.pontos
            : (q.nivel_id === 3 ? 100 : (q.nivel_id === 2 ? 75 : 50));

          return {
            texto: q.pergunta,
            resposta: textoCorreta.trim().toLowerCase() === "verdadeiro" || textoCorreta.trim().toLowerCase() === "certo",
            categoria: q.categoria,
            explicacao: q.explicacao,
            pontos: pontosValor,
            fonte: { texto: "Fonte oficial", url: q.fonte }
          };
        });
      }
    } catch (err) {
      console.error("Erro ao buscar perguntas da API:", err);
    } finally {
      botaoComecarQuiz.textContent = "--- Começar Quiz ---";
    }

    if (!perguntas || perguntas.length === 0) {
      alert("Não foi possível carregar as perguntas do servidor. Verifique a conexão.");
      return;
    }

    resetarQuiz(); 
    mostrarTela("quiz-screen");
    iniciarCronometro();
  });

  /* -------------------------------------------------------------
     PASSO 6 — Marcelo Ludin
     Tela 3 (quiz-screen): alternativas (Verdadeiro/Falso).
     Só uma alternativa pode ficar selecionada por vez. A cor usada
     é a mesma variável do site (--cor-ambar), aplicada via JS.
     ------------------------------------------------------------- */
  const alternativas = document.querySelectorAll("#quiz-screen .alternativa");
  const botaoProxima = document.querySelector("#quiz-screen .btn-proxima");
  const corDestaque = getComputedStyle(document.documentElement)
    .getPropertyValue("--cor-ambar").trim() || "#e5a332";

  let respostaSelecionada = null;  
  let respostaConfirmada = false;  

  const elExplicacao = document.getElementById("explicacao");
  const boxAlternativas = document.querySelector("#quiz-screen .alternativas");
  
  // Botão "Confirmar resposta" criado dinamicamente via JS
  const botaoConfirmar = document.createElement("button");
  botaoConfirmar.type = "button";
  botaoConfirmar.className = "btn-primario btn-confirmar";
  botaoConfirmar.textContent = "Confirmar resposta";
  botaoConfirmar.style.width = "100%";
  botaoConfirmar.style.marginTop = "14px";
  boxAlternativas.insertAdjacentElement("afterend", botaoConfirmar);

  const caixaPergunta = document.querySelector("#quiz-screen .pergunta-box");
  const elCategoria = document.createElement("p");
  elCategoria.className = "categoria-pergunta";
  elCategoria.style.cssText = "margin:0 0 10px 0;text-align:center;font-family:'JetBrains Mono',monospace;" +
    "font-size:13px;letter-spacing:0.04em;color:" + corDestaque + ";";
  caixaPergunta.insertBefore(elCategoria, caixaPergunta.firstChild);

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

  alternativas.forEach(function (botao) {
    botao.addEventListener("click", function () {
      if (respostaConfirmada) return; 
      alternativas.forEach(function (b) {
        b.style.borderColor = "";
        b.style.background = "";
      });
      botao.style.borderColor = corDestaque;
      botao.style.background = "rgba(229, 163, 50, 0.18)";
      respostaSelecionada = botao;
    });
  });

  botaoConfirmar.addEventListener("click", function () {
    if (respostaConfirmada) return;

    if (!respostaSelecionada) {
      boxAlternativas.style.outline = "2px solid #e2665f";
      setTimeout(function () { boxAlternativas.style.outline = ""; }, 600);
      return;
    }
    respostaConfirmada = true;

    const escolheuVerdadeiro = respostaSelecionada.textContent.trim().toLowerCase().includes("verdadeiro") || 
                               respostaSelecionada.textContent.trim().toLowerCase().includes("certo");
    const pergunta = perguntas[indicePergunta];
    const acertou = (escolheuVerdadeiro === pergunta.resposta);

    resultados[indicePergunta] = acertou;
    escolhas[indicePergunta] = escolheuVerdadeiro;
    
    /* -------------------------------------------------------------
       SOMA DE PONTOS DINÂMICA
       Soma os pontos atribuídos à questão específica (50, 75 ou 100)
       ------------------------------------------------------------- */
    if (acertou) pontosTotal += pergunta.pontos;
    if (elPontuacao) elPontuacao.textContent = "⭐ Pontos: " + pontosTotal;

    alternativas.forEach(function (b) {
      const ehVerdadeiro = b.textContent.trim().toLowerCase().includes("verdadeiro") || 
                           b.textContent.trim().toLowerCase().includes("certo");
      b.style.borderColor = "";  
      b.style.background = "";
      if (ehVerdadeiro === pergunta.resposta) {
        b.classList.add("certa");
      } else if (b === respostaSelecionada) {
        b.classList.add("errada");
      }
      b.disabled = true;
    });

    if (elExplicacao) {
      elExplicacao.textContent = "";
      const titulo = document.createElement("strong");
      titulo.textContent = acertou ? `✔ Você acertou! (+${pergunta.pontos} pts)` : "✘ Você errou!";
      titulo.style.color = acertou ? "#5be8a0" : "#e2665f";
      elExplicacao.appendChild(titulo);
      elExplicacao.appendChild(document.createElement("br"));
      elExplicacao.appendChild(document.createTextNode(pergunta.explicacao));
      elExplicacao.appendChild(document.createElement("br"));
      elExplicacao.appendChild(criarLinkFonte(pergunta));
      elExplicacao.style.display = "block";
    }

    botaoConfirmar.style.display = "none";
    botaoProxima.style.visibility = "visible";
  });

  /* -------------------------------------------------------------
     PASSO 7 — Marcelo Ludin
     Tela 3 (quiz-screen): botão "Próxima →".
     Só avança se uma alternativa tiver sido confirmada.
     ------------------------------------------------------------- */
  botaoProxima.addEventListener("click", function () {
    if (!respostaConfirmada) {
      const caixaAlternativas = document.querySelector("#quiz-screen .alternativas");
      if (caixaAlternativas) {
        caixaAlternativas.style.outline = "2px solid #e2665f";
        setTimeout(function () {
          caixaAlternativas.style.outline = "";
        }, 600);
      }
      return;
    }

    registrarResposta();
  });

  /* -------------------------------------------------------------
     CORREÇÃO / IMPLEMENTAÇÃO — Botão "Desistir" (quiz-screen)
     Para o cronômetro, marca o restante como incorreto e vai
     direto para a tela de resultados enviando a pontuação parcial.
     ------------------------------------------------------------- */
  const botaoDesistir = document.querySelector("#quiz-screen .btn-desistir");
  if (botaoDesistir) {
    botaoDesistir.addEventListener("click", function () {
      pararCronometro();
      // Preenche as perguntas restantes não respondidas como falsas/erradas
      for (let i = 0; i < perguntas.length; i++) {
        if (resultados[i] === undefined) {
          resultados[i] = false;
          escolhas[i] = null;
        }
      }
      salvarPartidaNoBanco();
      atualizarResultado();
      mostrarTela("resultado-screen");
    });
  }

  const elContador = document.querySelector("#quiz-screen .contador-pergunta");
  const elPontuacao = document.querySelector("#quiz-screen .pontuacao");
  const elBarra = document.querySelector("#quiz-screen .progresso");
  const elTextoPergunta = document.querySelector("#quiz-screen .pergunta-box h2");

  function limparAlternativas() {
    alternativas.forEach(function (b) {
      b.style.borderColor = "";
      b.style.background = "";
      b.classList.remove("certa", "errada");
      b.disabled = false;
    });
    if (elExplicacao) elExplicacao.style.display = "none";
    respostaSelecionada = null;
    respostaConfirmada = false;
    botaoConfirmar.style.display = "";            
    botaoProxima.style.visibility = "hidden";     
  }

  limparAlternativas();

  function carregarPergunta() {
    const numero = indicePergunta + 1;
    const total = perguntas.length;
    if (elContador) elContador.textContent = "Pergunta " + numero + " de " + total;
    if (elPontuacao) elPontuacao.textContent = "⭐ Pontos: " + pontosTotal;
    if (elBarra) elBarra.style.width = (numero / total * 100) + "%";
    if (elTextoPergunta) {
      elTextoPergunta.textContent = String(numero).padStart(2, "0") + "-) " + perguntas[indicePergunta].texto;
    }
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

  function registrarResposta() {
    if (indicePergunta < perguntas.length - 1) {
      indicePergunta++;
      carregarPergunta();
    } else {
      pararCronometro();
      salvarPartidaNoBanco();
      atualizarResultado();
      mostrarTela("resultado-screen");
    }
  }

  // Envia a pontuação final da partida para o backend
  async function salvarPartidaNoBanco() {
    if (!usuarioAtual.id) return;
    try {
      await fetch(`${API_URL}/api/matches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: usuarioAtual.id,
          pontuacao_total: pontosTotal
        })
      });
    } catch (err) {
      console.error("Erro ao salvar partida na API:", err);
    }
  }

  /* -------------------------------------------------------------
     PASSO 8 — Marcelo Ludin (Atualizado)
     Tela 4 (resultado-screen): processa o desempenho do usuário
     (acertos, percentual, anel e histórico) e chama o carregamento do ranking.
     ------------------------------------------------------------- */
  function atualizarResultado() {
    const total = perguntas.length;
    const acertos = resultados.filter(Boolean).length;
    const pct = total > 0 ? Math.round(acertos / total * 100) : 0;

    let maiorSequencia = 0, sequenciaAtual = 0;
    resultados.forEach(function (ok) {
      if (ok) {
        sequenciaAtual++;
        if (sequenciaAtual > maiorSequencia) maiorSequencia = sequenciaAtual;
      } else {
        sequenciaAtual = 0;
      }
    });

    const elPontosAnel = document.querySelector("#resultado-screen .anel-pontos");
    const elPercentual = document.querySelector("#resultado-screen .anel-percentual");
    if (elPontosAnel) elPontosAnel.innerHTML = acertos + "<small>/" + total + "</small>";
    if (elPercentual) elPercentual.textContent = pct + "% de acerto";

    const elAnel = document.querySelector("#resultado-screen .anel-progresso");
    if (elAnel) elAnel.style.strokeDashoffset = 452 - (452 * pct / 100);

    document.querySelectorAll("#resultado-screen .terminal-box p").forEach(function (linha) {
      const valor = linha.querySelector(".destaque");
      if (!valor) return;
      const rotulo = linha.textContent;
      if (rotulo.indexOf("Corretas") !== -1) valor.textContent = acertos + "/" + total;
      else if (rotulo.indexOf("Tempo") !== -1) valor.textContent = spanTempo ? spanTempo.textContent : "00:00";
      else if (rotulo.indexOf("Sequência") !== -1) valor.textContent = maiorSequencia;
    });

    const itens = document.querySelectorAll("#resultado-screen .qitem");
    itens.forEach(function (item, i) {
      item.classList.remove("acerto", "erro");
      if (resultados[i] !== undefined) {
        item.classList.add(resultados[i] ? "acerto" : "erro");
      }
    });

    carregarRankingNaTela();
  }

  let textoCompartilhar = "";

  /* -------------------------------------------------------------
     CARREGAMENTO DO RANKING E PÓDIO (API / Supabase)
     Busca os dados reais do servidor, formata com os avatares corretos
     e aplica os tamanhos customizados para o pódio e lista geral.
     ------------------------------------------------------------- */
  async function carregarRankingNaTela() {
    let rankingServidor = [];
    try {
      const response = await fetch(`${API_URL}/api/ranking`);
      if (response.ok) {
        rankingServidor = await response.json();
      }
    } catch (err) {
      console.error("Erro ao buscar ranking da API:", err);
    }

    const listaFormatada = rankingServidor.map(item => {
      const iconeId = item.usuarios ? item.usuarios.icone_id : 1;
      return {
        nome: item.usuarios ? item.usuarios.nome : "Anônimo",
        icone_id: iconeId,
        pontos: item.pontuacao_total,
        voce: item.usuarios && item.usuarios.nome === usuarioAtual.nome && item.pontuacao_total === pontosTotal
      };
    });

    const jaExiste = listaFormatada.some(j => j.voce);
    if (!jaExiste && usuarioAtual.id) {
      listaFormatada.push({
        nome: usuarioAtual.nome,
        icone_id: avatarEscolhido,
        pontos: pontosTotal,
        voce: true
      });
    }

    listaFormatada.sort((a, b) => b.pontos - a.pontos);

    const posicao = listaFormatada.findIndex(j => j.voce) + 1 || 1;
    const total = listaFormatada.length;

    const elPosicao = document.getElementById("posicao");
    const elTotal = document.getElementById("total");
    const elFalta = document.querySelector("#resultado-screen .ranking-falta");
    if (elPosicao) elPosicao.textContent = posicao + "º lugar";
    if (elTotal) elTotal.textContent = total;
    if (elFalta && listaFormatada.length >= 3) {
      if (posicao <= 3) {
        elFalta.textContent = "você está no pódio! 🎉";
      } else {
        const faltam = Math.max(listaFormatada[2].pontos - pontosTotal, 1);
        elFalta.textContent = "faltam " + faltam + " pts pro pódio";
      }
    }

    function renderizarAvatarHTML(iconeId) {
      const itemOriginal = document.querySelector(`#start-screen .avatar-item[data-avatar="${iconeId}"]`);
      if (itemOriginal) {
        const img = itemOriginal.querySelector("img");
        if (img) {
          const cloneImg = img.cloneNode(true);
          
          /* -------------------------------------------------------------
             📐 AJUSTE DE TAMANHO: Avatares na Lista do Ranking (4º em diante)
             ------------------------------------------------------------- */
          cloneImg.style.width = "46px";
          cloneImg.style.height = "46px";
          cloneImg.style.objectFit = "contain";
          return cloneImg.outerHTML;
        } else {
          return itemOriginal.textContent.trim() || "👾";
        }
      }
      return "👾";
    }

    const cartoes = [
      { seletor: ".podio-card.primeiro", indice: 0 },
      { seletor: ".podio-card.segundo",  indice: 1 },
      { seletor: ".podio-card.terceiro", indice: 2 }
    ];
    cartoes.forEach(function (c) {
      const card = document.querySelector("#ranking-screen " + c.seletor);
      const j = listaFormatada[c.indice];
      if (!card || !j) return;
      const elAvatar = card.querySelector(".podio-avatar");
      const elNome = card.querySelector(".podio-nome");
      const elPts = card.querySelector(".podio-pontos");
      
      if (elAvatar) {
        elAvatar.innerHTML = renderizarAvatarHTML(j.icone_id);
        
        /* -------------------------------------------------------------
           📐 AJUSTE DE TAMANHO: Avatares EXCLUSIVAMENTE do Pódio (1º, 2º e 3º)
           ------------------------------------------------------------- */
        const imgNoPodio = elAvatar.querySelector("img");
        if (imgNoPodio) {
          imgNoPodio.style.width = "72px";
          imgNoPodio.style.height = "72px";
          imgNoPodio.style.objectFit = "contain";
        }
      }

      if (elNome) elNome.textContent = j.voce ? j.nome + " (você)" : j.nome;
      if (elPts) elPts.textContent = j.pontos + " pts";
    });

    const elLista = document.querySelector("#ranking-screen .rank-lista");
    if (elLista) {
      let linhas = listaFormatada.slice(3, 7).map(function (j, i) {
        return { j: j, pos: i + 4 };
      });
      if (posicao > 7) linhas[linhas.length - 1] = { j: listaFormatada[posicao - 1], pos: posicao };

      elLista.textContent = "";
      linhas.forEach(function (l) {
        const linha = document.createElement("div");
        linha.className = "rank-linha" + (l.j.voce ? " voce" : "");

        const sPos = document.createElement("span");
        sPos.className = "rank-posicao";
        sPos.textContent = l.pos + "º";

        const sAv = document.createElement("span");
        sAv.className = "rank-avatar";
        sAv.innerHTML = renderizarAvatarHTML(l.j.icone_id);

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

    const acertos = resultados.filter(Boolean).length;
    textoCompartilhar = "Joguei Verdade ou Bug (Tech Trivia): acertei " + acertos + "/" +
      perguntas.length + ", fiz " + pontosTotal + " pts e fiquei em " + posicao + "º lugar! 🚀";
  }

  const botaoVerRanking = document.querySelector("#resultado-screen .btn-primario");
  const botaoJogarNovamenteResultado = document.querySelector("#resultado-screen .btn-secundario");

  botaoVerRanking.addEventListener("click", function () {
    mostrarTela("ranking-screen");
  });

  botaoJogarNovamenteResultado.addEventListener("click", function () {
    mostrarTela("ready-screen");
  });

  /* -------------------------------------------------------------
     PASSO 9 — Marcelo Ludin
     Tela 5 (ranking-screen): botões finais de reinício e compartilhamento.
     ------------------------------------------------------------- */
  const botaoJogarNovamenteRanking = document.querySelector("#ranking-screen .btn-primario");
  const botaoCompartilhar = document.querySelector("#ranking-screen .btn-secundario");

  botaoJogarNovamenteRanking.addEventListener("click", function () {
    reiniciarJogo();
  });

  botaoCompartilhar.addEventListener("click", function () {
    const textoResumo = textoCompartilhar || "Joguei o Tech Trivia (Verdade ou Bug)! 🚀";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textoResumo).then(function () {
        const textoOriginal = botaoCompartilhar.textContent;
        botaoCompartilhar.textContent = "Copiado! ✔";
        setTimeout(function () { botaoCompartilhar.textContent = textoOriginal; }, 1500);
      }).catch(function () {});
    }
  });

  /* -------------------------------------------------------------
     PASSO 10 — Marcelo Ludin
     Função de reinício: limpa dados, reseta o cronômetro e
     retorna o fluxo para a tela inicial (start-screen).
     ------------------------------------------------------------- */
  function reiniciarJogo() {
    pararCronometro();
    if (campoNome) campoNome.value = "";
    usuarioAtual = { id: null, nome: "Usuário", icone: 1 };
    avatarEscolhido = 1;
    carregarIconesDinamicos(); 
    mostrarTela("start-screen");
  }

});

/* -------------------------------------------------------------
   ALTERNADOR DE TEMA (MODO CLARO / MODO ESCURO)
   ------------------------------------------------------------- */
const botaoTema = document.getElementById('botao-tema');
if (botaoTema) {
  botaoTema.addEventListener('click', function () {
    document.body.classList.toggle('tema-claro');
    const claro = document.body.classList.contains('tema-claro');
    botaoTema.setAttribute('aria-label', claro ? 'Alternar para modo escuro' : 'Alternar para modo claro');
  });
}
