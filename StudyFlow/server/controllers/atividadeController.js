const atividadeModel = require("../models/atividadeModel");

async function criarAtividade(req, res) {
    try {
        const { titulo, disciplina, data, urgencia } = req.body;

        await atividadeModel.inserir({
            titulo,
            disciplina,
            data,
            urgencia
        });

        res.status(201).json({
            sucesso: true,
            mensagem: "Atividade criada com sucesso"
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao salvar atividade"
        });
    }
}

module.exports = {
    criarAtividade
};