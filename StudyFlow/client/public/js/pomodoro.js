// =========================
// TIMER & ESTADOS
// =========================
let tempoAtual = 25 * 60;
let tempoInicial = 25 * 60;
let intervalo = null;
let modoAtual = "foco"; // Pode ser "foco" ou "pausa"
let sessaoAtiva = null; // Guarda a sessão que está rodando no momento

// =========================
// STORAGE
// =========================
let sessoes = JSON.parse(localStorage.getItem("sessoes")) || [];
let indiceEditando = -1;

// =========================
// DISPLAY TIMER
// =========================
function atualizarDisplay() {
    const minutos = Math.floor(tempoAtual / 60);
    const segundos = tempoAtual % 60;

    document.getElementById("timerDisplay").textContent =
        String(minutos).padStart(2, "0") +
        ":" +
        String(segundos).padStart(2, "0");
        
    // Opcional: Atualiza um texto na tela para mostrar se é Foco ou Pausa
    const statusLabel = document.getElementById("statusAtual");
    if (statusLabel) {
        statusLabel.textContent = modoAtual === "foco" ? "🔴 Hora de Focar!" : "🟢 Hora de Relaxar!";
    }
}

// =========================
// INICIAR
// =========================
function iniciarTimer() {
    if (intervalo != null) return;

    intervalo = setInterval(() => {
        if (tempoAtual > 0) {
            tempoAtual--;
            atualizarDisplay();
        } else {
            clearInterval(intervalo);
            intervalo = null;
            
            // Lógica de alternar entre Foco e Pausa
            if (modoAtual === "foco") {
                alert("Sessão de foco finalizada! Hora da pausa.");
                if (sessaoAtiva !== null) {
                    modoAtual = "pausa";
                    tempoAtual = sessoes[sessaoAtiva].pausa * 60;
                } else {
                    // Padrão caso não tenha sessão selecionada
                    modoAtual = "pausa";
                    tempoAtual = 5 * 60; 
                }
            } else {
                alert("A pausa acabou! Pronto para focar de novo?");
                modoAtual = "foco";
                tempoAtual = sessaoAtiva !== null ? sessoes[sessaoAtiva].foco * 60 : 25 * 60;
            }
            
            atualizarDisplay();
            iniciarTimer(); // Inicia automaticamente o próximo ciclo
        }
    }, 1000);
}

// =========================
// PAUSAR
// =========================
function pausarTimer() {
    clearInterval(intervalo);
    intervalo = null;
}

// =========================
// RESETAR
// =========================
function resetarTimer() {
    clearInterval(intervalo);
    intervalo = null;
    modoAtual = "foco";
    tempoAtual = sessaoAtiva !== null ? sessoes[sessaoAtiva].foco * 60 : 25 * 60;
    atualizarDisplay();
}

// =========================
// FORMULÁRIO
// =========================
function abrirFormulario() {
    document.getElementById("formularioSessao").style.display = "block";
}

function fecharFormulario() {
    indiceEditando = -1;
    document.getElementById("formularioSessao").style.display = "none";
    document.getElementById("nomeSessao").value = "";
    document.getElementById("tempoFoco").value = "";
    document.getElementById("tempoPausa").value = "";
}

// =========================
// SALVAR SESSÃO
// =========================
function salvarSessao() {
    const nome = document.getElementById("nomeSessao").value;
    const foco = Number(document.getElementById("tempoFoco").value);
    const pausa = Number(document.getElementById("tempoPausa").value);

    if (!nome || !foco || !pausa) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    const sessao = { nome, foco, pausa };

    if (indiceEditando >= 0) {
        sessoes[indiceEditando] = sessao;
        indiceEditando = -1;
    } else {
        sessoes.push(sessao);
    }

    localStorage.setItem("sessoes", JSON.stringify(sessoes));
    fecharFormulario();
    renderizarSessoes();
}

// =========================
// RENDERIZAR
// =========================
function renderizarSessoes() {
    const lista = document.getElementById("listaSessoes");

    if (!lista) return;

    lista.innerHTML = "";

    sessoes.forEach((sessao, index) => {
        lista.innerHTML += `
            <div class="sessao-card">

                <div class="sessao-topo">

                    <div>
                        <h3>${sessao.nome}</h3>
                    </div>

                    <div class="acoes-topo">

                        <button
                            class="btn-iniciar"
                            onclick="usarTimer(${index})"
                            title="Iniciar"
                        >
                            ▶
                        </button>

                        <button
                            class="btn-editar"
                            onclick="editarSessao(${index})"
                            title="Editar"
                        >
                            ✏
                        </button>

                        <button
                            class="btn-excluir"
                            onclick="excluirSessao(${index})"
                            title="Excluir"
                        >
                            🗑
                        </button>

                    </div>

                </div>

                <div class="sessao-info">
                    <span>🕒 Foco: ${sessao.foco}min</span>
                    <span>🕒 Pausa: ${sessao.pausa}min</span>
                </div>

            </div>
        `;
    });
}

// =========================
// USAR TIMER
// =========================
function usarTimer(index) {
    clearInterval(intervalo);
    intervalo = null;
    
    sessaoAtiva = index;
    modoAtual = "foco";
    tempoInicial = sessoes[index].foco * 60;
    tempoAtual = tempoInicial;
    
    atualizarDisplay();
}

// =========================
// EDITAR
// =========================
function editarSessao(index) {
    indiceEditando = index;
    abrirFormulario();

    document.getElementById("nomeSessao").value = sessoes[index].nome;
    document.getElementById("tempoFoco").value = sessoes[index].foco;
    document.getElementById("tempoPausa").value = sessoes[index].pausa;
}

// =========================
// EXCLUIR
// =========================
function excluirSessao(index) {
    sessoes.splice(index, 1);
    localStorage.setItem("sessoes", JSON.stringify(sessoes));
    
    if (sessaoAtiva === index) {
        sessaoAtiva = null;
        resetarTimer();
    }
    
    renderizarSessoes();
}

// =========================
// INICIAR PÁGINA
// =========================
window.onload = function () {
    atualizarDisplay();
    renderizarSessoes();
};