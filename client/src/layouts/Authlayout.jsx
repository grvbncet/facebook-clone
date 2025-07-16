import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-300 via-purple-100 to-blue-100">
      <div className="w-full max-w-lg rounded-lg">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
