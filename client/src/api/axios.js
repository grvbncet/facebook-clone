import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL, // Change as per your backend
  withCredentials: true, // Required to send HttpOnly cookies (refresh token)
});

export default api;
