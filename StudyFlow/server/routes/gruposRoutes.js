const express = require("express");
const router = express.Router();

const uploadGrupos = require("../config/uploadGrupos");

const gruposController = require("../controllers/gruposController");

const { verificarAutenticacao } = require("../middlewares/authMiddleware");
const { verificarAssinatura } = require("../middlewares/assinaturaMiddleware");

/* =========================
   PROTEÇÃO DAS ROTAS DE GRUPOS
   Só usuário autenticado e Premium acessa
========================= */

router.use(verificarAutenticacao);
router.use(verificarAssinatura);

/* =========================
   PÁGINA DE GRUPOS
========================= */

router.get(
  "/grupos",
  gruposController.paginaGrupos
);

/* =========================
   CRIAR GRUPO
========================= */

router.post(
  "/grupos/criar",
  gruposController.criarGrupo
);

/* =========================
   EXCLUIR GRUPO
========================= */

router.delete(
  "/grupos/:id",
  gruposController.excluirGrupo
);

/* =========================
   MEMBROS DO GRUPO
========================= */

router.post(
  "/grupos/:id/membros",
  gruposController.adicionarMembro
);

router.get(
  "/grupos/:id/membros",
  gruposController.listarMembros
);

/* =========================
   ARQUIVOS DO GRUPO
========================= */

router.get(
  "/grupos/:id/arquivos",
  gruposController.listarArquivos
);

router.post(
  "/grupos/:id/arquivos",
  uploadGrupos.single("arquivo"),
  gruposController.uploadArquivo
);

router.get(
  "/grupos/:id/arquivos/:arquivoId/download",
  gruposController.downloadArquivo
);

/* =========================
   SESSÕES DO GRUPO
========================= */

router.post(
  "/grupos/:id/sessoes",
  gruposController.criarSessao
);

router.get(
  "/grupos/:id/sessoes",
  gruposController.listarSessoes
);

module.exports = router;