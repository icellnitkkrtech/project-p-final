import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PublicRoute = () => {
  const { user } = useAuth();
  
  // Check localStorage for authentication data
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const authToken = localStorage.getItem('authToken');
  
  // Determine if user is authenticated
  const isAuthenticated = !!(storedUser && authToken);

  if (isAuthenticated) {
    // If authenticated, redirect to appropriate dashboard
    const userRole = user?.user_role || storedUser?.user_role;
    if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // Add other role redirects as needed
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  return <Outlet />;
};

export default PublicRoute; 