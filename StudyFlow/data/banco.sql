CREATE DATABASE IF NOT EXISTS StudyFlow;

USE StudyFlow;


SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS pomodoro_sessoes;
DROP TABLE IF EXISTS kanban_cards;
DROP TABLE IF EXISTS kanban_colunas;
DROP TABLE IF EXISTS kanbans;
DROP TABLE IF EXISTS grupo_arquivos;
DROP TABLE IF EXISTS grupo_sessoes;
DROP TABLE IF EXISTS grupo_membros;
DROP TABLE IF EXISTS tarefas;
DROP TABLE IF EXISTS pomodoros;
DROP TABLE IF EXISTS grupos;
DROP TABLE IF EXISTS usuarios;

SET FOREIGN_KEY_CHECKS = 1;

-- ===========================
-- USUÁRIOS
-- ===========================

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    foto VARCHAR(255) NULL,

    perfil ENUM('estudante') DEFAULT 'estudante',

    plano ENUM('free', 'premium') DEFAULT 'free',
    assinatura_ativa BOOLEAN DEFAULT FALSE,
    assinatura_expira_em DATETIME NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- GRUPOS
-- ===========================

CREATE TABLE grupos (
    id INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(100) NOT NULL,
    disciplina VARCHAR(100) NOT NULL,
    descricao TEXT,

    prioridade ENUM('baixa', 'media', 'alta') DEFAULT 'media',

    id_usuario INT NOT NULL,

    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

-- ===========================
-- MEMBROS DOS GRUPOS
-- ===========================

CREATE TABLE grupo_membros (
    id INT AUTO_INCREMENT PRIMARY KEY,

    id_grupo INT NOT NULL,
    id_usuario INT NOT NULL,

    papel ENUM('admin', 'membro') DEFAULT 'membro',
    status ENUM('ativo', 'pendente') DEFAULT 'ativo',

    data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_grupo)
        REFERENCES grupos(id)
        ON DELETE CASCADE,

    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    UNIQUE KEY grupo_usuario_unico (id_grupo, id_usuario)
);

-- ===========================
-- SESSÕES DOS GRUPOS
-- mantida por compatibilidade com o model
-- ===========================

CREATE TABLE grupo_sessoes (
    id INT AUTO_INCREMENT PRIMARY KEY,

    id_grupo INT NOT NULL,

    data_sessao DATE NOT NULL,
    hora_sessao TIME NOT NULL,
    descricao TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_grupo)
        REFERENCES grupos(id)
        ON DELETE CASCADE
);

-- ===========================
-- ARQUIVOS DOS GRUPOS
-- ===========================

CREATE TABLE grupo_arquivos (
    id INT AUTO_INCREMENT PRIMARY KEY,

    id_grupo INT NOT NULL,
    id_usuario INT NOT NULL,

    nome_original VARCHAR(255) NOT NULL,
    nome_arquivo VARCHAR(255) NOT NULL,
    caminho VARCHAR(255) NOT NULL,

    mime_type VARCHAR(100) NULL,
    tamanho_bytes INT DEFAULT 0,

    tipo VARCHAR(100) NULL,
    tamanho INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_grupo)
        REFERENCES grupos(id)
        ON DELETE CASCADE,

    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

-- ===========================
-- TAREFAS
-- ===========================

CREATE TABLE tarefas (
    id INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(100) NOT NULL,
    descricao TEXT,

    prioridade ENUM('baixa', 'media', 'alta') DEFAULT 'media',
    data_vencimento DATE,

    concluida BOOLEAN DEFAULT FALSE,
    concluida_em DATETIME NULL,

    id_usuario INT NOT NULL,
    id_grupo INT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    FOREIGN KEY (id_grupo)
        REFERENCES grupos(id)
        ON DELETE SET NULL
);

-- ===========================
-- POMODOROS
-- ===========================

