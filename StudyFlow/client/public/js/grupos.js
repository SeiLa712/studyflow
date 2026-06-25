// ==========================
// ELEMENTOS DOS MODAIS
// ==========================

const modalOverlay = document.getElementById("modalOverlay");
const modalMembroOverlay = document.getElementById("modalMembroOverlay");
const modalArquivosOverlay = document.getElementById("modalArquivosOverlay");

const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.getElementById("closeModal");
const cancelModalBtn = document.getElementById("cancelModal");

const closeModalMembroBtn = document.getElementById("closeModalMembro");
const cancelModalMembroBtn = document.getElementById("cancelModalMembro");

const closeModalArquivosBtn = document.getElementById("closeModalArquivos");

const membroForm = document.getElementById("membroForm");

const arquivoForm = document.getElementById("arquivoForm");
const arquivoGrupoInput = document.getElementById("arquivoGrupo");
const arquivoGrupoIdInput = document.getElementById("arquivoGrupoId");
const listaArquivosGrupo = document.getElementById("listaArquivosGrupo");
const tituloModalArquivos = document.getElementById("tituloModalArquivos");

// ==========================
// ABRIR MODAL CRIAR GRUPO
// ==========================

if (openModalBtn) {
  openModalBtn.addEventListener("click", () => {
    modalOverlay.classList.add("active");
  });
}

// ==========================
// FECHAR MODAIS
// ==========================

function closeModals() {
  if (modalOverlay) modalOverlay.classList.remove("active");
  if (modalMembroOverlay) modalMembroOverlay.classList.remove("active");
  if (modalArquivosOverlay) modalArquivosOverlay.classList.remove("active");
}

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", closeModals);
}

if (cancelModalBtn) {
  cancelModalBtn.addEventListener("click", closeModals);
}

if (closeModalMembroBtn) {
  closeModalMembroBtn.addEventListener("click", closeModals);
}

if (cancelModalMembroBtn) {
  cancelModalMembroBtn.addEventListener("click", closeModals);
}

if (closeModalArquivosBtn) {
  closeModalArquivosBtn.addEventListener("click", closeModals);
}

// Fechar clicando fora do modal
[modalOverlay, modalMembroOverlay, modalArquivosOverlay].forEach((modal) => {
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModals();
      }
    });
  }
});

// ==========================
// EXCLUIR GRUPO
// ==========================

document.querySelectorAll(".btn-delete-grupo").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.stopPropagation();

    const grupoId = btn.dataset.id;

    if (!confirm("Tem certeza que deseja excluir este grupo?")) {
      return;
    }

    try {
      const response = await fetch(`/usuarios/grupos/${grupoId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        const card = btn.closest(".grupo-card");
        card.remove();

        const gruposContainer = document.getElementById("gruposContainer");

        if (gruposContainer.querySelectorAll(".grupo-card").length === 0) {
          location.reload();
        }
      } else {
        alert("Erro ao excluir grupo");
      }
    } catch (error) {
      console.error("Erro ao excluir grupo:", error);
      alert("Erro ao excluir grupo");
    }
  });
});

// ==========================
// ADICIONAR MEMBRO
// ==========================

document.querySelectorAll(".btn-add-membro").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    const grupoId = btn.dataset.id;

    document.getElementById("grupoId").value = grupoId;
    modalMembroOverlay.classList.add("active");
  });
});

if (membroForm) {
  membroForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const grupoId = document.getElementById("grupoId").value;
    const emailUsuario = document.getElementById("email_usuario").value;

    try {
      const response = await fetch(`/usuarios/grupos/${grupoId}/membros`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email_usuario: emailUsuario
        })
      });

      const data = await response.json();

      if (response.ok) {
        closeModals();
        membroForm.reset();
        location.reload();
      } else {
        alert(data.erro || "Erro ao adicionar membro");
      }
    } catch (error) {
      console.error("Erro ao adicionar membro:", error);
      alert("Erro ao adicionar membro");
    }
  });
}

// ==========================
// ABRIR MODAL DE ARQUIVOS AO CLICAR NO CARD
// ==========================

document.querySelectorAll(".grupo-card").forEach((card) => {
  card.addEventListener("click", async () => {
    const grupoId = card.dataset.id;
    const nomeGrupo = card.dataset.nome || "Grupo";

    abrirModalArquivos(grupoId, nomeGrupo);
  });
});

async function abrirModalArquivos(grupoId, nomeGrupo) {
  if (!modalArquivosOverlay) {
    console.error("Modal de arquivos não encontrado no EJS");
    return;
  }

  arquivoGrupoIdInput.value = grupoId;
  tituloModalArquivos.textContent = `Arquivos - ${nomeGrupo}`;

  modalArquivosOverlay.classList.add("active");

  await carregarArquivosGrupo(grupoId);
}

async function carregarArquivosGrupo(grupoId) {
  listaArquivosGrupo.innerHTML = "<p>Carregando arquivos...</p>";

  try {
    const response = await fetch(`/usuarios/grupos/${grupoId}/arquivos`);

    const arquivos = await response.json();

    if (!response.ok) {
      listaArquivosGrupo.innerHTML = `
        <p>Erro ao carregar arquivos.</p>
      `;
      return;
    }

    if (!arquivos || arquivos.length === 0) {
      listaArquivosGrupo.innerHTML = `
        <div class="empty-arquivos">
          <i class="fa-solid fa-folder-open"></i>
          <p>Nenhum arquivo enviado para este grupo.</p>
        </div>
      `;
      return;
    }

    listaArquivosGrupo.innerHTML = arquivos
      .map((arquivo) => {
        return `
          <div class="arquivo-item">
            <div class="arquivo-info">
              <i class="fa-solid fa-file"></i>

              <div>
                <strong>${arquivo.nome_original}</strong>
                <span>Enviado por ${arquivo.nome_usuario || "usuário"}</span>
              </div>
            </div>

            <a
              href="/usuarios/grupos/${grupoId}/arquivos/${arquivo.id}/download"
              class="btn-download"
            >
              <i class="fa-solid fa-download"></i>
              Baixar
            </a>
          </div>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Erro ao carregar arquivos:", error);

    listaArquivosGrupo.innerHTML = `
      <p>Erro ao carregar arquivos.</p>
    `;
  }
}

// ==========================
// ENVIAR ARQUIVO
// ==========================

if (arquivoForm) {
  arquivoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const grupoId = arquivoGrupoIdInput.value;
    const arquivo = arquivoGrupoInput.files[0];

    if (!arquivo) {
      alert("Selecione um arquivo");
      return;
    }

    const formData = new FormData();
    formData.append("arquivo", arquivo);

    try {
      const response = await fetch(`/usuarios/grupos/${grupoId}/arquivos`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        arquivoForm.reset();
        await carregarArquivosGrupo(grupoId);
      } else {
        alert(data.erro || "Erro ao enviar arquivo");
      }
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
      alert("Erro ao enviar arquivo");
    }
  });
}