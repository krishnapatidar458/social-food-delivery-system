import React, { useEffect } from "react";
import Signup from "./components/auth/Signup";
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
import { setOnlineUsers } from "./redux/chatSlice";
import { addNotification, fetchNotifications } from "./redux/rtnSlice";
import { setSocketConnected, resetSocketState } from "./redux/socketSlice";
import { fetchCurrentUserFollowings } from "./redux/userSlice";
import { 
  initSocket, 
  closeSocket, 
  onEvent, 
  offEvent,
  getSocket
} from "./services/socketManager";
import PostDetail from "./components/post/PostDetail";
import FavoritesPage from "./components/favorites/FavoritesPage";

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
      {
        path: "/post/:id",
        element: <PostDetail />,
      },
      {
        path: "/favorites",
        element: <FavoritesPage />,
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
  const { connected } = useSelector((store) => store.socket);
  const { unreadCounts } = useSelector((store) => store.chat); 
  const dispatch = useDispatch();
  
  // Detect and fix corrupted chat state
  useEffect(() => {
    // Check if unreadCounts is undefined, which indicates a corrupted state
    if (unreadCounts === undefined) {
      console.warn('Found corrupted chat state, attempting to fix...');
      
      // Try to repair the localStorage data
      try {
        // Get the current persisted state
        const persistedState = JSON.parse(localStorage.getItem('persist:chat'));
        if (persistedState) {
          // Ensure unreadCounts exists in the state
          const chatState = JSON.parse(persistedState);
          if (!chatState.unreadCounts) {
            chatState.unreadCounts = {};
            persistedState.chat = JSON.stringify(chatState);
            localStorage.setItem('persist:chat', JSON.stringify(persistedState));
            console.log('Fixed corrupted chat state');
            
            // Force a page reload to apply the fixed state
            window.location.reload();
          }
        }
      } catch (error) {
        console.error('Error fixing corrupted state, clearing chat state:', error);
        // If unable to repair, clear the chat state completely
        localStorage.removeItem('persist:chat');
        window.location.reload();
      }
    }
  }, [unreadCounts]);
  
  // Fetch notifications when user is logged in
  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications());
    }
  }, [user, dispatch]);
  
  // Fetch user followings when logged in
  useEffect(() => {
    if (user) {
      dispatch(fetchCurrentUserFollowings());
    }
  }, [user, dispatch]);
  
  // Setup socket connection
  useEffect(() => {
    if (user) {
      try {
        const socket = initSocket(user._id);
        
        if (socket) {
          // Set socket connection status in Redux
          dispatch(setSocketConnected({
            connected: socket.connected,
            socketId: socket.id
          }));
          
          // Update connection status when it changes
          onEvent('connect', () => {
            console.log('Socket connected');
            dispatch(setSocketConnected({
              connected: true,
              socketId: socket.id
            }));
            
            // When reconnected, refresh notifications
            dispatch(fetchNotifications());
          });
          
          onEvent('disconnect', () => {
            console.log('Socket disconnected');
            dispatch(setSocketConnected({
              connected: false,
              socketId: null
            }));
          });
          
          // Handle connection errors
          onEvent('connect_error', (err) => {
            console.error("Socket connection error:", err.message);
            dispatch(setSocketConnected({
              connected: false,
              socketId: null
            }));
          });
          
          // Listening for all events
          onEvent('getOnlineUsers', (onlineUsers) => {
            console.log('Online users updated:', onlineUsers.length);
            dispatch(setOnlineUsers(onlineUsers));
          });

          // Handle all notification types with the same function
          const handleNotification = (notification) => {
            console.log('Received notification:', notification);
            dispatch(addNotification(notification));
          };
          
          // Register notification handlers
          onEvent('notification', handleNotification);
          onEvent('newNotification', handleNotification);
        }

        return () => {
          // Clean up all event listeners
          offEvent('connect');
          offEvent('disconnect');
          offEvent('connect_error');
          offEvent('getOnlineUsers');
          offEvent('notification');
          offEvent('newNotification');
          
          closeSocket();
          dispatch(resetSocketState());
          dispatch(setOnlineUsers([]));
        };
      } catch (error) {
        console.error("Socket setup error:", error);
      }
    } else {
      closeSocket();
      dispatch(resetSocketState());
      dispatch(setOnlineUsers([]));
    }
  }, [user, dispatch]);
  
  return (
    <div>
      <RouterProvider router={browserRouter} />
    </div>
  );
};

export default App;
