import React, { useEffect } from "react";
import Signup from "./components/auth/Signup";
import { io } from "socket.io-client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/mainlayout/MainLayout";
import Login from "./components/auth/Login";
import Feeds from "./components/feeds/Feeds";
import Profile from "./components/profile/Profile";
import EditProfile from "./components/editProfile/EditProfile";
import CategoryPage from "./components/category/CategoryPage";
import Cart from "./components/cart/Cart";
import ChatLayout from "./components/chat/ChatLayout";
import ChatPage from "./components/chat/ChatPage";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/rtnSlice";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Feeds />,
      },
      {
        path: "/category/:category",
        element: <CategoryPage />,
      },
    ],
  },
  {
    path: "/signup",
    element: <Signup />,
  },

  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/profile/:id",
    element: <Profile />,
  },
  {
    path: "profile/:id/account/edit",
    element: <EditProfile />,
  },
  {
    path: "/cartPage",
    element: <Cart />,
  },
  {
    path: "/chat",
    element: <ChatLayout />,
    children: [
      {
        path: "/chat/chatpage",
        element: <ChatPage />,
      },
    ],
  },
]);

const App = () => {


  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.socket);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:8000", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });
      dispatch(setSocket(socketio));

      //listening all the events:
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("notification", (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        socketio.close();
        dispatch(setOnlineUsers(null));
      };
    } else if (socket) {
      socket?.close();
      dispatch(setOnlineUsers(null));
    }
  }, [user, dispatch]);
  return (
    <div>
      <RouterProvider router={browserRouter} />
    </div>
  );
};

export default App;
