const Tweet = require('../models/Tweet');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Criar novo tweet
const createTweet = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { content, replyTo, quotedTweet } = req.body;
    const authorId = req.user._id;

    // Verificar se é reply e se o tweet pai existe
    if (replyTo) {
      const parentTweet = await Tweet.findById(replyTo);
      if (!parentTweet) {
        return res.status(404).json({
          success: false,
          message: 'Tweet pai não encontrado'
        });
      }
    }

    // Verificar se é quote e se o tweet citado existe
    if (quotedTweet) {
      const quotedTweetDoc = await Tweet.findById(quotedTweet);
      if (!quotedTweetDoc) {
        return res.status(404).json({
          success: false,
          message: 'Tweet citado não encontrado'
        });
      }
    }

    // Extrair hashtags e menções
    const hashtags = content.match(/#\w+/g) || [];
    const mentions = content.match(/@\w+/g) || [];

    // Buscar usuários mencionados
    const mentionedUsers = await User.find({
      username: { $in: mentions.map(mention => mention.substring(1)) }
    });

    const tweet = new Tweet({
      author: authorId,
      content,
      replyTo,
      quotedTweet,
      hashtags: hashtags.map(tag => tag.substring(1).toLowerCase()),
      mentions: mentionedUsers.map(user => user._id)
    });

    await tweet.save();

    // Atualizar contador de tweets do usuário
    await User.findByIdAndUpdate(authorId, { $inc: { tweetsCount: 1 } });

    // Popular dados do autor
    await tweet.populate('author', 'username displayName avatar isVerified');

    res.status(201).json({
      success: true,
      message: 'Tweet criado com sucesso',
      data: { tweet }
    });

  } catch (error) {
    console.error('Erro ao criar tweet:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter feed do usuário
const getFeed = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const tweets = await Tweet.getFeed(userId, page, limit);

    res.json({
      success: true,
      data: { tweets }
    });

  } catch (error) {
    console.error('Erro ao obter feed:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter tweet específico
const getTweet = async (req, res) => {
  try {
    const { tweetId } = req.params;

    const tweet = await Tweet.findById(tweetId)
      .populate('author', 'username displayName avatar isVerified')
      .populate('replyTo')
      .populate('quotedTweet')
      .populate('retweetOf');

    if (!tweet) {
      return res.status(404).json({
        success: false,
        message: 'Tweet não encontrado'
      });
    }

    // Incrementar views
    await tweet.incrementViews();

    res.json({
      success: true,
      data: { tweet }
    });

  } catch (error) {
    console.error('Erro ao obter tweet:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter tweets do usuário
const getUserTweets = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const tweets = await Tweet.find({
      author: userId,
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

// Editar tweet
const editTweet = async (req, res) => {
  try {
    const { tweetId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({
        success: false,
        message: 'Tweet não encontrado'
      });
    }

    // Verificar se o usuário é o autor
    if (tweet.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Você só pode editar seus próprios tweets'
      });
    }

    // Verificar se o tweet pode ser editado (apenas tweets recentes)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (tweet.createdAt < oneHourAgo) {
      return res.status(400).json({
        success: false,
        message: 'Tweets só podem ser editados até 1 hora após a publicação'
      });
    }

    await tweet.edit(content);

    res.json({
      success: true,
      message: 'Tweet editado com sucesso',
      data: { tweet }
    });

  } catch (error) {
    console.error('Erro ao editar tweet:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Deletar tweet
const deleteTweet = async (req, res) => {
  try {
    const { tweetId } = req.params;
    const userId = req.user._id;

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({
        success: false,
        message: 'Tweet não encontrado'
      });
    }

    // Verificar se o usuário é o autor
    if (tweet.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Você só pode deletar seus próprios tweets'
      });
    }

    await tweet.softDelete();

    // Decrementar contador de tweets do usuário
    await User.findByIdAndUpdate(userId, { $inc: { tweetsCount: -1 } });

    res.json({
      success: true,
      message: 'Tweet deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar tweet:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Bookmark tweet
const bookmarkTweet = async (req, res) => {
  try {
    const { tweetId } = req.params;
    const userId = req.user._id;

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({
        success: false,
        message: 'Tweet não encontrado'
      });
    }

    const wasBookmarked = await tweet.bookmark(userId);

    res.json({
      success: true,
      message: wasBookmarked ? 'Tweet salvo' : 'Tweet removido dos salvos',
      data: { bookmarked: wasBookmarked }
    });

  } catch (error) {
    console.error('Erro ao salvar tweet:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter tweets salvos
const getBookmarkedTweets = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const tweets = await Tweet.find({
      bookmarks: userId,
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
    console.error('Erro ao obter tweets salvos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter tweets por hashtag
const getTweetsByHashtag = async (req, res) => {
  try {
    const { hashtag } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const tweets = await Tweet.getByHashtag(hashtag, page, limit);

    res.json({
      success: true,
      data: { tweets }
    });

  } catch (error) {
    console.error('Erro ao obter tweets por hashtag:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter tweets por menção
const getTweetsByMention = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const tweets = await Tweet.getByMention(userId, page, limit);

    res.json({
      success: true,
      data: { tweets }
    });

  } catch (error) {
    console.error('Erro ao obter tweets por menção:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Pin tweet
const pinTweet = async (req, res) => {
  try {
    const { tweetId } = req.params;
    const userId = req.user._id;

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({
        success: false,
        message: 'Tweet não encontrado'
      });
    }

    // Verificar se o usuário é o autor
    if (tweet.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Você só pode fixar seus próprios tweets'
      });
    }

    // Desfixar todos os outros tweets do usuário
    await Tweet.updateMany(
      { author: userId, isPinned: true },
      { isPinned: false }
    );

    // Fixar o tweet atual
    tweet.isPinned = true;
    await tweet.save();

    res.json({
      success: true,
      message: 'Tweet fixado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao fixar tweet:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Unpin tweet
const unpinTweet = async (req, res) => {
  try {
    const { tweetId } = req.params;
    const userId = req.user._id;

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({
        success: false,
        message: 'Tweet não encontrado'
      });
    }

    // Verificar se o usuário é o autor
    if (tweet.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Você só pode desfixar seus próprios tweets'
      });
    }

    tweet.isPinned = false;
    await tweet.save();

    res.json({
      success: true,
      message: 'Tweet desfixado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao desfixar tweet:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  createTweet,
  getFeed,
  getTweet,
  getUserTweets,
  editTweet,
  deleteTweet,
  bookmarkTweet,
  getBookmarkedTweets,
  getTweetsByHashtag,
  getTweetsByMention,
  pinTweet,
  unpinTweet
};