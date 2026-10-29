
BEGIN;

-- Massa mínima, nesta ordem: alternativas, perguntas, niveis, icones, usuarios, partidas.
-- No mínimo:
--  10 perguntas com id fact-001, fact-002, ...
--  1 URL por pergunta
--  uma pergunta cuja correta é Certo e outra cuja correta é Errado
-- Não insiram de novo categoria, publicador ou URL já gravados.

COMMIT;

-- RA01	Cada pergunta deverá pertencer a uma categoria específica da área de tecnologia.

-- RA02	Cada pergunta deverá possuir uma fonte bibliográfica ou link de referência oficial.	

-- RA03	Cada pergunta deverá possuir um conjunto de alternativas correspondentes (Verdadeiro ou Falso), com apenas uma correta.	

-- RA04	Cada resposta correta confirmada pontuará o usuário com base no valor atribuído ao nível de dificuldade da questão na tabela de níveis (Fácil: 50 pts, Médio: 75 pts, Difícil: 100 pts).

-- RA05	Cada sessão de partida deverá conter exatamente 10 questões.

-- RA06	A pontuação máxima exibida no sistema corresponderá ao recorde global alcançado pelo jogador posicionado em primeiro lugar no ranking geral de pontuações.



-----------------------------
-- COMANDO DML-CONSULTAS
-----------------------------

-- INSERT INTO perguntas (id, categoria, pergunta, explicacao, fonte) VALUES

-- (83,'Governo e Legislação', 
-- 'É certo afirmar que o governo chinês baniu o Windows 10 China Government Edition de órgãos públicos, alegando riscos à segurança digital e que a motivação por trás pode ser a redução da dependência de tecnologia americana?',
-- 'A China proibiu o uso do Windows 10 China Government Edition alegando preocupações na segurança digital, mas o motivo real por trás disso é que a China quer parar de depender da tecnologia americana, fazendo parte da guerra fria tecnológica EUA x China.',
-- 'https://tecnoblog.net/noticias/china-bane-versao-especial-do-windows-10-em-orgaos-de-governo/'),

-- (84,'Hardware e Componentes',
-- 'O UEFI foi desenvolvido por um consórcio americano para fazer uma pequena atualização no BIOS e todos os detalhes já foram divulgados.',
-- 'O UEFI não é uma pequena atualização da BIOS, e sim um firmware que a substitui por completo, trazendo suporte a discos maiores, boot mais rápido e recursos de segurança como o Secure Boot. Além disso, o padrão foi criado pelo UEFI Forum, formado por diversas empresas.',
-- 'https://tecnoblog.net/responde/o-que-e-uefi-saiba-para-que-serve-o-firmware-e-como-funciona-no-pc/'),

-- (85,'Hardware e Componentes',
-- 'Russos estão montando memória RAM em casa por causa da escassez e dos preços altos.',
-- 'Na Rússia está faltando RAM e o preço aumentou devido às sanções, à falta de importação oficial e à crise global de chips.',
-- 'https://tecnoblog.net/noticias/russos-apelam-para-ram-feita-em-casa-como-forma-de-driblar-crise/'),

-- (86,'Inteligência Artificial',
-- 'Segundo o alerta do presidente da Microsoft, Brad Smith, os recentes protestos universitários contra a IA nos EUA são um tema que ele levou a outras empresas do setor.',
-- 'O presidente da Microsoft, Brad Smith, alertou outras empresas do setor sobre a onda de protestos de estudantes universitários contra a IA nos Estados Unidos.',
-- 'https://tecnoblog.net/noticias/acordem-diz-presidente-da-microsoft-ao-setor-de-ia/'),

-- (87,'Inteligência Artificial',
-- 'De acordo com o presidente da Microsoft, Brad Smith, os recentes protestos universitários contra a IA demonstram o apoio dos jovens à automação total, e por isso ele defende que o setor de IA ignore essas manifestações.',
-- 'Os protestos não representam apoio à automação total. Brad Smith defende equilíbrio no uso da IA e atenção às preocupações apresentadas pelos estudantes.',
-- 'https://tecnoblog.net/noticias/acordem-diz-presidente-da-microsoft-ao-setor-de-ia/'),

