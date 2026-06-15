// =======================
// SIDEBAR
// =======================

// Seleciona a barra lateral
const sidebar = document.querySelector(".sidebar");

// Seleciona o botão responsável por recolher/expandir a sidebar
const collapseBtn = document.querySelector(".collapse-btn");


// Ao clicar no botão, adiciona ou remove a classe "collapsed"
collapseBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

// Busca todos os itens do menu
const menuItems = document.querySelectorAll(".menu-item");

// Percorre todos os links do menu
menuItems.forEach((item) => {
  // Quando um item for clicado...
  item.addEventListener("click", () => {
    // Remove a classe "active" de todos os itens
    menuItems.forEach((link) => {
      link.classList.remove("active");
    });

    // Adiciona "active" apenas no item clicado
    item.classList.add("active");
  });
});