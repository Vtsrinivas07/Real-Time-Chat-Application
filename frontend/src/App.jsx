import React, { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import { initSocket, disconnectSocket } from './services/socket';

function App() {
  const [userId, setUserId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    let storedUserId = localStorage.getItem('chatUserId');
    if (!storedUserId) {
      storedUserId = 'user-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('chatUserId', storedUserId);
    }
    setUserId(storedUserId);

    const socket = initSocket();

    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socket.on('onlineUsers', (count) => {
      setOnlineUsers(count);
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            💬 Real-Time Chat
          </h1>
          <p className="text-gray-600">
            Connected as: <span className="font-mono text-sm">{userId}</span>
            {isConnected ? (
              <span className="ml-3 inline-flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                <span className="text-green-600 text-sm">Online</span>
              </span>
            ) : (
              <span className="ml-3 inline-flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                <span className="text-red-600 text-sm">Offline</span>
              </span>
            )}
            {onlineUsers > 0 && (
              <span className="ml-3 text-sm text-gray-500">
                👥 {onlineUsers} user{onlineUsers !== 1 ? 's' : ''} online
              </span>
            )}
          </p>
        </header>

        <ChatWindow userId={userId} />
      </div>
    </div>
  );
}

export default App;
