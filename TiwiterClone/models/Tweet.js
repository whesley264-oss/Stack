const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Conteúdo do tweet é obrigatório'],
    maxlength: [280, 'Tweet deve ter no máximo 280 caracteres'],
    trim: true
  },
  images: [{
    type: String, // URLs das imagens
    max: 4 // Máximo 4 imagens por tweet
  }],
  video: {
    type: String, // URL do vídeo
    maxlength: 500
  },
  gif: {
    type: String, // URL do GIF
    maxlength: 500
  },
  poll: {
    question: {
      type: String,
      maxlength: [200, 'Pergunta da enquete deve ter no máximo 200 caracteres']
    },
    options: [{
      text: {
        type: String,
        maxlength: [50, 'Opção da enquete deve ter no máximo 50 caracteres']
      },
      votes: {
        type: Number,
        default: 0
      },
      voters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }]
    }],
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
    },
    totalVotes: {
      type: Number,
      default: 0
    }
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet'
  },
  retweetOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet'
  },
  quotedTweet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet'
  },
  thread: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet'
  }],
  isThread: {
    type: Boolean,
    default: false
  },
  threadPosition: {
    type: Number,
    default: 0
  },
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  hashtags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  urls: [{
    original: String,
    short: String,
    title: String,
    description: String,
    image: String
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  retweets: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    retweetedAt: {
      type: Date,
      default: Date.now
    }
  }],
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  editHistory: [{
    content: String,
    editedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  },
  // Contadores para performance
  likesCount: {
    type: Number,
    default: 0
  },
  retweetsCount: {
    type: Number,
    default: 0
  },
  repliesCount: {
    type: Number,
    default: 0
  },
  bookmarksCount: {
    type: Number,
    default: 0
  },
  // Engajamento
  engagement: {
    total: {
      type: Number,
      default: 0
    },
    rate: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para performance
tweetSchema.index({ author: 1, createdAt: -1 });
tweetSchema.index({ createdAt: -1 });
tweetSchema.index({ likes: 1 });
tweetSchema.index({ retweets: 1 });
tweetSchema.index({ hashtags: 1 });
tweetSchema.index({ mentions: 1 });
tweetSchema.index({ replyTo: 1 });
tweetSchema.index({ retweetOf: 1 });
tweetSchema.index({ isDeleted: 1, isPublic: 1 });

// Middleware para atualizar contadores
tweetSchema.pre('save', function(next) {
  this.likesCount = this.likes.length;
  this.retweetsCount = this.retweets.length;
  this.bookmarksCount = this.bookmarks.length;
  
  // Calcular engajamento
  this.engagement.total = this.likesCount + this.retweetsCount + this.repliesCount;
  if (this.views > 0) {
    this.engagement.rate = (this.engagement.total / this.views) * 100;
  }
  
  next();
});

// Middleware para soft delete
tweetSchema.pre('find', function() {
  this.where({ isDeleted: { $ne: true } });
});

tweetSchema.pre('findOne', function() {
  this.where({ isDeleted: { $ne: true } });
});

// Virtual para URL do tweet
tweetSchema.virtual('tweetUrl').get(function() {
  return `/tweet/${this._id}`;
});

// Virtual para verificar se é retweet
tweetSchema.virtual('isRetweet').get(function() {
  return !!this.retweetOf;
});

// Virtual para verificar se é reply
tweetSchema.virtual('isReply').get(function() {
  return !!this.replyTo;
});

// Virtual para verificar se é quote
tweetSchema.virtual('isQuote').get(function() {
  return !!this.quotedTweet;
});

// Método para dar like
tweetSchema.methods.like = async function(userId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
    await this.save();
    return true;
  }
  return false;
};

// Método para remover like
tweetSchema.methods.unlike = async function(userId) {
  this.likes = this.likes.filter(id => id.toString() !== userId.toString());
  await this.save();
  return true;
};

// Método para retweet
tweetSchema.methods.retweet = async function(userId) {
  const existingRetweet = this.retweets.find(rt => rt.user.toString() === userId.toString());
  
  if (!existingRetweet) {
    this.retweets.push({
      user: userId,
      retweetedAt: new Date()
    });
    await this.save();
    return true;
  }
  return false;
};

// Método para remover retweet
tweetSchema.methods.unretweet = async function(userId) {
  this.retweets = this.retweets.filter(rt => rt.user.toString() !== userId.toString());
  await this.save();
  return true;
};

// Método para bookmark
tweetSchema.methods.bookmark = async function(userId) {
  if (!this.bookmarks.includes(userId)) {
    this.bookmarks.push(userId);
    await this.save();
    return true;
  }
  return false;
};

// Método para remover bookmark
tweetSchema.methods.unbookmark = async function(userId) {
  this.bookmarks = this.bookmarks.filter(id => id.toString() !== userId.toString());
  await this.save();
  return true;
};

// Método para incrementar views
tweetSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
};

// Método para soft delete
tweetSchema.methods.softDelete = async function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  await this.save();
};

// Método para editar tweet
tweetSchema.methods.edit = async function(newContent) {
  // Salvar versão anterior no histórico
  this.editHistory.push({
    content: this.content,
    editedAt: new Date()
  });
  
  this.content = newContent;
  this.isEdited = true;
  this.editedAt = new Date();
  
  await this.save();
};

// Método estático para buscar tweets do feed
tweetSchema.statics.getFeed = async function(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  
  // Buscar usuários que o usuário segue
  const user = await mongoose.model('User').findById(userId);
  const followingIds = user.following;
  
  // Buscar tweets dos usuários seguidos + tweets do próprio usuário
  const tweets = await this.find({
    author: { $in: [...followingIds, userId] },
    isPublic: true,
    isDeleted: { $ne: true }
  })
  .populate('author', 'username displayName avatar isVerified')
  .populate('retweetOf')
  .populate('quotedTweet')
  .populate('replyTo')
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);
  
  return tweets;
};

// Método estático para buscar tweets por hashtag
tweetSchema.statics.getByHashtag = async function(hashtag, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  
  const tweets = await this.find({
    hashtags: hashtag.toLowerCase(),
    isPublic: true,
    isDeleted: { $ne: true }
  })
  .populate('author', 'username displayName avatar isVerified')
  .populate('retweetOf')
  .populate('quotedTweet')
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);
  
  return tweets;
};

// Método estático para buscar tweets por menção
tweetSchema.statics.getByMention = async function(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  
  const tweets = await this.find({
    mentions: userId,
    isPublic: true,
    isDeleted: { $ne: true }
  })
  .populate('author', 'username displayName avatar isVerified')
  .populate('retweetOf')
  .populate('quotedTweet')
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);
  
  return tweets;
};

module.exports = mongoose.model('Tweet', tweetSchema);