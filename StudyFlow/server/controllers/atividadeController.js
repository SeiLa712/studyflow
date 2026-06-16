const atividadeModel = require("../models/atividadeModel");

exports.criarAtividade = async (req, res) => {
  try {
    const {
      nome,
      descricao,
      data_vencimento,
      prioridade
    } = req.body;

    await atividadeModel.criar({
      nome,
      descricao,
      data_vencimento,
      prioridade,
      id_usuario: req.usuario.id
    });

    res.redirect("/usuarios/pagina-inicial");
  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao criar atividade");
  }
};