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

exports.paginaInicial = async (req, res) => {
  try {
    const atividades = await atividadeModel.listar();

    res.render("usuarios/pagina-inicial", {
      atividades
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