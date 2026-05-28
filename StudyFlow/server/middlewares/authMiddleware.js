const jwt = require('jsonwebtoken')

//verifica se existe algum token
function verificarAutenticacao (req,res,next){
    const token = req.cookies?.token
    //se nao tiver, ja redireciona o usuario para a tela de login
    if(!token){
        return res.redirect('/login')
    }
    try{
        //verifica se o token é válido ou n
        const dados = jwt.verify(token, process.env.JWT_SECRET)
        //salva o usuário no backend, para todos terem acesso
        req.usuario = dados
        // variavel global para o EJS ter acesso aos dados do usuario
        res.locals.usuario = dados
        // deixa o usuário prosseguir
        next()
    }
    catch(erro){
        res.clearCookie('token') //apaga o token inválido
        return res.redirect('/login') //vai para tela de login
    }
}


module.exports = { 
    verificarAutenticacao
}