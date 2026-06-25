<<<<<<< HEAD
// Importação do módulo express
const express = require("express");
const router = express.Router();

// Controllers
const usuarioController = require("../controllers/usuarioController.js");
const calendarioController = require("../controllers/calendarioController");

// Models
const atividadeModel = require("../models/atividadeModel");

// Multer
const upload = require("../config/multer.js");

// Middleware de autenticação
const { verificarAutenticacao } = require("../middlewares/authMiddleware.js");

/* =========================
   ROTAS PÚBLICAS
========================= */

// Login
router.post("/login", usuarioController.login);

// Logout
router.get("/logout", usuarioController.logout);

// Cadastro de usuário
router.post(
  "/cadastrar",
  upload.single("foto"),
  usuarioController.cadastrar
);

/* =========================
   ROTAS PRIVADAS
========================= */

router.use(verificarAutenticacao);

/* =========================
   LISTAR USUÁRIOS
========================= */

router.get("/", (req, res) => {
  res.status(200).render("usuarios/listar");
});

/* =========================
   PÁGINA INICIAL
========================= */

router.get("/pagina-inicial", async (req, res) => {
  try {
    const idUsuario = req.usuario.id;

    console.log("USUÁRIO LOGADO:", req.usuario);
    console.log("ID USUÁRIO:", idUsuario);

    const atividadesProximas =
      await atividadeModel.listarProximasPorUsuario(idUsuario);

    const atividadesCalendario =
      await atividadeModel.listarCalendarioPorUsuario(idUsuario);

    console.log("ATIVIDADES PRÓXIMAS:", atividadesProximas);
    console.log("ATIVIDADES CALENDÁRIO:", atividadesCalendario);

    return res.render("usuarios/pagina-inicial", {
      atividadesProximas,
      atividadesCalendario,

      // Mantém compatibilidade com códigos antigos
      atividades: atividadesProximas
    });

  } catch (erro) {
    console.error("Erro ao carregar página inicial:", erro);

    return res
      .status(500)
      .send("Erro ao carregar página inicial");
  }
});

/* =========================
   CADASTRO
========================= */

router.get("/cadastro", (req, res) => {
  res.status(200).render("usuarios/cadastrar");
});

/* =========================
   CALENDÁRIO
========================= */

router.get(
  "/calendario",
  calendarioController.calendario
);

module.exports = router;