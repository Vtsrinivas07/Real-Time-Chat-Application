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

  const handleSendMessage = (newMessage) => {
    // Message will be added via socket event
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

  const handlePinToggle = (messageId) => {
    // Update will come via socket event
  };

  const visibleMessages = messages.filter(
    (msg) => !msg.deletedBy || !msg.deletedBy.includes(userId)
  );

  const pinnedMessages = [...new Map(
    visibleMessages
      .filter((msg) => msg.isPinned && !msg.deletedForEveryone)
      .map((msg) => [msg._id, msg])
  ).values()];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={loadMessages}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
      <PinnedMessages messages={pinnedMessages} userId={userId} />
      
      <MessageList
        messages={visibleMessages}
        userId={userId}
        onDeleteForMe={handleDeleteForMe}
        onPinToggle={handlePinToggle}
      />
      
      <MessageInput onSendMessage={handleSendMessage} userId={userId} />
    </div>
  );
};

export default ChatWindow;