CREATE TABLE pomodoros (
    id INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(100) NOT NULL,
    descricao TEXT,

    foco_min INT NOT NULL DEFAULT 25,
    pausa_min INT NOT NULL DEFAULT 5,
    ciclos INT DEFAULT 4,

    cor VARCHAR(30) DEFAULT '#6366f1',

    id_usuario INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

-- ===========================
-- SESSÕES POMODORO CONCLUÍDAS
-- ===========================

CREATE TABLE pomodoro_sessoes (
    id INT AUTO_INCREMENT PRIMARY KEY,

    id_usuario INT NOT NULL,

    duracao_min INT NOT NULL,
    origem VARCHAR(50) DEFAULT 'pomodoro',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

-- ===========================
-- KANBANS
-- ===========================

CREATE TABLE kanbans (
    id INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(100) NOT NULL,
    descricao TEXT,

    id_usuario INT NOT NULL,

    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

-- ===========================
-- COLUNAS DO KANBAN
-- ===========================

CREATE TABLE kanban_colunas (
    id INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(100) NOT NULL,

    ordem INT DEFAULT 0,
    posicao INT DEFAULT 0,

    id_kanban INT NOT NULL,

    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_kanban)
        REFERENCES kanbans(id)
        ON DELETE CASCADE
);

-- ===========================
-- CARDS DO KANBAN
-- ===========================

CREATE TABLE kanban_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,

    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,

    prioridade ENUM('baixa', 'media', 'alta') DEFAULT 'media',
    data_entrega DATE NULL,

    progresso INT DEFAULT 0,
    posicao INT DEFAULT 0,

    id_coluna INT NOT NULL,

    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_coluna)
        REFERENCES kanban_colunas(id)
        ON DELETE CASCADE
);

-- ===========================
-- USUÁRIOS PADRÃO
-- senha dos dois: 123456
-- bcrypt fator 10
-- ===========================

INSERT INTO usuarios
(
    id,
    nome,
    email,
    senha,
    perfil,
    plano,
    assinatura_ativa,
    assinatura_expira_em
)
VALUES
(
    1,
    'Usuário Assinante',
    'premium@studyflow.com',
    '$2b$10$6FG.Au0xR.hGjkXSLe/sCuLOBEE/lWDcQUlEmThMw2f5izAhv/UtC',
    'estudante',
    'premium',
    TRUE,
    DATE_ADD(NOW(), INTERVAL 30 DAY)
),
(
    2,
    'Usuário Gratuito',
    'free@studyflow.com',
    '$2b$10$6FG.Au0xR.hGjkXSLe/sCuLOBEE/lWDcQUlEmThMw2f5izAhv/UtC',
    'estudante',
    'free',
    FALSE,
    NULL
);

-- ===========================
-- DADOS DO USUÁRIO ASSINANTE
-- ===========================

INSERT INTO grupos
(
    id,
    nome,
    disciplina,
    descricao,
    prioridade,
    id_usuario
)
VALUES
(
    1,
    'Grupo de Estudos',
    'Desenvolvimento de Sistemas',
    'Grupo principal para organizar atividades e materiais de estudo.',
    'alta',
    1
);

INSERT INTO grupo_membros
(
    id_grupo,
    id_usuario,
    papel,
    status
)
VALUES
(
    1,
    1,
    'admin',
    'ativo'
);

INSERT INTO grupo_sessoes
(
    id_grupo,
    data_sessao,
    hora_sessao,
    descricao
)
VALUES
(
    1,
    DATE_ADD(CURDATE(), INTERVAL 2 DAY),
    '19:00:00',
    'Reunião de estudos para revisar o projeto.'
);

INSERT INTO tarefas
(
    nome,
    descricao,
    prioridade,
    data_vencimento,
    concluida,
    concluida_em,
    id_usuario,
    id_grupo
)
VALUES
(
    'Finalizar relatório do StudyFlow',
    'Revisar os dados da semana e validar os relatórios inteligentes.',
    'alta',
    CURDATE(),
    FALSE,
    NULL,
    1,
    1
),
(
    'Revisar layout do calendário',
    'Ajustar detalhes visuais da tela de calendário.',
    'media',
    DATE_SUB(CURDATE(), INTERVAL 1 DAY),
    TRUE,
    NOW(),
    1,
    1
),
(
    'Preparar apresentação do projeto',
    'Organizar os principais pontos para apresentação do StudyFlow.',
    'baixa',
    DATE_ADD(CURDATE(), INTERVAL 5 DAY),
    FALSE,
    NULL,
    1,
    NULL
);

INSERT INTO pomodoros
(
    nome,
    descricao,
    foco_min,
    pausa_min,
    ciclos,
    cor,
    id_usuario
)
VALUES
(
    'Sessão de Foco',
    'Pomodoro padrão para estudos.',
    25,
    5,
    4,
    '#6366f1',
    1
);

INSERT INTO pomodoro_sessoes
(
    id_usuario,
    duracao_min,
    origem
)
VALUES
(
    1,
    25,
    'pomodoro'
),
(
    1,
    25,
    'timer-rapido'
);

INSERT INTO kanbans
(
    id,
    nome,
    descricao,
    id_usuario
)
VALUES
(
    1,
    'Meu Kanban',
    'Quadro principal para organizar tarefas do projeto.',
    1
);

