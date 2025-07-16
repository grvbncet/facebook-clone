import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Error from "../pages/Error";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AuthLayout from "../layouts/Authlayout";
import MainLayout from "../layouts/Mainlayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { Profile } from "../pages/Profile";
import { UpdateProfile } from "../pages/Profile";
import ForgotPassword from "../pages/ForgotPassword";
import Help from "../pages/Help";
import Friends from "../pages/Friends";
import Reels from "../pages/Reels";
import MarketPlace from "../pages/MarketPlace";
import Groups from "../pages/Groups";
import Games from "../pages/Games";
import Events from "../pages/Events";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "profile", element: <Profile /> },
      { path: "profile/update", element: <UpdateProfile /> },
      { path: "help", element: <Help /> },
      { path: "friends", element: <Friends /> },
      { path: "reels", element: <Reels /> },
      { path: "marketplace", element: <MarketPlace /> },
      { path: "groups", element: <Groups /> },
      { path: "games", element: <Games /> },
      { path: "events", element: <Events /> },
      { path: "see-more", element: <div>See more</div> },
    ],
  },
  {
    path: "/auth",
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "reset-password", element: <ForgotPassword /> },
    ],
  },
  { path: "*", element: <Error /> },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
