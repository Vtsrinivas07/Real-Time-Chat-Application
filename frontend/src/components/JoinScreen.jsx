import React, { useState } from 'react';

const JoinScreen = ({ onJoin }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleJoin = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Please enter your name');
      return;
    }

    if (trimmedName.length > 20) {
      setError('Name must be 20 characters or less');
      return;
    }

    setError('');
    localStorage.setItem('userName', trimmedName);
    onJoin(trimmedName);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleJoin(e);
    }
  };

  return (
    <div className="join-screen">
      <div className="join-card">
        <div>
          <h1 className="join-title">Welcome to Chat</h1>
          <p className="join-subtitle">Join the conversation</p>
        </div>

        <form onSubmit={handleJoin}>
          <div>
            <label className="join-label">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder="Enter your name..."
              maxLength={20}
              className="join-input"
              autoFocus
            />
            <p className="join-count">{name.length}/20</p>
          </div>

          {error && (
            <div className="join-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!name.trim()}
            className="join-submit"
          >
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinScreen;
