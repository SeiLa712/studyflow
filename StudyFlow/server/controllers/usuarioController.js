// importação do model
const UsuarioModel = require("../models/usuarioModel.js")

// importar pacotes
// para criptrograffia
const bcrypt = require('bcrypt')
// para lidar com cookies
const jwt = require('jsonwebtoken')
const usuarioModel = require("../models/usuarioModel.js")

module.exports = {
    //FUNÇÕES DE LOGIN
    login: async (req,res) =>{
        try{
            // Pega as infomações das caixinhas da view, de acordo com o name delas
            const { email, senha } = req.body
            console.log("Dados:", email, senha)
            // Executa a função de busca no model
            const usuario = await usuarioModel.buscarPorEmail(email)
             console.log(usuario)
            // Se não existir, mensagem de erro
            if (!usuario) return res.status(404).render('erro', { mensagem: "Credenciais inválidas"})

            // compara a senha que o usuário digitou, com a senha do usuario retornado no banco
            const senhaValida = await bcrypt.compare(senha, usuario.senha)
            // Se senhas não coincidirem, mensagem de erro
            if (!senhaValida) return res.status(404).render('erro', { mensagem: "Credenciais inválidas"})

            // Gera o token de acesso, contendo o perfil 
            const token = jwt.sign(
                {id: usuario.id, perfil: usuario.perfil, nome: usuario.nome},
                process.env.JWT_SECRET,
                {expiresIn: '2h'}       
            )

            // Guardar o token nos cookies do navegador
            res.cookie('token', token, { httpOnly: true })

            // Redirecionamento de acordo com o perfil 
            if(usuario.perfil === "estudante") return res.render("auth/cadastro")
        }
        catch(erro){
            res.status(500).render('erro', { mensagem: "Erro interno no servidor"})
        }
    },

    logout: (req,res) =>{
        //Limpa o token dos cookies
        res.clearCookie('token')
        // Volta pra tela de login
        res.redirect("/login")
    }

}