# Passos 1 a 3 — Contexto, minimundo e requisitos

Marco M1.

## 1. Introdução e contexto

O **Verdade ou Bug** é um jogo de trivia em formato web (full-stack com HTML/CSS/Vanilla JS e backend Node.js) focado em estudantes e entusiastas do universo da tecnologia. O sistema apresenta afirmações no formato de verdadeiro ou falso, onde o banco de dados armazena as questões, suas alternativas, categorias, explicações, níveis de dificuldade, fontes e pontuações.

------------------------------------------------------------------------------
### Escopo

| O banco faz |
| --- |
| Armazena o cadastro do usuário (nome, ícone de perfil e data de criação). |
| Armazena as perguntas de tecnologia, suas categorias, níveis de dificuldade, explicações e fontes bibliográficas. |
| Armazena as alternativas vinculadas às perguntas e indica qual delas é a correta. |
| Armazena o histórico de partidas com a pontuação total obtida por cada usuário. |
| Fornece dados ordenados para a exibição do ranking geral de pontuações. |
| Realiza o sorteio aleatório de perguntas para cada nova sessão de jogo. |

| O banco não faz |
| --- |
| Não gera novas perguntas automaticamente de forma autônoma. |
| Não possui interface gráfica própria de gerenciamento administrativo (o cadastro de perguntas é realizado diretamente via scripts ou banco). |

------------------------------------------------------------------------------
### Usuários

| Usuário / Papel | O que faz |
| --- | --- |
| **Jogador** | Informa seu nome e escolhe um ícone de avatar para se registrar no sistema. |
| **Jogador** | Responde às 10 perguntas geradas aleatoriamente em sua sessão de jogo. |
| **Jogador** | Visualiza sua performance detalhada ao finalizar ou desistir da partida. |
| **Jogador** | Consulta o ranking da sessão para comparar sua pontuação com a dos demais participantes. |
| **Equipe do Projeto** | Administra e cadastra as perguntas e alternativas oficiais no banco de dados. |

------------------------------------------------------------------------------

## 2. Minimundo

O sistema de Trivia inicia na tela de boas-vindas com o registro do nome e a escolha do ícone (avatar) do usuário, cujas informações são cadastradas e armazenadas no banco de dados. Após o acesso, a interface interativa do quiz é exibida para que o usuário responda a perguntas relacionadas à tecnologia. As perguntas estão em português e possuem categoria, nível de dificuldade, explicação pedagógica e fonte de referência, operando com alternativas de verdadeiro ou falso.

Cada sessão de jogo é composta por 10 questões sorteadas aleatoriamente pelo servidor a partir de um acervo central. A cada resposta correta confirmada, o usuário acumula 100 pontos, totalizando até 1.000 pontos caso acerte todas as questões da sessão. O sistema registra de forma persistente o resultado da partida vinculada ao ID do usuário. Ao término do quiz, a pontuação alcançada e a performance individual são exibidas na tela de resultado, acompanhadas de um ranking dinâmico que apresenta a posição do jogador em comparação com o restante dos participantes.

## 3. Requisitos e regras de negócio

| Código | Texto do requisito | Tipo |
| --- | --- | --- |
| **RD01** | O sistema deverá permitir o cadastro do nome e do ícone do usuário antes de iniciar o quiz. | Funcional |
| **RD02** | O sistema deverá exibir a interface principal de perguntas após a confirmação do perfil. | Funcional |
| **RD03** | O sistema deverá buscar e apresentar perguntas dinâmicas relacionadas à área de Tecnologia e Inovação. | Funcional |
| **RD04** | O sistema deverá sortear e apresentar exatamente 10 questões por sessão de jogo. | Funcional |
| **RD05** | O sistema deverá permitir que o usuário selecione uma alternativa (Verdadeiro ou Falso) para cada pergunta. | Funcional |
| **RD06** | O sistema deverá validar a resposta confirmada pelo usuário, exibindo feedback visual de acerto/erro e a respectiva explicação. | Funcional |
| **RD07** | O sistema deverá calcular, acumular e exibir a pontuação do usuário em tempo real. | Funcional |
| **RD08** | O sistema deverá armazenar de forma estruturada as perguntas, categorias, explicações, fontes e alternativas no banco de dados relacional. | Funcional |
| **RD09** | O sistema deverá registrar a pontuação total da partida na tabela de histórico ao finalizar ou concluir o quiz. | Funcional |
| **RD10** | O sistema deverá consultar e exibir o ranking ordenado de pontuações dos jogadores. | Funcional |
| **RA01** | Cada pergunta deverá pertencer a uma categoria específica da área de tecnologia. | Regra de Negócio |
| **RA02** | Cada pergunta deverá possuir uma fonte bibliográfica ou link de referência oficial. | Regra de Negócio |
| **RA03** | Cada pergunta deverá possuir um conjunto de alternativas correspondentes (Verdadeiro ou Falso), com apenas uma correta. | Regra de Negócio |
| **RA04** | Cada resposta correta confirmada deverá valer exatamente 100 pontos. | Regra de Negócio |
| **RA05** | Cada sessão de partida deverá conter exatamente 10 questões. | Regra de Negócio |
| **RA06** | A pontuação máxima por sessão de trivia será de 1.000 pontos (10 questões multiplicadas por 100 pontos). | Regra de Negócio |
| **RNF01** | Os campos obrigatórios das entidades (como nomes, textos de perguntas e IDs de relacionamento) não poderão aceitar valores nulos (`NOT NULL`). | Não Funcional |
| **RNF02** | O Sistema de Gerenciamento de Banco de Dados relacional utilizado para a persistência dos dados deverá ser o Supabase (PostgreSQL), integrado a uma API backend em Node.js. | Não Funcional |
