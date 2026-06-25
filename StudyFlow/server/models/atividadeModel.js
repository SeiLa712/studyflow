const db = require("../config/db");

/* =========================
   CRIAR ATIVIDADE
========================= */

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

/* =========================
   PRÓXIMAS ATIVIDADES

   Regras:
   - Mostra somente tarefas do usuário logado
   - Não mostra tarefas vencidas há mais de 1 mês
   - Organiza por data
   - Na mesma data, organiza por urgência:
     alta > media > baixa
========================= */

exports.listarProximasPorUsuario = async (idUsuario) => {
  const sql = `
    SELECT *
    FROM tarefas
    WHERE id_usuario = ?
      AND data_vencimento >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
    ORDER BY
      ABS(DATEDIFF(data_vencimento, CURDATE())) ASC,
      CASE prioridade
        WHEN 'alta' THEN 1
        WHEN 'media' THEN 2
        WHEN 'baixa' THEN 3
        ELSE 4
      END ASC,
      data_vencimento ASC,
      created_at DESC
  `;

  const [rows] = await db.query(sql, [idUsuario]);

  return rows;
};

/* =========================
   ATIVIDADES DO CALENDÁRIO

   Regras:
   - Mostra todas as tarefas do usuário logado
   - Mesmo as vencidas há mais de 1 mês
   - Usado para o calendário geral/semanal
========================= */

exports.listarCalendarioPorUsuario = async (idUsuario) => {
  const sql = `
    SELECT *
    FROM tarefas
    WHERE id_usuario = ?
    ORDER BY
      data_vencimento ASC,
      CASE prioridade
        WHEN 'alta' THEN 1
        WHEN 'media' THEN 2
        WHEN 'baixa' THEN 3
        ELSE 4
      END ASC,
      created_at DESC
  `;

  const [rows] = await db.query(sql, [idUsuario]);

  return rows;
};

/* =========================
   COMPATIBILIDADE

   Essa função evita o erro:
   atividadeModel.listarPorUsuario is not a function

   Ela retorna as próximas atividades.
========================= */

exports.listarPorUsuario = async (idUsuario) => {
  return exports.listarProximasPorUsuario(idUsuario);
};

/* =========================
   LISTAR TODAS

   Mantida por compatibilidade, caso algum controller antigo use.
========================= */

exports.listar = async () => {
  const sql = `
    SELECT *
    FROM tarefas
    ORDER BY
      data_vencimento ASC,
      CASE prioridade
        WHEN 'alta' THEN 1
        WHEN 'media' THEN 2
        WHEN 'baixa' THEN 3
        ELSE 4
      END ASC,
      created_at DESC
  `;

  const [rows] = await db.query(sql);

  return rows;
};

/* =========================
   DELETAR ATIVIDADE
========================= */

exports.deletar = async (id) => {
  const sql = "DELETE FROM tarefas WHERE id = ?";

  return db.query(sql, [id]);
};
exports.atualizar = async (id, idUsuario, atividade) => {
  const sql = `
    UPDATE tarefas
    SET
      nome = ?,
      descricao = ?,
      prioridade = ?,
      data_vencimento = ?
    WHERE id = ?
      AND id_usuario = ?
  `;

  return db.query(sql, [
    atividade.nome,
    atividade.descricao,
    atividade.prioridade,
    atividade.data_vencimento,
    id,
    idUsuario
  ]);
};