const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuarioController.js");
const calendarioController = require("../controllers/calendarioController");

const atividadeModel = require("../models/atividadeModel");

const upload = require("../config/multer.js");

const {
  verificarAutenticacao,
  bloquearCache
} = require("../middlewares/authMiddleware.js");

/* =========================
   ROTAS PÚBLICAS
========================= */

router.post("/login", usuarioController.login);

router.get("/logout", usuarioController.logout);

router.post(
  "/cadastrar",
  upload.single("foto"),
  usuarioController.cadastrar
);

/* =========================
   ROTAS PRIVADAS
========================= */

router.use(verificarAutenticacao);
router.use(bloquearCache);

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

    const atividadesProximas =
      await atividadeModel.listarProximasPorUsuario(idUsuario);

    const atividadesCalendario =
      await atividadeModel.listarCalendarioPorUsuario(idUsuario);

    return res.render("usuarios/pagina-inicial", {
      atividadesProximas,
      atividadesCalendario,
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