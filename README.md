# Real-Time Chat Application

A clean, modern full-stack real-time chat application built with React, Node.js, Express, MongoDB, and Socket.io. Features a minimal UI with plain CSS and robust real-time messaging capabilities.

## 🚀 Features

- ✅ **Real-time Messaging**: Send and receive messages instantly using Socket.io
- ✅ **Multi-User Support**: Unlimited concurrent users with unique session IDs
- ✅ **User Identification**: Each user is identified by name with unique sender display
- ✅ **Delete for Me**: Remove messages from your view only (client-side)
- ✅ **Delete for Everyone**: Remove messages for all users (sender only, server-side)
- ✅ **Pin Messages**: Pin important messages for quick access
- ✅ **Message Timestamps**: All messages display readable local timestamps
- ✅ **Online User Count**: Shows how many users are currently online
- ✅ **Persistent Data**: Messages persist across page refreshes
- ✅ **Input Validation**: Prevents empty or excessively long messages (max 1000 chars)
- ✅ **Responsive Design**: Clean, modern UI that works on desktop and mobile
- ✅ **Session Persistence**: Users remain logged in after page reload

## 🛠️ Tech Stack

### Frontend
- **React 18** (with Vite for fast builds)
- **Socket.io-client** - Real-time WebSocket communication
- **Axios** - HTTP API requests
- **Plain CSS** - Modern, minimal styling (no frameworks)
- **Deployed on**: Vercel

### Backend
- **Node.js** & **Express.js**
- **MongoDB** with **Mongoose** - Document database
- **Socket.io** - Real-time bidirectional communication
- **Express-validator** - Input validation & sanitization
- **Deployed on**: Render

## 📦 Installation & Local Development

### Prerequisites
- Node.js v16+ 
- MongoDB Atlas account (free tier available)
- Git

### Quick Start

#### 1. Clone Repository
```bash
git clone https://github.com/Vtsrinivas07/Real-Time-Chat-Application.git
cd Real-Time-Chat-Application
```

#### 2. Backend Setup
```bash
cd backend
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your values:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
# PORT=5000
# FRONTEND_URL=http://localhost:5173
# NODE_ENV=development
```

#### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Copy environment template  
cp .env.example .env

# Edit .env with your values:
# VITE_API_URL=http://localhost:5000
# VITE_SOCKET_URL=http://localhost:5000
```

#### 4. Run Locally

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
# Server runs at http://localhost:5000
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
# App opens at http://localhost:5173
```

Open http://localhost:5173 in your browser and start chatting!

## 🌐 Live Application

The application is currently deployed and live:

- **Frontend**: https://real-time-chat-application-lake-five.vercel.app
- **Backend API**: https://real-time-chat-application-bjn8.onrender.com
- **API Health Check**: https://real-time-chat-application-bjn8.onrender.com/health

### How to Use
1. Visit the frontend URL above
2. Enter your name (max 20 characters)
3. Click the "✓ Enter" button to join
4. Start chatting with other users in real-time
5. Use the menu (...) on each message to Pin or Delete

## 📚 API Documentation

### Base URL
```
Local: http://localhost:5000/api
Production: [Your deployed backend URL]/api
```

### Endpoints

#### Get All Messages
```
GET /api/messages?limit=50&offset=0
```
**Response:**
```json
{
  "success": true,
  "messages": [...],
  "total": 100
}
```

#### Send Message
```
POST /api/messages
Content-Type: application/json

{
  "content": "Hello, World!"
}
```

#### Delete Message for Me
```
DELETE /api/messages/:id/delete-for-me
Content-Type: application/json

{
  "userId": "user-uuid"
}
```

#### Delete Message for Everyone
```
DELETE /api/messages/:id/delete-for-everyone
```

#### Toggle Pin Message
```
PATCH /api/messages/:id/pin
```

### Socket.io Events

**Client to Server:**
- `connection` - Initial connection

**Server to Client:**
- `message:new` - New message broadcast
- `message:deleted` - Message deletion broadcast
- `message:pinned` - Message pin/unpin broadcast

## 🏗️ Project Structure

