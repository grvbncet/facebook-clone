import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const PublicRoute = ({ children }) => {
  const { user } = useAuthStore();

  if (user) return <Navigate to="/" replace />;

  return children;
};

export default PublicRoute;
