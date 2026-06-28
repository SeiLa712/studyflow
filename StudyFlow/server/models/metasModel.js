const db = require("../config/db");

exports.listarPorUsuario = async (idUsuario) => {
  const sql = `
    SELECT
      id,
      id_usuario,
      titulo,
      descricao,
      tipo,
      valor_meta,
      unidade,
      ativo,
      created_at,
      updated_at
    FROM metas_semanais
    WHERE id_usuario = ?
      AND ativo = TRUE
    ORDER BY created_at DESC
  `;

  const [rows] = await db.query(sql, [idUsuario]);

  return rows;
};

exports.criar = async (dados) => {
  const sql = `
    INSERT INTO metas_semanais
    (
      id_usuario,
      titulo,
      descricao,
      tipo,
      valor_meta,
      unidade
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [resultado] = await db.query(sql, [
    dados.id_usuario,
    dados.titulo,
    dados.descricao,
    dados.tipo,
    dados.valor_meta,
    dados.unidade
  ]);

  return resultado;
};

exports.atualizar = async (idMeta, idUsuario, dados) => {
  const sql = `
    UPDATE metas_semanais
    SET
      titulo = ?,
      descricao = ?,
      tipo = ?,
      valor_meta = ?,
      unidade = ?
    WHERE id = ?
      AND id_usuario = ?
  `;

  const [resultado] = await db.query(sql, [
    dados.titulo,
    dados.descricao,
    dados.tipo,
    dados.valor_meta,
    dados.unidade,
    idMeta,
    idUsuario
  ]);

  return resultado;
};

exports.excluir = async (idMeta, idUsuario) => {
  const sql = `
    UPDATE metas_semanais
    SET ativo = FALSE
    WHERE id = ?
      AND id_usuario = ?
  `;

  const [resultado] = await db.query(sql, [
    idMeta,
    idUsuario
  ]);

  return resultado;
};

exports.buscarProgressoSemanal = async (idUsuario) => {
  const [tarefasRows] = await db.query(
    `
      SELECT COUNT(*) AS total
      FROM tarefas
      WHERE id_usuario = ?
        AND concluida = TRUE
        AND DATE(concluida_em) BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND CURDATE()
    `,
    [idUsuario]
  );

  const [focoRows] = await db.query(
    `
      SELECT COALESCE(SUM(duracao_min), 0) AS total
      FROM pomodoro_sessoes
      WHERE id_usuario = ?
        AND DATE(created_at) BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND CURDATE()
    `,
    [idUsuario]
  );

  const [atrasadasRows] = await db.query(
    `
      SELECT COUNT(*) AS total
      FROM tarefas
      WHERE id_usuario = ?
        AND concluida = FALSE
        AND data_vencimento < CURDATE()
    `,
    [idUsuario]
  );

  return {
    tarefas: tarefasRows[0].total || 0,
    foco: focoRows[0].total || 0,
    atrasos: atrasadasRows[0].total || 0
  };
};