-- (88,'Internet',
-- 'A pane na AWS foi realmente o motivo causador da instabilidade no Mercado Livre, Alexa e Prime Video?',
-- 'A Amazon identificou problemas operacionais em um data center na Virgínia, afetando serviços dependentes da infraestrutura AWS.',
-- 'https://tecnoblog.net/noticias/mercado-livre-e-mais-servicos-ficam-fora-do-ar-nesta-manha-de-segunda-feira/'),

-- (89,'Internet',
-- 'A AWS teve uma falha total e permanente causada por um ataque de hackers em um data center que derrubou o servidor, e a Amazon não identificou a causa do problema.',
-- 'A Amazon informou que o problema foi uma falha técnica e não um ataque hacker, além de ter identificado a causa da instabilidade.',
-- 'https://olhardigital.com.br/2025/10/24/pro/aws-revela-motivo-da-falha-que-causou-apagao-em-servicos/'),

-- (90,'Negócios e Mercado',
-- 'A Samsung vai reduzir em 15% a produção de DRAM até o fim do ano no campus de Hwasong, na Coreia do Sul, para aumentar as negociações com a empresa chinesa CXMT e diminuir a demanda da Apple.',
-- 'A informação está incorreta. A estratégia divulgada envolve ampliar a produção para atender clientes e enfrentar a concorrência chinesa.',
-- 'https://tecnoblog.net/noticias/samsung-vai-ampliar-producao-de-dram-para-frear-chips-chineses/'),

-- (91,'Negócios e Mercado',
-- 'É correto afirmar que aumentar em 15% a produção de DRAM até o fim do ano e centralizar a fabricação para atender à alta demanda de clientes da Apple, e evitar o avanço de negociações dos concorrentes chineses, é uma estratégia da Samsung?',
-- 'O aumento da produção busca atender à demanda elevada do mercado e reduzir o avanço de fabricantes chineses concorrentes.',
-- 'https://tecnoblog.net/noticias/samsung-vai-ampliar-producao-de-dram-para-frear-chips-chineses/'),

-- (92,'Segurança e Privacidade',
-- 'A NordVPN oferece apenas VPN básica para ocultar o IP, com uma rede pequena de servidores e proteção para apenas 1 dispositivo.',
-- 'A NordVPN oferece recursos adicionais de segurança e suporte a múltiplos dispositivos, além de uma ampla rede de servidores.',
-- 'https://tecnoblog.net/publieditoriais/nordvpn-conheca-os-principais-recursos-velocidade-servidores-e-seguranca/'),

-- (93,'Segurança e Privacidade',
-- 'É correto afirmar que a NordVPN oferece proteção em até 10 dispositivos com mais de 9.500 servidores em 149 países, incluindo recursos como Kill Switch e Antivírus Next-Gen?',
-- 'A NordVPN disponibiliza ampla infraestrutura global e recursos avançados de proteção e privacidade para seus usuários.',
-- 'https://tecnoblog.net/publieditoriais/nordvpn-conheca-os-principais-recursos-velocidade-servidores-e-seguranca/'),

-- (94,'Sistemas Operacionais',
-- 'A atualização KB5066835 permite que servidores com SSDs PCIe Gen5 alcancem 3,3 milhões de operações por segundo?',
-- 'A atualização da Microsoft trouxe otimizações para NVMe que permitiram atingir até 3,3 milhões de IOPS em cenários específicos.',
-- 'https://tecnoblog.net/noticias/microsoft-libera-recurso-que-pode-aumentar-desempenho-do-pc-em-80/'),

-- (95,'Sistemas Operacionais',
-- 'A atualização KB5066835 da Microsoft ativa automaticamente 80% de melhora de desempenho em qualquer PC comum, bastando estar com o Windows atualizado.',
-- 'O ganho de desempenho depende de requisitos específicos e configurações adicionais, não ocorrendo automaticamente em qualquer computador.',
-- 'https://tecnoblog.net/noticias/microsoft-libera-recurso-que-pode-aumentar-desempenho-do-pc-em-80/'),

