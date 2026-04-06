import React, { useState } from 'react';
import { sendMessage } from '../services/api';

const MessageInput = ({ onSendMessage, userId }) => {
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
    <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={sending}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          maxLength={1000}
        />
        <button
          type="submit"
          disabled={!message.trim() || sending}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </div>
      <div className="mt-1 text-xs text-gray-500 text-right">
        {message.length}/1000
      </div>
    </form>
  );
};

export default MessageInput;
