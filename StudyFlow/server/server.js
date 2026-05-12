//importação do módulo express
const express = require("express");
const app = express();

//módulo do node para lidar com caminho de arquivos
const path = require('path');
//módulo do node para lidar com caminho de arquivo
console.log(path.join(__dirname, ":.estou aqui"));
//define a porta do servidor
const port = 3000;

//Configuração do EJS e pastas do FRONT END
app.set('view engine', 'ejs');
//Aponta para o express e ejs onde estão as páginas
app.set('views', path.join(__dirname, '../client/views'));
// Deixa a pasta public acessivel ao usuario
app.use(express.static(path.join(__dirname, '../client/public')));
//rotas publicas
//Criação de rotas padrões
app.get("/", (req,res) => {
  //Redireciona para a tela de login
  res.status(200).redirect("/login");
});

//rota que retorna a página de login
app.get("/login", (req,res) => {
  res.render("auth/login");
});
//rota que retorna a página de cadastro de usuário

// app.get("/cadastro", (req,res) => {
//   res.render("auth/cadastro");
// });

//importar as rotas de usuário
const usuarioRoutes = require("./routes/usuarioRoutes.js");
// requisições comecando com /usuarios e gerenciada pelo sub-arquivo de rotas
app.use("/usuarios", usuarioRoutes);


//função para subir o servidor
app.listen(port, () => {
  console.log(`Servidor ativo na porta:${port}`)
  console.log(`Link: http://localhost:${port}`)
});

