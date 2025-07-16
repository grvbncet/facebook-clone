import React from "react";
import api from "../api/axios.js";
import useAuthStore from "../store/useAuthStore.js";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Lock, Mail } from "lucide-react";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    // Send login request to backend
    try {
      const response = await api.post("/auth/login", { email, password });

      login({
        user: response.data.user,
        accessToken: response.data.accessToken,
      });

      navigate("/");
    } catch (error) {
      console.error(
        "Login failed:",
        error?.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center justify-center flex-col w-full gap-4 ">
        <h1 className="font-semibold text-blue-600">
          Please Login to this Social Media
        </h1>
        <form
          action=""
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">Log In</h2>
          <div className="flex items-center border border-gray-300 rounded m-2 mb-4">
            <Mail />
            <input
              type="text"
              placeholder="email@example.com"
              className="flex-1 px-4 py-2 focus-none outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded m-2 mb-4">
            <Lock />
            <input
              type="password"
              className="flex-1 px-4 py-2 focus-none outline-none"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-800 transition hover:shadow-lg mb-4"
          >
            Login
          </button>
          <p className="gap-2 flex items-center justify-center">
            Don't have an account ?
            <Link to="/auth/register" className="text-blue-600">
              Register
            </Link>
          </p>
          <p className="gap-2 flex items-center justify-center">
            Forgot your password ?
            <Link to="/auth/reset-password" className="text-blue-600">
              Click here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
