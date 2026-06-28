const notificacoesModel =
  require("../models/notificacoesModel");

exports.paginaNotificacoes = async (req, res) => {
  try {
    const notificacoes =
      await notificacoesModel.listarPorUsuario(
        req.usuario.id
      );

    return res.render("usuarios/notificacoes", {
      notificacoes
    });

  } catch (erro) {
    console.error("Erro ao carregar notificações:", erro);

    return res.status(500).send(
      "Erro ao carregar notificações"
    );
  }
};

exports.contadorNotificacoes = async (req, res) => {
  try {
    const total =
      await notificacoesModel.contarPorUsuario(
        req.usuario.id
      );

    return res.json({
      total
    });

  } catch (erro) {
    console.error("Erro ao contar notificações:", erro);

    return res.json({
      total: 0
    });
  }
};