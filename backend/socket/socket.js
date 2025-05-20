import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Map to track online users: userId -> socketId
const userSocketMap = {};

// Helper function to get a user's socket ID
export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

// Socket connection handling
io.on("connection", (socket) => {
  // Extract user ID from query parameters
  const userId = socket.handshake.query.userId;
  
  if (userId) {
    // Register the user as online
    userSocketMap[userId] = socket.id;
    console.log(`User connected: userId=${userId}, socketId=${socket.id}`);
    
    // Broadcast updated online users list to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    
    // Handle follow/unfollow notifications
    socket.on("follow", (data) => {
      const receiverSocketId = getReceiverSocketId(data.recipientId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", {
          type: "follow",
          data
        });
      }
    });
    
    // Handle message read status
    socket.on("markMessagesRead", (data) => {
      const senderSocketId = getReceiverSocketId(data.senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesRead", {
          from: userId,
          to: data.senderId
        });
      }
    });
    
    // Handle notification read status
    socket.on("markNotificationsRead", (userId) => {
      socket.broadcast.emit("notificationsRead", userId);
    });
    
    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: userId=${userId}, socketId=${socket.id}`);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  }
});

export { app, server, io };
