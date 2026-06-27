document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");

  const temaSalvo = localStorage.getItem("studyflow-tema");

  if (temaSalvo === "escuro") {
    document.body.classList.add("dark-mode");
  }

  atualizarBotaoTema();

  themeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const modoEscuroAtivo =
      document.body.classList.contains("dark-mode");

    if (modoEscuroAtivo) {
      localStorage.setItem("studyflow-tema", "escuro");
    } else {
      localStorage.setItem("studyflow-tema", "claro");
    }

    atualizarBotaoTema();
  });

  function atualizarBotaoTema() {
    if (!themeToggle) return;

    const modoEscuroAtivo =
      document.body.classList.contains("dark-mode");

    const icone = themeToggle.querySelector("i");
    const texto = themeToggle.querySelector("span");

    if (modoEscuroAtivo) {
      icone.className = "fa-solid fa-sun";
      texto.textContent = "Modo claro";
    } else {
      icone.className = "fa-solid fa-moon";
      texto.textContent = "Modo escuro";
    }
  }
});