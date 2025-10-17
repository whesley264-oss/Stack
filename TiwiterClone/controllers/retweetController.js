const Tweet = require('../models/Tweet');
const User = require('../models/User');

// Fazer retweet
const retweet = async (req, res) => {
  try {
    const { tweetId } = req.params;
    const userId = req.user._id;

    const originalTweet = await Tweet.findById(tweetId);

    if (!originalTweet) {
      return res.status(404).json({
        success: false,
        message: 'Tweet não encontrado'
      });
    }

    // Verificar se já retweetou
    const existingRetweet = await Tweet.findOne({
      author: userId,
      retweetOf: tweetId
    });

    if (existingRetweet) {
      return res.status(400).json({
        success: false,
        message: 'Você já retweetou este tweet'
      });
    }

    // Criar retweet
    const retweet = new Tweet({
      author: userId,
      retweetOf: tweetId,
      content: '' // Retweets não têm conteúdo próprio
    });

    await retweet.save();

    // Adicionar retweet ao tweet original
    await originalTweet.retweet(userId);

    // Incrementar contador de retweets do usuário
    await User.findByIdAndUpdate(userId, { $inc: { tweetsCount: 1 } });

    // Popular dados do autor
    await retweet.populate('author', 'username displayName avatar isVerified');
    await retweet.populate('retweetOf');

    res.status(201).json({
      success: true,
      message: 'Tweet retweetado com sucesso',
      data: { 
        retweet,
        retweetsCount: originalTweet.retweetsCount
      }
    });

  } catch (error) {
    console.error('Erro ao retweetar:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Remover retweet
const unretweet = async (req, res) => {
  try {
    const { tweetId } = req.params;
    const userId = req.user._id;

    const originalTweet = await Tweet.findById(tweetId);

    if (!originalTweet) {
      return res.status(404).json({
        success: false,
        message: 'Tweet não encontrado'
      });
    }

    // Encontrar e deletar o retweet
    const retweet = await Tweet.findOneAndDelete({
      author: userId,
      retweetOf: tweetId
    });

    if (!retweet) {
      return res.status(404).json({
        success: false,
        message: 'Retweet não encontrado'
      });
    }

    // Remover retweet do tweet original
    await originalTweet.unretweet(userId);

    // Decrementar contador de tweets do usuário
    await User.findByIdAndUpdate(userId, { $inc: { tweetsCount: -1 } });

    res.json({
      success: true,
      message: 'Retweet removido com sucesso',
      data: { 
        retweetsCount: originalTweet.retweetsCount
      }
    });

  } catch (error) {
    console.error('Erro ao remover retweet:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter retweets de um tweet
const getRetweets = async (req, res) => {
  try {
    const { tweetId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const retweets = await Tweet.find({
      retweetOf: tweetId,
      isDeleted: { $ne: true }
    })
    .populate('author', 'username displayName avatar isVerified')
    .populate('retweetOf')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    res.json({
      success: true,
      data: { retweets }
    });

  } catch (error) {
    console.error('Erro ao obter retweets:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter retweets do usuário
const getUserRetweets = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const retweets = await Tweet.find({
      author: userId,
      retweetOf: { $exists: true },
      isDeleted: { $ne: true }
    })
    .populate('author', 'username displayName avatar isVerified')
    .populate('retweetOf')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    res.json({
      success: true,
      data: { retweets }
    });

  } catch (error) {
    console.error('Erro ao obter retweets do usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Verificar se usuário retweetou um tweet
const checkRetweetStatus = async (req, res) => {
  try {
    const { tweetId } = req.params;
    const userId = req.user._id;

    const retweet = await Tweet.findOne({
      author: userId,
      retweetOf: tweetId,
      isDeleted: { $ne: true }
    });

    const originalTweet = await Tweet.findById(tweetId);

    if (!originalTweet) {
      return res.status(404).json({
        success: false,
        message: 'Tweet não encontrado'
      });
    }

    res.json({
      success: true,
      data: { 
        retweeted: !!retweet,
        retweetsCount: originalTweet.retweetsCount
      }
    });

  } catch (error) {
    console.error('Erro ao verificar status do retweet:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  retweet,
  unretweet,
  getRetweets,
  getUserRetweets,
  checkRetweetStatus
};