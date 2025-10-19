const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Conteúdo da mensagem é obrigatório'],
    maxlength: [1000, 'Mensagem deve ter no máximo 1000 caracteres'],
    trim: true
  },
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'file', 'gif'],
    default: 'text'
  },
  media: {
    url: String,
    filename: String,
    size: Number,
    mimeType: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  },
  // Para mensagens em grupo (futuro)
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  },
  // Para mensagens editadas
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
  // Para mensagens com reação
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Para mensagens respondidas
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para performance
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, isRead: 1 });
messageSchema.index({ conversation: 1, createdAt: -1 });

// Middleware para soft delete
messageSchema.pre('find', function() {
  this.where({ isDeleted: { $ne: true } });
});

messageSchema.pre('findOne', function() {
  this.where({ isDeleted: { $ne: true } });
});

// Middleware para marcar como lida
messageSchema.pre('save', function(next) {
  if (this.isModified('isRead') && this.isRead && !this.readAt) {
    this.readAt = new Date();
  }
  next();
});

// Virtual para URL da mensagem
messageSchema.virtual('messageUrl').get(function() {
  return `/messages/${this._id}`;
});

// Método para marcar como lida
messageSchema.methods.markAsRead = async function() {
  this.isRead = true;
  this.readAt = new Date();
  await this.save();
  return this;
};

// Método para editar mensagem
messageSchema.methods.edit = async function(newContent) {
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

// Método para adicionar reação
messageSchema.methods.addReaction = async function(userId, emoji) {
  // Remover reação existente do usuário
  this.reactions = this.reactions.filter(r => r.user.toString() !== userId.toString());
  
  // Adicionar nova reação
  this.reactions.push({
    user: userId,
    emoji: emoji
  });
  
  await this.save();
};

// Método para remover reação
messageSchema.methods.removeReaction = async function(userId) {
  this.reactions = this.reactions.filter(r => r.user.toString() !== userId.toString());
  await this.save();
};

// Método para soft delete
messageSchema.methods.softDelete = async function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  await this.save();
};

// Método estático para obter conversa entre dois usuários
messageSchema.statics.getConversation = async function(user1Id, user2Id, page = 1, limit = 50) {
  const skip = (page - 1) * limit;

  const messages = await this.find({
    $or: [
      { sender: user1Id, receiver: user2Id },
      { sender: user2Id, receiver: user1Id }
    ]
  })
  .populate('sender', 'username displayName avatar isVerified')
  .populate('receiver', 'username displayName avatar isVerified')
  .populate('replyTo')
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);

  return messages.reverse(); // Ordenar por data crescente
};

// Método estático para obter conversas do usuário
messageSchema.statics.getUserConversations = async function(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;

  // Buscar as últimas mensagens de cada conversa
  const conversations = await this.aggregate([
    {
      $match: {
        $or: [
          { sender: userId },
          { receiver: userId }
        ],
        isDeleted: { $ne: true }
      }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ['$sender', userId] },
            '$receiver',
            '$sender'
          ]
        },
        lastMessage: { $first: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ['$receiver', userId] }, { $eq: ['$isRead', false] }] },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $project: {
        user: {
          _id: '$user._id',
          username: '$user.username',
          displayName: '$user.displayName',
          avatar: '$user.avatar',
          isVerified: '$user.isVerified'
        },
        lastMessage: 1,
        unreadCount: 1
      }
    },
    {
      $sort: { 'lastMessage.createdAt': -1 }
    },
    {
      $skip: skip
    },
    {
      $limit: limit
    }
  ]);

  return conversations;
};

// Método estático para marcar conversa como lida
messageSchema.statics.markConversationAsRead = async function(userId, otherUserId) {
  await this.updateMany(
    {
      sender: otherUserId,
      receiver: userId,
      isRead: false
    },
    {
      isRead: true,
      readAt: new Date()
    }
  );
};

// Método estático para obter contagem de mensagens não lidas
messageSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({
    receiver: userId,
    isRead: false
  });
};

module.exports = mongoose.model('Message', messageSchema);