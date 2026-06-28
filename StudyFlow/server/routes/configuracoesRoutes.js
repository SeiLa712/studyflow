const express = require("express");
const router = express.Router();

const configuracoesController =
  require("../controllers/configuracoesController");

const {
  verificarAutenticacao,
  bloquearCache
} = require("../middlewares/authMiddleware");

router.use(verificarAutenticacao);
router.use(bloquearCache);

router.get(
  "/",
  configuracoesController.paginaConfiguracoes
);

router.post(
  "/perfil",
  configuracoesController.atualizarPerfil
);

router.post(
  "/senha",
  configuracoesController.atualizarSenha
);

router.post(
  "/premium/assinar",
  configuracoesController.ativarPremium
);

router.post(
  "/premium/cancelar",
  configuracoesController.cancelarPremium
);

module.exports = router;