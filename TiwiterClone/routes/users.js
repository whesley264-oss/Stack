const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const {
  getUserProfile,
  updateProfile,
  getUserTweets,
  getUserLikedTweets,
  getUserMedia,
  getFollowers,
  getFollowing,
  getSuggestions,
  searchUsers,
  blockUser,
  unblockUser
} = require('../controllers/userController');

const router = express.Router();

// Validações
const updateProfileValidation = [
  body('displayName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Nome de exibição deve ter entre 1 e 50 caracteres')
    .trim(),
  body('bio')
    .optional()
    .isLength({ max: 160 })
    .withMessage('Bio deve ter no máximo 160 caracteres'),
  body('location')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Localização deve ter no máximo 100 caracteres'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Website deve ser uma URL válida'),
  body('birthDate')
    .optional()
    .isISO8601()
    .withMessage('Data de nascimento deve ser uma data válida'),
  body('isPrivate')
    .optional()
    .isBoolean()
    .withMessage('isPrivate deve ser um valor booleano')
];

// Rotas públicas
router.get('/search', searchUsers);
router.get('/:username', optionalAuth, getUserProfile);
router.get('/:username/tweets', optionalAuth, getUserTweets);
router.get('/:username/likes', optionalAuth, getUserLikedTweets);
router.get('/:username/media', optionalAuth, getUserMedia);
router.get('/:username/followers', optionalAuth, getFollowers);
router.get('/:username/following', optionalAuth, getFollowing);

// Rotas protegidas
router.put('/profile', authenticateToken, updateProfileValidation, updateProfile);
router.get('/suggestions', authenticateToken, getSuggestions);
router.post('/:userId/block', authenticateToken, blockUser);
router.delete('/:userId/block', authenticateToken, unblockUser);

module.exports = router;