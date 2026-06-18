const atividadeModel = require("../models/atividadeModel");

exports.calendario = async (req, res) => {
  try {
    const tarefas = await atividadeModel.listarPorUsuario(
      req.usuario.id
    );

    const mes = parseInt(req.query.mes) || new Date().getMonth();
    const ano = parseInt(req.query.ano) || new Date().getFullYear();

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