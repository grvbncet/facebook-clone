import { Lock, Mail, User } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import useAuthStore from "../store/useAuthStore.js";

const Register = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();

    // Send register request to backend
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        confirmPassword,
      });

      const { accessToken } = useAuthStore.getState();

      console.log(accessToken);

      // Handle successful registration
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      navigate("/auth/login");
    } catch (error) {
      console.error(
        "Registration failed:",
        error?.response?.data?.message || error.message
      );
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center justify-center flex-col w-full gap-4 ">
        <h1 className="font-semibold text-blue-600">
          Please Register to this Social Media
        </h1>
        <form
          action=""
          onSubmit={handleRegister}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
          <div className="flex items-center border border-gray-300 rounded m-2 mb-4">
            <User />
            <input
              type="text"
              placeholder="Please enter your name"
              className="flex-1 px-4 py-2 focus-none outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
          <div className="flex items-center border border-gray-300 rounded m-2 mb-4">
            <Lock />
            <input
              type="confirmPasssword"
              className="flex-1 px-4 py-2 focus-none outline-none"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-800 transition hover:shadow-lg mb-4"
          >
            Register
          </button>
          <p className="gap-2 flex items-center justify-center">
            Already have an account ?
            <Link to="/auth/login" className="text-blue-600">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
