const Tweet = require('../models/Tweet');
const User = require('../models/User');

// Busca geral
const search = async (req, res) => {
  try {
    const { q, type, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Query de busca deve ter pelo menos 2 caracteres'
      });
    }

    const searchType = type || 'all';
    const results = {};

    // Buscar tweets
    if (searchType === 'all' || searchType === 'tweets') {
      const tweets = await Tweet.find({
        $or: [
          { content: { $regex: q, $options: 'i' } },
          { hashtags: { $in: [q.toLowerCase()] } }
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

      results.tweets = tweets;
    }

    // Buscar usuários
    if (searchType === 'all' || searchType === 'users') {
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

      results.users = users;
    }

    // Buscar hashtags
    if (searchType === 'all' || searchType === 'hashtags') {
      const hashtags = await Tweet.aggregate([
        {
          $match: {
            hashtags: { $in: [q.toLowerCase()] },
            isPublic: true,
            isDeleted: { $ne: true }
          }
        },
        {
          $group: {
            _id: '$hashtags',
            count: { $sum: 1 }
          }
        },
        {
          $unwind: '$_id'
        },
        {
          $match: {
            '_id': { $regex: q, $options: 'i' }
          }
        },
        {
          $group: {
            _id: '$_id',
            count: { $sum: '$count' }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 10
        }
      ]);

      results.hashtags = hashtags;
    }

    res.json({
      success: true,
      data: { results }
    });

  } catch (error) {
    console.error('Erro na busca:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar trends
const getTrends = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Buscar hashtags mais populares nas últimas 24 horas
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const trends = await Tweet.aggregate([
      {
        $match: {
          createdAt: { $gte: oneDayAgo },
          hashtags: { $exists: true, $ne: [] },
          isPublic: true,
          isDeleted: { $ne: true }
        }
      },
      {
        $unwind: '$hashtags'
      },
      {
        $group: {
          _id: '$hashtags',
          count: { $sum: 1 },
          tweets: { $push: '$_id' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $project: {
          hashtag: '$_id',
          count: 1,
          tweets: { $size: '$tweets' }
        }
      }
    ]);

    res.json({
      success: true,
      data: { trends }
    });

  } catch (error) {
    console.error('Erro ao obter trends:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar tweets por hashtag
const searchByHashtag = async (req, res) => {
  try {
    const { hashtag } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const tweets = await Tweet.find({
      hashtags: hashtag.toLowerCase(),
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
    console.error('Erro ao buscar por hashtag:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar tweets por menção
const searchByMention = async (req, res) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const tweets = await Tweet.find({
      mentions: user._id,
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
    console.error('Erro ao buscar por menção:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar usuários sugeridos
const getSuggestedUsers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const users = await User.find({
      isActive: true,
      followersCount: { $gt: 0 }
    })
    .select('username displayName avatar bio isVerified followersCount')
    .sort({ followersCount: -1 })
    .limit(limit);

    res.json({
      success: true,
      data: { users }
    });

  } catch (error) {
    console.error('Erro ao obter usuários sugeridos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  search,
  getTrends,
  searchByHashtag,
  searchByMention,
  getSuggestedUsers
};