-- Passo 7 — Modelo físico
-- Equipe: Pablo | Lucas | Ana | Carina | Marcelo | Murilo | Rafael / Grupo 4
-- SGBD: PostgreSQL. 
-- Contrato com Aplicativos para Web: os nomes abaixo são os acordados.
-- Banco vazio:
--   createdb tech_trivia
--   psql -d tech_trivia -v ON_ERROR_STOP=1 -f 04-ddl.sql
-- Só esquema e domínio fixo (ícones, níveis, etc.).

-- BEGIN;

-- -- 1. Tabela Ícone (independente)
-- CREATE TABLE icone (
--     id_icon SERIAL PRIMARY KEY,
--     nome VARCHAR(100),
--     url VARCHAR(255) NOT NULL
-- );

-- -- 2. Tabela Nível (independente)
-- CREATE TABLE nivel (
--     id_nivel SERIAL PRIMARY KEY,
--     dificuldade VARCHAR(50) NOT NULL UNIQUE,
--     pontos INTEGER NOT NULL
-- );

-- -- 3. Tabela Usuário (depende de Ícone)
-- CREATE TABLE usuario (
--     id_usuario SERIAL PRIMARY KEY,
--     nome VARCHAR(100) NOT NULL,
--     criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     icone_id INTEGER NOT NULL,
--     CONSTRAINT fk_usuario_icone FOREIGN KEY (icone_id) REFERENCES icone(id_icon)
-- );

-- -- 4. Tabela Pergunta (depende de Nível)
-- CREATE TABLE perguntas (
--     id_perguntas SERIAL PRIMARY KEY,
--     pergunta TEXT NOT NULL,
--     categoria VARCHAR(100),
--     fonte VARCHAR(255),
--     explicacao TEXT,
--     nivel_id INTEGER NOT NULL,
--     CONSTRAINT fk_pergunta_nivel FOREIGN KEY (nivel_id) REFERENCES nivel(id_nivel)
-- );

-- -- 5. Tabela Alternativa (depende de Pergunta)
-- CREATE TABLE alternativa (
--     id_alternativa SERIAL PRIMARY KEY,
--     texto_alternativa TEXT NOT NULL,
--     correta BOOLEAN NOT NULL,
--     pergunta_id INTEGER NOT NULL,
--     CONSTRAINT fk_alternativa_pergunta FOREIGN KEY (pergunta_id) REFERENCES perguntas(id_perguntas)
-- );

-- -- 6. Tabela Partida (depende de Usuário)
-- CREATE TABLE partidas (
--     id_partida SERIAL PRIMARY KEY,
--     data_partida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     pontuacao_total INTEGER NOT NULL DEFAULT 0,
--     usuario_id INTEGER NOT NULL,
--     CONSTRAINT fk_partida_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id_usuario)
-- );


-- -- 1. Ajustar a tabela `usuarios` para se ligar à tabela `icons`
-- -- (Removemos o tipo antigo varchar e transformamos em int para aceitar a chave estrangeira)
-- TRUNCATE TABLE partidas, usuarios CASCADE;
-- ALTER TABLE usuarios 
--   ALTER COLUMN Icone_id TYPE INT USING Icone_id::integer;

-- ALTER TABLE usuarios 
--   ADD CONSTRAINT fk_usuarios_icons 
--   FOREIGN KEY (Icone_id) REFERENCES icons(icon_id) ON DELETE SET NULL;


-- -- 2. Ajustar a tabela `nivel` para o padrão relacional correto
-- -- (Recriamos a tabela nivel para que cada linha represente um nível e possamos relacionar com perguntas)
-- DROP TABLE IF EXISTS nivel CASCADE;


-- -- 3. Adicionar a chave estrangeira de `nivel` na tabela `perguntas`
-- ALTER TABLE perguntas 
--   ADD COLUMN IF NOT EXISTS nivel_id INT;

-- ALTER TABLE perguntas 
--   ADD CONSTRAINT fk_perguntas_nivel 
--   FOREIGN KEY (nivel_id) REFERENCES nivel(id_nivel) ON DELETE SET NULL;


--   -- Libera o acesso público para a API conseguir salvar as partidas e ler o ranking
-- ALTER TABLE partidas DISABLE ROW LEVEL SECURITY;

-- ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE perguntas DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE alternativas DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE partidas DISABLE ROW LEVEL SECURITY;


-- -- Cria política de leitura pública para o front-end
-- create policy "Permitir leitura pública das perguntas"
-- on perguntas for select
-- to anon using (true);


-- NOTIFY pgrst, 'reload schema';

-- GRANT USAGE ON SCHEMA public TO anon, authenticated;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;