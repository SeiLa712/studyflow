const express = require("express");
const router = express.Router();

const relatoriosController =
  require("../controllers/relatoriosController");

const {
  verificarAutenticacao
} = require("../middlewares/authMiddleware");

const {
  verificarAssinatura
} = require("../middlewares/assinaturaMiddleware");

router.get(
  "/",
  verificarAutenticacao,
  verificarAssinatura,
  relatoriosController.paginaRelatorios
);

router.get(
  "/pdf",
  verificarAutenticacao,
  verificarAssinatura,
  relatoriosController.baixarPdf
);

module.exports = router;