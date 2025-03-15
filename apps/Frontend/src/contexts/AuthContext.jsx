import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/admin/useNotification';

const AuthContext = createContext({
  isInitialized: false,
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuth, isAuthenticated, isLoading, role } = useAuth();
  const { showError } = useNotification();
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        await checkAuth();
        setIsInitialized(true);

        // Handle redirections after successful auth check
        if (isAuthenticated && role) {
          const from = location.state?.from || `/${role}/dashboard`;
          navigate(from, { replace: true });
        }
      } catch (error) {
        showError('Authentication failed');
        navigate('/auth/select-role', { replace: true });
      }
    };

    initAuth();
  }, []);

  if (isLoading || !isInitialized) {
    return <div>Loading...</div>; // Replace with your loading component
  }

  return (
    <AuthContext.Provider value={{ isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
}; 