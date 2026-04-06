# Real-Time Chat Application

A full-stack real-time chat application built with React, Node.js, Express, MongoDB, and Socket.io.

## 🚀 Features

- ✅ **Real-time Messaging**: Send and receive messages instantly using Socket.io
- ✅ **Multi-User Support**: Unlimited concurrent users with unique IDs
- ✅ **User Identification**: Each user gets a unique color and senderId display
- ✅ **Delete for Me**: Remove messages from your view only
- ✅ **Delete for Everyone**: Remove messages for all users (sender only)
- ✅ **Pin Messages**: Pin important messages for easy access
- ✅ **Message Timestamps**: All messages include readable timestamps
- ✅ **Online User Count**: Shows how many users are currently online
- ✅ **Persistent Data**: Messages persist after page refresh
- ✅ **Input Validation**: Prevents empty or overly long messages
- ✅ **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React** (with Vite)
- **Socket.io-client** - Real-time communication
- **Axios** - HTTP requests
- **Tailwind CSS** - Styling
- **Deployed on**: Vercel

### Backend
- **Node.js** & **Express.js**
- **MongoDB** with **Mongoose** - Database
- **Socket.io** - WebSocket server
- **Express-validator** - Input validation
- **Deployed on**: Render

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### Local Development Setup

#### 1. Clone the repository
```bash
git clone <repository-url>
cd Adverayze
```

#### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Add your MongoDB URI and other env variables
# MONGODB_URI=mongodb+srv://...
# PORT=5000
# FRONTEND_URL=http://localhost:5173
```

#### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Create .env file
cp .env.example .env

# Add backend URL
# VITE_API_URL=http://localhost:5000
# VITE_SOCKET_URL=http://localhost:5000
```

#### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## 🌐 Deployed Application

> **Note**: Update these URLs after deploying to Render and Vercel

- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-backend.onrender.com
- **API Health Check**: https://your-backend.onrender.com/health

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

## 🎯 Design Decisions & Tradeoffs

### 1. User Authentication
**Decision**: Simplified user identification using localStorage-generated UUID
**Reason**: Focus on core chat functionality within time constraints
**Tradeoff**: Not production-ready; real app would need proper authentication

### 2. Delete Strategies
**Decision**: 
- "Delete for me": Client-side filtering using `deletedBy` array
- "Delete for everyone": Server-side flag with "[Message deleted]" placeholder
**Reason**: Maintains message history while providing both deletion types
**Tradeoff**: Messages aren't physically deleted (could add scheduled cleanup)

### 3. Real-time Communication
**Decision**: Socket.io for bidirectional real-time updates
**Reason**: More efficient than polling, industry standard for chat apps
**Tradeoff**: Requires persistent WebSocket connection

### 4. Database Choice
**Decision**: MongoDB with Mongoose
**Reason**: Fast setup, flexible schema, excellent for rapid development
**Tradeoff**: Less strict than PostgreSQL, but perfect for this use case

### 5. Message Ordering
**Decision**: Newest messages at bottom (traditional chat UX)
**Reason**: Industry standard, better UX for real-time chat
**Implementation**: Auto-scroll to bottom on new messages

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
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set environment variables:
   - `MONGODB_URI`
   - `PORT`
   - `FRONTEND_URL`
   - `NODE_ENV=production`
4. Deploy from `backend` directory
5. Note the deployed URL

### Frontend Deployment (Vercel)
1. Import project on Vercel
2. Set root directory to `frontend`
3. Set environment variables:
   - `VITE_API_URL` (Render backend URL)
   - `VITE_SOCKET_URL` (Render backend URL)
4. Deploy
5. Test full integration

## 👨‍💻 Development Notes

- Built as part of Adverayze technical assignment
- Development time: ~4 hours
- Focus on clean, maintainable code
- Emphasizes real-time functionality and user experience

## 📝 License

This project is built for educational and assessment purposes.

---

**Built with ❤️ for Adverayze Technical Assessment**
