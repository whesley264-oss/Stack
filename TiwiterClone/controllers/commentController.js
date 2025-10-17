const Tweet = require('../models/Tweet');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Criar comentário
const createComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { tweetId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const parentTweet = await Tweet.findById(tweetId);

    if (!parentTweet) {
      return res.status(404).json({
        success: false,
        message: 'Tweet não encontrado'
      });
    }

    // Extrair hashtags e menções
    const hashtags = content.match(/#\w+/g) || [];
    const mentions = content.match(/@\w+/g) || [];

    // Buscar usuários mencionados
    const mentionedUsers = await User.find({
      username: { $in: mentions.map(mention => mention.substring(1)) }
    });

    const comment = new Tweet({
      author: userId,
      content,
      replyTo: tweetId,
      hashtags: hashtags.map(tag => tag.substring(1).toLowerCase()),
      mentions: mentionedUsers.map(user => user._id)
    });

    await comment.save();

    // Incrementar contador de comentários do tweet pai
    await Tweet.findByIdAndUpdate(tweetId, { $inc: { repliesCount: 1 } });

    // Incrementar contador de tweets do usuário
    await User.findByIdAndUpdate(userId, { $inc: { tweetsCount: 1 } });

    // Popular dados do autor
    await comment.populate('author', 'username displayName avatar isVerified');
    await comment.populate('replyTo');

    res.status(201).json({
      success: true,
      message: 'Comentário criado com sucesso',
      data: { comment }
    });

  } catch (error) {
    console.error('Erro ao criar comentário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter comentários de um tweet
const getComments = async (req, res) => {
  try {
    const { tweetId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const comments = await Tweet.find({
      replyTo: tweetId,
      isDeleted: { $ne: true }
    })
    .populate('author', 'username displayName avatar isVerified')
    .populate('replyTo')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    res.json({
      success: true,
      data: { comments }
    });

  } catch (error) {
    console.error('Erro ao obter comentários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Editar comentário
const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const comment = await Tweet.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comentário não encontrado'
      });
    }

    // Verificar se o usuário é o autor
    if (comment.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Você só pode editar seus próprios comentários'
      });
    }

    // Verificar se o comentário pode ser editado (apenas comentários recentes)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (comment.createdAt < oneHourAgo) {
      return res.status(400).json({
        success: false,
        message: 'Comentários só podem ser editados até 1 hora após a publicação'
      });
    }

    await comment.edit(content);

    res.json({
      success: true,
      message: 'Comentário editado com sucesso',
      data: { comment }
    });

  } catch (error) {
    console.error('Erro ao editar comentário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Deletar comentário
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Tweet.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comentário não encontrado'
      });
    }

    // Verificar se o usuário é o autor
    if (comment.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Você só pode deletar seus próprios comentários'
      });
    }

    await comment.softDelete();

    // Decrementar contador de comentários do tweet pai
    if (comment.replyTo) {
      await Tweet.findByIdAndUpdate(comment.replyTo, { $inc: { repliesCount: -1 } });
    }

    // Decrementar contador de tweets do usuário
    await User.findByIdAndUpdate(userId, { $inc: { tweetsCount: -1 } });

    res.json({
      success: true,
      message: 'Comentário deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar comentário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter comentários do usuário
const getUserComments = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const comments = await Tweet.find({
      author: userId,
      replyTo: { $exists: true },
      isDeleted: { $ne: true }
    })
    .populate('author', 'username displayName avatar isVerified')
    .populate('replyTo')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    res.json({
      success: true,
      data: { comments }
    });

  } catch (error) {
    console.error('Erro ao obter comentários do usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  createComment,
  getComments,
  editComment,
  deleteComment,
  getUserComments
};