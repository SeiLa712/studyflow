let draggedCard = null;

// drag start
document.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('card')) {
        draggedCard = e.target;
    }
});

// permitir drop
document.querySelectorAll('.column').forEach(col => {
    col.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    col.addEventListener('drop', async (e) => {
        const colunaId = col.getAttribute('data-id');

        col.appendChild(draggedCard);

        const cardId = draggedCard.getAttribute('data-id');

        await fetch('/kanban/cards/mover', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idCard: cardId,
                idColuna: colunaId
            })
        });
    });
});

// simples prompts (depois você melhora com modal)
function addColumn() {
    const nome = prompt('Nome da coluna:');

    fetch('/kanban/colunas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome })
    }).then(() => location.reload());
}

function addCard(colunaId) {
    const titulo = prompt('Título do card:');
    const descricao = prompt('Descrição:');

    fetch('/kanban/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            titulo,
            descricao,
            id_coluna: colunaId
        })
    }).then(() => location.reload());
}