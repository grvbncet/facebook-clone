import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-purple-100 via-pink-100 to-red-200 px-4">
      <h1 className="text-9xl font-extrabold text-black drop-shadow-lg mb-4">
        404
      </h1>
      <p className="text-2xl sm:text-3xl font-semibold text-black mb-6">
        Oops! Page not found.
      </p>
      <p className="text-black mb-8 max-w-md text-center">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-white text-gray-600 font-bold rounded-full shadow-lg hover:bg-pink-200 hover:text-black transition"
        replace
      >
        Go back home
      </Link>
    </div>
  );
};

export default ErrorPage;
