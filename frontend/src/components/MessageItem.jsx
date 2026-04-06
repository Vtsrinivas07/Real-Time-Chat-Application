import React, { useState } from 'react';
import { deleteMessageForMe, deleteMessageForEveryone, togglePinMessage } from '../services/api';

const MessageItem = ({ message, userId, onDeleteForMe, onPinToggle }) => {
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getColorFromId = (id) => {
    const colors = [
      '#fecaca', // red-200
      '#fed7aa', // orange-200
      '#fde68a', // yellow-200
      '#d9f99d', // lime-200
      '#bbf7d0', // green-200
      '#a7f3d0', // emerald-200
      '#99f6e4', // teal-200
      '#a5f3fc', // cyan-200
      '#bfdbfe', // blue-200
      '#c7d2fe', // indigo-200
      '#ddd6fe', // violet-200
      '#f0abfc', // fuchsia-200
      '#fbcfe8', // pink-200
    ];
    
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const handleDeleteForMe = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      await deleteMessageForMe(message._id, userId);
      onDeleteForMe(message._id);
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteForEveryone = async () => {
    if (isDeleting) return;
    
    if (message.senderId !== userId) {
      alert('You can only delete your own messages for everyone');
      return;
    }
    
    if (!window.confirm('Delete this message for everyone?')) return;
    
    try {
      setIsDeleting(true);
      await deleteMessageForEveryone(message._id, userId);
    } catch (error) {
      console.error('Error deleting message:', error);
      alert(error.response?.data?.message || 'Failed to delete message');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePin = async () => {
    try {
      await togglePinMessage(message._id);
      onPinToggle(message._id);
    } catch (error) {
      console.error('Error toggling pin:', error);
      alert('Failed to toggle pin');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isDeleted = message.deletedForEveryone;
  const isOwnMessage = message.senderId === userId;
  const userColor = !isOwnMessage && !message.isPinned ? getColorFromId(message.senderId) : null;

  return (
    <div
      className={`relative p-3 rounded-lg transition-all ${
        message.isPinned
          ? 'bg-yellow-50 border-l-4 border-yellow-400'
          : isOwnMessage
          ? 'bg-blue-50 border-l-4 border-blue-400'
          : 'bg-white'
      } ${isDeleted ? 'opacity-60' : ''} hover:shadow-md`}
      style={userColor && !isDeleted ? { backgroundColor: userColor } : {}}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {!isOwnMessage && (
              <span className="text-xs font-semibold text-gray-700">
                {message.senderId}
              </span>
            )}
            <span className="text-xs text-gray-500">
              {formatTime(message.timestamp)}
            </span>
            {isOwnMessage && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                You
              </span>
            )}
            {message.isPinned && (
              <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
                📌 Pinned
              </span>
            )}
          </div>
          <p className={`text-gray-800 break-words ${isDeleted ? 'italic text-gray-500' : ''}`}>
            {message.content}
          </p>
        </div>

        {showActions && !isDeleted && (
          <div className="flex gap-1 ml-2">
            <button
              onClick={handleTogglePin}
              className="p-1 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
              title={message.isPinned ? 'Unpin' : 'Pin message'}
            >
              📌
            </button>
            <button
              onClick={handleDeleteForMe}
              disabled={isDeleting}
              className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
              title="Delete for me"
            >
              🗑️
            </button>
            {message.senderId === userId && (
              <button
                onClick={handleDeleteForEveryone}
                disabled={isDeleting}
                className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                title="Delete for everyone"
              >
                ❌
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
