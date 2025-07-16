import { create } from "zustand";

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("accessToken");

const useAuthStore = create((set) => ({
  user: storedUser ? JSON.parse(localStorage.getItem("user")) : null,
  accessToken: storedToken || null,
  phone: null,
  isLoading: false,

  // Login sets both user and token
  login: ({ user, accessToken }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", accessToken);
    set({ user, accessToken });
  },

  //  Logout clears both user and token
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    set({ user: null, accessToken: null });
  },

  // Get user initials

  getInitials: (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  },
}));

export default useAuthStore;
