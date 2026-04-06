require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/database');
const messageRoutes = require('./routes/messages');

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Socket.io setup
const io = new Server(server, {
  cors: corsOptions
});

// Make io accessible to routes
app.set('io', io);

// Track active users
const activeUsers = new Map(); // userId -> { id, name, socketId }
const userSockets = new Map(); // socketId -> userId

io.on('connection', (socket) => {
  const socketId = socket.id;
  console.log(`User connected: ${socketId}`);

  // Emit current list of active users
  io.emit('activeUsers', Array.from(activeUsers.values()));

  // Update online count
  io.emit('onlineUsers', activeUsers.size);

  // Handle user join
  socket.on('user:join', (data) => {
    const { id, name } = data;
    activeUsers.set(id, { id, name, socketId });
    userSockets.set(socketId, id);

    console.log(`User joined: ${name} (${id})`);

    // Broadcast to all clients
    io.emit('user:joined', { id, name });
    io.emit('activeUsers', Array.from(activeUsers.values()));
    io.emit('onlineUsers', activeUsers.size);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const userId = userSockets.get(socketId);
    if (userId) {
      activeUsers.delete(userId);
      userSockets.delete(socketId);
      io.emit('user:left', userId);
      io.emit('activeUsers', Array.from(activeUsers.values()));
      io.emit('onlineUsers', activeUsers.size);
      console.log(`User left: ${userId}`);
    }
  });
});

// Routes
app.use('/api/messages', messageRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Chat Application API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      messages: '/api/messages'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
