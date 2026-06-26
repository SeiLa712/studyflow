const { spawn } = require("child_process");
const path = require("path");

function executarRelatorioSemanal(idUsuario) {
  return new Promise((resolve, reject) => {
    const pythonCommand = process.env.PYTHON_CMD || "python";

    const scriptPath = path.join(
      __dirname,
      "../../python/relatorio_semanal.py"
    );

    const processo = spawn(
      pythonCommand,
      [scriptPath, String(idUsuario)],
      {
        env: {
          ...process.env,
          PYTHONIOENCODING: "utf-8",
          PYTHONUTF8: "1"
        }
      }
    );

    let saida = "";
    let erro = "";

    processo.stdout.on("data", (data) => {
      saida += data.toString();
    });

    processo.stderr.on("data", (data) => {
      erro += data.toString();
    });

    processo.on("close", (code) => {
      if (code !== 0) {
        return reject(
          new Error(
            erro || "Erro ao executar o script Python"
          )
        );
      }

      try {
        const json = JSON.parse(saida);
        return resolve(json);
      } catch (parseErro) {
        return reject(
          new Error(
            "Erro ao interpretar resposta do Python: " + saida
          )
        );
      }
    });
  });
}

function gerarPdfSemanal(relatorio, idUsuario) {
  return new Promise((resolve, reject) => {
    const pythonCommand = process.env.PYTHON_CMD || "python";

    const scriptPath = path.join(
      __dirname,
      "../../python/gerar_pdf_semanal.py"
    );

    const pastaSaida = path.join(
      __dirname,
      "../../client/public/relatorios"
    );

    const processo = spawn(
      pythonCommand,
      [scriptPath, pastaSaida],
      {
        env: {
          ...process.env,
          PYTHONIOENCODING: "utf-8",
          PYTHONUTF8: "1"
        }
      }
    );

    let saida = "";
    let erro = "";

    processo.stdout.on("data", (data) => {
      saida += data.toString();
    });

    processo.stderr.on("data", (data) => {
      erro += data.toString();
    });

    processo.stdin.write(
      JSON.stringify({
        id_usuario: idUsuario,
        relatorio
      })
    );

    processo.stdin.end();

    processo.on("close", (code) => {
      if (code !== 0) {
        return reject(
          new Error(
            erro || "Erro ao gerar PDF com Python"
          )
        );
      }

      try {
        const json = JSON.parse(saida);
        return resolve(json);
      } catch (parseErro) {
        return reject(
          new Error(
            "Erro ao interpretar resposta do PDF: " + saida
          )
        );
      }
    });
  });
}

module.exports = {
  executarRelatorioSemanal,
  gerarPdfSemanal
};