const atividadeModel = require("../models/atividadeModel");

exports.criarAtividade = async (req, res) => {
  try {
    const {
      nome,
      descricao,
      data_vencimento,
      prioridade,
      redirectTo
    } = req.body;

    await atividadeModel.criar({
      nome,
      descricao,
      data_vencimento,
      prioridade,
      id_usuario: req.usuario.id
    });

    return res.redirect(
      redirectTo || "/usuarios/pagina-inicial"
    );

  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao criar atividade");
  }
};

exports.paginaInicial = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;

    const atividadesProximas =
      await atividadeModel.listarProximasPorUsuario(idUsuario);

    const atividadesCalendario =
      await atividadeModel.listarCalendarioPorUsuario(idUsuario);

    res.render("usuarios/pagina-inicial", {
      atividadesProximas,
      atividadesCalendario,

      // Mantém compatibilidade caso alguma parte antiga ainda use "atividades"
      atividades: atividadesProximas
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao carregar atividades");
  }
};

exports.excluir = async (req, res) => {
  try {
    const { id } = req.params;

    await atividadeModel.deletar(id);

    return res.sendStatus(200);

  } catch (erro) {
    console.error(erro);
    return res.sendStatus(500);
  }
};
exports.editarAtividade = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nome,
      descricao,
      data_vencimento,
      prioridade,
      redirectTo
    } = req.body;

    await atividadeModel.atualizar(
      id,
      req.usuario.id,
      {
        nome,
        descricao,
        data_vencimento,
        prioridade
      }
    );

    return res.redirect(
      redirectTo || "/usuarios/pagina-inicial"
    );

  } catch (erro) {
    console.error("Erro ao editar atividade:", erro);
    return res.status(500).send("Erro ao editar atividade");
  }
};

exports.concluirAtividade = async (req, res) => {
  try {
    const { id } = req.params;

    await atividadeModel.marcarComoConcluida(
      id,
      req.usuario.id
    );

    return res.json({
      sucesso: true,
      mensagem: "Atividade concluída com sucesso"
    });

  } catch (erro) {
    console.error("Erro ao concluir atividade:", erro);

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao concluir atividade"
    });
  }
};