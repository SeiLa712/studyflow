document.addEventListener("DOMContentLoaded", () => {
  prepararCardCriarMeta();
  prepararCardsMetas();
});

/* =========================
   CARD CRIAR NOVA META
========================= */

function prepararCardCriarMeta() {
  const card = document.querySelector(".create-meta-card");

  if (!card) return;

  const header = card.querySelector(".section-title");

  if (!header) return;

  const chaveStorage = "studyflow-criar-meta-card";

  const botao = document.createElement("button");
  botao.type = "button";
  botao.classList.add("btn-minimize-meta");
  botao.setAttribute("aria-label", "Minimizar card");

  botao.innerHTML = `<i class="fa-solid fa-minus"></i>`;

  header.appendChild(botao);

  const estavaMinimizado =
    localStorage.getItem(chaveStorage) === "minimizado";

  if (estavaMinimizado) {
    card.classList.add("collapsed");
    botao.innerHTML = `<i class="fa-solid fa-plus"></i>`;
    botao.setAttribute("aria-label", "Expandir card");
  }

  botao.addEventListener("click", () => {
    card.classList.toggle("collapsed");

    const minimizado = card.classList.contains("collapsed");

    if (minimizado) {
      botao.innerHTML = `<i class="fa-solid fa-plus"></i>`;
      botao.setAttribute("aria-label", "Expandir card");
      localStorage.setItem(chaveStorage, "minimizado");
    } else {
      botao.innerHTML = `<i class="fa-solid fa-minus"></i>`;
      botao.setAttribute("aria-label", "Minimizar card");
      localStorage.setItem(chaveStorage, "aberto");
    }
  });
}

/* =========================
   CARDS DAS METAS
========================= */

function prepararCardsMetas() {
  const cards = document.querySelectorAll(".meta-card");

  cards.forEach((card) => {
    const header = card.querySelector(".meta-header");

    if (!header) return;

    const idMeta =
      card.querySelector("form[action*='/metas/excluir/']")?.action
        ?.split("/")
        ?.pop() || Math.random();

    const chaveStorage = `studyflow-meta-card-${idMeta}`;

    const actions = document.createElement("div");
    actions.classList.add("meta-card-actions");

    const deleteForm = header.querySelector("form");

    if (deleteForm) {
      actions.appendChild(deleteForm);
    }

    const botao = document.createElement("button");
    botao.type = "button";
    botao.classList.add("btn-minimize-meta");
    botao.setAttribute("aria-label", "Minimizar meta");

    botao.innerHTML = `<i class="fa-solid fa-minus"></i>`;

    actions.appendChild(botao);
    header.appendChild(actions);

    const estavaMinimizado =
      localStorage.getItem(chaveStorage) === "minimizado";

    if (estavaMinimizado) {
      card.classList.add("collapsed");
      botao.innerHTML = `<i class="fa-solid fa-plus"></i>`;
      botao.setAttribute("aria-label", "Expandir meta");
    }

    botao.addEventListener("click", () => {
      card.classList.toggle("collapsed");

      const minimizado = card.classList.contains("collapsed");

      if (minimizado) {
        botao.innerHTML = `<i class="fa-solid fa-plus"></i>`;
        botao.setAttribute("aria-label", "Expandir meta");
        localStorage.setItem(chaveStorage, "minimizado");
      } else {
        botao.innerHTML = `<i class="fa-solid fa-minus"></i>`;
        botao.setAttribute("aria-label", "Minimizar meta");
        localStorage.setItem(chaveStorage, "aberto");
      }
    });
  });
}