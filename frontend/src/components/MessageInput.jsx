import React, { useState } from 'react';
import { sendMessage } from '../services/api';

const MessageInput = ({ onSendMessage, userId, userName }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage || sending) return;

    if (trimmedMessage.length > 1000) {
      alert('Message is too long (max 1000 characters)');
      return;
    }

    try {
      setSending(true);
      await sendMessage(trimmedMessage, userId);
      setMessage('');
      onSendMessage();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="input-area">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
        disabled={sending}
        maxLength={1000}
      />
      <button
        type="submit"
        disabled={!message.trim() || sending}
        className="send-btn"
        onClick={handleSubmit}
      >
        {sending ? 'Sending...' : 'Send'}
      </button>
      <div className="char-counter">{message.length}/1000</div>
    </div>
  );
};

export default MessageInput;
