const db = require("../config/db");

async function inserir(atividade) {
    const sql = `
        INSERT INTO atividades
        (titulo, disciplina, data_entrega, urgencia)
        VALUES (?, ?, ?, ?)
    `;

    return db.query(sql, [
        atividade.titulo,
        atividade.disciplina,
        atividade.data,
        atividade.urgencia
    ]);
}

module.exports = {
    inserir
};