INSERT INTO kanban_colunas
(
    id,
    nome,
    ordem,
    posicao,
    id_kanban
)
VALUES
(
    1,
    'A Fazer',
    1,
    1,
    1
),
(
    2,
    'Em Andamento',
    2,
    2,
    1
),
(
    3,
    'Revisão',
    3,
    3,
    1
),
(
    4,
    'Concluído',
    4,
    4,
    1
);

INSERT INTO kanban_cards
(
    titulo,
    descricao,
    prioridade,
    data_entrega,
    progresso,
    posicao,
    id_coluna
)
VALUES
(
    'Organizar tarefas do TCC',
    'Separar as próximas etapas do projeto.',
    'alta',
    DATE_ADD(CURDATE(), INTERVAL 2 DAY),
    20,
    1,
    1
),
(
    'Ajustar relatório inteligente',
    'Melhorar a exibição dos dados de produtividade.',
    'media',
    DATE_ADD(CURDATE(), INTERVAL 4 DAY),
    60,
    1,
    2
);

-- ===========================
-- DADOS DO USUÁRIO GRATUITO
-- ===========================

INSERT INTO grupos
(
    id,
    nome,
    disciplina,
    descricao,
    prioridade,
    id_usuario
)
VALUES
(
    2,
    'Grupo de Estudos',
    'Estudos Gerais',
    'Grupo principal para organizar estudos e atividades.',
    'media',
    2
);

INSERT INTO grupo_membros
(
    id_grupo,
    id_usuario,
    papel,
    status
)
VALUES
(
    2,
    2,
    'admin',
    'ativo'
);

INSERT INTO grupo_sessoes
(
    id_grupo,
    data_sessao,
    hora_sessao,
    descricao
)
VALUES
(
    2,
    DATE_ADD(CURDATE(), INTERVAL 3 DAY),
    '18:30:00',
    'Sessão de estudos gerais.'
);

INSERT INTO tarefas
(
    nome,
    descricao,
    prioridade,
    data_vencimento,
    concluida,
    concluida_em,
    id_usuario,
    id_grupo
)
VALUES
(
    'Organizar rotina de estudos',
    'Criar uma rotina semanal usando o StudyFlow.',
    'media',
    DATE_ADD(CURDATE(), INTERVAL 1 DAY),
    FALSE,
    NULL,
    2,
    2
),
(
    'Criar primeira tarefa',
    'Atividade concluída para testar o painel inicial.',
    'baixa',
    CURDATE(),
    TRUE,
    NOW(),
    2,
    NULL
);

INSERT INTO pomodoros
(
    nome,
    descricao,
    foco_min,
    pausa_min,
    ciclos,
    cor,
    id_usuario
)
VALUES
(
    'Sessão de Foco',
    'Pomodoro padrão para estudos.',
    25,
    5,
    4,
    '#6366f1',
    2
);

INSERT INTO kanbans
(
    id,
    nome,
    descricao,
    id_usuario
)
VALUES
(
    2,
    'Meu Kanban',
    'Quadro principal para organizar tarefas.',
    2
);

INSERT INTO kanban_colunas
(
    id,
    nome,
    ordem,
    posicao,
    id_kanban
)
VALUES
(
    5,
    'A Fazer',
    1,
    1,
    2
),
(
    6,
    'Em Andamento',
    2,
    2,
    2
),
(
    7,
    'Revisão',
    3,
    3,
    2
),
(
    8,
    'Concluído',
    4,
    4,
    2
);

INSERT INTO kanban_cards
(
    titulo,
    descricao,
    prioridade,
    data_entrega,
    progresso,
    posicao,
    id_coluna
)
VALUES
(
    'Planejar semana de estudos',
    'Criar cards para organizar as tarefas da semana.',
    'baixa',
    DATE_ADD(CURDATE(), INTERVAL 3 DAY),
    10,
    1,
    5
);

INSERT INTO usuarios
(
    id,
    nome,
    email,
    senha,
    perfil,
    plano,
    assinatura_ativa,
    assinatura_expira_em
)
VALUES
(
    3,
    'Usuário Premium sem nada',
    'premium.novo@studyflow.com',
    '$2b$10$6FG.Au0xR.hGjkXSLe/sCuLOBEE/lWDcQUlEmThMw2f5izAhv/UtC',
    'estudante',
    'premium',
    TRUE,
    DATE_ADD(NOW(), INTERVAL 30 DAY)
);

-- Premium:
-- email: premium@studyflow.com
-- senha: 123456

-- Premium com nada registrado:
-- email: premium.novo@studyflow.com
-- senha: 123456

-- Free:
-- email: free@studyflow.com
-- senha: 123456