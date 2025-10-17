const User = require('../models/User');

// Seguir usuário
const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (userId === currentUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Você não pode seguir a si mesmo'
      });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    if (!targetUser.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Usuário não está ativo'
      });
    }

    // Verificar se já está seguindo
    if (currentUser.isFollowing(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Você já está seguindo este usuário'
      });
    }

    // Verificar se está bloqueado
    if (targetUser.blockedUsers && targetUser.blockedUsers.includes(currentUserId)) {
      return res.status(403).json({
        success: false,
        message: 'Você foi bloqueado por este usuário'
      });
    }

    // Seguir usuário
    await currentUser.follow(userId);

    // Adicionar seguidor ao usuário alvo
    if (!targetUser.followers.includes(currentUserId)) {
      targetUser.followers.push(currentUserId);
      await targetUser.save();
    }

    res.json({
      success: true,
      message: 'Usuário seguido com sucesso',
      data: {
        following: true,
        followersCount: targetUser.followersCount,
        followingCount: currentUser.followingCount
      }
    });

  } catch (error) {
    console.error('Erro ao seguir usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Deixar de seguir usuário
const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar se está seguindo
    if (!currentUser.isFollowing(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Você não está seguindo este usuário'
      });
    }

    // Deixar de seguir
    await currentUser.unfollow(userId);

    // Remover seguidor do usuário alvo
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId.toString());
    await targetUser.save();

    res.json({
      success: true,
      message: 'Usuário deixado de seguir com sucesso',
      data: {
        following: false,
        followersCount: targetUser.followersCount,
        followingCount: currentUser.followingCount
      }
    });

  } catch (error) {
    console.error('Erro ao deixar de seguir usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Verificar status de seguimento
const checkFollowStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const isFollowing = currentUser.isFollowing(userId);
    const isFollowedBy = targetUser.isFollowing(currentUserId);

    res.json({
      success: true,
      data: {
        following: isFollowing,
        followedBy: isFollowedBy,
        followersCount: targetUser.followersCount,
        followingCount: targetUser.followingCount
      }
    });

  } catch (error) {
    console.error('Erro ao verificar status de seguimento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter usuários que seguem o usuário atual
const getFollowers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const currentUser = await User.findById(currentUserId);
    const followers = await User.find({
      _id: { $in: currentUser.followers }
    })
    .select('username displayName avatar bio isVerified followersCount followingCount')
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

// Obter usuários que o usuário atual segue
const getFollowing = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const currentUser = await User.findById(currentUserId);
    const following = await User.find({
      _id: { $in: currentUser.following }
    })
    .select('username displayName avatar bio isVerified followersCount followingCount')
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

// Obter usuários que seguem mutuamente
const getMutualFollows = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Encontrar seguidores em comum
    const mutualFollowers = await User.find({
      _id: { 
        $in: currentUser.followers.filter(id => 
          targetUser.followers.some(targetId => targetId.toString() === id.toString())
        )
      }
    })
    .select('username displayName avatar bio isVerified followersCount followingCount')
    .limit(20);

    res.json({
      success: true,
      data: { mutualFollowers }
    });

  } catch (error) {
    console.error('Erro ao obter seguidores mútuos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter estatísticas de seguimento
const getFollowStats = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);

    res.json({
      success: true,
      data: {
        followersCount: currentUser.followersCount,
        followingCount: currentUser.followingCount,
        tweetsCount: currentUser.tweetsCount,
        likesCount: currentUser.likesCount
      }
    });

  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  followUser,
  unfollowUser,
  checkFollowStatus,
  getFollowers,
  getFollowing,
  getMutualFollows,
  getFollowStats
};