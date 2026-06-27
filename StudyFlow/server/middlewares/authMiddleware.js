const jwt = require("jsonwebtoken");

// Bloqueia cache das páginas privadas
function bloquearCache(req, res, next) {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private"
  );

  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  next();
}

// Verifica se existe algum token
function verificarAutenticacao(req, res, next) {
  const token = req.cookies?.token;

  // Se não tiver token, manda para login
  if (!token) {
    return res.redirect("/login");
  }

  try {
    // Verifica se o token é válido
    const dados = jwt.verify(token, process.env.JWT_SECRET);

    // Salva o usuário no backend
    req.usuario = dados;

    // Variável global para o EJS
    res.locals.usuario = dados;

    return next();

  } catch (erro) {
    // Apaga token inválido
    res.clearCookie("token", {
      path: "/"
    });

    return res.redirect("/login");
  }
}

module.exports = {
  verificarAutenticacao,
  bloquearCache
};