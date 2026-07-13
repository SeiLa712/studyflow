let tempoAtual = 25 * 60;
let intervalo = null;

let modoAtual = "foco";

let tempoFoco = 25;
let tempoPausa = 5;

// =========================
// ELEMENTOS
// =========================
const display = document.getElementById("timerDisplay");
const text = document.getElementById("timerText");
const tabs = document.querySelectorAll(".tab");

// CÍRCULO PROGRESSO
const circle = document.querySelector(".ring-fill");
const radius = 120;
const circumference = 2 * Math.PI * radius;

// =========================
// INIT CÍRCULO
// =========================
if (circle) {
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;
}

// =========================
// PROGRESSO DO CÍRCULO
// =========================
function setProgress(percent) {
    if (!circle) return;

    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
}

// =========================
// DISPLAY TEMPO
// =========================
function atualizarDisplay() {
    const minutos = Math.floor(tempoAtual / 60);
    const segundos = tempoAtual % 60;

    display.textContent =
        String(minutos).padStart(2, "0") +
        ":" +
        String(segundos).padStart(2, "0");

    // PROGRESSO
    const total =
        modoAtual === "foco"
            ? tempoFoco * 60
            : tempoPausa * 60;

    const percent = ((total - tempoAtual) / total) * 100;

    setProgress(percent);
}

// =========================
// TEXTO
// =========================
function atualizarTexto(nome = "", modo = "foco") {

    if (!text) return;

    if (nome) {
        text.textContent = `${nome} - ${modo === "foco" ? "Foco" : "Pausa"}`;
    } else {
        text.textContent =
            modo === "foco"
                ? "Sessão de foco"
                : "Hora de descanso";
    }
}

// =========================
// USAR SESSÃO
// =========================
function usarSessao(foco, pausa, nome) {

    clearInterval(intervalo);
    intervalo = null;

    modoAtual = "foco";

    tempoFoco = foco;
    tempoPausa = pausa;

    tempoAtual = foco * 60;

    setProgress(0);
    atualizarDisplay();
    atualizarTexto(nome, "foco");
    setActiveTab("foco");
}

// =========================
// INICIAR TIMER
// =========================
function iniciarTimer() {

    if (intervalo) return;

    intervalo = setInterval(() => {

        if (tempoAtual > 0) {
            tempoAtual--;
            atualizarDisplay();
            return;
        }

        clearInterval(intervalo);
        intervalo = null;

        if (modoAtual === "foco") {

            salvarSessaoPomodoro(tempoFoco, "pomodoro");

            alert("Tempo de foco concluído! Hora da pausa.");

            modoAtual = "pausa";
            tempoAtual = tempoPausa * 60;

        } else {

            alert("Pausa concluída! Volte aos estudos.");

            modoAtual = "foco";
            tempoAtual = tempoFoco * 60;
        }

        atualizarDisplay();
        atualizarTexto("", modoAtual);

        iniciarTimer();

    }, 1000);
}

// =========================
// PAUSAR TIMER
// =========================
function pausarTimer() {
    clearInterval(intervalo);
    intervalo = null;
}

// =========================
// RESETAR TIMER
// =========================
function resetarTimer() {

    clearInterval(intervalo);
    intervalo = null;

    modoAtual = "foco";
    tempoAtual = tempoFoco * 60;

    setProgress(0);
    atualizarDisplay();
    atualizarTexto("", "foco");

    setActiveTab("foco");
}

// =========================
// TABS
// =========================
tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        const tipo = tab.innerText.trim().toLowerCase();

        clearInterval(intervalo);
        intervalo = null;

        if (tipo.includes("foco")) {
            modoAtual = "foco";
            tempoAtual = tempoFoco * 60;
        }

        if (tipo.includes("pausa")) {
            modoAtual = "pausa";
            tempoAtual = tempoPausa * 60;
        }

        setProgress(0);
        atualizarDisplay();
        atualizarTexto("", modoAtual);
        setActiveTab(tipo);
    });
});

// =========================
// ATIVAR TAB VISUAL
// =========================
function setActiveTab(tipo) {

    tabs.forEach(t => t.classList.remove("active"));

    if (tipo.includes("foco")) {
        tabs[0].classList.add("active");
    }

    if (tipo.includes("pausa")) {
        tabs[1].classList.add("active");
    }
}

// =========================
// FORMULÁRIO
// =========================
function abrirFormulario() {
    document.getElementById("formularioSessao").style.display = "block";
}

function fecharFormulario() {
    document.getElementById("formularioSessao").style.display = "none";
}

let rodando = false;

const btnToggle = document.getElementById("btnToggle");

function toggleTimer() {

    if (!rodando) {
        iniciarTimer();
        rodando = true;
        btnToggle.textContent = "⏸";
    } else {
        pausarTimer();
        rodando = false;
        btnToggle.textContent = "▶";
    }
}

// =========================
// INICIALIZAÇÃO
// =========================
window.onload = () => {
    atualizarDisplay();
    atualizarTexto("", "foco");
    setActiveTab("foco");
    setProgress(0);
};

async function salvarSessaoPomodoro(duracaoMin, origem = "pomodoro") {
  try {
    await fetch("/usuarios/pomodoro/sessoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        duracao_min: duracaoMin,
        origem
      })
    });
  } catch (erro) {
    console.error("Erro ao salvar sessão Pomodoro:", erro);
  }
}