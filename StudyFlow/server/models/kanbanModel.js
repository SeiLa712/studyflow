const db = require("../config/db.js");

async function buscarKanbanUsuario(idUsuario) {
    const [rows] = await db.query(
        "SELECT * FROM kanbans WHERE id_usuario = ? LIMIT 1",
        [idUsuario]
    );

    return rows[0];
}

async function criarKanbanUsuario(idUsuario) {
    const [result] = await db.query(
        "INSERT INTO kanbans (nome, id_usuario) VALUES (?, ?)",
        ["Quadro Kanban", idUsuario]
    );

    return result.insertId;
}

async function listarColunas(idKanban) {
    const [rows] = await db.query(
        "SELECT * FROM kanban_colunas WHERE id_kanban = ? ORDER BY ordem ASC",
        [idKanban]
    );

    return rows;
}

async function criarColunasPadrao(idKanban) {
    const colunasPadrao = [
        ["A Fazer", 1],
        ["Em Andamento", 2],
        ["Revisão", 3],
        ["Concluído", 4]
    ];

    for (const [nome, ordem] of colunasPadrao) {
        await db.query(
            "INSERT INTO kanban_colunas (nome, ordem, id_kanban) VALUES (?, ?, ?)",
            [nome, ordem, idKanban]
        );
    }
}

async function listarCards(idKanban) {
    const [rows] = await db.query(
        `
        SELECT kc.*
        FROM kanban_cards kc
        INNER JOIN kanban_colunas col ON col.id = kc.id_coluna
        WHERE col.id_kanban = ?
        ORDER BY kc.id ASC
        `,
        [idKanban]
    );

    return rows;
}

async function criarColuna(nome, idKanban) {
    const [rows] = await db.query(
        "SELECT COUNT(*) AS total FROM kanban_colunas WHERE id_kanban = ?",
        [idKanban]
    );

    const ordem = rows[0].total + 1;

    await db.query(
        "INSERT INTO kanban_colunas (nome, ordem, id_kanban) VALUES (?, ?, ?)",
        [nome, ordem, idKanban]
    );
}

async function criarCard(titulo, descricao, id_coluna) {
    await db.query(
        "INSERT INTO kanban_cards (titulo, descricao, id_coluna) VALUES (?, ?, ?)",
        [titulo, descricao, id_coluna]
    );
}

async function moverCard(idCard, idColuna) {
    await db.query(
        "UPDATE kanban_cards SET id_coluna = ? WHERE id = ?",
        [idColuna, idCard]
    );
}

module.exports = {
    buscarKanbanUsuario,
    criarKanbanUsuario,
    listarColunas,
    criarColunasPadrao,
    listarCards,
    criarColuna,
    criarCard,
    moverCard
};