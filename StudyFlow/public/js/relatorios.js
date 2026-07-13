document.addEventListener("DOMContentLoaded", () => {
  const paineis = document.querySelectorAll(".relatorios-page .panel");

  paineis.forEach((painel, index) => {
    const header = painel.querySelector(".panel-header");

    if (!header) return;

    const titulo =
      header.querySelector("h2")?.textContent.trim() || `painel-${index}`;

    const chaveStorage = `studyflow-relatorio-${titulo}`;

    const iconeOriginal = header.querySelector("i");

    const actions = document.createElement("div");
    actions.classList.add("panel-actions");

    if (iconeOriginal) {
      actions.appendChild(iconeOriginal);
    }

    const botao = document.createElement("button");
    botao.type = "button";
    botao.classList.add("btn-minimize-panel");
    botao.setAttribute("aria-label", "Minimizar card");

    botao.innerHTML = `<i class="fa-solid fa-minus"></i>`;

    actions.appendChild(botao);
    header.appendChild(actions);

    const estavaMinimizado =
      localStorage.getItem(chaveStorage) === "minimizado";

    if (estavaMinimizado) {
      painel.classList.add("collapsed");
      botao.innerHTML = `<i class="fa-solid fa-plus"></i>`;
      botao.setAttribute("aria-label", "Expandir card");
    }

    botao.addEventListener("click", () => {
      painel.classList.toggle("collapsed");

      const estaMinimizado = painel.classList.contains("collapsed");

      if (estaMinimizado) {
        botao.innerHTML = `<i class="fa-solid fa-plus"></i>`;
        botao.setAttribute("aria-label", "Expandir card");
        localStorage.setItem(chaveStorage, "minimizado");
      } else {
        botao.innerHTML = `<i class="fa-solid fa-minus"></i>`;
        botao.setAttribute("aria-label", "Minimizar card");
        localStorage.setItem(chaveStorage, "aberto");
      }
    });
  });
});