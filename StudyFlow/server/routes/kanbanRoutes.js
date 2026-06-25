const express = require('express');
const router = express.Router();

const kanbanController = require('../controllers/kanbanController');
const { verificarAutenticacao } = require('../middlewares/authMiddleware');

// Página Kanban
router.get('/', verificarAutenticacao, kanbanController.index);

// Colunas
router.post('/colunas', verificarAutenticacao, kanbanController.criarColuna);

// Cards
router.post('/cards', verificarAutenticacao, kanbanController.criarCard);

// Mover card
router.put('/cards/mover', verificarAutenticacao, kanbanController.moverCard);

module.exports = router;