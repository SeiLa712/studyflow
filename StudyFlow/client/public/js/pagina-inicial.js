const atividades = window.atividades || [];

// =======================
// HELPERS
// =======================

function normalizarDataISO(data) {
  if (!data) return "";

  if (typeof data === "string" && data.length >= 10) {
    return data.substring(0, 10);
  }

  const dataObj = new Date(data);

  const ano = dataObj.getFullYear();
  const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
  const dia = String(dataObj.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function formatarDataBR(dataISO) {
  if (!dataISO) return "Sem data";

  const data = normalizarDataISO(dataISO);
  const partes = data.split("-");

  if (partes.length !== 3) return dataISO;

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function formatarPrioridade(prioridade) {
  if (prioridade === "alta") return "Alta prioridade";
  if (prioridade === "media") return "Média prioridade";
  return "Baixa prioridade";
}

// =======================
// MODAL ADICIONAR ATIVIDADE
// =======================

const modalOverlay = document.getElementById("modalOverlay");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const cancelModal = document.getElementById("cancelModal");

function abrirModalAdicionar(dataSelecionada = "") {
  const inputData = document.querySelector('input[name="data_vencimento"]');

  if (inputData) {
    inputData.value = dataSelecionada;
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

// =======================
// POMODORO RÁPIDO
// =======================

const timerDisplay = document.querySelector(".timer-circle");
const playBtn = document.querySelector(".play-btn");
const resetBtn = document.querySelector(".reset-btn");

let tempo = 25 * 60;
let intervalo = null;
let rodando = false;

function atualizarTimer() {
  if (!timerDisplay) return;

  const minutos = Math.floor(tempo / 60);
  const segundos = tempo % 60;

  timerDisplay.textContent =
    `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
}

async function salvarSessaoPomodoroRapido(duracaoMin) {
  try {
    await fetch("/usuarios/pomodoro/sessoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        duracao_min: duracaoMin,
        origem: "timer-rapido"
      })
    });
  } catch (erro) {
    console.error("Erro ao salvar Pomodoro rápido:", erro);
  }
}

function iniciarTimer() {
  intervalo = setInterval(async () => {
    tempo--;

    atualizarTimer();

    if (tempo <= 0) {
      clearInterval(intervalo);

      await salvarSessaoPomodoroRapido(25);

      rodando = false;

      if (playBtn) {
        playBtn.textContent = "Iniciar";
      }

      alert("Pomodoro concluído! Tempo de foco salvo no relatório.");
    }
  }, 1000);
}

playBtn?.addEventListener("click", () => {
  if (!rodando) {
    iniciarTimer();
    rodando = true;
    playBtn.textContent = "Pausar";
  } else {
    clearInterval(intervalo);
    rodando = false;
    playBtn.textContent = "Continuar";
  }
});

resetBtn?.addEventListener("click", () => {
  clearInterval(intervalo);

  tempo = 25 * 60;
  rodando = false;

  atualizarTimer();

  if (playBtn) {
    playBtn.textContent = "Iniciar";
  }
});

atualizarTimer();

// =======================
// MODAL DETALHES DA ATIVIDADE
// =======================

const modalDetalhesOverlay = document.getElementById("modalDetalhesOverlay");
const closeDetalhesModal = document.getElementById("closeDetalhesModal");

const detalheTitulo = document.getElementById("detalheTitulo");
const detalheDescricao = document.getElementById("detalheDescricao");
const detalheData = document.getElementById("detalheData");
const detalhePrioridade = document.getElementById("detalhePrioridade");

function abrirDetalhesAtividade(elemento) {
  if (!modalDetalhesOverlay) return;

  detalheTitulo.textContent = elemento.dataset.titulo || "Atividade";
  detalheDescricao.textContent = elemento.dataset.descricao || "Sem descrição.";
  detalheData.textContent = formatarDataBR(elemento.dataset.data);
  detalhePrioridade.textContent = formatarPrioridade(elemento.dataset.prioridade);

  modalDetalhesOverlay.classList.add("show");
}

function fecharDetalhesAtividade() {
  modalDetalhesOverlay?.classList.remove("show");
}

document.querySelectorAll(".task-card").forEach((card) => {
  card.addEventListener("click", () => {
    abrirDetalhesAtividade(card);
  });
});

closeDetalhesModal?.addEventListener("click", fecharDetalhesAtividade);

modalDetalhesOverlay?.addEventListener("click", (e) => {
  if (e.target === modalDetalhesOverlay) {
    fecharDetalhesAtividade();
  }
});

// =======================
// MODAL EDITAR ATIVIDADE
// =======================

const modalEditarOverlay = document.getElementById("modalEditarOverlay");
const closeEditModal = document.getElementById("closeEditModal");
const cancelEditModal = document.getElementById("cancelEditModal");
const editActivityForm = document.getElementById("editActivityForm");

const editNome = document.getElementById("editNome");
const editDescricao = document.getElementById("editDescricao");
const editData = document.getElementById("editData");
const editPrioridade = document.getElementById("editPrioridade");

function abrirModalEditarAtividade(botao) {
  const id = botao.dataset.id;

  editActivityForm.action = `/tarefas/editar/${id}`;

  editNome.value = botao.dataset.nome || "";
  editDescricao.value = botao.dataset.descricao || "";
  editData.value = botao.dataset.data || "";
  editPrioridade.value = botao.dataset.prioridade || "baixa";

  modalEditarOverlay.classList.add("show");
}

function fecharModalEditarAtividade() {
  modalEditarOverlay.classList.remove("show");
}

document.querySelectorAll(".btn-edit").forEach((botao) => {
  botao.addEventListener("click", (e) => {
    e.stopPropagation();
    abrirModalEditarAtividade(botao);
  });
});

closeEditModal?.addEventListener("click", fecharModalEditarAtividade);
cancelEditModal?.addEventListener("click", fecharModalEditarAtividade);

modalEditarOverlay?.addEventListener("click", (e) => {
  if (e.target === modalEditarOverlay) {
    fecharModalEditarAtividade();
  }
});

// =======================
// CONCLUIR ATIVIDADE
// =======================

document.querySelectorAll(".btn-complete").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.stopPropagation();

    const card = e.target.closest(".task-card");
    const id = card.dataset.id;

    const confirmar = confirm("Deseja marcar esta atividade como concluída?");

    if (!confirmar) return;

    try {
      const resposta = await fetch(`/tarefas/concluir/${id}`, {
        method: "POST"
      });

      if (resposta.ok) {
        card.classList.add("completed");

        setTimeout(() => {
          card.remove();
        }, 250);
      } else {
        alert("Erro ao concluir atividade.");
      }

    } catch (erro) {
      console.error(erro);
      alert("Erro ao conectar com o servidor.");
    }
  });
});

// =======================
// EXCLUIR ATIVIDADE
// =======================

document.querySelectorAll(".btn-delete").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.stopPropagation();

    const card = e.target.closest(".task-card");
    const id = card.dataset.id;

    const confirmDelete = confirm("Deseja excluir esta tarefa?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/tarefas/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        card.remove();
      } else {
        alert("Erro ao excluir tarefa");
      }

    } catch (err) {
      console.error(err);
      alert("Erro no servidor");
    }
  });
});

// =======================
// CADASTRAR NOVA ATIVIDADE
// =======================

const activityForm = document.getElementById("activityForm");

activityForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;

  const descricao = document.querySelector(
    'textarea[name="descricao"]'
  ).value;

  const data_vencimento = document.querySelector(
    'input[name="data_vencimento"]'
  ).value;

  const prioridade = document.querySelector(
    'select[name="prioridade"]'
  ).value;

  try {
    const resposta = await fetch("/tarefas/criar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nome,
        descricao,
        data_vencimento,
        prioridade
      })
    });

    if (resposta.ok) {
      activityForm.reset();
      fecharModalAdicionar();

      alert("Tarefa criada com sucesso!");

      location.reload();
    } else {
      alert("Erro ao criar tarefa.");
    }
  } catch (erro) {
    console.error(erro);
    alert("Erro ao conectar ao servidor.");
  }
});

// =======================
// CALENDÁRIO SEMANAL
// =======================

const calendarGrid = document.getElementById("calendarGrid");
const weekRange = document.getElementById("weekRange");

function gerarSemanaAtual() {
  if (!calendarGrid || !weekRange) return;

  calendarGrid.innerHTML = "";

  const hoje = new Date();
  const diaSemana = hoje.getDay();

  const segunda = new Date(hoje);

  segunda.setDate(
    hoje.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1)
  );

  const diasSemana = [
    "Seg",
    "Ter",
    "Qua",
    "Qui",
    "Sex",
    "Sáb",
    "Dom"
  ];

  for (let i = 0; i < 7; i++) {
    const data = new Date(segunda);
    data.setDate(segunda.getDate() + i);

    const dataISO = normalizarDataISO(data);

    const coluna = document.createElement("div");
    coluna.classList.add("day-column");
    coluna.dataset.date = dataISO;

    coluna.addEventListener("click", () => {
      abrirModalAdicionar(dataISO);
    });

    const ehHoje =
      data.getDate() === hoje.getDate() &&
      data.getMonth() === hoje.getMonth() &&
      data.getFullYear() === hoje.getFullYear();

    if (ehHoje) {
      coluna.classList.add("active-day");
    }

    coluna.innerHTML = `
      <div class="day-header">
        <span>${diasSemana[i]}</span>
        <strong>${data.getDate()}</strong>
      </div>

      <div class="events-container"></div>
    `;

    calendarGrid.appendChild(coluna);
  }

  const domingo = new Date(segunda);
  domingo.setDate(segunda.getDate() + 6);

  const meses = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez"
  ];

  weekRange.textContent =
    `${segunda.getDate()} de ${meses[segunda.getMonth()]} - ` +
    `${domingo.getDate()} de ${meses[domingo.getMonth()]} de ${domingo.getFullYear()}`;
}

function adicionarEventoCalendario(atividade) {
  const dataEventoISO = normalizarDataISO(atividade.data_vencimento);

  const coluna = document.querySelector(
    `.day-column[data-date="${dataEventoISO}"]`
  );

  if (!coluna) return;

  const evento = document.createElement("div");

  evento.dataset.taskId = atividade.id;
  evento.dataset.titulo = atividade.nome;
  evento.dataset.descricao = atividade.descricao || "Sem descrição.";
  evento.dataset.data = dataEventoISO;
  evento.dataset.prioridade = atividade.prioridade;

  evento.classList.add("event");

  if (atividade.prioridade === "alta") {
    evento.classList.add("urgent");
  } else if (atividade.prioridade === "media") {
    evento.classList.add("medium");
  } else {
    evento.classList.add("low");
  }

  if (atividade.concluida) {
    evento.classList.add("completed");
    evento.textContent = `✓ ${atividade.nome}`;
  } else {
    evento.textContent = atividade.nome;
  }

  evento.addEventListener("click", (e) => {
    e.stopPropagation();

    const fakeElement = {
      dataset: {
        titulo: atividade.nome,
        descricao: atividade.descricao || "Sem descrição.",
        data: dataEventoISO,
        prioridade: atividade.prioridade
      }
    };

    abrirDetalhesAtividade(fakeElement);
  });

  coluna
    .querySelector(".events-container")
    .appendChild(evento);
}

gerarSemanaAtual();

atividades.forEach((atividade) => {
  adicionarEventoCalendario(atividade);
});

console.log("Atividades:", atividades);