-- -- (96,'Software',
-- -- 'A Microsoft já lançou oficialmente o login com conta Google no Edge para sincronizar senhas e favoritos, e o recurso está disponível de forma padrão para todos os usuários na versão 152 para Linux.',
-- -- 'O recurso citado não envolve conta Google, ainda está em testes e não foi lançado oficialmente para todos os usuários.',
-- -- 'https://tecnoblog.net/noticias/microsoft-vai-permitir-login-no-edge-com-conta-apple-para-atrair-usuarios/'),

-- -- (97,'Software', 
-- -- 'A Microsoft está testando no Edge o login com Conta Apple para sincronizar dados de navegação, recurso encontrado nas versões Beta e Canary, com lançamento previsto para a última semana de agosto?',
-- -- 'A Microsoft está testando a integração de login com Conta Apple no Edge para sincronização de dados de navegação nas versões Beta e Canary.',
-- -- 'https://tecnoblog.net/noticias/microsoft-vai-permitir-login-no-edge-com-conta-apple-para-atrair-usuarios/');








-- --------------------------------
-- INSERTS DA TABELA ALTERNATIVAS
-- --------------------------------
-- INSERT INTO alternativas (pergunta_id, texto_alternativa, correta) VALUES
-- (11, 'Verdadeiro', TRUE),
-- (11, 'Falso', FALSE),
-- (12, 'Verdadeiro', FALSE),
-- (12, 'Falso', TRUE),
-- (13, 'Verdadeiro', TRUE),
-- (13, 'Falso', FALSE),
-- (14, 'Verdadeiro', FALSE),
-- (14, 'Falso', TRUE),
-- (15, 'Verdadeiro', TRUE),
-- (15, 'Falso', FALSE),
-- (16, 'Verdadeiro', TRUE),
-- (16, 'Falso', FALSE),
-- (17, 'Verdadeiro', TRUE),
-- (17, 'Falso', FALSE),
-- (18, 'Verdadeiro', FALSE),
-- (18, 'Falso', TRUE),
-- (19, 'Verdadeiro', TRUE),
-- (19, 'Falso', FALSE),
-- (20, 'Verdadeiro', TRUE),
-- (20, 'Falso', FALSE),
-- (21, 'Verdadeiro', FALSE),
-- (21, 'Falso', TRUE),
-- (22, 'Verdadeiro', TRUE),
-- (22, 'Falso', FALSE),
-- (23, 'Verdadeiro', TRUE),
-- (23, 'Falso', FALSE),
-- (24, 'Verdadeiro', TRUE),
-- (24, 'Falso', FALSE),
-- (25, 'Verdadeiro', TRUE),
-- (25, 'Falso', FALSE),
-- (26, 'Verdadeiro', FALSE),
-- (26, 'Falso', TRUE),
-- (27, 'Verdadeiro', FALSE),
-- (27, 'Falso', TRUE),
-- (28, 'Verdadeiro', TRUE),
-- (28, 'Falso', FALSE),
-- (29, 'Verdadeiro', TRUE),
-- (29, 'Falso', FALSE),
-- (30, 'Verdadeiro', TRUE),
-- (30, 'Falso', FALSE),
-- (31, 'Verdadeiro', TRUE),
-- (31, 'Falso', FALSE),
-- (32, 'Verdadeiro', FALSE),
-- (32, 'Falso', TRUE),
-- (33, 'Verdadeiro', TRUE),
-- (33, 'Falso', FALSE),
-- (34, 'Verdadeiro', TRUE),
-- (34, 'Falso', FALSE),
-- (35, 'Verdadeiro', TRUE),
-- (35, 'Falso', FALSE),
-- (36, 'Verdadeiro', TRUE),
-- (36, 'Falso', FALSE),
-- (37, 'Verdadeiro', FALSE),
-- (37, 'Falso', TRUE),
-- (38, 'Verdadeiro', TRUE),
-- (38, 'Falso', FALSE),
-- (39, 'Verdadeiro', TRUE),
-- (39, 'Falso', FALSE),
-- (40, 'Verdadeiro', TRUE),
-- (40, 'Falso', FALSE),
-- (41, 'Verdadeiro', TRUE),
-- (41, 'Falso', FALSE),
-- (42, 'Verdadeiro', TRUE),
-- (42, 'Falso', FALSE),
-- (43, 'Verdadeiro', TRUE),
-- (43, 'Falso', FALSE),
-- (44, 'Verdadeiro', FALSE),
-- (44, 'Falso', TRUE),
-- (45, 'Verdadeiro', FALSE),
-- (45, 'Falso', TRUE),
-- (46, 'Verdadeiro', TRUE),
-- (46, 'Falso', FALSE),
-- (47, 'Verdadeiro', TRUE),
-- (47, 'Falso', FALSE),
-- (48, 'Verdadeiro', FALSE),
-- (48, 'Falso', TRUE),
-- (49, 'Verdadeiro', TRUE),
-- (49, 'Falso', FALSE),
-- (50, 'Verdadeiro', TRUE),
-- (50, 'Falso', FALSE),
-- (51, 'Verdadeiro', TRUE),
-- (51, 'Falso', FALSE),
-- (52, 'Verdadeiro', TRUE),
-- (52, 'Falso', FALSE),
-- (53, 'Verdadeiro', FALSE),
-- (53, 'Falso', TRUE),
-- (54, 'Verdadeiro', TRUE),
-- (54, 'Falso', FALSE),
-- (55, 'Verdadeiro', FALSE),
-- (55, 'Falso', TRUE),
-- (56, 'Verdadeiro', FALSE),
-- (56, 'Falso', TRUE),
-- (57, 'Verdadeiro', TRUE),
-- (57, 'Falso', FALSE),
-- (58, 'Verdadeiro', FALSE),
-- (58, 'Falso', TRUE),
-- (59, 'Verdadeiro', FALSE),
-- (59, 'Falso', TRUE),
-- (60, 'Verdadeiro', FALSE),
-- (60, 'Falso', TRUE),
-- (61, 'Verdadeiro', FALSE),
-- (61, 'Falso', TRUE),
-- (62, 'Verdadeiro', TRUE),
-- (62, 'Falso', FALSE),
-- (63, 'Verdadeiro', FALSE),
-- (63, 'Falso', TRUE),
-- (64, 'Verdadeiro', TRUE),
-- (64, 'Falso', FALSE),
-- (65, 'Verdadeiro', TRUE),
-- (65, 'Falso', FALSE),
-- (66, 'Verdadeiro', FALSE),
-- (66, 'Falso', TRUE),
-- (67, 'Verdadeiro', FALSE),
-- (67, 'Falso', TRUE),
-- (68, 'Verdadeiro', TRUE),
-- (68, 'Falso', FALSE),
-- (69, 'Verdadeiro', FALSE),
-- (69, 'Falso', TRUE),
-- (70, 'Verdadeiro', TRUE),
-- (70, 'Falso', FALSE),
-- (71, 'Verdadeiro', TRUE),
-- (71, 'Falso', FALSE),
-- (72, 'Verdadeiro', TRUE),
-- (72, 'Falso', FALSE),
-- (73, 'Verdadeiro', TRUE),
-- (73, 'Falso', FALSE),
-- (74, 'Verdadeiro', FALSE),
-- (74, 'Falso', TRUE),
-- (75, 'Verdadeiro', FALSE),
-- (75, 'Falso', TRUE),
-- (76, 'Verdadeiro', TRUE),
-- (76, 'Falso', FALSE),
-- (77, 'Verdadeiro', TRUE),
-- (77, 'Falso', FALSE),
-- (78, 'Verdadeiro', FALSE),
-- (78, 'Falso', TRUE),
-- (79, 'Verdadeiro', TRUE),
-- (79, 'Falso', FALSE),
-- (80, 'Verdadeiro', TRUE),
-- (80, 'Falso', FALSE),
-- (81, 'Verdadeiro', FALSE),
-- (81, 'Falso', TRUE),
-- (82, 'Verdadeiro', TRUE),
-- (82, 'Falso', FALSE),
-- (83, 'Verdadeiro', TRUE),
-- (83, 'Falso', FALSE),
-- (84, 'Verdadeiro', FALSE),
-- (84, 'Falso', TRUE),
-- (85, 'Verdadeiro', FALSE),
-- (85, 'Falso', TRUE),
-- (86, 'Verdadeiro', TRUE),
-- (86, 'Falso', FALSE),
-- (87, 'Verdadeiro', FALSE),
-- (87, 'Falso', TRUE),
-- (88, 'Verdadeiro', TRUE),
-- (88, 'Falso', FALSE),
-- (89, 'Verdadeiro', FALSE),
-- (89, 'Falso', TRUE),
-- (90, 'Verdadeiro', FALSE),
-- (90, 'Falso', TRUE),
-- (91, 'Verdadeiro', TRUE),
-- (91, 'Falso', FALSE),
-- (92, 'Verdadeiro', FALSE),
-- (92, 'Falso', TRUE),
-- (93, 'Verdadeiro', TRUE),
-- (93, 'Falso', FALSE),
-- (94, 'Verdadeiro', TRUE),
-- (94, 'Falso', FALSE),
-- (95, 'Verdadeiro', FALSE),
-- (95, 'Falso', TRUE),
-- (96, 'Verdadeiro', FALSE),
-- (96, 'Falso', TRUE),
-- (97, 'Verdadeiro', TRUE),
-- (97, 'Falso', FALSE);

