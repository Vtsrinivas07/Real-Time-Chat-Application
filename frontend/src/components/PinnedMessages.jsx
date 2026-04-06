import React, { useState } from 'react';
import MessageItem from './MessageItem';

const PinnedMessages = ({ messages, userId, userName }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (messages.length === 0) return null;

  return (
    <div className="pinned-section">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="pinned-header"
      >
        <div className="pinned-title-text">
          Pinned Messages ({messages.length})
        </div>
        <span className="pinned-toggle">{isExpanded ? '▼' : '▶'}</span>
      </button>

      {isExpanded && (
        <div className="pinned-content">
          {messages.map((message) => (
            <MessageItem
              key={message._id}
              message={message}
              userId={userId}
              userName={userName}
              onDeleteForMe={() => {}}
              onPinToggle={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PinnedMessages;
