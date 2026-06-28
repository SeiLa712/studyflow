const express = require("express");
const router = express.Router();

const atividadeController = require("../controllers/atividadeController");
const { verificarAutenticacao } = require("../middlewares/authMiddleware");

// criar atividade
router.post(
  "/criar",
  verificarAutenticacao,
  atividadeController.criarAtividade
);

// editar atividade
router.post(
  "/editar/:id",
  verificarAutenticacao,
  atividadeController.editarAtividade
);

// concluir atividade
router.post(
  "/concluir/:id",
  verificarAutenticacao,
  atividadeController.concluirAtividade
);

// excluir atividade
router.delete(
  "/:id",
  verificarAutenticacao,
  atividadeController.excluir
);

module.exports = router;