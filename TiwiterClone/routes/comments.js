const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  createComment,
  getComments,
  editComment,
  deleteComment,
  getUserComments
} = require('../controllers/commentController');

const router = express.Router();

// Validações
const createCommentValidation = [
  body('content')
    .isLength({ min: 1, max: 280 })
    .withMessage('Comentário deve ter entre 1 e 280 caracteres')
    .trim()
];

const editCommentValidation = [
  body('content')
    .isLength({ min: 1, max: 280 })
    .withMessage('Comentário deve ter entre 1 e 280 caracteres')
    .trim()
];

// Rotas públicas
router.get('/:tweetId', getComments);

// Rotas protegidas
router.post('/:tweetId', authenticateToken, createCommentValidation, createComment);
router.put('/:commentId', authenticateToken, editCommentValidation, editComment);
router.delete('/:commentId', authenticateToken, deleteComment);
router.get('/user/:userId', authenticateToken, getUserComments);

module.exports = router;