-- -- Corrige o gabarito das perguntas 22, 31, 52 e 57 para FALSO
-- UPDATE alternativas 
-- SET correta = FALSE 
-- WHERE pergunta_id IN (22, 31, 52, 57) AND texto_alternativa = 'Verdadeiro';

-- UPDATE alternativas 
-- SET correta = TRUE 
-- WHERE pergunta_id IN (22, 31, 52, 57) AND texto_alternativa = 'Falso';






-- -- Insere os níveis básicos
-- INSERT INTO nivel (nome, pontos) VALUES 
-- ('Fácil', 100),
-- ('Médio', 150),
-- ('Difícil', 200);


-- - Exemplo de atualização/inserção na tabela nivel
-- UPDATE nivel SET pontos = 50 WHERE id_nivel = 1; -- Fácil
-- UPDATE nivel SET pontos = 75 WHERE id_nivel = 2; -- Médio
-- UPDATE nivel SET pontos = 100 WHERE id_nivel = 3; -- Difícil



-- --------------------------------
-- INSERTS DA TABELA ICONES
-- --------------------------------
-- INSERT INTO icons (icon_id, icon_name, icon_url) VALUES 
-- (1, 'Bobô', 'https://api.dicebear.com/10.x/lorelei/svg?seed=Felix')
-- ON CONFLICT (icon_id) DO NOTHING;

