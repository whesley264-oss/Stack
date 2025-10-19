const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar token JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso necessário'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Conta desativada'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    console.error('Erro na autenticação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware opcional para autenticação (não falha se não houver token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Se houver erro, continua sem usuário autenticado
    next();
  }
};

// Middleware para verificar se usuário é o dono do recurso
const authorizeOwner = (req, res, next) => {
  const resourceUserId = req.params.userId || req.body.userId;
  
  if (!resourceUserId) {
    return res.status(400).json({
      success: false,
      message: 'ID do usuário não fornecido'
    });
  }

  if (req.user._id.toString() !== resourceUserId.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Você só pode modificar seus próprios recursos'
    });
  }

  next();
};

// Middleware para verificar se usuário está seguindo outro usuário
const checkFollowing = async (req, res, next) => {
  try {
    const targetUserId = req.params.userId;
    const currentUser = req.user;

    if (currentUser._id.toString() === targetUserId.toString()) {
      return next(); // Usuário pode ver seu próprio perfil
    }

    const targetUser = await User.findById(targetUserId);
    
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Se o perfil for privado, verificar se está seguindo
    if (targetUser.isPrivate && !currentUser.isFollowing(targetUserId)) {
      return res.status(403).json({
        success: false,
        message: 'Este perfil é privado. Você precisa seguir para ver o conteúdo'
      });
    }

    next();
  } catch (error) {
    console.error('Erro ao verificar seguimento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware para verificar se usuário está bloqueado
const checkBlocked = async (req, res, next) => {
  try {
    const targetUserId = req.params.userId;
    const currentUser = req.user;

    // Verificar se o usuário atual foi bloqueado pelo usuário alvo
    const targetUser = await User.findById(targetUserId);
    
    if (targetUser && targetUser.blockedUsers && targetUser.blockedUsers.includes(currentUser._id)) {
      return res.status(403).json({
        success: false,
        message: 'Você foi bloqueado por este usuário'
      });
    }

    // Verificar se o usuário atual bloqueou o usuário alvo
    if (currentUser.blockedUsers && currentUser.blockedUsers.includes(targetUserId)) {
      return res.status(403).json({
        success: false,
        message: 'Você bloqueou este usuário'
      });
    }

    next();
  } catch (error) {
    console.error('Erro ao verificar bloqueio:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  authenticateToken,
  optionalAuth,
  authorizeOwner,
  checkFollowing,
  checkBlocked
};