import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';

const MessageList = ({ messages, userId, onDeleteForMe, onPinToggle }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="messages-area">
        <div className="empty-state">
          <div className="empty-state-text">No messages yet</div>
          <div className="empty-state-subtext">Be the first to start the conversation!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-area">
      {messages.map((message) => (
        message && message._id ? (
          <MessageItem
            key={message._id}
            message={message}
            userId={userId}
            onDeleteForMe={onDeleteForMe}
            onPinToggle={onPinToggle}
          />
        ) : null
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
