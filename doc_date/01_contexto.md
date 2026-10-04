# Passos 1 a 3 — Contexto, minimundo e requisitos

Marco M1. Copiem para `entregas/01-contexto.md`.

## 1. Introdução e contexto

# Verdade ou bug é um trivia de verdadeiro ou falso onde o público são estudantes na amostra de tecnologia. O trivia contém afirmações sobre a área geral da tecnologia, onde o banco guarda as questões com suas respostas, categoria, explicação, nível, fonte bibliográfica e quantidade de pontos de cada pergunta

------------------------------------------------------------------------------
Escopo. Listem só o que o banco faz e o que fica de fora.

| O banco faz |

# Ele guarda as perguntas, a resposta, a categoria, a explicação, o nível de dificuldade, a fonte e quantos pontos vale a questão

# Ele guarda o nome do usuário e quantidade de pontos obtidos

# Ele guarda o ID dos icones 

# Ele guarda a quantidade de pontos que o usuário obteve e o icone utilizado para mostrar no ranking

# Ele guarda o histórico de respostas do usuário e o ranking obtido.

# Ele seleciona aleatoriamente as questões dentro do banco

------------------------------------------------------------------------------


O banco não faz |
| --- | --- |


# Não gera questões automaticamente. Quem cadastra é por fora 

# Não possui tela visivel para o usuário


------------------------------------------------------------------------------
Usuários. Quem usa o sistema e o que cada um faz com os dados. Não criem tabela de usuário se nenhum requisito pedir cadastro, senha ou sessão.

| Usuário | O que faz |

# Se registra no sistema, colocando nome e selecionando o ícone de perfil



------------------------------------------------------------------------------
| Jogador | |

# Responde as perguntas

# Verifica seu resultado

# Pode consultar o rank

# Pode refazer o Trivia para mudar sua pontuação

------------------------------------------------------------------------------
| Quem cadastra perguntas | |

# Quem cadastra as perguntas são a equipe por trás do Trivia, as pessoas do grupo 4


------------------------------------------------------------------------------


## 2. Minimundo

Um ou dois parágrafos, na voz de quem encomenda o sistema. É deste texto que saem as entidades e as regras. Cubram pergunta, categoria, fonte, publicador, idioma e alternativas, inclusive a possibilidade de mais de duas alternativas no futuro.

>O sistema de Trivia deverá iniciar pelo registro do nome e a escolha do ícone do usuário onde as informações do usuário serão cadastradas e armazenadas. Após o acesso, a interface será exibida e o usuário poderá responder perguntas relacionadas à tecnologia. As perguntas serão em português e deverão possuir uma categoria, fonte, opção de verdadeiro ou falso. As categorias serão relacionadas à área de Tecnologia e Inovação, abrangendo diferentes temas do universo tecnológico.


>O Trivia será dividido em 10 questões por sessão (terão 90 no total e 10 questões aleatórias serão puxadas do banco de dados). A cada etapa concluída, o usuário ganhará 100 pontos por questão acertada, totalizando 1.000 pontos no total caso o usuário acerte todas as questões. O sistema deverá registrar as respostas e a pontuação do usuário. Ao final do Trivia, a pontuação alcançada pelo usuário será exibida, juntamente com um ranking que apresentará sua posição em comparação com os demais participantes.



## 3. Requisitos e regras de negócio

Cada RD01–RD11 e cada RA01–RA07 entra numa linha. Não deixem código de fora.

| Código | Texto do requisito | Tipo |
| --- | --- | --- |
| | | funcional / não funcional / regra de negócio |
----------------------------------------------------------------------------------------------------------------------------------------------------
# Código	Texto do requisito	Tipo
# RD01	O sistema deverá permitir o cadastro do nome e ícone do usuário	                                        |funcional|

# RD02	O sistema deverá exibir a interface principal do Trivia após o cadastro.	                                    |funcional|

# RD03	O sistema deverá apresentar perguntas relacionadas à área de Tecnologia e Inovação.	                        |funcional|

# RD04	O sistema deverá apresentar 10 questões por sessão.	                                                    |funcional|

# RD05	O sistema deverá permitir que o usuário selecione uma alternativa para cada pergunta.	                    |funcional|

# RD06	O sistema deverá registrar as respostas fornecidas pelo usuário.	                                        |funcional|

# RD07	O sistema deverá calcular e exibir a pontuação do usuário.	                                                |funcional|

# RD08	O sistema deverá permitir o acesso às 9 etapas do Trivia.	                                                |funcional|

# RD09	O sistema deverá armazenar as perguntas, suas categorias, fontes, publicadores, idiomas e alternativas.	    |funcional|

# RD10	O sistema deverá apresentar as perguntas no idioma português.	                                            |funcional|

# RD11	O sistema deverá registrar o resultado do usuário ao finalizar as etapas.	                                |funcional|

# RA01	Cada pergunta deverá possuir uma categoria relacionada à área de Tecnologia e Inovação.	                    |regra de negócio|

# RA02	Cada pergunta deverá possuir uma fonte e um publicador.	                                                    |regra de negócio|
 
# RA03	Cada pergunta deverá possuir alternativas de resposta. (verdadeiro ou falso)                                |regra de negócio|

# RA04	Cada resposta correta deverá valer 100 pontos.                                                   |regra de negócio|

# RA05	Cada etapa deverá possuir exatamente 10 questões.	                                                        |regra de negócio|

# RA06	O Trivia deverá possuir 9 etapas, totalizando 90 questões.	                                                | regra de negócio |

# RA07	A pontuação máxima do Trivia será de 1.000 pontos, considerando 100 pontos por questão respondida corretamente, em um total de 10 questões por sessão.	|Regra de negócio|

----------------------------------------------------------------------------------------------------------------------------------------------------
Não funcional inclui, no mínimo, o SGBD e a integridade (o que não pode duplicar nem ficar nulo).

# Os dados obrigatórios das entidades não poderão ficar nulos e os registros que exigem unicidade não poderão ser duplicados.     |não funcional|