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

    modalOverlay?.classList.add("show");
  }

  function fecharModalAdicionar() {
    modalOverlay?.classList.remove("show");
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

  const btnConcluirEdit = document.getElementById("btnConcluirEdit");

  function abrirModalEditarAtividade(elemento) {
    const id = elemento.dataset.id;
    const concluida = elemento.dataset.concluida === "true";

    if (!id) return;

    editActivityForm.action = `/tarefas/editar/${id}`;

    editNome.value = elemento.dataset.titulo || "";
    editDescricao.value = elemento.dataset.descricao || "";
    editData.value = elemento.dataset.data || "";
    editPrioridade.value = elemento.dataset.prioridade || "baixa";

    if (btnConcluirEdit) {
      btnConcluirEdit.dataset.id = id;

      if (concluida) {
        btnConcluirEdit.style.display = "none";
      } else {
        btnConcluirEdit.style.display = "inline-flex";
      }
    }

    modalEditarOverlay?.classList.add("show");
  }

  function fecharModalEditarAtividade() {
    modalEditarOverlay?.classList.remove("show");
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
  // CONCLUIR ATIVIDADE PELO MODAL
  // =========================

  btnConcluirEdit?.addEventListener("click", async () => {
    const id = btnConcluirEdit.dataset.id;

    if (!id) return;

    const confirmar = confirm(
      "Deseja marcar esta atividade como concluída?"
    );

    if (!confirmar) return;

    try {
      const resposta = await fetch(`/tarefas/concluir/${id}`, {
        method: "POST"
      });

      if (resposta.ok) {
        location.reload();
      } else {
        alert("Erro ao concluir atividade.");
      }

    } catch (erro) {
      console.error(erro);
      alert("Erro ao conectar com o servidor.");
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

  let mes = Number.parseInt(titulo.dataset.mes, 10);
  let ano = Number.parseInt(titulo.dataset.ano, 10);

  if (Number.isNaN(mes)) {
    mes = new Date().getMonth();
  }

  if (Number.isNaN(ano)) {
    ano = new Date().getFullYear();
  }

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