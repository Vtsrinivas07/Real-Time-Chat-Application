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

// Socket.io connection handling
const users = new Map();

io.on('connection', (socket) => {
  const userId = socket.handshake.query?.userId || socket.id;
  users.set(socket.id, userId);
  
  io.emit('onlineUsers', users.size);
  console.log(`User connected. Total online: ${users.size}`);

  socket.on('disconnect', () => {
    users.delete(socket.id);
    io.emit('onlineUsers', users.size);
    console.log(`User disconnected. Total online: ${users.size}`);
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
