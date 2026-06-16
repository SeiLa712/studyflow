const express = require("express");
const router = express.Router();

const atividadeController = require("../controllers/atividadeController");
const { verificarAutenticacao } = require("../middlewares/authMiddleware");

router.post(
  "/criar",
  verificarAutenticacao,
  atividadeController.criarAtividade
);

module.exports = router;