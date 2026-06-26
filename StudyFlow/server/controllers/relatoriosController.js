const {
  executarRelatorioSemanal,
  gerarPdfSemanal
} = require("../services/pythonService");

exports.paginaRelatorios = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;

    const relatorio = await executarRelatorioSemanal(idUsuario);

    return res.render("usuarios/relatorios", {
      relatorio
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

    const relatorio = await executarRelatorioSemanal(idUsuario);

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