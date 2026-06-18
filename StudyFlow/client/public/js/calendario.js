document.addEventListener("DOMContentLoaded", () => {

  // MODAL

  const openModal = document.getElementById("openModal");
  const modalOverlay = document.getElementById("modalOverlay");
  const closeModal = document.getElementById("closeModal");
  const cancelModal = document.getElementById("cancelModal");

  openModal?.addEventListener("click", () => {
    modalOverlay.classList.add("show");
  });

  closeModal?.addEventListener("click", () => {
    modalOverlay.classList.remove("show");
  });

  cancelModal?.addEventListener("click", () => {
    modalOverlay.classList.remove("show");
  });

  modalOverlay?.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove("show");
    }
  });

  // NAVEGAÇÃO DE MESES

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