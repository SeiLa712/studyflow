const atividades = window.atividades || [];

// =======================
// POMODORO
// =======================

// Elemento onde o tempo será exibido
const timerDisplay = document.querySelector(".timer-circle");

// Botão iniciar/pausar
const playBtn = document.querySelector(".play-btn");

// Tempo inicial do pomodoro (25 minutos em segundos)
let tempo = 25 * 60;

// Guarda o intervalo do setInterval
let intervalo = null;

// Controla se o timer está rodando ou não
let rodando = false;

// Atualiza o texto exibido no cronômetro
function atualizarTimer() {
  // Calcula minutos restantes
  const minutos = Math.floor(tempo / 60);

  // Calcula segundos restantes
  const segundos = tempo % 60;

  // Formata para 00:00
  timerDisplay.textContent = `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
}
// Responsável por iniciar a contagem regressiva
function iniciarTimer() {
  intervalo = setInterval(() => {
    // Diminui 1 segundo
    tempo--;

    // Atualiza a tela
    atualizarTimer();

    // Verifica se chegou ao fim
    if (tempo <= 0) {
      // Para o intervalo
      clearInterval(intervalo);

      rodando = false;

      playBtn.textContent = "▶ Iniciar";

      alert("Pomodoro concluído!");
    }
  }, 1000);
}

playBtn.addEventListener("click", () => {
  if (!rodando) {
    iniciarTimer();
    rodando = true;
    playBtn.textContent = "⏸ Pausar";
  } else {
    clearInterval(intervalo);
    rodando = false;
    playBtn.textContent = "▶ Continuar";
  }
});

const resetBtn = document.querySelector(".reset-btn");

resetBtn.addEventListener("click", () => {
  clearInterval(intervalo);

  tempo = 25 * 60;
  rodando = false;

  atualizarTimer();

  playBtn.textContent = "▶ Iniciar";
});

atualizarTimer();
// =======================
// CALENDÁRIO SEMANAL
// =======================

// Seleciona o container onde os dias da semana serão criados
const calendarGrid = document.getElementById("calendarGrid");

// Seleciona o elemento que exibirá o período da semana
const weekRange = document.getElementById("weekRange");

// Função responsável por gerar dinamicamente a semana atual
function gerarSemanaAtual() {

  // Limpa o calendário antes de gerar novamente
  calendarGrid.innerHTML = "";

  // Obtém a data atual
  const hoje = new Date();

  // Retorna o dia da semana atual
  // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  const diaSemana = hoje.getDay();

  // Cria uma cópia da data atual
  const segunda = new Date(hoje);

  // Calcula a data da segunda-feira da semana atual
  // Caso hoje seja domingo, volta 6 dias
  segunda.setDate(
    hoje.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1)
  );

  // Nomes abreviados dos dias da semana
  const diasSemana = [
    "Seg",
    "Ter",
    "Qua",
    "Qui",
    "Sex",
    "Sáb",
    "Dom"
  ];

  // Cria as 7 colunas da semana
  for (let i = 0; i < 7; i++) {

    // Cria uma nova data baseada na segunda-feira
    const data = new Date(segunda);

    // Adiciona os dias seguintes
    data.setDate(segunda.getDate() + i);

    // Cria a coluna do dia
    const coluna = document.createElement("div");

    // Adiciona a classe padrão da coluna
    coluna.classList.add("day-column");

    const dataISO = data.toISOString().split("T")[0];
    coluna.dataset.date = dataISO;
    
    coluna.addEventListener("click", () => {
      const inputData = document.querySelector('input[name="data_vencimento"]');
      
      if (inputData) {
        inputData.value = dataISO;
      }
      
      modalOverlay.classList.add("show");
    });

    // Verifica se a data gerada corresponde ao dia atual
    const ehHoje =
      data.getDate() === hoje.getDate() &&
      data.getMonth() === hoje.getMonth() &&
      data.getFullYear() === hoje.getFullYear();

    // Destaca visualmente o dia atual
    if (ehHoje) {
      coluna.classList.add("active-day");
    }

    // Estrutura HTML da coluna
    // day-header = cabeçalho do dia
    // events-container = local onde eventos serão inseridos
    coluna.innerHTML = `
      <div class="day-header">
          <span>${diasSemana[i]}</span>
          <strong>${data.getDate()}</strong>
      </div>

      <div class="events-container"></div>
    `;

    // Adiciona a coluna ao calendário
    calendarGrid.appendChild(coluna);
  }

  // Calcula a data do domingo da mesma semana
  const domingo = new Date(segunda);
  domingo.setDate(segunda.getDate() + 6);

  // Vetor utilizado para converter número do mês em texto
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
    "dez",
  ];

  // Exibe o intervalo da semana no topo do calendário
  // Exemplo:
  // 09 de jun - 15 de jun de 2026
  weekRange.textContent =
    `${segunda.getDate()} de ${meses[segunda.getMonth()]} - ` +
    `${domingo.getDate()} de ${meses[domingo.getMonth()]} de ${domingo.getFullYear()}`;
}

// Executa a função assim que a página carrega
gerarSemanaAtual();


// Agora adiciona as atividades vindas do banco
if (typeof atividades !== "undefined") {

  atividades.forEach((atividade) => {

    adicionarEventoCalendario(
      atividade.id,
      atividade.nome,
      atividade.data_vencimento,
      atividade.prioridade
    );

  });

}

console.log("Atividades:", atividades);

// =======================
// MODAL
// =======================

// Seleciona o fundo escuro que contém o modal
const modalOverlay = document.getElementById("modalOverlay");

// Botão "+ Adicionar" que abre o modal
const openModal = document.getElementById("openModal");

// Botão "X" localizado no canto superior do modal
const closeModal = document.getElementById("closeModal");

// Botão "Cancelar" do formulário
const cancelModal = document.getElementById("cancelModal");

// Exibe o modal ao clicar em "+ Adicionar"
openModal.addEventListener("click", () => {
  modalOverlay.classList.add("show");
});

// Fecha o modal ao clicar no botão X
closeModal.addEventListener("click", () => {
  modalOverlay.classList.remove("show");
});

// Fecha o modal ao clicar em Cancelar
cancelModal.addEventListener("click", () => {
  modalOverlay.classList.remove("show");
});


// =======================
// EVENTOS DO CALENDÁRIO
// =======================

// Adiciona um evento visual no dia correspondente do calendário
function adicionarEventoCalendario(taskId, titulo, data, urgencia) {

  // Converte a data recebida para objeto Date
  const dataEvento = new Date(data);

  // Busca todas as colunas do calendário semanal
  const colunas = document.querySelectorAll(".day-column");

  colunas.forEach((coluna) => {

    // Recupera o número do dia exibido na coluna
    const dia =
      parseInt(
        coluna.querySelector("strong").textContent
      );

    // Verifica se a atividade pertence a este dia
    if (dia === dataEvento.getDate()) {

      // Cria o elemento visual do evento
      const evento =
        document.createElement("div");

      // Salva o ID da atividade para facilitar exclusões futuras
      evento.dataset.taskId = taskId;

      // Adiciona a classe CSS padrão
      evento.classList.add("event");

      // Define cores diferentes conforme o nível de urgência
      if (urgencia === "alta") {
        evento.classList.add("urgent");
      } else if (urgencia === "media") {
        evento.classList.add("medium");
      } else {
        evento.classList.add("low");
      }

      // Define o texto exibido no calendário
      evento.textContent = titulo;

      evento.addEventListener("click", (e) => {
      e.stopPropagation();

      const atividade = atividades.find((item) => item.id === taskId);

      if (!atividade) return;

      const fakeElement = {
        dataset: {
        titulo: atividade.nome,
        descricao: atividade.descricao || "Sem descrição.",
        data: atividade.data_vencimento.split("T")[0],
        prioridade: atividade.prioridade
      }
    };
    
    abrirDetalhesAtividade(fakeElement);
  });

      // Insere o evento dentro do dia correspondente
      coluna
        .querySelector(".events-container")
        .appendChild(evento);
    }
  });
}


// =======================
// NOVA ATIVIDADE
// =======================

// Formulário de cadastro de atividades
const activityForm =
  document.getElementById("activityForm");

// Container onde os cards de atividades serão exibidos
const tasksContainer =
  document.getElementById("tasksContainer");

// Executa quando o usuário envia o formulário
activityForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome =
    document.getElementById("nome").value;

  const descricao =
    document.querySelector(
      'textarea[name="descricao"]'
    ).value;

  const data_vencimento =
    document.querySelector(
      'input[name="data_vencimento"]'
    ).value;

  const prioridade =
    document.querySelector(
      'select[name="prioridade"]'
    ).value;

  try {
    const resposta = await fetch(
      "/tarefas/criar",
      {
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
      }
    );

    if (resposta.ok) {
      activityForm.reset();
      modalOverlay.classList.remove("show");

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

document.querySelectorAll(".btn-delete").forEach((btn) => {
  btn.addEventListener("click", async (e) => {

    const card = e.target.closest(".task-card"); // 🔥 AQUI o card existe

    const id = card.dataset.id;

    console.log("ID da tarefa:", id);

    const confirmDelete = confirm("Deseja excluir esta tarefa?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/tarefas/${id}`, {
        method: "DELETE",
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
// MODAL DETALHES DA ATIVIDADE
// =======================

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

function abrirDetalhesAtividade(elemento) {
  detalheTitulo.textContent = elemento.dataset.titulo || "Atividade";
  detalheDescricao.textContent = elemento.dataset.descricao || "Sem descrição.";
  detalheData.textContent = formatarDataBR(elemento.dataset.data);
  detalhePrioridade.textContent = formatarPrioridade(elemento.dataset.prioridade);

  modalDetalhesOverlay.classList.add("show");
}

function fecharDetalhesAtividade() {
  modalDetalhesOverlay.classList.remove("show");
}

document.querySelectorAll(".task-card").forEach((card) => {
  card.addEventListener("click", () => {
    abrirDetalhesAtividade(card);
  });
});

document.querySelectorAll(".btn-delete").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
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