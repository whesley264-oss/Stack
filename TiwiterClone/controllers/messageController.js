const Message = require('../models/Message');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Enviar mensagem
const sendMessage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { receiverId, content, type = 'text', media, replyTo } = req.body;
    const senderId = req.user._id;

    // Verificar se o receptor existe
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar se o usuário não está bloqueado
    if (receiver.blockedUsers && receiver.blockedUsers.includes(senderId)) {
      return res.status(403).json({
        success: false,
        message: 'Você foi bloqueado por este usuário'
      });
    }

    // Verificar se o usuário atual não bloqueou o receptor
    const sender = await User.findById(senderId);
    if (sender.blockedUsers && sender.blockedUsers.includes(receiverId)) {
      return res.status(403).json({
        success: false,
        message: 'Você bloqueou este usuário'
      });
    }

    // Verificar se é reply e se a mensagem existe
    if (replyTo) {
      const replyMessage = await Message.findById(replyTo);
      if (!replyMessage) {
        return res.status(404).json({
          success: false,
          message: 'Mensagem de resposta não encontrada'
        });
      }
    }

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
      type,
      media,
      replyTo
    });

    await message.save();

    // Popular dados do remetente e destinatário
    await message.populate('sender', 'username displayName avatar isVerified');
    await message.populate('receiver', 'username displayName avatar isVerified');
    if (replyTo) {
      await message.populate('replyTo');
    }

    res.status(201).json({
      success: true,
      message: 'Mensagem enviada com sucesso',
      data: { message }
    });

  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter conversa entre dois usuários
const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    // Verificar se o usuário existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const messages = await Message.getConversation(currentUserId, userId, page, limit);

    // Marcar mensagens como lidas
    await Message.markConversationAsRead(currentUserId, userId);

    res.json({
      success: true,
      data: { messages }
    });

  } catch (error) {
    console.error('Erro ao obter conversa:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter conversas do usuário
const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const conversations = await Message.getUserConversations(currentUserId, page, limit);

    res.json({
      success: true,
      data: { conversations }
    });

  } catch (error) {
    console.error('Erro ao obter conversas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Editar mensagem
const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const currentUserId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada'
      });
    }

    // Verificar se o usuário é o remetente
    if (message.sender.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Você só pode editar suas próprias mensagens'
      });
    }

    // Verificar se a mensagem pode ser editada (apenas mensagens recentes)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (message.createdAt < oneHourAgo) {
      return res.status(400).json({
        success: false,
        message: 'Mensagens só podem ser editadas até 1 hora após o envio'
      });
    }

    await message.edit(content);

    res.json({
      success: true,
      message: 'Mensagem editada com sucesso',
      data: { message }
    });

  } catch (error) {
    console.error('Erro ao editar mensagem:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Deletar mensagem
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const currentUserId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada'
      });
    }

    // Verificar se o usuário é o remetente
    if (message.sender.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Você só pode deletar suas próprias mensagens'
      });
    }

    await message.softDelete();

    res.json({
      success: true,
      message: 'Mensagem deletada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar mensagem:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Adicionar reação à mensagem
const addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const currentUserId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada'
      });
    }

    await message.addReaction(currentUserId, emoji);

    res.json({
      success: true,
      message: 'Reação adicionada com sucesso',
      data: { reactions: message.reactions }
    });

  } catch (error) {
    console.error('Erro ao adicionar reação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Remover reação da mensagem
const removeReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const currentUserId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada'
      });
    }

    await message.removeReaction(currentUserId);

    res.json({
      success: true,
      message: 'Reação removida com sucesso',
      data: { reactions: message.reactions }
    });

  } catch (error) {
    console.error('Erro ao remover reação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter contagem de mensagens não lidas
const getUnreadCount = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const count = await Message.getUnreadCount(currentUserId);

    res.json({
      success: true,
      data: { unreadCount: count }
    });

  } catch (error) {
    console.error('Erro ao obter contagem de mensagens não lidas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Marcar conversa como lida
const markConversationAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    await Message.markConversationAsRead(currentUserId, userId);

    res.json({
      success: true,
      message: 'Conversa marcada como lida'
    });

  } catch (error) {
    console.error('Erro ao marcar conversa como lida:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  sendMessage,
  getConversation,
  getConversations,
  editMessage,
  deleteMessage,
  addReaction,
  removeReaction,
  getUnreadCount,
  markConversationAsRead
};