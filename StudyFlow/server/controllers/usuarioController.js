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
login: async (req, res) => {
    try {
        // Pega as informações das caixinhas da view
        const { email, senha } = req.body;
        console.log("Dados:", email, senha);

        // Busca o usuário pelo email
        const usuario = await usuarioModel.buscarPorEmail(email);
        console.log("Usuário encontrado:", usuario);

        // Se não existir
        if (!usuario) {
            return res.redirect('/login');
        }

        // Compara a senha digitada com a senha do banco
        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        // Se a senha estiver errada
        if (!senhaValida) {
            return res.redirect('/login');
        }

        // Gera o token
        const token = jwt.sign(
            {
                id: usuario.id,
                perfil: usuario.perfil,
                nome: usuario.nome
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        // Salva o token nos cookies
        res.cookie('token', token, {
            httpOnly: true
        });

        console.log("LOGIN REALIZADO COM SUCESSO");

        // Redireciona para a página inicial
        return res.redirect('/usuarios/pagina-inicial');

    } catch (erro) {
        console.error(erro);
        return res.status(500).send("Erro interno no servidor");
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