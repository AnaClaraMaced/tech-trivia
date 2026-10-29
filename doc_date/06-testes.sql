-----------------------------
-- TESTES REALIZADOS
-----------------------------




-- não existem dois níveis com a mesma dificuldade.
-- ERRO: duplicar valor na chave única viola a restrição da coluna 'dificuldade'
-- INSERT INTO nivel (dificuldade, pontos) VALUES ('Fácil', 50);

-- uma alternativa não pode ser inserida sem texto obrigatório (NOT NULL).
-- ERRO: o valor nulo na coluna "texto" viola a restrição NOT NULL
-- INSERT INTO alternativa (texto, correta, pergunta_id) VALUES (NULL, TRUE, 1);

-- Um usuário não pode ser cadastrado sem um ID de ícone válido (Foreign Key).
-- ERRO: violação de chave estrangeira: chave não encontrada na tabela "icone"
-- INSERT INTO usuario (nome, icone_id) VALUES ('Teste Erro', 9999);




-- SELECT * FROM alternativas

-- SELECT * FROM icons

-- SELECT * FROM nivel

-- SELECT * FROM partidas

-- SELECT * FROM perguntas

-- SELECT * FROM usuarios