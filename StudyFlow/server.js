// IMPORTAÇÃO DOS MÓDULOS
const express = require("express");
const path = require("path");
require("dotenv").config();

// CRIAÇÃO DO EXPRESS
const app = express();
const port = process.env.PORT || 3000;

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("cookie-parser")());

// CONFIGURAÇÃO DO EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "client/views"));

// ARQUIVOS ESTÁTICOS
// Funciona localmente. Na Vercel, os arquivos da pasta public
// são servidos automaticamente.
app.use(express.static(path.join(__dirname, "public")));

// IDENTIFICA A PÁGINA ATUAL
app.use((req, res, next) => {
  res.locals.pagina = req.path.split("/").pop();
  next();
});

// =========================
// ROTAS PÚBLICAS
// =========================

app.get("/", (req, res) => {
  return res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private"
  );

  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  return res.render("auth/login", {
    erro: null
  });
});

app.get("/cadastro", (req, res) => {
  return res.render("auth/cadastro");
});

// =========================
// ROTAS DO SISTEMA
// =========================

const usuariosRoutes = require("./server/routes/usuarioRoutes.js");
app.use("/usuarios", usuariosRoutes);

const atividadesRoutes = require("./server/routes/atividadesRoutes.js");
app.use("/tarefas", atividadesRoutes);

const pomodoroRoutes = require("./server/routes/pomodoroRoutes.js");
app.use("/usuarios/pomodoro", pomodoroRoutes);

const gruposRoutes = require("./server/routes/gruposRoutes.js");
app.use("/usuarios", gruposRoutes);

const kanbanRoutes = require("./server/routes/kanbanRoutes.js");
app.use("/kanban", kanbanRoutes);

const relatoriosRoutes = require("./server/routes/relatoriosRoutes.js");
app.use("/relatorios", relatoriosRoutes);

const configuracoesRoutes = require(
  "./server/routes/configuracoesRoutes.js"
);
app.use("/configuracoes", configuracoesRoutes);

const metasRoutes = require("./server/routes/metasRoutes.js");
app.use("/metas", metasRoutes);

const notificacoesRoutes = require(
  "./server/routes/notificacoesRoutes.js"
);
app.use("/notificacoes", notificacoesRoutes);

// =========================
// EXECUÇÃO LOCAL
// =========================

if (require.main === module) {
  const pool = require("./server/config/db.js");

  (async () => {
    try {
      const conexao = await pool.getConnection();
      conexao.release();

      console.log("Banco conectado");

      app.listen(port, () => {
        console.log(`StudyFlow funcionando na porta ${port}`);
        console.log(`http://localhost:${port}`);
      });
    } catch (erro) {
      console.error("Erro ao conectar com o banco:", erro);
    }
  })();
}

// EXPORTAÇÃO PARA A VERCEL
module.exports = app;