import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Check if user exists in localStorage if not in auth context
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const authToken = localStorage.getItem("authToken");

  // Determine if user is authenticated
  const isAuthenticated = !!(storedUser && authToken);

  // Get user role from either context or localStorage
  const userRole = user?.user_role || storedUser?.user_role;

  if (!isAuthenticated) {
    // Redirect to login with current location
    return (
      <Navigate to="/auth/admin/login" state={{ from: location }} replace />
    );
  }

  // Check if user has required role
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/auth/admin/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
