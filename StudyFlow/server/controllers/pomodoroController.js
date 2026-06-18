const PomodoroModel = require("../models/pomodoroModel");

class PomodoroController {

    async listar(req, res) {
        try {

            const id_usuario = req.usuario.id;

            const pomodoros =
                await PomodoroModel.listarPorUsuario(id_usuario);

            res.render(
                "usuarios/pomodoro",
                { pomodoros }
            );

        } catch (erro) {

            console.log(erro);

            res.status(500).send(
                "Erro ao listar pomodoros"
            );
        }
    }

    async cadastrar(req, res) {

        try {

            await PomodoroModel.criar({
                nome: req.body.nome,
                descricao: req.body.descricao,
                foco_min: req.body.foco_min,
                pausa_min: req.body.pausa_min,
                ciclos: req.body.ciclos,
                cor: req.body.cor,
                id_usuario: req.usuario.id
            });

            res.redirect("/usuarios/pomodoro");

        } catch (erro) {

            console.log(erro);

            res.status(500).send(
                "Erro ao cadastrar pomodoro"
            );
        }
    }

    async excluir(req, res) {

        try {

            await PomodoroModel.excluir(
                req.params.id
            );

            res.redirect("/usuarios/pomodoro");

        } catch (erro) {

            console.log(erro);

            res.status(500).send(
                "Erro ao excluir pomodoro"
            );
        }
    }
}

module.exports = new PomodoroController();