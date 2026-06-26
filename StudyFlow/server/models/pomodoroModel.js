const database = require("../config/db");

class Pomodoro {
  static async listarPorUsuario(id_usuario) {
    const sql = `
      SELECT *
      FROM pomodoros
      WHERE id_usuario = ?
      ORDER BY created_at DESC
    `;

    const [rows] = await database.query(sql, [id_usuario]);
    return rows;
  }

  static async criar(dados) {
    const sql = `
      INSERT INTO pomodoros
      (
        nome,
        descricao,
        foco_min,
        pausa_min,
        ciclos,
        cor,
        id_usuario
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
      dados.nome,
      dados.descricao,
      dados.foco_min,
      dados.pausa_min,
      dados.ciclos,
      dados.cor,
      dados.id_usuario
    ];

    const [resultado] = await database.query(sql, valores);

    return resultado;
  }

  static async excluir(id) {
    const sql = `
      DELETE FROM pomodoros
      WHERE id = ?
    `;

    const [resultado] = await database.query(sql, [id]);

    return resultado;
  }

  static async salvarSessao(dados) {
    const sql = `
      INSERT INTO pomodoro_sessoes
      (
        id_usuario,
        duracao_min,
        origem
      )
      VALUES (?, ?, ?)
    `;

    const [resultado] = await database.query(sql, [
      dados.id_usuario,
      dados.duracao_min,
      dados.origem || "pomodoro"
    ]);

    return resultado;
  }
}

module.exports = Pomodoro;