import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import cors from 'cors';
import { connectDB } from './config/db.js';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';

// import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from "./routes/chatRoutes.js"; // ✅ new
import messageRoutes from './routes/messageRoutes.js';

// Import your controller helper
import { _createAndPopulateMessage } from './controllers/messageController.js';

// config
// Loads .env file contents into process.env by default. 
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
// DB connect
connectDB();

// middlewares
// It allow React to call Node APIs.
// Allow credentials in your CORS setup:
app.use(cors({
    origin: true, // your frontend origin
    credentials: true // important for sending cookies
}));
app.use(express.json()); // To Properly parse Json Data from Frontend
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: true, credentials: true }
});

// In-memory map: userId → socketId
const userSocketMap = {};

io.on('connection', socket => {
  console.log('🟢 Socket connected:', socket.id);

  // 1) Client tells who they are
  socket.on('setup', userId => {
    userSocketMap[userId] = socket.id;
    console.log(`Mapped user ${userId} → socket ${socket.id}`);
  });

  // 2) Handle private messages
  socket.on('private message', async ({ toUserId, content, chatId, senderId }) => {
    if (!toUserId || !content || !chatId) return;
    try {
      // a) Save & populate via your helper
      const msg = await _createAndPopulateMessage(senderId, content, chatId);

      // b) Send to recipient if online
      const targetSocket = userSocketMap[toUserId];
      if (targetSocket) {
        io.to(targetSocket).emit('private message', msg);
      }
      // c) Also echo back to sender for immediate UI update
      socket.emit('private message', msg);
    } catch (err) {
      console.error('❌ Socket message error:', err);
    }
  });

  // 3) Cleanup on disconnect
  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id);
    // remove mapping
    for (const [uid, sid] of Object.entries(userSocketMap)) {
      if (sid === socket.id) {
        delete userSocketMap[uid];
        break;
      }
    }
  });
});

// server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})