const atividadeModel = require("../models/atividadeModel");

exports.calendario = async (req, res) => {
  try {
    const tarefas = await atividadeModel.listarCalendarioPorUsuario(
      req.usuario.id
    );

    const dataAtual = new Date();

    let mes;

    if (req.query.mes !== undefined) {
      mes = parseInt(req.query.mes);
    } else {
      mes = dataAtual.getMonth();
    }

    let ano;

    if (req.query.ano !== undefined) {
      ano = parseInt(req.query.ano);
    } else {
      ano = dataAtual.getFullYear();
    }

    if (Number.isNaN(mes) || mes < 0 || mes > 11) {
      mes = dataAtual.getMonth();
    }

    if (Number.isNaN(ano)) {
      ano = dataAtual.getFullYear();
    }

    res.render("usuarios/calendario", {
      tarefas,
      mes,
      ano
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao carregar calendário");
  }
};

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

    res.redirect("/usuarios/calendario");

  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao criar atividade");
  }
};