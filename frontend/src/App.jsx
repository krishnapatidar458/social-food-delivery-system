import React from "react";
import Signup from "./components/auth/Signup";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/mainlayout/MainLayout";
import Login from "./components/auth/Login";
import Feeds from "./components/feeds/Feeds";
import Profile from "./components/profile/Profile";
import EditProfile from "./components/editProfile/EditProfile";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Feeds />,
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
]);

const App = () => {
  return (
    <div>
      <RouterProvider router={browserRouter} />

    </div>
  );
};

export default App;
