const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
  deleteAllNotifications,
  getNotificationSettings,
  updateNotificationSettings
} = require('../controllers/notificationController');

const router = express.Router();

// Validações
const updateSettingsValidation = [
  body('email')
    .optional()
    .isBoolean()
    .withMessage('Email deve ser um valor booleano'),
  body('push')
    .optional()
    .isBoolean()
    .withMessage('Push deve ser um valor booleano'),
  body('mentions')
    .optional()
    .isBoolean()
    .withMessage('Mentions deve ser um valor booleano'),
  body('likes')
    .optional()
    .isBoolean()
    .withMessage('Likes deve ser um valor booleano'),
  body('retweets')
    .optional()
    .isBoolean()
    .withMessage('Retweets deve ser um valor booleano'),
  body('follows')
    .optional()
    .isBoolean()
    .withMessage('Follows deve ser um valor booleano')
];

// Rotas protegidas
router.get('/', authenticateToken, getNotifications);
router.get('/unread-count', authenticateToken, getUnreadCount);
router.get('/settings', authenticateToken, getNotificationSettings);
router.put('/:notificationId/read', authenticateToken, markAsRead);
router.put('/read-all', authenticateToken, markAllAsRead);
router.put('/settings', authenticateToken, updateSettingsValidation, updateNotificationSettings);
router.delete('/:notificationId', authenticateToken, deleteNotification);
router.delete('/all', authenticateToken, deleteAllNotifications);

module.exports = router;