    CREATE DATABASE IF NOT EXISTS StudyFlow;

  USE StudyFlow;


    SET FOREIGN_KEY_CHECKS = 0;

    DROP TABLE IF EXISTS metas_semanais;
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
    -- METAS SEMANAIS
    -- ===========================

    CREATE TABLE metas_semanais (
        id INT AUTO_INCREMENT PRIMARY KEY,

        id_usuario INT NOT NULL,

        titulo VARCHAR(120) NOT NULL,
        descricao TEXT NULL,

        tipo ENUM('tarefas', 'foco', 'atrasos') NOT NULL DEFAULT 'tarefas',

        valor_meta INT NOT NULL DEFAULT 1,
        unidade VARCHAR(30) DEFAULT 'tarefas',

        ativo BOOLEAN DEFAULT TRUE,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        FOREIGN KEY (id_usuario)
            REFERENCES usuarios(id)
            ON DELETE CASCADE
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
    -- DADOS PARA APRESENTAÇÃO DO TCC
    -- Senha de todos os usuários: 123456
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
        'apresentador - Apresentação',
        'adm@studyflow.com',
        '$2b$10$6FG.Au0xR.hGjkXSLe/sCuLOBEE/lWDcQUlEmThMw2f5izAhv/UtC',
        'estudante',
        'premium',
        TRUE,
        DATE_ADD(NOW(), INTERVAL 60 DAY)
    ),
    (
        2,
        'Usuário Gratuito - Teste',
        'free@studyflow.com',
        '$2b$10$6FG.Au0xR.hGjkXSLe/sCuLOBEE/lWDcQUlEmThMw2f5izAhv/UtC',
        'estudante',
        'free',
        FALSE,
        NULL
    ),
    (
        3,
        'Ana Clara',
        'ana@studyflow.com',
        '$2b$10$6FG.Au0xR.hGjkXSLe/sCuLOBEE/lWDcQUlEmThMw2f5izAhv/UtC',
        'estudante',
        'premium',
        TRUE,
        DATE_ADD(NOW(), INTERVAL 60 DAY)
    ),
    (
        4,
        'Miguel Pacheco',
        'miguel@studyflow.com',
        '$2b$10$6FG.Au0xR.hGjkXSLe/sCuLOBEE/lWDcQUlEmThMw2f5izAhv/UtC',
        'estudante',
        'premium',
        TRUE,
        DATE_ADD(NOW(), INTERVAL 60 DAY)
    ),
    (
        5,
        'Pedro Henrique',
        'pedro@studyflow.com',
        '$2b$10$6FG.Au0xR.hGjkXSLe/sCuLOBEE/lWDcQUlEmThMw2f5izAhv/UtC',
        'estudante',
        'free',
        FALSE,
        NULL
    );

    -- ===========================
    -- METAS SEMANAIS
    -- ===========================

    INSERT INTO metas_semanais
    (
        id_usuario,
        titulo,
        descricao,
        tipo,
        valor_meta,
        unidade
    )
    VALUES
    (
        1,
        'Concluir tarefas da semana',
        'Finalizar as principais atividades acadêmicas cadastradas no sistema.',
        'tarefas',
        8,
        'tarefas'
    ),
    (
        1,
        'Estudar com Pomodoro',
        'Atingir pelo menos 180 minutos de foco usando o Pomodoro.',
        'foco',
        180,
        'minutos'
    ),
    (
        1,
        'Evitar atrasos',
        'Manter no máximo uma tarefa atrasada durante a semana.',
        'atrasos',
        1,
        'atrasos'
    ),
    (
        1,
        'Preparar apresentação',
        'Organizar a apresentação final do projeto StudyFlow.',
        'tarefas',
        4,
        'tarefas'
    ),
    (
        1,
        'Revisar documentação',
        'Conferir README, relatório técnico, PMC e roteiro de apresentação.',
        'tarefas',
        3,
        'tarefas'
    ),
    (
        2,
        'Criar rotina básica',
        'Organizar algumas atividades simples para testar a versão gratuita.',
        'tarefas',
        3,
        'tarefas'
    ),
    (
        2,
        'Foco inicial',
        'Realizar pelo menos 60 minutos de estudo.',
        'foco',
        60,
        'minutos'
    );

    -- ===========================
    -- GRUPOS DO USUÁRIO PREMIUM
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
        'TCC - StudyFlow',
        'Desenvolvimento de Sistemas',
        'Grupo principal para organizar o desenvolvimento, testes e apresentação do TCC.',
        'alta',
        1
    ),
    (
        2,
        'Revisão Banco de Dados',
        'Banco de Dados',
        'Grupo destinado à revisão das tabelas, relacionamentos e scripts SQL do sistema.',
        'media',
        1
    ),
    (
        3,
        'Preparação para Banca',
        'Projeto Integrador',
        'Grupo usado para organizar ensaio, roteiro de apresentação e possíveis perguntas da banca.',
        'alta',
        1
    );

    -- ===========================
    -- MEMBROS DOS GRUPOS
    -- ===========================

    INSERT INTO grupo_membros
    (
        id_grupo,
        id_usuario,
        papel,
        status
    )
    VALUES
    (1, 1, 'admin', 'ativo'),
    (1, 3, 'membro', 'ativo'),
    (1, 4, 'membro', 'ativo'),
    (1, 5, 'membro', 'ativo'),

    (2, 1, 'admin', 'ativo'),
    (2, 3, 'membro', 'ativo'),

    (3, 1, 'admin', 'ativo'),
    (3, 4, 'membro', 'ativo'),
    (3, 5, 'membro', 'ativo');

    -- ===========================
    -- SESSÕES DOS GRUPOS
    -- ===========================

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
        DATE_ADD(CURDATE(), INTERVAL 1 DAY),
        '18:30:00',
        'Reunião para revisar funcionalidades do StudyFlow antes da apresentação.'
    ),
    (
        1,
        DATE_ADD(CURDATE(), INTERVAL 3 DAY),
        '19:00:00',
        'Validação final do fluxo de login, tarefas, calendário, Kanban e relatórios.'
    ),
    (
        2,
        DATE_ADD(CURDATE(), INTERVAL 2 DAY),
        '17:30:00',
        'Revisão das tabelas, chaves estrangeiras e dados de demonstração.'
    ),
    (
        3,
        DATE_ADD(CURDATE(), INTERVAL 4 DAY),
        '20:00:00',
        'Ensaio geral da apresentação para a banca.'
    );

    -- ===========================
    -- TAREFAS DO USUÁRIO PREMIUM
    -- ===========================

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
        'Finalizar slides da apresentação',
        'Revisar os slides do Canva e alinhar a fala da equipe.',
        'alta',
        DATE_ADD(CURDATE(), INTERVAL 1 DAY),
        FALSE,
        NULL,
        1,
        3
    ),
    (
        'Testar login premium e gratuito',
        'Entrar com usuário premium e usuário free para demonstrar o bloqueio de recursos.',
        'alta',
        CURDATE(),
        FALSE,
        NULL,
        1,
        NULL
    ),
    (
        'Revisar middleware de assinatura',
        'Garantir que grupos e recursos premium sejam bloqueados para usuários gratuitos.',
        'alta',
        DATE_ADD(CURDATE(), INTERVAL 2 DAY),
        TRUE,
        NOW(),
        1,
        1
    ),
    (
        'Conferir banco de dados',
        'Validar se usuários, tarefas, grupos, metas e Kanban estão cadastrados corretamente.',
        'media',
        DATE_ADD(CURDATE(), INTERVAL 2 DAY),
        FALSE,
        NULL,
        1,
        2
    ),
    (
        'Gravar vídeo de testes',
        'Demonstrar o funcionamento das principais telas do StudyFlow.',
        'media',
        DATE_SUB(CURDATE(), INTERVAL 1 DAY),
        TRUE,
        DATE_SUB(NOW(), INTERVAL 1 DAY),
        1,
        1
    ),
    (
        'Enviar relatório técnico',
        'Enviar o relatório técnico e o PMC para o docente antes da apresentação.',
        'alta',
        DATE_SUB(CURDATE(), INTERVAL 2 DAY),
        TRUE,
        DATE_SUB(NOW(), INTERVAL 2 DAY),
        1,
        NULL
    ),
    (
        'Corrigir pequenos ajustes visuais',
        'Revisar espaçamentos, sidebar, cards e tema escuro.',
        'media',
        DATE_ADD(CURDATE(), INTERVAL 3 DAY),
        FALSE,
        NULL,
        1,
        NULL
    ),
    (
        'Preparar respostas da banca',
        'Treinar perguntas sobre problema, solução, banco, segurança e modelo premium.',
        'alta',
        DATE_ADD(CURDATE(), INTERVAL 4 DAY),
        FALSE,
        NULL,
        1,
        3
    ),
    (
        'Atualizar README do GitHub',
        'Conferir tecnologias, funcionalidades, prints e instruções de execução.',
        'baixa',
        DATE_ADD(CURDATE(), INTERVAL 5 DAY),
        FALSE,
        NULL,
        1,
        NULL
    ),
    (
        'Tarefa atrasada de exemplo',
        'Exemplo para demonstrar alerta de atraso nas notificações e relatórios.',
        'alta',
        DATE_SUB(CURDATE(), INTERVAL 3 DAY),
        FALSE,
        NULL,
        1,
        NULL
    ),
    (
        'Validar tela de grupos',
        'Testar criação de grupos, membros e sessões de estudo.',
        'media',
        CURDATE(),
        FALSE,
        NULL,
        1,
        1
    ),
    (
        'Ensaiar apresentação final',
        'Simular a apresentação completa do projeto para ganhar segurança.',
        'alta',
        DATE_ADD(CURDATE(), INTERVAL 6 DAY),
        FALSE,
        NULL,
        1,
        3
    );

    -- ===========================
    -- TAREFAS DO USUÁRIO GRATUITO
    -- ===========================

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
        'Criar primeira atividade',
        'Teste simples da versão gratuita do StudyFlow.',
        'baixa',
        CURDATE(),
        TRUE,
        NOW(),
        2,
        NULL
    ),
    (
        'Organizar semana de estudos',
        'Cadastrar atividades básicas e visualizar no calendário.',
        'media',
        DATE_ADD(CURDATE(), INTERVAL 2 DAY),
        FALSE,
        NULL,
        2,
        NULL
    ),
    (
        'Tentar acessar grupos premium',
        'Usado na apresentação para demonstrar bloqueio de usuário gratuito.',
        'alta',
        DATE_ADD(CURDATE(), INTERVAL 1 DAY),
        FALSE,
        NULL,
        2,
        NULL
    );

    -- ===========================
    -- POMODOROS
    -- ===========================

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
        'Foco padrão',
        'Sessão padrão de estudos com 25 minutos de foco e 5 minutos de pausa.',
        25,
        5,
        4,
        '#6366f1',
        1
    ),
    (
        'Revisão rápida',
        'Sessão curta para revisar conteúdos antes da apresentação.',
        15,
        5,
        3,
        '#22c55e',
        1
    ),
    (
        'Estudo profundo',
        'Sessão mais longa para desenvolvimento e correções do projeto.',
        50,
        10,
        2,
        '#f97316',
        1
    ),
    (
        'Pomodoro gratuito',
        'Sessão simples para o usuário gratuito.',
        25,
        5,
        4,
        '#6366f1',
        2
    );

    -- ===========================
    -- SESSÕES POMODORO CONCLUÍDAS
    -- ===========================

    INSERT INTO pomodoro_sessoes
    (
        id_usuario,
        duracao_min,
        origem,
        created_at
    )
    VALUES
    (1, 25, 'pomodoro', DATE_SUB(NOW(), INTERVAL 6 DAY)),
    (1, 25, 'pomodoro', DATE_SUB(NOW(), INTERVAL 5 DAY)),
    (1, 50, 'pomodoro', DATE_SUB(NOW(), INTERVAL 4 DAY)),
    (1, 15, 'pomodoro', DATE_SUB(NOW(), INTERVAL 3 DAY)),
    (1, 25, 'timer-rapido', DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (1, 50, 'pomodoro', DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (1, 25, 'pomodoro', NOW()),
    (1, 15, 'timer-rapido', NOW()),

    (2, 25, 'pomodoro', DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (2, 25, 'timer-rapido', NOW());

    -- ===========================
    -- KANBANS
    -- ===========================

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
        'TCC StudyFlow',
        'Quadro principal para acompanhar o desenvolvimento e apresentação do projeto.',
        1
    ),
    (
        2,
        'Rotina de Estudos',
        'Quadro pessoal para organizar estudos semanais.',
        1
    ),
    (
        3,
        'Kanban Free',
        'Quadro simples para usuário gratuito.',
        2
    );

    -- ===========================
    -- COLUNAS DO KANBAN
    -- ===========================

    INSERT INTO kanban_colunas
    (
        id,
        nome,
        ordem,
        posicao,
        id_kanban
    )
    VALUES
    (1, 'A Fazer', 1, 1, 1),
    (2, 'Em Andamento', 2, 2, 1),
    (3, 'Revisão', 3, 3, 1),
    (4, 'Concluído', 4, 4, 1),

    (5, 'A Fazer', 1, 1, 2),
    (6, 'Em Andamento', 2, 2, 2),
    (7, 'Revisão', 3, 3, 2),
    (8, 'Concluído', 4, 4, 2),

    (9, 'A Fazer', 1, 1, 3),
    (10, 'Em Andamento', 2, 2, 3),
    (11, 'Revisão', 3, 3, 3),
    (12, 'Concluído', 4, 4, 3);

    -- ===========================
    -- CARDS DO KANBAN
    -- ===========================

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
        'Implementar bloqueio premium em grupos',
        'Garantir que apenas usuários premium acessem a área de grupos.',
        'alta',
        DATE_ADD(CURDATE(), INTERVAL 1 DAY),
        80,
        1,
        2
    ),
    (
        'Revisar autenticação JWT',
        'Conferir login, logout, cookies e proteção de rotas privadas.',
        'alta',
        DATE_ADD(CURDATE(), INTERVAL 2 DAY),
        70,
        2,
        2
    ),
    (
        'Organizar banco para apresentação',
        'Criar dados prontos para demonstrar tarefas, metas, grupos e Kanban.',
        'alta',
        CURDATE(),
        90,
        1,
        3
    ),
    (
        'Finalizar documentação',
        'Revisar README, PMC e relatório técnico.',
        'media',
        DATE_ADD(CURDATE(), INTERVAL 3 DAY),
        60,
        2,
        3
    ),
    (
        'Testar tela de relatórios',
        'Validar gráficos, dados semanais, sugestões e exportação em PDF.',
        'media',
        DATE_ADD(CURDATE(), INTERVAL 4 DAY),
        40,
        1,
        1
    ),
    (
        'Preparar fala da banca',
        'Treinar explicação sobre problema, solução, tecnologia e segurança.',
        'alta',
        DATE_ADD(CURDATE(), INTERVAL 5 DAY),
        30,
        2,
        1
    ),
    (
        'Criar protótipo de baixa fidelidade',
        'Entregar material inicial da prototipagem.',
        'baixa',
        DATE_SUB(CURDATE(), INTERVAL 4 DAY),
        100,
        1,
        4
    ),
    (
        'Gravar demonstração do sistema',
        'Vídeo mostrando funcionalidades principais do StudyFlow.',
        'media',
        DATE_SUB(CURDATE(), INTERVAL 2 DAY),
        100,
        2,
        4
    ),
    (
        'Estudar banco de dados',
        'Revisar relacionamentos, foreign keys e comandos SQL.',
        'media',
        DATE_ADD(CURDATE(), INTERVAL 2 DAY),
        20,
        1,
        5
    ),
    (
        'Revisar Node.js e Express',
        'Revisar controllers, routes, middlewares e models.',
        'alta',
        DATE_ADD(CURDATE(), INTERVAL 3 DAY),
        50,
        1,
        6
    ),
    (
        'Treinar perguntas da banca',
        'Praticar respostas sobre segurança, testes e melhorias futuras.',
        'alta',
        DATE_ADD(CURDATE(), INTERVAL 4 DAY),
        70,
        1,
        7
    ),
    (
        'Concluir revisão de CSS',
        'Verificar responsividade e tema escuro.',
        'baixa',
        DATE_SUB(CURDATE(), INTERVAL 1 DAY),
        100,
        1,
        8
    ),
    (
        'Criar tarefa de estudo',
        'Card simples da versão gratuita.',
        'baixa',
        DATE_ADD(CURDATE(), INTERVAL 1 DAY),
        10,
        1,
        9
    ),
    (
        'Testar calendário',
        'Verificar se as atividades aparecem no calendário.',
        'media',
        DATE_ADD(CURDATE(), INTERVAL 2 DAY),
        40,
        1,
        10
    );

    -- ===========================
    -- LOGINS PARA APRESENTAÇÃO
    -- ===========================

    -- Usuário premium principal:
    -- email: adm@studyflow.com
    -- senha: 123456

    -- Usuário gratuito para demonstrar bloqueio premium:
    -- email: free@studyflow.com
    -- senha: 123456

    -- Outros usuários de exemplo:
    -- email: ana@studyflow.com
    -- senha: 123456

    -- email: miguel@studyflow.com
    -- senha: 123456

    -- email: pedro@studyflow.com
    -- senha: 123456

    -- ===========================
    -- MÓDULOS USADOS NO RELATÓRIO
    -- ===========================

    -- reportlab
    -- mysql.connector
    -- python
