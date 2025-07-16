import React from "react";
import {
  Bell,
  HandHelping,
  Handshake,
  House,
  LogOut,
  MessageCirclePlus,
  RotateCcwKey,
  Search,
  Settings,
  UsersRound,
} from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

const NavBar = () => {
  const navigate = useNavigate();
  const { user, getInitials } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const handleLogout = async () => {
    // Send logout request to backend
    try {
      await api.post("/auth/logout");

      // Clear user and token from store
      useAuthStore.getState().logout();

      // Redirect to login page
      navigate("/login");

      // Handle successful logout
    } catch (error) {
      console.error(
        "Logout failed:",
        error?.response?.data?.message || error.message
      );
    }
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50 w-full">
      <div className="max-w-8xl mx-auto px-4 py-2 md:px-6 md:py-3 flex justify-between items-center">
        {/* Left: Logo + Search */}
        <div className="flex items-center gap-2">
          <span
            onClick={() => navigate("/")}
            className="w-10 cursor-pointer h-10 aspect-square rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold mx-auto my-auto"
          >
            f
          </span>

          {/* Search Bar */}
          <div className="flex items-center bg-gray-100 px-2 py-[6px] rounded-full  ">
            {/* Small screen icon inside a circle (same size as 'f') */}
            <div className="w-6 h-7 rounded-full bg-gray-100 flex items-center justify-center md:hidden">
              <Search size={20} className="text-gray-500 " />
            </div>

            {/* Medium and up: icon + input */}
            <div className="hidden md:flex items-center">
              <Search size={20} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search Facebook"
                className="bg-transparent px-2 text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>
        {/* Center: Navigation Icons */}

        <div className="flex items-center gap-10 hidden md:flex">
          <div title="Home" className="bg-blue-100 px-3 py-2 rounded-full">
            <button
              className="text-blue-800 cursor-pointer flex justify-center"
              onClick={() => navigate("/")}
            >
              <House />
            </button>
          </div>
          <div title="Friends" className="bg-blue-100 px-3 py-2 rounded-full ">
            <button
              className="text-blue-800 cursor-pointer flex justify-center"
              onClick={() => navigate("/friends")}
            >
              <Handshake />
            </button>
          </div>
          <div title="Groups" className="bg-blue-100 px-3 py-2 rounded-full">
            <button
              className="text-blue-800 cursor-pointer flex justify-center"
              onClick={() => navigate("/groups")}
            >
              <UsersRound />
            </button>
          </div>
        </div>

        {/* Right: Create + Messenger + Bell + Profile */}
        <div className="flex items-center gap-3">
          <button className=" hidden md:block bg-blue-100 text-blue-800 text-xs sm:text-xs md:text-sm lg:text-base px-3 py-2 rounded-full cursor-pointer hover:bg-gray-200 hover:text-blue-900">
            Find Friends
          </button>
          <div title="Messanger" className="bg-blue-100 px-3 py-2 rounded-full">
            <button className="text-blue-800 cursor-pointer flex justify-center">
              <MessageCirclePlus />
            </button>
          </div>
          <div
            title="Notification"
            className="bg-blue-100 px-3 py-2 rounded-full"
          >
            <button className="text-blue-800 cursor-pointer flex justify-center">
              <Bell />
            </button>
          </div>
          {/* Profile Initials (click to logout) */}

          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              title="Account"
              className="cursor-pointer bg-blue-600 text-white w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold hover:bg-blue-700"
            >
              {getInitials(user.name)}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg py-2 z-50">
                <button
                  onClick={() => {
                    navigate("/friends");
                    setDropdownOpen(false);
                  }}
                  className="flex gap-2 items-center block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <UsersRound />
                  Friends
                </button>
                <button
                  onClick={() => {
                    navigate("/profile/update");
                    setDropdownOpen(false);
                  }}
                  className="flex gap-2 items-center block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings />
                  Settings
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/help");
                    //navigate to help page
                  }}
                  className=" flex gap-2 items-center block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <HandHelping />
                  Help & Support
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);

                    // Call logout function
                    handleLogout();
                  }}
                  className=" flex gap-2 items-center block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                >
                  <LogOut />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
