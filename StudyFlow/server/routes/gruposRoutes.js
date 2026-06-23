const express = require("express");
const router = express.Router();

const gruposController = require("../controllers/gruposController");
const { verificarAutenticacao } = require("../middlewares/authMiddleware");

// página de grupos
router.get(
  "/grupos",
  verificarAutenticacao,
  gruposController.paginaGrupos
);

// criar grupo
router.post(
  "/grupos/criar",
  verificarAutenticacao,
  gruposController.criarGrupo
);

// excluir grupo
router.delete(
  "/grupos/:id",
  verificarAutenticacao,
  gruposController.excluirGrupo
);

// adicionar membro ao grupo
router.post(
  "/grupos/:id/membros",
  verificarAutenticacao,
  gruposController.adicionarMembro
);

// listar membros do grupo
router.get(
  "/grupos/:id/membros",
  verificarAutenticacao,
  gruposController.listarMembros
);

// criar sessão do grupo
router.post(
  "/grupos/:id/sessoes",
  verificarAutenticacao,
  gruposController.criarSessao
);

// listar sessões do grupo
router.get(
  "/grupos/:id/sessoes",
  verificarAutenticacao,
  gruposController.listarSessoes
);

module.exports = router;
