# Passo 4 — Modelo conceitual

Marco M1. A entrega deste passo é o modelo conceitual: o desenho em `doc_date/02-conceitual.pdf` (ou `.png`) e as tabelas abaixo.

## Entidades

| Entidade | Atributos | Identificador |
| --- | --- | --- |
| **Ícone** | Nome, URL | ID do Ícone |
| **Usuário** | Nome, Data de Criação | ID do Usuário |
| **Partida** | Pontuação Total, Data da Partida | ID da Partida |
| **Nível** | Dificuldade, Pontos | ID do Nível |
| **Pergunta** | Enunciado, Categoria, Explicação, Fonte | ID da Pergunta |
| **Alternativa** | Texto da Alternativa, Correta | ID da Alternativa |

## Relacionamentos

| Relacionamento | Cardinalidade | Justificativa | Requisito |
| --- | --- | --- | --- |
| **Usuário escolhe Ícone** | (1,1) a (0,N) | Cada usuário possui obrigatoriamente um ícone de perfil, enquanto um ícone pode ser escolhido por nenhum ou vários usuários. | RD01 |
| **Usuário realiza Partida** | (1,1) a (0,N) | Cada partida pertence a um único usuário, mas um usuário pode registrar zero ou várias partidas no histórico. | RD02 |
| **Nível classifica Pergunta** | (1,1) a (1,N) | Cada pergunta está associada obrigatoriamente a um nível, e cada nível agrupa uma ou mais perguntas do quiz. | RD03 |
| **Pergunta possui Alternativa** | (1,1) a (1,N) | Cada alternativa pertence estritamente a uma única pergunta, e cada pergunta possui obrigatoriamente várias alternativas de resposta. | RD04 |
