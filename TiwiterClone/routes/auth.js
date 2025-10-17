const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  deactivateAccount,
  verifyToken
} = require('../controllers/authController');

const router = express.Router();

// Validações
const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username deve ter entre 3 e 20 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username pode conter apenas letras, números e underscore'),
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('displayName')
    .isLength({ min: 1, max: 50 })
    .withMessage('Nome de exibição deve ter entre 1 e 50 caracteres')
    .trim()
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória')
];

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
    .withMessage('Data de nascimento deve ser uma data válida')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Senha atual é obrigatória'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Nova senha deve ter pelo menos 6 caracteres')
];

// Rotas públicas
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Rotas protegidas
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfileValidation, updateProfile);
router.put('/change-password', authenticateToken, changePasswordValidation, changePassword);
router.delete('/deactivate', authenticateToken, deactivateAccount);
router.get('/verify', authenticateToken, verifyToken);

module.exports = router;