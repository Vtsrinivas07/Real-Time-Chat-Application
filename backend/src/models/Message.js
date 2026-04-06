const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  senderId: {
    type: String,
    required: [true, 'Sender ID is required']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  deletedForEveryone: {
    type: Boolean,
    default: false
  },
  deletedBy: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Index for better query performance
messageSchema.index({ timestamp: -1 });
messageSchema.index({ isPinned: 1, timestamp: -1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
