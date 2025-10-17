const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'like',
      'retweet',
      'comment',
      'follow',
      'mention',
      'reply',
      'quote'
    ],
    required: true
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tweet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet'
  },
  content: {
    type: String,
    maxlength: [200, 'Conteúdo da notificação deve ter no máximo 200 caracteres']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  // Dados adicionais para diferentes tipos de notificação
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para performance
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ from: 1 });

// Middleware para marcar como lida quando lida
notificationSchema.pre('save', function(next) {
  if (this.isModified('isRead') && this.isRead && !this.readAt) {
    this.readAt = new Date();
  }
  next();
});

// Virtual para URL da notificação
notificationSchema.virtual('url').get(function() {
  if (this.tweet) {
    return `/tweet/${this.tweet}`;
  }
  return `/profile/${this.from.username}`;
});

// Método para marcar como lida
notificationSchema.methods.markAsRead = async function() {
  this.isRead = true;
  this.readAt = new Date();
  await this.save();
  return this;
};

// Método estático para criar notificação
notificationSchema.statics.createNotification = async function(data) {
  const { user, type, from, tweet, content, metadata } = data;

  // Verificar se já existe notificação similar recente (evitar spam)
  const recentNotification = await this.findOne({
    user,
    type,
    from,
    tweet,
    createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // 5 minutos
  });

  if (recentNotification) {
    return recentNotification;
  }

  const notification = new this({
    user,
    type,
    from,
    tweet,
    content,
    metadata
  });

  await notification.save();
  return notification;
};

// Método estático para obter notificações do usuário
notificationSchema.statics.getUserNotifications = async function(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;

  const notifications = await this.find({ user: userId })
    .populate('from', 'username displayName avatar isVerified')
    .populate('tweet')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return notifications;
};

// Método estático para marcar todas como lidas
notificationSchema.statics.markAllAsRead = async function(userId) {
  await this.updateMany(
    { user: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

// Método estático para obter contagem de notificações não lidas
notificationSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({ user: userId, isRead: false });
};

module.exports = mongoose.model('Notification', notificationSchema);