const db = require("../config/db");

exports.buscarUsuarioPorId = async (idUsuario) => {
  const sql = `
    SELECT
      id,
      nome,
      email,
      perfil,
      plano,
      assinatura_ativa,
      assinatura_expira_em,
      created_at
    FROM usuarios
    WHERE id = ?
    LIMIT 1
  `;

  const [rows] = await db.query(sql, [idUsuario]);

  return rows[0];
};

exports.atualizarPerfil = async (idUsuario, nome, email) => {
  const sql = `
    UPDATE usuarios
    SET
      nome = ?,
      email = ?
    WHERE id = ?
  `;

  return db.query(sql, [nome, email, idUsuario]);
};

exports.atualizarSenha = async (idUsuario, senhaHash) => {
  const sql = `
    UPDATE usuarios
    SET senha = ?
    WHERE id = ?
  `;

  return db.query(sql, [senhaHash, idUsuario]);
};

exports.ativarPremium = async (idUsuario) => {
  const sql = `
    UPDATE usuarios
    SET
      plano = 'premium',
      assinatura_ativa = TRUE,
      assinatura_expira_em = DATE_ADD(NOW(), INTERVAL 30 DAY)
    WHERE id = ?
  `;

  return db.query(sql, [idUsuario]);
};

exports.cancelarPremium = async (idUsuario) => {
  const sql = `
    UPDATE usuarios
    SET
      plano = 'free',
      assinatura_ativa = FALSE,
      assinatura_expira_em = NULL
    WHERE id = ?
  `;

  return db.query(sql, [idUsuario]);
};