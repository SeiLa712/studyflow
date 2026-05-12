//importação do módulo express
const express = require("express");

const router = express.Router();

//Declaração das rotas do usuário
//Obtém a lista de usuários
router.get("/", (req,res) => {
    res.json({"mensagem": "Peguei a lista de usuários"});
});

//Retornar a página de cadastro
router.get("/cadastro",(req,res) => {
    res.json({"mensagem": "Estou na página de cadastro"});
});

module.exports = router;





