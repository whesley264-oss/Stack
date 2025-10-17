const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username é obrigatório'],
    unique: true,
    trim: true,
    minlength: [3, 'Username deve ter pelo menos 3 caracteres'],
    maxlength: [20, 'Username deve ter no máximo 20 caracteres'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username pode conter apenas letras, números e underscore']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter pelo menos 6 caracteres']
  },
  displayName: {
    type: String,
    required: [true, 'Nome de exibição é obrigatório'],
    trim: true,
    maxlength: [50, 'Nome de exibição deve ter no máximo 50 caracteres']
  },
  bio: {
    type: String,
    maxlength: [160, 'Bio deve ter no máximo 160 caracteres'],
    default: ''
  },
  avatar: {
    type: String,
    default: 'https://via.placeholder.com/150/1DA1F2/FFFFFF?text=U'
  },
  coverPhoto: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    maxlength: [100, 'Localização deve ter no máximo 100 caracteres'],
    default: ''
  },
  website: {
    type: String,
    maxlength: [200, 'Website deve ter no máximo 200 caracteres'],
    default: ''
  },
  birthDate: {
    type: Date,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followersCount: {
    type: Number,
    default: 0
  },
  followingCount: {
    type: Number,
    default: 0
  },
  tweetsCount: {
    type: Number,
    default: 0
  },
  likesCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    language: {
      type: String,
      default: 'pt'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      mentions: {
        type: Boolean,
        default: true
      },
      likes: {
        type: Boolean,
        default: true
      },
      retweets: {
        type: Boolean,
        default: true
      },
      follows: {
        type: Boolean,
        default: true
      }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para performance
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ followers: 1 });
userSchema.index({ following: 1 });

// Middleware para hash da senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware para atualizar contadores
userSchema.pre('save', function(next) {
  this.followersCount = this.followers.length;
  this.followingCount = this.following.length;
  next();
});

// Método para verificar senha
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para obter dados públicos do usuário
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.email;
  delete userObject.preferences;
  return userObject;
};

// Método para verificar se usuário segue outro
userSchema.methods.isFollowing = function(userId) {
  return this.following.some(id => id.toString() === userId.toString());
};

// Método para seguir usuário
userSchema.methods.follow = async function(userId) {
  if (this._id.toString() === userId.toString()) {
    throw new Error('Você não pode seguir a si mesmo');
  }
  
  if (!this.isFollowing(userId)) {
    this.following.push(userId);
    await this.save();
  }
  
  return this;
};

// Método para deixar de seguir usuário
userSchema.methods.unfollow = async function(userId) {
  this.following = this.following.filter(id => id.toString() !== userId.toString());
  await this.save();
  return this;
};

// Virtual para URL do perfil
userSchema.virtual('profileUrl').get(function() {
  return `/profile/${this.username}`;
});

// Virtual para contagem de tweets (será atualizado quando tweets forem criados)
userSchema.virtual('tweetsCount').get(function() {
  return this.tweetsCount || 0;
});

module.exports = mongoose.model('User', userSchema);