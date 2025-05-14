import { Server } from "socket.io";
import express from "express";
import http from "http";
import exp from "constants";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", //allow all origins, this is for testing only and should be disabled in production environments!"
    methods: ["GET", "POST"],
  },
});

// to view online/active the users
const userSocketMap = {}; // this map stores socket id corresponding to the user id;
export const getReceiverSocketId=(receiverId)=>userSocketMap[receiverId];

//setting up the socket
io.on("connection", (socket) => {
  //when user gets connected or use application
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User connected:userId=${userId} ,socketId =${socket.id}`);
  }
  // to send the online user
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  // when user leaves the application
  socket.on("disconnect", () => {
    if (userId) {
      console.log(`User diconnected:userId=${userId} ,socketId =${socket.id}`);
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
