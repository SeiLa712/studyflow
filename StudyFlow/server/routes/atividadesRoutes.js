const express = require("express");
const router = express.Router();
const atividadeController = require("../controllers/atividadeController");

router.post("/atividades", atividadeController.criarAtividade);

module.exports = router;