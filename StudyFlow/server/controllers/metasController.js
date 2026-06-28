const metasModel = require("../models/metasModel");

function unidadePorTipo(tipo) {
  if (tipo === "foco") {
    return "minutos";
  }

  if (tipo === "atrasos") {
    return "atrasos";
  }

  return "tarefas";
}

function calcularMeta(meta, progressoBase) {
  let valorAtual = 0;

  if (meta.tipo === "tarefas") {
    valorAtual = progressoBase.tarefas;
  }

  if (meta.tipo === "foco") {
    valorAtual = progressoBase.foco;
  }

  if (meta.tipo === "atrasos") {
    valorAtual = progressoBase.atrasos;
  }

  let porcentagem = 0;
  let status = "Em andamento";

  if (meta.tipo === "atrasos") {
    if (valorAtual <= meta.valor_meta) {
      porcentagem = 100;
      status = "Dentro da meta";
    } else {
      porcentagem = 0;
      status = "Meta ultrapassada";
    }
  } else {
    porcentagem = Math.round(
      (Number(valorAtual) / Number(meta.valor_meta || 1)) * 100
    );

    if (porcentagem >= 100) {
      porcentagem = 100;
      status = "Meta concluída";
    }
  }

  return {
    ...meta,
    valor_atual: valorAtual,
    porcentagem,
    status
  };
}

exports.paginaMetas = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;

    const metas = await metasModel.listarPorUsuario(idUsuario);
    const progressoBase = await metasModel.buscarProgressoSemanal(idUsuario);

    const metasComProgresso = metas.map((meta) => {
      return calcularMeta(meta, progressoBase);
    });

    return res.render("usuarios/metas", {
      metas: metasComProgresso,
      mensagem: req.query.mensagem || null,
      erro: req.query.erro || null
    });

  } catch (erro) {
    console.error("Erro ao carregar metas:", erro);

    return res.status(500).send(
      "Erro ao carregar metas"
    );
  }
};

exports.criarMeta = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;

    const {
      titulo,
      descricao,
      tipo,
      valor_meta
    } = req.body;

    if (!titulo || !tipo || !valor_meta) {
      return res.redirect(
        "/metas?erro=Preencha os campos obrigatórios"
      );
    }

    await metasModel.criar({
      id_usuario: idUsuario,
      titulo,
      descricao,
      tipo,
      valor_meta: Number(valor_meta),
      unidade: unidadePorTipo(tipo)
    });

    return res.redirect(
      "/metas?mensagem=Meta criada com sucesso"
    );

  } catch (erro) {
    console.error("Erro ao criar meta:", erro);

    return res.redirect(
      "/metas?erro=Erro ao criar meta"
    );
  }
};

exports.atualizarMeta = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;
    const { id } = req.params;

    const {
      titulo,
      descricao,
      tipo,
      valor_meta
    } = req.body;

    if (!titulo || !tipo || !valor_meta) {
      return res.redirect(
        "/metas?erro=Preencha os campos obrigatórios"
      );
    }

    await metasModel.atualizar(
      id,
      idUsuario,
      {
        titulo,
        descricao,
        tipo,
        valor_meta: Number(valor_meta),
        unidade: unidadePorTipo(tipo)
      }
    );

    return res.redirect(
      "/metas?mensagem=Meta atualizada com sucesso"
    );

  } catch (erro) {
    console.error("Erro ao atualizar meta:", erro);

    return res.redirect(
      "/metas?erro=Erro ao atualizar meta"
    );
  }
};

exports.excluirMeta = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;
    const { id } = req.params;

    await metasModel.excluir(id, idUsuario);

    return res.redirect(
      "/metas?mensagem=Meta excluída com sucesso"
    );

  } catch (erro) {
    console.error("Erro ao excluir meta:", erro);

    return res.redirect(
      "/metas?erro=Erro ao excluir meta"
    );
  }
};