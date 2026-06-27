const express = require("express");
const router = express.Router();

const metasController = require("../controllers/metasController");

const {
  verificarAutenticacao,
  bloquearCache
} = require("../middlewares/authMiddleware");

const {
  verificarAssinatura
} = require("../middlewares/assinaturaMiddleware");

router.use(verificarAutenticacao);
router.use(bloquearCache);

// A partir daqui, somente usuários Premium acessam metas
router.use(verificarAssinatura);

router.get(
  "/",
  metasController.paginaMetas
);

router.post(
  "/criar",
  metasController.criarMeta
);

router.post(
  "/editar/:id",
  metasController.atualizarMeta
);

router.post(
  "/excluir/:id",
  metasController.excluirMeta
);

module.exports = router;