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
        if (!usuario){
            return res.status(404).render('erro', { mensagem: "Credenciais inválidas"})
        }

        // compara a senha que o usuário digitou, com a senha do usuario retornado no banco
        const senhaValida = await bcrypt.compare(senha, usuario.senha)

        // Se senhas não coincidirem, mensagem de erro
        if (!senhaValida){
            return res.status(404).render('erro', { mensagem: "Credenciais inválidas"})
        }

        // Gera o token de acesso, contendo o perfil 
        const token = jwt.sign(
            {id: usuario.id, perfil: usuario.perfil, nome: usuario.nome},
            process.env.JWT_SECRET,
            {expiresIn: '2h'}       
        )

        // Guardar o token nos cookies do navegador
        res.cookie('token', token, { httpOnly: true })

        // REDIRECIONAMENTO
        return res.redirect('/usuarios/pagina-inicial');

        // ao fim, redireciona o usuario
        res.redirect(redirecionadoPara)

    }
    catch(erro){
        console.log(erro)
        res.status(500).render('erro', { mensagem: "Erro interno no servidor"})
    }
},

    logout: (req,res) =>{
        //Limpa o token dos cookies
        res.clearCookie('token')
        // Volta pra tela de login
        res.redirect("/login")
    },

    //CRUD
    //CRIAR USUARIOS
    renderizarCadastro:(req, res) => {
        res.render('usuarios/cadastrar')
    },

    cadastrar: async(req,res) =>{
        //objeto com as informações preenchidas nos inputs
        const { nome, email, senha, telefone, perfil } = req.body

        if(perfil === 'administrador'){
            return res.status(403).render('erro', { mensagem: "Você não possui acesso"})
        }

        //multer salva a imagem na pasta, e a variavel guarda o nome dela caso o duuario tenha anexado uma imagem
        const fotoDaPessoa = req.file ? `uploads/usuarios/${req.file.filename}` : null

        //criptografa a senha do usuario
        const senhaHash = await bcrypt.hash(senha, 10)

        //chama o model passando as informações já corrigidas
        await usuarioModel.criarUsuario(nome, email, senhaHash)
        //variavel pra guardar onde tem de redirecionar o usuario
        let redirecionadoPara = '/login'
        //verifica se ja tem alguem logado, analisando se ha algum token salvo
        if(req.cookies && req.cookies.token){
            try{
                const decodificado = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
            }
            catch (erro){
                //segue o jogoindo pra login msm
            }
        }
        //ao fim, redireciona o susuario para onde ele tem q ir, /login ou /usuarios
        res.redirect(redirecionadoPara)
    },

    catch(erro){
        console.error(erro)
        res.status(500).render('erro',
             { mensagem: "Erro interno no servidor"})
    
    }

}