const User = require('../models/User');
const Tweet = require('../models/Tweet');
const { validationResult } = require('express-validator');

// Obter perfil de usuário
const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const currentUserId = req.user ? req.user._id : null;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar se o perfil é privado e se o usuário atual não está seguindo
    if (user.isPrivate && currentUserId && !user.isFollowing(currentUserId)) {
      return res.status(403).json({
        success: false,
        message: 'Este perfil é privado'
      });
    }

    const userData = user.getPublicProfile();

    // Adicionar informações de relacionamento se usuário estiver logado
    if (currentUserId) {
      userData.isFollowing = user.isFollowing(currentUserId);
      userData.isFollowedBy = currentUserId && await User.findById(currentUserId).then(u => u.isFollowing(user._id));
    }

    res.json({
      success: true,
      data: { user: userData }
    });

  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Atualizar perfil
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const userId = req.user._id;
    const { displayName, bio, location, website, birthDate, isPrivate } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Atualizar campos permitidos
    if (displayName !== undefined) user.displayName = displayName;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (website !== undefined) user.website = website;
    if (birthDate !== undefined) user.birthDate = birthDate;
    if (isPrivate !== undefined) user.isPrivate = isPrivate;

    await user.save();

    const userData = user.getPublicProfile();

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: { user: userData }
    });

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter tweets do usuário
const getUserTweets = async (req, res) => {
  try {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const tweets = await Tweet.find({
      author: user._id,
      isPublic: true,
      isDeleted: { $ne: true }
    })
    .populate('author', 'username displayName avatar isVerified')
    .populate('replyTo')
    .populate('quotedTweet')
    .populate('retweetOf')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    res.json({
      success: true,
      data: { tweets }
    });

  } catch (error) {
    console.error('Erro ao obter tweets do usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter tweets curtidos pelo usuário
const getUserLikedTweets = async (req, res) => {
  try {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const tweets = await Tweet.find({
      likes: user._id,
      isPublic: true,
      isDeleted: { $ne: true }
    })
    .populate('author', 'username displayName avatar isVerified')
    .populate('replyTo')
    .populate('quotedTweet')
    .populate('retweetOf')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    res.json({
      success: true,
      data: { tweets }
    });

  } catch (error) {
    console.error('Erro ao obter tweets curtidos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter mídia do usuário
const getUserMedia = async (req, res) => {
  try {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const tweets = await Tweet.find({
      author: user._id,
      $or: [
        { images: { $exists: true, $ne: [] } },
        { video: { $exists: true, $ne: null } },
        { gif: { $exists: true, $ne: null } }
      ],
      isPublic: true,
      isDeleted: { $ne: true }
    })
    .populate('author', 'username displayName avatar isVerified')
    .populate('replyTo')
    .populate('quotedTweet')
    .populate('retweetOf')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    res.json({
      success: true,
      data: { tweets }
    });

  } catch (error) {
    console.error('Erro ao obter mídia do usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter seguidores
const getFollowers = async (req, res) => {
  try {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const followers = await User.find({
      _id: { $in: user.followers }
    })
    .select('username displayName avatar bio isVerified')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    res.json({
      success: true,
      data: { followers }
    });

  } catch (error) {
    console.error('Erro ao obter seguidores:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter seguindo
const getFollowing = async (req, res) => {
  try {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const following = await User.find({
      _id: { $in: user.following }
    })
    .select('username displayName avatar bio isVerified')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    res.json({
      success: true,
      data: { following }
    });

  } catch (error) {
    console.error('Erro ao obter seguindo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter sugestões de usuários
const getSuggestions = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 10;

    const user = await User.findById(userId);
    const followingIds = user.following;
    followingIds.push(userId); // Excluir o próprio usuário

    const suggestions = await User.find({
      _id: { $nin: followingIds },
      isActive: true
    })
    .select('username displayName avatar bio isVerified followersCount')
    .sort({ followersCount: -1 })
    .limit(limit);

    res.json({
      success: true,
      data: { users: suggestions }
    });

  } catch (error) {
    console.error('Erro ao obter sugestões:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar usuários
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Query de busca deve ter pelo menos 2 caracteres'
      });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { displayName: { $regex: q, $options: 'i' } }
      ],
      isActive: true
    })
    .select('username displayName avatar bio isVerified followersCount')
    .sort({ followersCount: -1 })
    .skip(skip)
    .limit(limit);

    res.json({
      success: true,
      data: { users }
    });

  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Bloquear usuário
const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (userId === currentUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Você não pode bloquear a si mesmo'
      });
    }

    const user = await User.findById(currentUserId);
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Adicionar à lista de bloqueados
    if (!user.blockedUsers) {
      user.blockedUsers = [];
    }

    if (!user.blockedUsers.includes(userId)) {
      user.blockedUsers.push(userId);
      await user.save();
    }

    // Remover de seguidores/seguindo
    await user.unfollow(userId);
    await targetUser.unfollow(currentUserId);

    res.json({
      success: true,
      message: 'Usuário bloqueado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao bloquear usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Desbloquear usuário
const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const user = await User.findById(currentUserId);

    if (!user.blockedUsers) {
      return res.status(400).json({
        success: false,
        message: 'Usuário não está bloqueado'
      });
    }

    user.blockedUsers = user.blockedUsers.filter(id => id.toString() !== userId);
    await user.save();

    res.json({
      success: true,
      message: 'Usuário desbloqueado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao desbloquear usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
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
};