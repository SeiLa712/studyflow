document.addEventListener("DOMContentLoaded", async () => {
  const badge = document.getElementById("notificationBadge");
  const botaoMarcarLidas = document.getElementById("marcarLidasBtn");
  const contadorPagina = document.getElementById("contadorPaginaNotificacoes");

  const hoje = new Date().toISOString().slice(0, 10);
  const chaveLidas = `studyflow-notificacoes-lidas-${hoje}`;

  function buscarTotalLido() {
    return Number(localStorage.getItem(chaveLidas) || 0);
  }

  function salvarTotalLido(total) {
    localStorage.setItem(chaveLidas, String(total));
  }

  function esconderBadge() {
    if (!badge) return;

    badge.textContent = "";
    badge.hidden = true;
    badge.classList.add("badge-hidden");
    badge.style.display = "none";
  }

  function mostrarBadge(total) {
    if (!badge) return;

    badge.hidden = false;
    badge.classList.remove("badge-hidden");
    badge.style.display = "inline-flex";
    badge.textContent = total > 9 ? "9+" : total;
  }

  function atualizarBadge(total) {
    const totalLido = buscarTotalLido();
    const totalNaoLido = Math.max(total - totalLido, 0);

    if (totalNaoLido > 0) {
      mostrarBadge(totalNaoLido);
    } else {
      esconderBadge();
    }
  }

  async function carregarContador() {
    try {
      const resposta = await fetch("/notificacoes/contador");

      if (!resposta.ok) {
        esconderBadge();
        return 0;
      }

      const dados = await resposta.json();

      const total = Number(dados.total || 0);

      atualizarBadge(total);

      return total;

    } catch (erro) {
      console.error("Erro ao carregar notificações:", erro);
      esconderBadge();
      return 0;
    }
  }

  const totalAtual = await carregarContador();

  const totalLido = buscarTotalLido();

  if (totalAtual > 0 && totalLido >= totalAtual) {
    esconderBadge();

    if (contadorPagina) {
      contadorPagina.textContent = "0 aviso(s) novo(s)";
    }

    if (botaoMarcarLidas) {
      botaoMarcarLidas.innerHTML = `
        <i class="fa-solid fa-check-double"></i>
        Tudo lido
      `;

      botaoMarcarLidas.disabled = true;
      botaoMarcarLidas.classList.add("lido");
    }
  }

  if (botaoMarcarLidas) {
    botaoMarcarLidas.addEventListener("click", () => {
      const totalPagina = Number(
        botaoMarcarLidas.dataset.total || totalAtual || 0
      );

      salvarTotalLido(totalPagina);

      esconderBadge();

      if (contadorPagina) {
        contadorPagina.textContent = "0 aviso(s) novo(s)";
      }

      botaoMarcarLidas.innerHTML = `
        <i class="fa-solid fa-check-double"></i>
        Tudo lido
      `;

      botaoMarcarLidas.disabled = true;
      botaoMarcarLidas.classList.add("lido");
    });
  }
});