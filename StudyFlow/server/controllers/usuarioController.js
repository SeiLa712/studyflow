const usuarioModel = require("../models/usuarioModel.js");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  login: async (req, res) => {
    try {
      const { email, senha } = req.body;

      const usuario = await usuarioModel.buscarPorEmail(email);

      if (!usuario) {
        return res.status(401).render("auth/login", {
          erro: "Email ou senha incorretos."
        });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) {
        return res.status(401).render("auth/login", {
          erro: "Email ou senha incorretos."
        });
      }

      const token = jwt.sign(
        {
          id: usuario.id,
          perfil: usuario.perfil,
          nome: usuario.nome
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "2h"
        }
      );

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        path: "/"
      });

      return res.redirect("/usuarios/pagina-inicial");

    } catch (erro) {
      console.error("Erro ao fazer login:", erro);

      return res.status(500).render("auth/login", {
        erro: "Erro interno no servidor. Tente novamente."
      });
    }
  },

  logout: (req, res) => {
    res.clearCookie("token", {
      path: "/"
    });

    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, private"
    );

    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    return res.redirect("/login");
  },

  renderizarCadastro: (req, res) => {
    res.render("usuarios/cadastrar");
  },

  cadastrar: async (req, res) => {
    try {
      const { nome, email, senha } = req.body;

      const senhaHash = await bcrypt.hash(senha, 10);

      await usuarioModel.criarUsuario(nome, email, senhaHash);

      return res.redirect("/login");

    } catch (erro) {
      console.error("Erro ao cadastrar usuário:", erro);

      return res.status(500).render("auth/login", {
        erro: "Erro ao cadastrar usuário. Tente novamente."
      });
    }
  }
};