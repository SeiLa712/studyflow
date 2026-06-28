const express = require("express");
const router = express.Router();

const notificacoesController =
  require("../controllers/notificacoesController");

const {
  verificarAutenticacao,
  bloquearCache
} = require("../middlewares/authMiddleware");

router.use(verificarAutenticacao);
router.use(bloquearCache);

router.get(
  "/",
  notificacoesController.paginaNotificacoes
);

router.get(
  "/contador",
  notificacoesController.contadorNotificacoes
);

module.exports = router;