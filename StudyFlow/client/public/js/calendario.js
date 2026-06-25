document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // MODAL ADICIONAR ATIVIDADE
  // =========================

  const openModal = document.getElementById("openModal");
  const modalOverlay = document.getElementById("modalOverlay");
  const closeModal = document.getElementById("closeModal");
  const cancelModal = document.getElementById("cancelModal");
  const inputData = document.getElementById("data_vencimento");

  function abrirModalAdicionar(dataSelecionada = null) {
    if (dataSelecionada && inputData) {
      inputData.value = dataSelecionada;
    }

    modalOverlay.classList.add("show");
  }

  function fecharModalAdicionar() {
    modalOverlay.classList.remove("show");
  }

  openModal?.addEventListener("click", () => {
    abrirModalAdicionar();
  });

  closeModal?.addEventListener("click", fecharModalAdicionar);
  cancelModal?.addEventListener("click", fecharModalAdicionar);

  modalOverlay?.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      fecharModalAdicionar();
    }
  });

  // =========================
  // MODAL DETALHES
  // =========================

  const modalDetalhesOverlay = document.getElementById("modalDetalhesOverlay");
  const closeDetalhesModal = document.getElementById("closeDetalhesModal");

  const detalheTitulo = document.getElementById("detalheTitulo");
  const detalheDescricao = document.getElementById("detalheDescricao");
  const detalheData = document.getElementById("detalheData");
  const detalhePrioridade = document.getElementById("detalhePrioridade");

  function formatarDataBR(dataISO) {
    if (!dataISO) return "Sem data";

    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  function formatarPrioridade(prioridade) {
    if (prioridade === "alta") return "Alta prioridade";
    if (prioridade === "media") return "Média prioridade";
    return "Baixa prioridade";
  }

  function abrirModalDetalhes(elemento) {
    const titulo = elemento.dataset.titulo;
    const descricao = elemento.dataset.descricao;
    const data = elemento.dataset.data;
    const prioridade = elemento.dataset.prioridade;

    detalheTitulo.textContent = titulo || "Atividade";
    detalheDescricao.textContent = descricao || "Sem descrição.";
    detalheData.textContent = formatarDataBR(data);
    detalhePrioridade.textContent = formatarPrioridade(prioridade);

    modalDetalhesOverlay.classList.add("show");
  }

  function fecharModalDetalhes() {
    modalDetalhesOverlay.classList.remove("show");
  }

  closeDetalhesModal?.addEventListener("click", fecharModalDetalhes);

  modalDetalhesOverlay?.addEventListener("click", (e) => {
    if (e.target === modalDetalhesOverlay) {
      fecharModalDetalhes();
    }
  });

  document.querySelectorAll(".activity-tag").forEach((atividade) => {
    atividade.addEventListener("click", (e) => {
      e.stopPropagation();
      abrirModalDetalhes(atividade);
    });
  });

  // =========================
  // CLICAR NO DIA DO CALENDÁRIO
  // =========================

  document.querySelectorAll(".calendar-day:not(.empty)").forEach((dia) => {
    dia.addEventListener("click", () => {
      const dataSelecionada = dia.dataset.date;
      abrirModalAdicionar(dataSelecionada);
    });
  });

  // =========================
  // NAVEGAÇÃO DE MESES
  // =========================

  const titulo = document.getElementById("currentMonth");
  const prevMonth = document.getElementById("prevMonth");
  const nextMonth = document.getElementById("nextMonth");

  if (!titulo) return;

  let mes = parseInt(titulo.dataset.mes);
  let ano = parseInt(titulo.dataset.ano);

  prevMonth?.addEventListener("click", () => {
    mes--;

    if (mes < 0) {
      mes = 11;
      ano--;
    }

    window.location.href = `/usuarios/calendario?mes=${mes}&ano=${ano}`;
  });

  nextMonth?.addEventListener("click", () => {
    mes++;

    if (mes > 11) {
      mes = 0;
      ano++;
    }

    window.location.href = `/usuarios/calendario?mes=${mes}&ano=${ano}`;
  });
});