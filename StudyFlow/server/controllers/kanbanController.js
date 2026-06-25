const kanbanModel = require("../models/kanbanModel");

async function index(req, res) {
    try {
        const idUsuario = req.usuario.id;

        let kanban = await kanbanModel.buscarKanbanUsuario(idUsuario);

        if (!kanban) {
            const idKanban = await kanbanModel.criarKanbanUsuario(idUsuario);

            kanban = {
                id: idKanban,
                nome: "Quadro Kanban",
                id_usuario: idUsuario
            };
        }

        let colunas = await kanbanModel.listarColunas(kanban.id);

        if (colunas.length === 0) {
            await kanbanModel.criarColunasPadrao(kanban.id);
            colunas = await kanbanModel.listarColunas(kanban.id);
        }

        const cards = await kanbanModel.listarCards(kanban.id);

        return res.render("usuarios/kanban", {
            kanban,
            colunas,
            cards
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send("Erro ao carregar Kanban");
    }
}

async function criarColuna(req, res) {
    try {
        const { nome, idKanban } = req.body;

        if (!nome || !idKanban) {
            return res.status(400).send("Dados inválidos");
        }

        await kanbanModel.criarColuna(nome, idKanban);

        return res.redirect("/kanban");

    } catch (err) {
        console.log(err);
        return res.status(500).send("Erro ao criar coluna");
    }
}

async function criarCard(req, res) {
    try {
        const { titulo, descricao, id_coluna } = req.body;

        if (!titulo || !id_coluna) {
            return res.status(400).send("Dados inválidos");
        }

        await kanbanModel.criarCard(titulo, descricao, id_coluna);

        return res.redirect("/kanban");

    } catch (err) {
        console.log(err);
        return res.status(500).send("Erro ao criar card");
    }
}

async function moverCard(req, res) {
    try {
        const { idCard, idColuna } = req.body;

        if (!idCard || !idColuna) {
            return res.status(400).json({ error: "Dados inválidos" });
        }

        await kanbanModel.moverCard(idCard, idColuna);

        return res.json({ success: true });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Erro ao mover card" });
    }
}

module.exports = {
    index,
    criarColuna,
    criarCard,
    moverCard
};