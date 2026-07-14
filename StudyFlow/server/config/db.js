const mysql = require("mysql2/promise");
const dns = require("node:dns");

// Prioriza IPv4 no Render
dns.setDefaultResultOrder("ipv4first");

const pool = mysql.createPool({
  host: process.env.DB_HOST?.trim(),
  port: Number(process.env.DB_PORT || 18330),
  user: process.env.DB_USER?.trim(),
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME?.trim(),

  // Aiven exige SSL
  ssl: {
    rejectUnauthorized: false
  },

  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,

  connectTimeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Testa a conexão quando o servidor iniciar
(async () => {
  try {
    const conexao = await pool.getConnection();

    console.log("Banco de dados Aiven conectado com sucesso!");
    console.log("Banco utilizado:", process.env.DB_NAME);

    conexao.release();
  } catch (erro) {
    console.error("Erro ao conectar com o banco Aiven:", {
      codigo: erro.code,
      mensagem: erro.message,
      host: process.env.DB_HOST,
      porta: process.env.DB_PORT,
      banco: process.env.DB_NAME,
      usuario: process.env.DB_USER
    });
  }
})();

module.exports = pool;