const Tweet = require('../models/Tweet');
const User = require('../models/User');

// Dar like em um tweet
const likeTweet = async (req, res) => {
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

    const wasLiked = await tweet.like(userId);

    if (wasLiked) {
      // Incrementar contador de likes do usuário
      await User.findByIdAndUpdate(userId, { $inc: { likesCount: 1 } });
    }

    res.json({
      success: true,
      message: wasLiked ? 'Tweet curtido' : 'Tweet já estava curtido',
      data: { 
        liked: wasLiked,
        likesCount: tweet.likesCount
      }
    });

  } catch (error) {
    console.error('Erro ao curtir tweet:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Remover like de um tweet
const unlikeTweet = async (req, res) => {
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

    await tweet.unlike(userId);

    // Decrementar contador de likes do usuário
    await User.findByIdAndUpdate(userId, { $inc: { likesCount: -1 } });

    res.json({
      success: true,
      message: 'Like removido',
      data: { 
        liked: false,
        likesCount: tweet.likesCount
      }
    });

  } catch (error) {
    console.error('Erro ao remover like:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter tweets curtidos pelo usuário
const getLikedTweets = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const tweets = await Tweet.find({
      likes: userId,
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

// Verificar se usuário curtiu um tweet
const checkLikeStatus = async (req, res) => {
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

    const isLiked = tweet.likes.includes(userId);

    res.json({
      success: true,
      data: { 
        liked: isLiked,
        likesCount: tweet.likesCount
      }
    });

  } catch (error) {
    console.error('Erro ao verificar status do like:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  likeTweet,
  unlikeTweet,
  getLikedTweets,
  checkLikeStatus
};