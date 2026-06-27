const db = require("../config/db");

exports.verificarAssinatura = async (req, res, next) => {
  try {
    const idUsuario = req.usuario?.id;

    if (!idUsuario) {
      return res.redirect("/login");
    }

    const sql = `
      SELECT
        id,
        nome,
        plano,
        assinatura_ativa,
        assinatura_expira_em
      FROM usuarios
      WHERE id = ?
      LIMIT 1
    `;

    const [rows] = await db.query(sql, [idUsuario]);

    if (rows.length === 0) {
      return res.redirect("/login");
    }

    const usuario = rows[0];

    const planoPremium =
      usuario.plano === "premium";

    const assinaturaAtiva =
      usuario.assinatura_ativa === true ||
      usuario.assinatura_ativa === 1;

    const naoTemDataExpiracao =
      usuario.assinatura_expira_em === null;

    const assinaturaNaoExpirou =
      naoTemDataExpiracao ||
      new Date(usuario.assinatura_expira_em) > new Date();

    const podeAcessar =
      planoPremium &&
      assinaturaAtiva &&
      assinaturaNaoExpirou;

    if (podeAcessar) {
      return next();
    }

    return res.status(403).render("usuarios/assinatura-bloqueada", {
      usuario,
      mensagem:
        "Esta área está disponível apenas para usuários Premium."
    });

  } catch (erro) {
    console.error("Erro ao verificar assinatura:", erro);

    return res.status(500).send(
      "Erro ao verificar assinatura"
    );
  }
};