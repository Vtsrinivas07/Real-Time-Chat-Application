import React, { useState } from 'react';
import MessageItem from './MessageItem';

const PinnedMessages = ({ messages, userId }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (messages.length === 0) return null;

  return (
    <div className="border-b bg-yellow-50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-yellow-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-yellow-700 font-semibold">
            📌 Pinned Messages ({messages.length})
          </span>
        </div>
        <span className="text-gray-500">
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>

      {isExpanded && (
        <div className="px-4 pb-3 max-h-64 overflow-y-auto">
          <div className="space-y-2">
            {messages.map((message) => (
              <MessageItem
                key={message._id}
                message={message}
                userId={userId}
                onDeleteForMe={() => {}}
                onPinToggle={() => {}}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PinnedMessages;
