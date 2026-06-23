// Modal controls
const modalOverlay = document.getElementById('modalOverlay');
const modalMembroOverlay = document.getElementById('modalMembroOverlay');
const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModal');
const cancelModalBtn = document.getElementById('cancelModal');
const closeModalMembroBtn = document.getElementById('closeModalMembro');
const cancelModalMembroBtn = document.getElementById('cancelModalMembro');

// Open modal to create group
if (openModalBtn) {
  openModalBtn.addEventListener('click', () => {
    modalOverlay.classList.add('active');
  });
}

// Close modal functions
function closeModals() {
  modalOverlay.classList.remove('active');
  modalMembroOverlay.classList.remove('active');
}

closeModalBtn.addEventListener('click', closeModals);
cancelModalBtn.addEventListener('click', closeModals);
closeModalMembroBtn.addEventListener('click', closeModals);
cancelModalMembroBtn.addEventListener('click', closeModals);

// Close modal when clicking outside
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    closeModals();
  }
});

modalMembroOverlay.addEventListener('click', (e) => {
  if (e.target === modalMembroOverlay) {
    closeModals();
  }
});

// Delete group functionality
document.querySelectorAll('.btn-delete-grupo').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const grupoId = btn.dataset.id;
    
    if (confirm('Tem certeza que deseja excluir este grupo?')) {
      try {
        const response = await fetch(`/usuarios/grupos/${grupoId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          const card = btn.closest('.grupo-card');
          card.remove();
          
          // Check if no groups left
          const gruposContainer = document.getElementById('gruposContainer');
          if (gruposContainer.querySelectorAll('.grupo-card').length === 0) {
            location.reload();
          }
        } else {
          alert('Erro ao excluir grupo');
        }
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir grupo');
      }
    }
  });
});

// Add member functionality
document.querySelectorAll('.btn-add-membro').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const grupoId = btn.dataset.id;
    document.getElementById('grupoId').value = grupoId;
    modalMembroOverlay.classList.add('active');
  });
});

// Submit member form
const membroForm = document.getElementById('membroForm');
if (membroForm) {
  membroForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const grupoId = document.getElementById('grupoId').value;
    const emailUsuario = document.getElementById('email_usuario').value;
    
    try {
      const response = await fetch(`/usuarios/grupos/${grupoId}/membros`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email_usuario: emailUsuario })
      });

      const data = await response.json();

      if (response.ok) {
        closeModals();
        membroForm.reset();
        location.reload();
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  });
}
