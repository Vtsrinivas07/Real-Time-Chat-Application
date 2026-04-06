import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import PinnedMessages from './PinnedMessages';
import { getMessages } from '../services/api';
import { getSocket } from '../services/socket';

const ChatWindow = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    const socket = getSocket();

    socket.on('message:new', (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on('message:deleted', ({ messageId, deletedForEveryone }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? { ...msg, deletedForEveryone: true, content: '[Message deleted]' }
            : msg
        )
      );
    });

    socket.on('message:pinned', ({ messageId, isPinned }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, isPinned } : msg
        )
      );
    });

    return () => {
      socket.off('message:new');
      socket.off('message:deleted');
      socket.off('message:pinned');
    };
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMessages(100, 0);
      setMessages(data.messages);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteForMe = (messageId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === messageId
          ? { ...msg, deletedBy: [...(msg.deletedBy || []), userId] }
          : msg
      )
    );
  };

  const handlePinToggle = () => {};

  const visibleMessages = messages.filter(
    (msg) => !msg.deletedBy || !msg.deletedBy.includes(userId)
  ).filter(msg => msg && msg._id);

  const pinnedMessages = [...new Map(
    visibleMessages
      .filter((msg) => msg.isPinned && !msg.deletedForEveryone)
      .map((msg) => [msg._id, msg])
  ).values()];

  if (loading) {
    return (
      <div className="chat-container">
        <div className="placeholder-container">
          Loading messages...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-container">
        <div className="placeholder-container">
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#ef4444', marginBottom: '15px' }}>{error}</p>
            <button
              onClick={loadMessages}
              style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <PinnedMessages messages={pinnedMessages} userId={userId} />

      <MessageList
        messages={visibleMessages}
        userId={userId}
        onDeleteForMe={handleDeleteForMe}
        onPinToggle={handlePinToggle}
      />

      <MessageInput onSendMessage={() => {}} userId={userId} />
    </div>
  );
};

export default ChatWindow;
