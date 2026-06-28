const {
  executarRelatorioSemanal,
  gerarPdfSemanal
} = require("../services/pythonService");

function obterSemanaSelecionada(req) {
  const semana = Number.parseInt(req.query.semana || "0", 10);

  if (Number.isNaN(semana) || semana < 0) {
    return 0;
  }

  return semana;
}

exports.paginaRelatorios = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;

    const semanaSelecionada = obterSemanaSelecionada(req);

    const relatorio = await executarRelatorioSemanal(
      idUsuario,
      semanaSelecionada
    );

    return res.render("usuarios/relatorios", {
      relatorio,
      semanaSelecionada
    });

  } catch (erro) {
    console.error("Erro ao carregar relatórios:", erro);

    return res.status(500).send(
      "Erro ao carregar relatórios: " + erro.message
    );
  }
};

exports.baixarPdf = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;

    const semanaSelecionada = obterSemanaSelecionada(req);

    const relatorio = await executarRelatorioSemanal(
      idUsuario,
      semanaSelecionada
    );

    const pdf = await gerarPdfSemanal(
      relatorio,
      idUsuario
    );

    return res.download(
      pdf.caminho,
      pdf.nome
    );

  } catch (erro) {
    console.error("Erro ao gerar PDF:", erro);

    return res.status(500).send(
      "Erro ao gerar PDF: " + erro.message
    );
  }
};