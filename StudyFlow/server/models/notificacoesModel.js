const db = require("../config/db");

async function tabelaExiste(nomeTabela) {
  const [rows] = await db.query(
    "SHOW TABLES LIKE ?",
    [nomeTabela]
  );

  return rows.length > 0;
}

exports.listarPorUsuario = async (idUsuario) => {
  const notificacoes = [];

  /*
    TAREFAS ATRASADAS
  */
  const [tarefasAtrasadas] = await db.query(
    `
      SELECT
        id,
        nome,
        data_vencimento,
        prioridade
      FROM tarefas
      WHERE id_usuario = ?
        AND concluida = FALSE
        AND data_vencimento < CURDATE()
      ORDER BY data_vencimento ASC
      LIMIT 5
    `,
    [idUsuario]
  );

  tarefasAtrasadas.forEach((tarefa) => {
    notificacoes.push({
      tipo: "tarefa",
      prioridade: "alta",
      icone: "fa-triangle-exclamation",
      titulo: "Tarefa atrasada",
      descricao: `"${tarefa.nome}" está atrasada. Priorize essa atividade.`,
      link: "/usuarios/pagina-inicial"
    });
  });

  /*
    TAREFAS VENCENDO HOJE
  */
  const [tarefasHoje] = await db.query(
    `
      SELECT
        id,
        nome,
        prioridade
      FROM tarefas
      WHERE id_usuario = ?
        AND concluida = FALSE
        AND data_vencimento = CURDATE()
      ORDER BY prioridade DESC
      LIMIT 5
    `,
    [idUsuario]
  );

  tarefasHoje.forEach((tarefa) => {
    notificacoes.push({
      tipo: "tarefa",
      prioridade: "media",
      icone: "fa-calendar-day",
      titulo: "Tarefa vence hoje",
      descricao: `"${tarefa.nome}" vence hoje. Tente concluir ainda neste dia.`,
      link: "/usuarios/calendario"
    });
  });

  /*
    TAREFAS VENCENDO AMANHÃ
  */
  const [tarefasAmanha] = await db.query(
    `
      SELECT
        id,
        nome,
        prioridade
      FROM tarefas
      WHERE id_usuario = ?
        AND concluida = FALSE
        AND data_vencimento = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
      ORDER BY prioridade DESC
      LIMIT 5
    `,
    [idUsuario]
  );

  tarefasAmanha.forEach((tarefa) => {
    notificacoes.push({
      tipo: "tarefa",
      prioridade: "baixa",
      icone: "fa-clock",
      titulo: "Tarefa vence amanhã",
      descricao: `"${tarefa.nome}" vence amanhã. Vale se preparar antes.`,
      link: "/usuarios/calendario"
    });
  });

  /*
    POMODORO DO DIA
  */
  if (await tabelaExiste("pomodoro_sessoes")) {
    const [focoHoje] = await db.query(
      `
        SELECT
          COALESCE(SUM(duracao_min), 0) AS total_minutos
        FROM pomodoro_sessoes
        WHERE id_usuario = ?
          AND DATE(created_at) = CURDATE()
      `,
      [idUsuario]
    );

    const minutosHoje = Number(
      focoHoje[0]?.total_minutos || 0
    );

    if (minutosHoje === 0) {
      notificacoes.push({
        tipo: "foco",
        prioridade: "media",
        icone: "fa-stopwatch",
        titulo: "Nenhum foco registrado hoje",
        descricao: "Você ainda não concluiu nenhuma sessão Pomodoro hoje.",
        link: "/usuarios/pomodoro"
      });
    }

    if (minutosHoje >= 50) {
      notificacoes.push({
        tipo: "foco",
        prioridade: "baixa",
        icone: "fa-fire",
        titulo: "Bom ritmo de foco",
        descricao: `Você já acumulou ${minutosHoje} minutos de foco hoje.`,
        link: "/usuarios/pomodoro"
      });
    }
  }

  /*
    METAS
  */
  if (await tabelaExiste("metas_semanais")) {
    const [metas] = await db.query(
      `
        SELECT
          id,
          titulo,
          tipo,
          valor_meta,
          unidade
        FROM metas_semanais
        WHERE id_usuario = ?
          AND ativo = TRUE
      `,
      [idUsuario]
    );

    if (metas.length === 0) {
      notificacoes.push({
        tipo: "meta",
        prioridade: "media",
        icone: "fa-bullseye",
        titulo: "Nenhuma meta cadastrada",
        descricao: "Crie metas semanais para acompanhar melhor sua evolução.",
        link: "/metas"
      });
    }
  }

  /*
    ORGANIZA POR PRIORIDADE
  */
  const ordemPrioridade = {
    alta: 1,
    media: 2,
    baixa: 3
  };

  notificacoes.sort((a, b) => {
    return ordemPrioridade[a.prioridade] -
      ordemPrioridade[b.prioridade];
  });

  return notificacoes;
};

exports.contarPorUsuario = async (idUsuario) => {
  const notificacoes =
    await exports.listarPorUsuario(idUsuario);

  return notificacoes.length;
};