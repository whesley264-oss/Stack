const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  sendMessage,
  getConversation,
  getConversations,
  editMessage,
  deleteMessage,
  addReaction,
  removeReaction,
  getUnreadCount,
  markConversationAsRead
} = require('../controllers/messageController');

const router = express.Router();

// Validações
const sendMessageValidation = [
  body('receiverId')
    .isMongoId()
    .withMessage('ID do destinatário inválido'),
  body('content')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Conteúdo da mensagem deve ter entre 1 e 1000 caracteres')
    .trim(),
  body('type')
    .optional()
    .isIn(['text', 'image', 'video', 'file', 'gif'])
    .withMessage('Tipo de mensagem inválido'),
  body('replyTo')
    .optional()
    .isMongoId()
    .withMessage('ID da mensagem de resposta inválido')
];

const editMessageValidation = [
  body('content')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Conteúdo da mensagem deve ter entre 1 e 1000 caracteres')
    .trim()
];

const addReactionValidation = [
  body('emoji')
    .isLength({ min: 1, max: 10 })
    .withMessage('Emoji deve ter entre 1 e 10 caracteres')
    .trim()
];

// Rotas protegidas
router.post('/', authenticateToken, sendMessageValidation, sendMessage);
router.get('/conversations', authenticateToken, getConversations);
router.get('/:userId', authenticateToken, getConversation);
router.put('/:messageId', authenticateToken, editMessageValidation, editMessage);
router.delete('/:messageId', authenticateToken, deleteMessage);
router.post('/:messageId/reaction', authenticateToken, addReactionValidation, addReaction);
router.delete('/:messageId/reaction', authenticateToken, removeReaction);
router.get('/unread/count', authenticateToken, getUnreadCount);
router.put('/:userId/read', authenticateToken, markConversationAsRead);

module.exports = router;