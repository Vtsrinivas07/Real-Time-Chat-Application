import React, { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import { initSocket, disconnectSocket } from './services/socket';
import './App.css';

function App() {
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '');
  const [inputName, setInputName] = useState(userName);
  const [userId, setUserId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [appError, setAppError] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    const socket = initSocket();

    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      setAppError(null);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socket.on('onlineUsers', (count) => {
      setOnlineUsers(count);
    });

    socket.on('activeUsers', (users) => {
      setActiveUsers(users);
    });

    socket.on('user:joined', (data) => {
      setActiveUsers((prev) => [...prev, data]);
    });

    socket.on('user:left', (userId) => {
      setActiveUsers((prev) => prev.filter((u) => u.id !== userId));
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  const handleEnterName = async () => {
    const trimmedName = inputName.trim();
    if (!trimmedName) {
      alert('Please enter a name');
      return;
    }

    if (trimmedName.length > 20) {
      alert('Name must be 20 characters or less');
      return;
    }

    try {
      const socket = initSocket();

      const existingUser = activeUsers.find(
        (u) => u.name.toLowerCase() === trimmedName.toLowerCase()
      );

      let finalName = trimmedName;
      if (existingUser) {
        let sequence = 1;
        let candidateName = `${trimmedName}-${sequence}`;

        while (activeUsers.some((u) => u.name === candidateName)) {
          sequence++;
          candidateName = `${trimmedName}-${sequence}`;
        }

        finalName = candidateName;
        alert(`Name "${trimmedName}" is already taken. Using "${finalName}" instead.`);
      }

      setUserName(finalName);
      setInputName(finalName);
      localStorage.setItem('userName', finalName);

      const uniqueId = finalName + '-' + Math.random().toString(36).substr(2, 6);
      setUserId(uniqueId);
      localStorage.setItem('chatUserId', uniqueId);

      socket.emit('user:join', { id: uniqueId, name: finalName });
    } catch (error) {
      console.error('Error joining:', error);
      setAppError('Failed to join chat');
    }
  };

  const handleLeaveChat = () => {
    if (window.confirm('Are you sure you want to leave?')) {
      setUserName('');
      setInputName('');
      setUserId('');
      localStorage.removeItem('userName');
      localStorage.removeItem('chatUserId');
      const socket = initSocket();
      socket.emit('user:leave');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isNameSet) {
      handleEnterName();
    }
  };

  if (appError) {
    return (
      <div className="app-container">
        <div className="placeholder-container">
          <div style={{ maxWidth: '400px', textAlign: 'center', background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h1 style={{ color: '#dc2626', marginBottom: '10px' }}>Application Error</h1>
            <p style={{ color: '#6b7280', marginBottom: '15px' }}>{appError}</p>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isNameSet = userName && userName.trim();

  return (
    <div className="app-container">
      <div className="header-bar">
        <div className="header-content">
          <div className="name-section">
            <label className="name-label">Your name:</label>
            <div className="name-input-container">
              <div className="name-input-wrapper">
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your name..."
                  maxLength={20}
                  disabled={isNameSet}
                />
                <span className="name-char-count">{inputName.length}/20</span>
              </div>

              {!isNameSet ? (
                <button
                  onClick={handleEnterName}
                  disabled={!inputName.trim()}
                  className="enter-btn"
                >
                  ✓ Enter
                </button>
              ) : (
                <div className="name-button-group">
                  <div className="name-display">✓ {userName}</div>
                  <button
                    onClick={handleLeaveChat}
                    className="leave-btn"
                  >
                    Leave
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="status-section">
            <div className="status-indicator">
              <span className={`status-dot ${isConnected ? 'online' : 'offline'}`}></span>
              <span className={`status-text ${isConnected ? 'online' : 'offline'}`}>
                {isConnected ? 'Online' : 'Offline'}
              </span>
            </div>

            {onlineUsers > 0 && (
              <div className="users-online">
                {onlineUsers} online
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="main-content">
        <h1 className="app-title">Real-Time Chat</h1>

        {isNameSet && userId ? (
          <ChatWindow userId={userId} userName={userName} />
        ) : (
          <div className="chat-container">
            <div className="placeholder-container">
              Enter your name above and click "Enter" to start chatting
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
