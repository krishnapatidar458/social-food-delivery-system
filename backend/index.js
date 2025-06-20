import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import { setupChangeStreams } from "./utils/changeStreams.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import storyRoute from "./routes/storyRoutes.js";
import messageRoute from "./routes/message.route.js";
import notificationRoute from "./routes/notification.route.js";
import shareRoute from "./routes/share.route.js";
<<<<<<< HEAD
import orderRoute from "./routes/order.route.js";
import categoryRoute from "./routes/category.route.js";
import deliveryAgentRoute from "./routes/deliveryAgent.route.js";
import { app, server, io } from "./socket/socket.js";
=======
import { app, server } from "./socket/socket.js";
>>>>>>> main

dotenv.config({});

const PORT = process.env.PORT || 3000;
//middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Make io available throughout the app
app.set("io", io);

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

//api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/story", storyRoute);
app.use("/api/v1/notifications", notificationRoute);
app.use("/api/v1/share", shareRoute);
<<<<<<< HEAD
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/delivery", deliveryAgentRoute);
=======
>>>>>>> main

//Routes
app.get("/", (req, res) => {
  res.send("welcome to instapic");
});

// API health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    time: new Date().toISOString(),
    routes: {
      orders: "/api/v1/orders",
      posts: "/api/v1/post",
      users: "/api/v1/user",
      delivery: "/api/v1/delivery",
    },
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

server.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);

  // Set up MongoDB change streams for real-time updates
  await setupChangeStreams();
});
