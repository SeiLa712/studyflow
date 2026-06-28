const bcrypt = require("bcrypt");

const configuracoesModel =
  require("../models/configuracoesModel");

const usuarioModel =
  require("../models/usuarioModel");

exports.paginaConfiguracoes = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;

    const usuario =
      await configuracoesModel.buscarUsuarioPorId(idUsuario);

    return res.render("usuarios/configuracoes", {
      usuario,
      mensagem: req.query.mensagem || null,
      erro: req.query.erro || null
    });

  } catch (erro) {
    console.error("Erro ao carregar configurações:", erro);

    return res.status(500).send(
      "Erro ao carregar configurações"
    );
  }
};

exports.atualizarPerfil = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;
    const { nome, email } = req.body;

    if (!nome || !email) {
      return res.redirect(
        "/configuracoes?erro=Preencha nome e email corretamente"
      );
    }

    await configuracoesModel.atualizarPerfil(
      idUsuario,
      nome,
      email
    );

    return res.redirect(
      "/configuracoes?mensagem=Perfil atualizado com sucesso"
    );

  } catch (erro) {
    console.error("Erro ao atualizar perfil:", erro);

    return res.redirect(
      "/configuracoes?erro=Erro ao atualizar perfil. Verifique se o email já está em uso"
    );
  }
};

exports.atualizarSenha = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;

    const {
      senha_atual,
      nova_senha,
      confirmar_senha
    } = req.body;

    if (!senha_atual || !nova_senha || !confirmar_senha) {
      return res.redirect(
        "/configuracoes?erro=Preencha todos os campos de senha"
      );
    }

    if (nova_senha !== confirmar_senha) {
      return res.redirect(
        "/configuracoes?erro=A nova senha e a confirmação não são iguais"
      );
    }

    const usuario =
      await configuracoesModel.buscarUsuarioPorId(idUsuario);

    const usuarioBanco =
      await usuarioModel.buscarPorEmail(usuario.email);

    const senhaValida = await bcrypt.compare(
      senha_atual,
      usuarioBanco.senha
    );

    if (!senhaValida) {
      return res.redirect(
        "/configuracoes?erro=Senha atual incorreta"
      );
    }

    const senhaHash = await bcrypt.hash(nova_senha, 10);

    await configuracoesModel.atualizarSenha(
      idUsuario,
      senhaHash
    );

    return res.redirect(
      "/configuracoes?mensagem=Senha alterada com sucesso"
    );

  } catch (erro) {
    console.error("Erro ao atualizar senha:", erro);

    return res.redirect(
      "/configuracoes?erro=Erro ao atualizar senha"
    );
  }
};

exports.ativarPremium = async (req, res) => {
  try {
    await configuracoesModel.ativarPremium(
      req.usuario.id
    );

    return res.redirect(
      "/configuracoes?mensagem=Plano Premium ativado com sucesso"
    );

  } catch (erro) {
    console.error("Erro ao ativar Premium:", erro);

    return res.redirect(
      "/configuracoes?erro=Erro ao ativar plano Premium"
    );
  }
};

exports.cancelarPremium = async (req, res) => {
  try {
    await configuracoesModel.cancelarPremium(
      req.usuario.id
    );

    return res.redirect(
      "/configuracoes?mensagem=Plano Premium cancelado"
    );

  } catch (erro) {
    console.error("Erro ao cancelar Premium:", erro);

    return res.redirect(
      "/configuracoes?erro=Erro ao cancelar plano Premium"
    );
  }
};