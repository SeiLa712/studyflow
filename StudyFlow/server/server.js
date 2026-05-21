// importação e uso do módulo express
const express = require("express");
const app = express();
// módulo do node para lidar com caminho de arquivos
const path = require("path");

// Importa o módulo do dotenv, lê o arquivo .env, e já configura inicialmente
require('dotenv').config()

// Define a porta do servidor com base nas variáveis de ambiente
// Se der errado, e porte será a 5000
const port = process.env.PORT || 5000;

// MIDDLEWARE PARA ENTENDER O JSON
// Lê os dados em JSON
app.use(express.json()) 
// Servidor está apto a ler os dados dos formulário
app.use(express.urlencoded({ extended: true })) 
// Permite ler cookies e alterar também
app.use(require('cookie-parser')())

// CONFIGURAÇÃO DO EJS E PASTAS DO FRONT END
// Define o EJS como engine do front
app.set("view engine", "ejs");
// Aponta para o express e ejs onde estão as páginas
app.set("views", path.join(__dirname, "../client/views"));
// Deixa a pasta public acessível ao usuário
app.use(express.static(path.join(__dirname, "../client/public")));

// ROTAS PÚBLICAS
// Criação de rotas padrão
app.get("/", (req, res) => {
  // Redireciona pra tela de login
  res.status(200).redirect("/login");
});

//Rota que retorna a página de login
app.get("/login", (req, res) => {
  res.render('auth/login');
});

// Rota que retorna a página de cadastro de usuário
app.get("/cadastro", (req, res) => {
  res.render('auth/cadastro');
});

//Importar as rotas de usuário
const usuariosRoutes = require("./routes/usuarioRoutes.js");
// Requisições comecando com /usuarios é gerenciada pelo sub-arquivo de rotas
app.use("/usuarios", usuariosRoutes);

// //Função para subir o servidor
// app.listen(port, () => {
//   console.log(`Servidor ativo na porta: ${port}`);
//   console.log(`Link: http://localhost:${port}`);
// });

// Traz as configurações do banco
const pool = require("./config/db.js");
//Cria uma conexão teste com o banco
(async () => {
  try {
    // Se o banco de dados estiver ativo, ai sim o servidor será iniciado
    await pool.getConnection();
    console.log("Banco conectado");
    // Se o banco de dados estiver ativo, ai sim o servidor será iniciado
    app.listen(port, () => {
      console.log(`Link: http://localhost:${port}`);
      console.log(`Servidor funcionando na porta ${port}`);
    });
  } catch (erro) {
    // Se deu erro, avisa e encerra a tentativa
    console.log("Erro ao tentar conectar com o banco de dados");
    process.exit(1);
  }
})();
