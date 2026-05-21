//importação do módulo express
const express = require("express");

const router = express.Router();

const usuarioController = require("../controllers/usuarioController.js")
//Declaração das rotas do usuário
//Obtém a lista de usuários
router.get("/", (req,res) => {
    res.json({"mensagem": "Peguei a lista de usuários"});
});

router.post("/login", usuarioController.login)

module.exports = router;





