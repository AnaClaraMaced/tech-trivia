# Passo 5 — Modelo lógico

Marco M1. A entrega deste passo é o modelo lógico: o desenho em `entregas/03-logico.pdf` (ou `.png`) e as tabelas de mapeamento abaixo.

O modelo lógico traduz o modelo conceitual para tabelas relacionais, especificando chaves primárias (PK), chaves estrangeiras (FK), tipos de dados e cardinalidades (1:N).

## Mapeamento de Entidades para Tabelas

| Tabela | Colunas (Atributos, PK e FK) | Tipos de Dados |
| --- | --- | --- |
| **icons** | id_icons (PK), icon_name, icon_url | int4, varchar, varchar |
| **usuarios** | id_usuario (PK), nome, icone_id (FK), criado_em | int4, varchar, int4, timestamptz |
| **partidas** | id_partida (PK), usuario_id (FK), pontuacao_total, data_partida | int4, int4, int4, timestamptz |
| **nivel** | id_nivel (PK), dificuldade, pontos | int4, varchar, int2 |
| **perguntas** | id_perguntas (PK), pergunta, categoria, explicacao, fonte, nivel_id (FK) | int4, text, varchar, varchar, varchar, int4 |
| **alternativas** | id_alternativas (PK), pergunta_id (FK), texto_alternativa, correta | int4, int4, varchar, bool |

## Relacionamentos e Cardinalidades no Modelo Lógico

| Relacionamento | Cardinalidade | Mapeamento no Modelo Lógico | Requisito |
| --- | --- | --- | --- |
| **icons ➔ usuarios** | 1:N | A tabela `usuarios` recebe a chave estrangeira `icone_id` referenciando `icons(id_icons)`. | RD01 |
| **usuarios ➔ partidas** | 1:N | A tabela `partidas` recebe a chave estrangeira `usuario_id` referenciando `usuarios(id_usuario)`. | RD02 |
| **nivel ➔ perguntas** | 1:N | A tabela `perguntas` recebe a chave estrangeira `nivel_id` referenciando `nivel(id_nivel)`. | RD03 |
| **perguntas ➔ alternativas** | 1:N | A tabela `alternativas` recebe a chave estrangeira `pergunta_id` referenciando `perguntas(id_perguntas)`. | RD04 |
