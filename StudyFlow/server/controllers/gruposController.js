const gruposModel = require("../models/gruposModel");

exports.paginaGrupos = async (req, res) => {
  try {
    const grupos = await gruposModel.listarPorUsuario(req.usuario.id);

    res.render("usuarios/grupos", {
      grupos
    });

  } catch (erro) {
    console.error("Erro ao carregar grupos:", erro);
    res.status(500).send("Erro ao carregar grupos: " + erro.message);
  }
};

exports.criarGrupo = async (req, res) => {
  try {
    const {
      nome,
      disciplina,
      descricao
    } = req.body;

    // Criar coluna disciplina se não existir
    const db = require("../config/db");
    try {
      await db.query(`
        ALTER TABLE grupos 
        ADD COLUMN disciplina VARCHAR(100) 
        AFTER nome
      `);
    } catch (alterError) {
      console.log("Coluna disciplina já existe ou erro ao criar:", alterError.message);
    }

    const grupoId = await gruposModel.criar({
      nome,
      disciplina,
      descricao,
      id_usuario: req.usuario.id
    });

    return res.redirect("/usuarios/grupos");

  } catch (erro) {
    console.error("Erro ao criar grupo:", erro);
    res.status(500).send("Erro ao criar grupo: " + erro.message);
  }
};

exports.excluirGrupo = async (req, res) => {
  try {
    const { id } = req.params;

    await gruposModel.deletar(id);

    return res.sendStatus(200);

  } catch (erro) {
    console.error(erro);
    return res.sendStatus(500);
  }
};

exports.adicionarMembro = async (req, res) => {
  try {
    const { id } = req.params;
    const { email_usuario } = req.body;

    const usuarioModel = require("../models/usuarioModel");
    const usuario = await usuarioModel.buscarPorEmail(email_usuario);

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    // Criar tabela se não existir
    const db = require("../config/db");
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS grupo_membros (
          id INT AUTO_INCREMENT PRIMARY KEY,
          id_grupo INT NOT NULL,
          id_usuario INT NOT NULL,
          data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          
          FOREIGN KEY (id_grupo)
            REFERENCES grupos(id)
            ON DELETE CASCADE,
          
          FOREIGN KEY (id_usuario)
            REFERENCES usuarios(id)
            ON DELETE CASCADE,
          
          UNIQUE KEY unique_membro (id_grupo, id_usuario)
        )
      `);
    } catch (tableError) {
      console.log("Tabela já existe ou erro ao criar:", tableError.message);
    }

    await gruposModel.adicionarMembro(id, usuario.id);

    return res.json({ 
      sucesso: true, 
      mensagem: "Membro adicionado com sucesso",
      nome_usuario: usuario.nome 
    });

  } catch (erro) {
    console.error("Erro ao adicionar membro:", erro);
    return res.status(500).json({ erro: "Erro ao adicionar membro: " + erro.message });
  }
};

exports.listarMembros = async (req, res) => {
  try {
    const { id } = req.params;

    const membros = await gruposModel.listarMembros(id);

    return res.json(membros);

  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Erro ao listar membros" });
  }
};

exports.criarSessao = async (req, res) => {
  try {
    const { id } = req.params;
    const { data_sessao, hora_sessao, descricao } = req.body;

    await gruposModel.criarSessao({
      id_grupo: id,
      data_sessao,
      hora_sessao,
      descricao
    });

    return res.json({ sucesso: true });

  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Erro ao criar sessão" });
  }
};

exports.listarSessoes = async (req, res) => {
  try {
    const { id } = req.params;

    const sessoes = await gruposModel.listarSessoes(id);

    return res.json(sessoes);

  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Erro ao listar sessões" });
  }
};
