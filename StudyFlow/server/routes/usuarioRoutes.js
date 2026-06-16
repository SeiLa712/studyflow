//importação do módulo express
const express = require("express");

const router = express.Router();

const usuarioController = require("../controllers/usuarioController.js")

const atividadeModel = require("../models/atividadeModel");

//importar o multer
const upload = require("../config/multer.js")

// importar o middleware de autenticação
const{verificarAutenticacao} = require("../middlewares/authMiddleware.js")

// Declaração das rotas do usuário
// ROTAS PÚBLICAS
// Envia os dados de login
router.post("/login", usuarioController.login)

// Rota de saida
router.get("/logout", usuarioController.logout)

//ROTA DE CADASTRO de usuario
//O multer, salva a imagem primeiro, através do upload.single, depois chama o controller
router.post("/cadastrar", upload.single('foto'), usuarioController.cadastrar)


// ROTAS PRIVADAS
//daqui pra baixo, so executa se tiver acesso para tal 
router.use(verificarAutenticacao)
//router.use(somenteAdmin)

// Obtém a lista de usuários
router.get("/", (req, res) => {
  res.status(200).render('usuarios/listar')
});

router.get('/pagina-inicial', async (req, res) => {
    try {

        const tarefas =
            await atividadeModel.listarPorUsuario(
                req.usuario.id
            );

        res.render(
            'usuarios/pagina-inicial',
            { tarefas }
        );

    } catch (erro) {
        console.error(erro);
        res.status(500).send(
            "Erro ao carregar tarefas"
        );
    }
});

//Retornar a página de cadastro
router.get("/cadastro", (req, res) => {
  res.status(200).render('usuarios/cadastrar')
});

// Vai para a tela de calendario
router.get('/calendario', async (req, res) => {
    try {
       
        const tarefas = await atividadeModel.listarPorUsuario(req.usuario.id);

       
        res.render('usuarios/calendario', { 
            usuario: req.usuario,
            tarefas: tarefas 
        });

    } catch (erro) {
        console.error("Erro ao carregar dados do calendário:", erro);
        res.status(500).send("Erro interno ao carregar o calendário");
    }
});


module.exports = router