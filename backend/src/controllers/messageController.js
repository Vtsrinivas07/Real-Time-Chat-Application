const Message = require('../models/Message');

// Get all messages with pagination
exports.getMessages = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const messages = await Message.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(offset);

    const total = await Message.countDocuments();

    // Reverse to show oldest first
    res.json({
      success: true,
      messages: messages.reverse(),
      total
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { content, senderId } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message content cannot be empty'
      });
    }

    if (!senderId) {
      return res.status(400).json({
        success: false,
        message: 'Sender ID is required'
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot exceed 1000 characters'
      });
    }

    const message = new Message({
      content: content.trim(),
      senderId
    });

    await message.save();

    req.app.get('io').emit('message:new', message);

    res.status(201).json({
      success: true,
      message
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};

// Delete message for current user
exports.deleteForMe = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Add userId to deletedBy array if not already present
    if (!message.deletedBy.includes(userId)) {
      message.deletedBy.push(userId);
      await message.save();
    }

    res.json({
      success: true,
      message: 'Message deleted for you'
    });
  } catch (error) {
    console.error('Error deleting message for user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message'
    });
  }
};

exports.deleteForEveryone = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    if (message.senderId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own messages for everyone'
      });
    }

    message.deletedForEveryone = true;
    message.content = '[Message deleted]';
    await message.save();

    req.app.get('io').emit('message:deleted', {
      messageId: id,
      deletedForEveryone: true
    });

    res.json({
      success: true,
      message: 'Message deleted for everyone'
    });
  } catch (error) {
    console.error('Error deleting message for everyone:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message'
    });
  }
};

// Toggle pin status
exports.togglePin = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    if (message.deletedForEveryone) {
      return res.status(400).json({
        success: false,
        message: 'Cannot pin a deleted message'
      });
    }

    message.isPinned = !message.isPinned;
    await message.save();

    // Emit socket event
    req.app.get('io').emit('message:pinned', {
      messageId: id,
      isPinned: message.isPinned
    });

    res.json({
      success: true,
      message,
      isPinned: message.isPinned
    });
  } catch (error) {
    console.error('Error toggling pin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle pin'
    });
  }
};
