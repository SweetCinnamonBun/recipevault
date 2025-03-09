import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const user = useSelector((state) => state.auth.user); // Get the user from the auth state

  // If the user exists, they are authenticated; otherwise, redirect to login
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;