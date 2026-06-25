CREATE DATABASE IF NOT EXISTS StudyFlow;
USE StudyFlow;
-- ===========================
-- USUÁRIOS
-- ===========================

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    perfil ENUM('estudante') DEFAULT 'estudante',
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- GRUPOS
-- ===========================

CREATE TABLE IF NOT EXISTS grupos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    disciplina VARCHAR(100) NOT NULL,
    descricao TEXT,
    prioridade ENUM('baixa', 'media', 'alta') DEFAULT 'media',

    ativo BOOLEAN DEFAULT TRUE,

    id_usuario INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS grupo_membros (
    id INT AUTO_INCREMENT PRIMARY KEY,

    id_grupo INT NOT NULL,
    id_usuario INT NOT NULL,

    ativo BOOLEAN DEFAULT TRUE,

    data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_grupo)
        REFERENCES grupos(id)
        ON DELETE CASCADE,

    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    UNIQUE KEY unique_membro (id_grupo, id_usuario)
);

CREATE TABLE IF NOT EXISTS grupo_arquivos (
    id INT AUTO_INCREMENT PRIMARY KEY,

    id_grupo INT NOT NULL,
    id_usuario INT NOT NULL,

    nome_original VARCHAR(255) NOT NULL,
    nome_arquivo VARCHAR(255) NOT NULL,
    caminho VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100),
    tamanho_bytes INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_grupo)
        REFERENCES grupos(id)
        ON DELETE CASCADE,

    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

-- ===========================
-- POMODOROS
-- ===========================

CREATE TABLE IF NOT EXISTS pomodoros (
    id INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(100) NOT NULL,
    descricao TEXT,

    foco_min INT NOT NULL,
    pausa_min INT NOT NULL,

    ciclos INT DEFAULT 4,

    cor VARCHAR(20) DEFAULT '#6d5dfc',

    ativo BOOLEAN DEFAULT TRUE,

    id_usuario INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

-- ===========================
-- KANBANS
-- ===========================

CREATE TABLE IF NOT EXISTS kanbans (
    id INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(100) NOT NULL,
    descricao TEXT,

    cor VARCHAR(20) DEFAULT '#6d5dfc',

    ativo BOOLEAN DEFAULT TRUE,

    id_usuario INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

-- ===========================
-- COLUNAS DO KANBAN
-- ===========================

CREATE TABLE IF NOT EXISTS kanban_colunas (
    id INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(50) NOT NULL,

    ordem INT NOT NULL,

    ativo BOOLEAN DEFAULT TRUE,

    id_kanban INT NOT NULL,

    FOREIGN KEY (id_kanban)
        REFERENCES kanbans(id)
        ON DELETE CASCADE
);

-- ===========================
-- CARDS DO KANBAN
-- ===========================

CREATE TABLE IF NOT EXISTS kanban_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,

    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,

    prioridade ENUM('baixa', 'media', 'alta')
    DEFAULT 'media',

    data_entrega DATE,

    progresso INT DEFAULT 0,

    ordem INT DEFAULT 0,

    ativo BOOLEAN DEFAULT TRUE,

    id_coluna INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_coluna)
        REFERENCES kanban_colunas(id)
        ON DELETE CASCADE
);

-- ===========================
-- USUÁRIO PADRÃO
-- ===========================

INSERT INTO usuarios (
    nome,
    email,
    senha,
    perfil
)
VALUES (
    'Admin joao',
    'adm@gmail.com',
    '$2a$10$7aVzLkUBw5Re8aEIZtzwUOetRamaAfSU.BLxfe0L90cQuc8aw.Lq6',
    'estudante'
);