const express = require("express");
const router = express.Router();

const pomodoroController =
  require("../controllers/pomodoroController");

const {
  verificarAutenticacao
} = require("../middlewares/authMiddleware");

router.use(verificarAutenticacao);

router.get(
  "/",
  pomodoroController.listar
);

router.post(
  "/cadastrar",
  pomodoroController.cadastrar
);

router.post(
  "/sessoes",
  pomodoroController.salvarSessao
);

router.get(
  "/excluir/:id",
  pomodoroController.excluir
);

module.exports = router;