# StudyFlow

O StudyFlow é uma plataforma web desenvolvida para ajudar estudantes a organizarem melhor sua rotina acadêmica. A ideia do sistema é reunir, em um só lugar, ferramentas importantes para planejamento de estudos, acompanhamento de tarefas, organização de grupos, controle de foco e análise de produtividade.

O projeto foi criado como uma solução prática para estudantes que precisam visualizar suas atividades, controlar prazos, estudar com mais concentração e acompanhar sua evolução ao longo da semana. Além das funcionalidades tradicionais de organização, o StudyFlow também utiliza Python para gerar relatórios inteligentes e exportar análises em PDF.

## Funcionalidades principais

### Autenticação de usuários

O sistema possui cadastro, login e logout de usuários, com autenticação protegida por token. Cada usuário acessa apenas suas próprias informações, como tarefas, grupos, calendário, Kanban e relatórios.

### Página inicial

A página inicial funciona como um painel de controle do estudante. Nela, o usuário consegue visualizar suas próximas atividades, acompanhar tarefas pendentes e acessar rapidamente as principais áreas do sistema.

### Calendário acadêmico

O calendário permite visualizar atividades por mês, navegar entre meses e anos, criar novas atividades em datas específicas e editar tarefas já cadastradas. Ele também destaca o mês atual para facilitar a localização do usuário dentro do calendário.

### Tarefas

O sistema permite criar, editar e concluir atividades acadêmicas. Cada tarefa pode possuir título, descrição, prioridade e data de vencimento. As tarefas concluídas são registradas para uso nos relatórios de produtividade.

### Pomodoro

O StudyFlow conta com uma área de Pomodoro para ajudar o estudante a manter o foco durante os estudos. As sessões concluídas são salvas e utilizadas posteriormente na análise de produtividade.

### Grupos de estudo

A área de grupos permite organizar grupos acadêmicos por disciplina, descrição e prioridade. O usuário pode visualizar grupos criados, membros e informações relacionadas aos estudos em equipe.

### Kanban

O Kanban ajuda na organização visual das tarefas. Ele possui colunas como “A Fazer”, “Em Andamento”, “Revisão” e “Concluído”, permitindo acompanhar o progresso das atividades de forma simples e intuitiva.

### Relatórios inteligentes com Python

O sistema possui uma área de relatórios que analisa os dados do usuário, como tarefas criadas, tarefas concluídas, atividades atrasadas, tempo de foco e cards do Kanban. Essa análise é processada com Python e gera sugestões inteligentes para melhorar a organização do estudante.

### Exportação de relatórios em PDF

Além da visualização na tela, o StudyFlow permite gerar relatórios semanais em PDF, facilitando o acompanhamento da produtividade e o registro da evolução do usuário.

### Plano Premium

O projeto possui uma lógica de plano Premium. Recursos como relatórios inteligentes e geração de PDF são protegidos para usuários assinantes, simulando um modelo de assinatura dentro da aplicação.

## Tecnologias utilizadas

* Node.js
* Express
* EJS
* JavaScript
* CSS
* MySQL
* Python
* ReportLab
* JWT
* Bcrypt
* Dotenv
* Cookie-parser

## Estrutura geral do projeto

O StudyFlow é organizado em uma estrutura MVC, separando responsabilidades entre rotas, controllers, models, views e arquivos públicos.

* `server/`: arquivos principais do back-end, como rotas, controllers, models, middlewares e serviços.
* `client/views/`: páginas EJS renderizadas pelo sistema.
* `client/public/`: arquivos estáticos, como CSS, JavaScript e assets públicos.
* `data/`: script SQL do banco de dados.
* `python/`: scripts Python responsáveis pelos relatórios inteligentes e geração de PDF.

## Banco de dados

O banco de dados do projeto utiliza MySQL e possui tabelas para usuários, tarefas, grupos, membros de grupos, Kanban, colunas, cards, Pomodoro e sessões concluídas.

O arquivo principal do banco está localizado em:

`StudyFlow/data/banco.sql`

## Objetivo do projeto

O objetivo do StudyFlow é oferecer uma ferramenta simples, visual e prática para melhorar a organização acadêmica dos estudantes. O sistema busca centralizar tarefas, prazos, métodos de foco e relatórios de desempenho, ajudando o usuário a entender melhor sua rotina e tomar decisões mais organizadas durante os estudos.

## Status do projeto

O projeto está em desenvolvimento e já conta com as principais funcionalidades integradas, incluindo calendário, Pomodoro, grupos, Kanban, autenticação, relatórios inteligentes com Python e geração de PDF.
