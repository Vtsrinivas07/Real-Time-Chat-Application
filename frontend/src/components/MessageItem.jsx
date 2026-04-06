import React, { useState, useRef, useEffect } from 'react';
import { deleteMessageForMe, deleteMessageForEveryone, togglePinMessage } from '../services/api';

const MessageItem = ({ message, userId, userName, onDeleteForMe, onPinToggle }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

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

    if (Number.isNaN(date.getTime())) {
      return '--:--';
    }

    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Extract sender name from senderId (format: "name-xxxx")
  const senderName =
    message.senderName ||
    message.senderId?.split('-').slice(0, -1).join('-') ||
    'Unknown';

  const isDeleted = message.deletedForEveryone;
  const isOwnMessage = message.senderId === userId;

  return (
    <div className={`message ${isOwnMessage ? 'me' : 'other'} ${message.isPinned ? 'pinned' : ''} ${isDeleted ? 'deleted' : ''}`}>
      <div className={`message-bubble ${isDeleted ? 'message-deleted' : ''}`} ref={menuRef}>
        <div className="message-header">
          <span className="message-sender">{isOwnMessage ? 'You' : senderName}</span>
          <span className="message-time">{formatTime(message.createdAt || message.timestamp)}</span>
          {message.isPinned && (
            <span className="message-badge pinned">Pinned</span>
          )}
        </div>
        <div className={`message-text ${isDeleted ? 'deleted' : ''}`}>
          {isDeleted ? 'Message deleted' : message.content}
        </div>

        {!isDeleted && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              type="button"
              className="message-menu-btn"
              title="Message options"
            >
              ⋮
            </button>

            {showMenu && (
              <div className="message-menu">
                <button
                  onClick={() => {
                    handleTogglePin();
                    setShowMenu(false);
                  }}
                  className="menu-item"
                >
                  {message.isPinned ? 'Unpin' : 'Pin'}
                </button>

                <button
                  onClick={() => {
                    handleDeleteForMe();
                    setShowMenu(false);
                  }}
                  disabled={isDeleting}
                  className="menu-item"
                >
                  Delete for me
                </button>

                {message.senderId === userId && (
                  <button
                    onClick={() => {
                      handleDeleteForEveryone();
                      setShowMenu(false);
                    }}
                    disabled={isDeleting}
                    className="menu-item danger"
                  >
                    Delete for everyone
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
