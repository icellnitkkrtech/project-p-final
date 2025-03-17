import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, logout, getCurrentUser } from '../store/slices/authSlice';
import { useNotification } from './admin/useNotification'; // Make sure this path is correct

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  
  const { user, isAuthenticated, isLoading, error, role } = useSelector(
    (state) => state.auth
  );

  const handleLogin = async (credentials) => {
    try {
      const result = await dispatch(login(credentials)).unwrap();
      showSuccess('Login successful');
      
      // Redirect based on role
      if (result.role === 'company') {
        navigate('/company/dashboard');
      } else if (result.role === 'student') {
        navigate('/student/dashboard');
      } else if (result.role === 'admin') {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      showError(error.message || 'Login failed');
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };


  const checkAuth = async () => {
    try {
      if (isAuthenticated && role) {
        await dispatch(getCurrentUser()).unwrap();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      throw error;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    role,
    login: handleLogin,
    logout: handleLogout,
    checkAuth,
  };
}; 