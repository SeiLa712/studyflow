CREATE DATABASE IF NOT EXISTS StudyFlow;

USE StudyFlow;

CREATE TABLE usuarios(
	id INT AUTO_INCREMENT PRIMARY KEY,
	nome VARCHAR(100),
    email VARCHAR(100),
    senha VARCHAR(255),
    perfil ENUM('administrador', 'estudante')
);

CREATE TABLE tarefas(
	id INT AUTO_INCREMENT PRIMARY KEY,
	nome VARCHAR(100),
	descricao TEXT,
    prioridade ENUM('baixa', 'media', 'alta') DEFAULT 'media',	
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
    
);