-- INSERT INTO icons (icon_id, icon_name, icon_url) VALUES 
-- (2, 'Robô', 'https://img.icons8.com/?size=100&id=Jz5tDx0gvMMC&format=png&color=000000')
-- ON CONFLICT (icon_id) DO NOTHING;

-- INSERT into icons (icon_id, icon_name, icon_url) VALUES
-- (3, 'ryan', 'https://api.dicebear.com/10.x/voxel-bot/svg?seed=2we3n6cr'),
-- (4, 'carlo', 'https://api.dicebear.com/10.x/voxel-bot/svg?seed=8elj9smm'),
-- (5, 'juan', 'https://api.dicebear.com/10.x/voxel-bot/svg?seed=stbl35dz'),
-- (6, 'fin', 'https://api.dicebear.com/10.x/voxel-bot/svg?seed=3chxm3da'),
-- (7, 'summer', 'https://api.dicebear.com/10.x/voxel-bot/svg?seed=0yx8prvt'),
-- (8, 'rick', 'https://api.dicebear.com/10.x/voxel-bot/svg?seed=dbmbz7f6'),
-- (9, 'bob', 'https://api.dicebear.com/10.x/voxel-bot/svg?seed=7h1o9lbw'),
-- (10, 'keirrison', 'https://api.dicebear.com/10.x/voxel-bot/svg?seed=08utww8d'),
-- (11, 'android', 'https://api.dicebear.com/10.x/voxel-bot/svg?seed=x2moihby');