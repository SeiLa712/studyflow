// =======================
// SIDEBAR
// =======================

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const collapseBtn = document.querySelector(".collapse-btn");

  if (!sidebar || !collapseBtn) return;

  const sidebarSalva = localStorage.getItem("studyflow-sidebar");

  if (sidebarSalva === "fechada") {
    sidebar.classList.add("collapsed");
    document.body.classList.add("sidebar-collapsed");
    collapseBtn.textContent = "▶";
  } else {
    sidebar.classList.remove("collapsed");
    document.body.classList.remove("sidebar-collapsed");
    collapseBtn.textContent = "◀";
  }

  collapseBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    document.body.classList.toggle("sidebar-collapsed");

    const sidebarFechada = sidebar.classList.contains("collapsed");

    if (sidebarFechada) {
      localStorage.setItem("studyflow-sidebar", "fechada");
      collapseBtn.textContent = "▶";
    } else {
      localStorage.setItem("studyflow-sidebar", "aberta");
      collapseBtn.textContent = "◀";
    }
  });

  const menuItems = document.querySelectorAll(".menu-item");

  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      menuItems.forEach((link) => {
        link.classList.remove("active");
      });

      item.classList.add("active");
    });
  });
});