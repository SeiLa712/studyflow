CREATE DATABASE IF NOT EXISTS StudyFlow;
USE StudyFlow;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    perfil ENUM('estudante'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE grupos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    disciplina VARCHAR(100) NOT NULL,
    descricao TEXT,
    prioridade ENUM('baixa', 'media', 'alta') DEFAULT 'media',
    id_usuario INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

CREATE TABLE grupo_membros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_grupo INT NOT NULL,
    id_usuario INT NOT NULL,
    data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_grupo)
        REFERENCES grupos(id)
        ON DELETE CASCADE,
    
    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    UNIQUE KEY unique_membro (id_grupo, id_usuario)
);

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

CREATE TABLE tarefas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    prioridade ENUM('baixa', 'media', 'alta') DEFAULT 'media',
    data_vencimento DATE,
    concluida BOOLEAN DEFAULT FALSE,

    id_usuario INT NOT NULL,
    id_grupo INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    FOREIGN KEY (id_grupo)
        REFERENCES grupos(id)
        ON DELETE SET NULL
);

CREATE TABLE provas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    prioridade ENUM('baixa', 'media', 'alta') DEFAULT 'media',

    data_prova DATE NOT NULL,

    id_usuario INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

CREATE TABLE pomodoros (
    id INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(100) NOT NULL,
    descricao TEXT,

    foco_min INT NOT NULL,
    pausa_min INT NOT NULL,

    ciclos INT DEFAULT 4,

    cor VARCHAR(20) DEFAULT '#6d5dfc',

    id_usuario INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

INSERT INTO usuarios(nome, email, senha, perfil)
VALUES(
	'Admin joao', 
    'adm@gmail.com', 
    '$2a$10$7aVzLkUBw5Re8aEIZtzwUOetRamaAfSU.BLxfe0L90cQuc8aw.Lq6', 
    'estudante'
);

