const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuarioController.js");
const atividadeModel = require("../models/atividadeModel");
const calendarioController = require("../controllers/calendarioController");

// upload
const upload = require("../config/multer.js");

// auth middleware
const { verificarAutenticacao } = require("../middlewares/authMiddleware.js");

// =======================
// ROTAS PÚBLICAS
// =======================

router.post("/login", usuarioController.login);
router.get("/logout", usuarioController.logout);
router.post("/cadastrar", upload.single('foto'), usuarioController.cadastrar);

// =======================
// ROTAS PRIVADAS
// =======================

router.use(verificarAutenticacao);

// listar usuários
router.get("/", (req, res) => {
  res.render("usuarios/listar");
});

// página inicial
router.get("/pagina-inicial", async (req, res) => {
  try {
    const atividades = await atividadeModel.listarPorUsuario(req.usuario.id);

    res.render("usuarios/pagina-inicial", {
      atividades
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao carregar página inicial");
  }
});

router.get("/cadastro", (req, res) => {
  res.render("usuarios/cadastrar");
});

// calendário
router.get(
  "/calendario",
  verificarAutenticacao,
  calendarioController.calendario
);

module.exports = router;