const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { body } = require('express-validator');

// Get all messages
router.get('/', messageController.getMessages);

// Send a new message
router.post('/',
  body('content').trim().notEmpty().withMessage('Content is required').isLength({ max: 1000 }).withMessage('Content too long'),
  messageController.sendMessage
);

// Delete message for current user
router.delete('/:id/delete-for-me', messageController.deleteForMe);

// Delete message for everyone
router.delete('/:id/delete-for-everyone', messageController.deleteForEveryone);

// Toggle pin status
router.patch('/:id/pin', messageController.togglePin);

module.exports = router;
