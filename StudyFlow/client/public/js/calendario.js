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
    if (inputData) {
      inputData.value = dataSelecionada || "";
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
  // MODAL EDITAR ATIVIDADE
  // =========================

  const modalEditarOverlay = document.getElementById("modalEditarOverlay");
  const closeEditModal = document.getElementById("closeEditModal");
  const cancelEditModal = document.getElementById("cancelEditModal");
  const editActivityForm = document.getElementById("editActivityForm");

  const editNome = document.getElementById("editNome");
  const editDescricao = document.getElementById("editDescricao");
  const editData = document.getElementById("editData");
  const editPrioridade = document.getElementById("editPrioridade");

  function abrirModalEditarAtividade(elemento) {
    const id = elemento.dataset.id;

    editActivityForm.action = `/tarefas/editar/${id}`;

    editNome.value = elemento.dataset.titulo || "";
    editDescricao.value = elemento.dataset.descricao || "";
    editData.value = elemento.dataset.data || "";
    editPrioridade.value = elemento.dataset.prioridade || "baixa";

    modalEditarOverlay.classList.add("show");
  }

  function fecharModalEditarAtividade() {
    modalEditarOverlay.classList.remove("show");
  }

  document.querySelectorAll(".activity-tag").forEach((atividade) => {
    atividade.addEventListener("click", (e) => {
      e.stopPropagation();
      abrirModalEditarAtividade(atividade);
    });
  });

  closeEditModal?.addEventListener("click", fecharModalEditarAtividade);
  cancelEditModal?.addEventListener("click", fecharModalEditarAtividade);

  modalEditarOverlay?.addEventListener("click", (e) => {
    if (e.target === modalEditarOverlay) {
      fecharModalEditarAtividade();
    }
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

    window.location.href =
      `/usuarios/calendario?mes=${mes}&ano=${ano}`;
  });

  nextMonth?.addEventListener("click", () => {
    mes++;

    if (mes > 11) {
      mes = 0;
      ano++;
    }

    window.location.href =
      `/usuarios/calendario?mes=${mes}&ano=${ano}`;
  });
});