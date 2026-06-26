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

  async salvarSessao(req, res) {
    try {
      const { duracao_min, origem } = req.body;

      if (!duracao_min || Number(duracao_min) <= 0) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Duração inválida"
        });
      }

      await PomodoroModel.salvarSessao({
        id_usuario: req.usuario.id,
        duracao_min: Number(duracao_min),
        origem: origem || "pomodoro"
      });

      return res.json({
        sucesso: true,
        mensagem: "Sessão Pomodoro salva com sucesso"
      });

    } catch (erro) {
      console.log("Erro ao salvar sessão Pomodoro:", erro);

      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao salvar sessão Pomodoro"
      });
    }
  }
}

module.exports = new PomodoroController();