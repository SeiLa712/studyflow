const db = require("../config/db");

exports.criar = async (grupo) => {
  const sql = `
    INSERT INTO grupos
    (
      nome,
      disciplina,
      descricao,
      id_usuario
    )
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await db.query(sql, [
    grupo.nome,
    grupo.disciplina,
    grupo.descricao,
    grupo.id_usuario
  ]);

  return result.insertId;
};

exports.listarPorUsuario = async (idUsuario) => {
  // Verificar se a tabela grupo_membros existe
  const [tables] = await db.query("SHOW TABLES LIKE 'grupo_membros'");
  const tabelaMembrosExiste = tables.length > 0;

  const [tablesSessoes] = await db.query("SHOW TABLES LIKE 'grupo_sessoes'");
  const tabelaSessoesExiste = tablesSessoes.length > 0;

  let sql;
  if (tabelaMembrosExiste) {
    sql = `
      SELECT g.*, 
             COALESCE((SELECT COUNT(*) FROM grupo_membros WHERE id_grupo = g.id), 0) as total_membros,
             (SELECT GROUP_CONCAT(u.nome SEPARATOR ', ') 
              FROM grupo_membros gm 
              JOIN usuarios u ON gm.id_usuario = u.id 
              WHERE gm.id_grupo = g.id 
              LIMIT 3) as membros_preview,
             COALESCE((SELECT COUNT(*) - 3 FROM grupo_membros WHERE id_grupo = g.id), 0) as membros_extras,
             ${tabelaSessoesExiste ? `(SELECT DATE_FORMAT(data_sessao, '%d/%m/%Y') 
            FROM grupo_sessoes 
            WHERE id_grupo = g.id 
            ORDER BY data_sessao ASC, hora_sessao ASC 
            LIMIT 1)` : 'NULL'} as proxima_data,
             ${tabelaSessoesExiste ? `(SELECT TIME_FORMAT(hora_sessao, '%H:%i') 
            FROM grupo_sessoes 
            WHERE id_grupo = g.id 
            ORDER BY data_sessao ASC, hora_sessao ASC 
            LIMIT 1)` : 'NULL'} as proxima_hora
      FROM grupos g
      WHERE g.id_usuario = ?
      ORDER BY g.created_at DESC
    `;
  } else {
    sql = `
      SELECT g.*, 
             0 as total_membros,
             NULL as membros_preview,
             0 as membros_extras,
             NULL as proxima_data,
             NULL as proxima_hora
      FROM grupos g
      WHERE g.id_usuario = ?
      ORDER BY g.created_at DESC
    `;
  }

  const [rows] = await db.query(sql, [idUsuario]);

  return rows;
};

exports.listarTodos = async () => {
  const sql = `
    SELECT g.*, 
           (SELECT COUNT(*) FROM grupo_membros WHERE id_grupo = g.id) as total_membros,
           (SELECT GROUP_CONCAT(u.nome SEPARATOR ', ') 
            FROM grupo_membros gm 
            JOIN usuarios u ON gm.id_usuario = u.id 
            WHERE gm.id_grupo = g.id 
            LIMIT 3) as membros_preview,
           (SELECT COUNT(*) - 3 FROM grupo_membros WHERE id_grupo = g.id) as membros_extras,
           (SELECT DATE_FORMAT(data_sessao, '%d/%m/%Y') 
            FROM grupo_sessoes 
            WHERE id_grupo = g.id 
            ORDER BY data_sessao ASC, hora_sessao ASC 
            LIMIT 1) as proxima_data,
           (SELECT TIME_FORMAT(hora_sessao, '%H:%i') 
            FROM grupo_sessoes 
            WHERE id_grupo = g.id 
            ORDER BY data_sessao ASC, hora_sessao ASC 
            LIMIT 1) as proxima_hora
    FROM grupos g
    ORDER BY g.created_at DESC
  `;

  const [rows] = await db.query(sql);

  return rows;
};

exports.buscarPorId = async (id) => {
  const sql = `
    SELECT g.*, 
           (SELECT COUNT(*) FROM grupo_membros WHERE id_grupo = g.id) as total_membros
    FROM grupos g
    WHERE g.id = ?
  `;

  const [rows] = await db.query(sql, [id]);

  return rows[0];
};

exports.deletar = async (id) => {
  const sql = "DELETE FROM grupos WHERE id = ?";
  await db.query(sql, [id]);
};

exports.adicionarMembro = async (idGrupo, idUsuario) => {
  const sql = `
    INSERT INTO grupo_membros (id_grupo, id_usuario)
    VALUES (?, ?)
  `;
  await db.query(sql, [idGrupo, idUsuario]);
};

exports.listarMembros = async (idGrupo) => {
  const sql = `
    SELECT u.id, u.nome, u.email
    FROM grupo_membros gm
    JOIN usuarios u ON gm.id_usuario = u.id
    WHERE gm.id_grupo = ?
  `;
  const [rows] = await db.query(sql, [idGrupo]);
  return rows;
};

exports.criarSessao = async (sessao) => {
  const sql = `
    INSERT INTO grupo_sessoes (id_grupo, data_sessao, hora_sessao, descricao)
    VALUES (?, ?, ?, ?)
  `;
  await db.query(sql, [sessao.id_grupo, sessao.data_sessao, sessao.hora_sessao, sessao.descricao]);
};

exports.listarSessoes = async (idGrupo) => {
  const sql = `
    SELECT * FROM grupo_sessoes
    WHERE id_grupo = ?
    ORDER BY data_sessao ASC, hora_sessao ASC
  `;
  const [rows] = await db.query(sql, [idGrupo]);
  return rows;
};
exports.usuarioTemAcessoAoGrupo = async (idGrupo, idUsuario) => {
  const sql = `
    SELECT g.id
    FROM grupos g
    LEFT JOIN grupo_membros gm ON gm.id_grupo = g.id
    WHERE g.id = ?
      AND (
        g.id_usuario = ?
        OR gm.id_usuario = ?
      )
    LIMIT 1
  `;

  const [rows] = await db.query(sql, [idGrupo, idUsuario, idUsuario]);

  return rows.length > 0;
};

exports.salvarArquivoGrupo = async (arquivo) => {
  const sql = `
    INSERT INTO grupo_arquivos
    (
      id_grupo,
      id_usuario,
      nome_original,
      nome_arquivo,
      caminho,
      mime_type,
      tamanho_bytes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(sql, [
    arquivo.id_grupo,
    arquivo.id_usuario,
    arquivo.nome_original,
    arquivo.nome_arquivo,
    arquivo.caminho,
    arquivo.mime_type,
    arquivo.tamanho_bytes
  ]);

  return result.insertId;
};

exports.listarArquivosGrupo = async (idGrupo) => {
  const sql = `
    SELECT 
      ga.*,
      u.nome AS nome_usuario
    FROM grupo_arquivos ga
    JOIN usuarios u ON u.id = ga.id_usuario
    WHERE ga.id_grupo = ?
    ORDER BY ga.created_at DESC
  `;

  const [rows] = await db.query(sql, [idGrupo]);

  return rows;
};

exports.buscarArquivoPorId = async (idArquivo) => {
  const sql = `
    SELECT *
    FROM grupo_arquivos
    WHERE id = ?
    LIMIT 1
  `;

  const [rows] = await db.query(sql, [idArquivo]);

  return rows[0];
};