```
Adverayze/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── MessageItem.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   └── PinnedMessages.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   └── Message.js
│   │   ├── routes/
│   │   │   └── messages.js
│   │   ├── controllers/
│   │   │   └── messageController.js
│   │   ├── middleware/
│   │   │   └── validator.js
│   │   ├── config/
│   │   │   └── database.js
│   │   └── server.js
│   └── package.json
│
└── README.md
```

## 🎯 Design & Architecture

### UI/UX Approach
**Decision**: Minimal, clean design using plain CSS with a two-tone message style
- Your messages: Light blue background
- Other users' messages: Light gray background
- No UI frameworks or dependencies
- Professional, focused on readability and simplicity

### Key Technical Decisions

### 1. Authentication
**Approach**: Simplified localStorage-based session with unique IDs
- User enters name, gets unique session ID
- Session persists across page refreshes
- **Production Note**: Real applications would use JWT + proper backend auth

### 2. Message Deletion
**Strategy**:
- "Delete for me": Client-side filtering (removes from current user's view)
- "Delete for everyone": Server-side flag with "[Message deleted]" placeholder
- Maintains message chronology while supporting both deletion types

### 3. Real-time Architecture
**Choice**: Socket.io for bidirectional WebSocket communication
- Efficient vs polling for live updates
- Industry standard for chat applications
- Supports reconnection and fallback transports

### 4. Database
**Choice**: MongoDB with Mongoose
- Flexible schema perfect for message documents
- Fast prototyping and deployment
- Scalable for production use

### 5. Message Flow
- Newest messages displayed at bottom (traditional chat UX)
- Auto-scroll to latest message on new arrivals
- Timestamps in user's local timezone

## 🔧 Key Assumptions

1. **Single Chat Room**: One global chat for all users
2. **Message Retention**: All messages kept indefinitely
3. **Character Limit**: 1000 characters per message
4. **Browser Support**: Modern browsers with WebSocket support
5. **Network**: Reliable internet for real-time features
6. **Timezone**: Timestamps displayed in user's local timezone

## 🧪 Testing

### Manual Testing Performed
- ✅ Sent and verified 100+ messages (performance test)
- ✅ Tested delete for me with multiple browser tabs
- ✅ Tested delete for everyone with real-time broadcast
- ✅ Tested pin/unpin functionality
- ✅ Verified data persistence after page refresh
- ✅ Tested input validation (empty, too long)
- ✅ Tested socket disconnect/reconnect scenarios
- ✅ Verified responsive design on mobile and desktop

### Edge Cases Handled
- Empty message prevention
- Maximum length validation (1000 chars)
- Network error handling
- Socket reconnection logic
- Deleted message interaction prevention
- Concurrent operation handling
- No messages empty state

## 🚀 Deployment Guide

### Backend Deployment (Render)

1. **Create Render Web Service**
   - Go to https://render.com
   - New Web Service
   - Connect your GitHub repository

2. **Configure Service**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Set Environment Variables**
   ```
   MONGODB_URI=your-mongodb-connection-string
   FRONTEND_URL=https://your-vercel-app.vercel.app
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build completion
   - Note the generated URL (e.g., https://your-app.onrender.com)

5. **Verify**
   - Test health endpoint: https://your-app.onrender.com/health
   - Should return `{"status":"OK",...}`

### Frontend Deployment (Vercel)

1. **Import Project**
   - Go to https://vercel.com
   - Import Git Repository
   - Select your GitHub repo

2. **Configure**
   - Root Directory: `frontend`
   - Framework: Vite (auto-detected)
   - Build: `npm run build` (auto-filled)

3. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-render-backend.onrender.com
   VITE_SOCKET_URL=https://your-render-backend.onrender.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - Get your live URL (e.g., https://app.vercel.app)

5. **Verify End-to-End**
   - Visit your Vercel URL
   - Enter name and join
   - Messages should load and send in real-time
   - Test pin/delete functionality

## 👨‍💻 Development Notes

- **Status**: ✅ Production-ready and fully deployed
- **Built for**: Adverayze technical assignment
- **Tech Philosophy**: Clean, minimal, maintainable code
- **Focus**: Real-time functionality, user experience, and code clarity
- **Build Time**: ~4-5 hours from concept to deployment
- **GitHub**: https://github.com/Vtsrinivas07/Real-Time-Chat-Application

## 📝 License

Built for educational and technical assessment purposes.

---

**Fully functional real-time chat – deployed and live!**
