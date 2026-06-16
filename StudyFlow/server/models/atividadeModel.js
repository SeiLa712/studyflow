const db = require("../config/db");

exports.criar = async (atividade) => {
  const sql = `
    INSERT INTO tarefas
    (
      nome,
      descricao,
      prioridade,
      data_vencimento,
      id_usuario
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  return db.query(sql, [
    atividade.nome,
    atividade.descricao,
    atividade.prioridade,
    atividade.data_vencimento,
    atividade.id_usuario
  ]);
};

exports.listarPorUsuario = async (idUsuario) => {
  const sql = `
    SELECT *
    FROM tarefas
    WHERE id_usuario = ?
    ORDER BY data_vencimento ASC
  `;

  const [rows] = await db.query(sql, [idUsuario]);

  return rows;
};