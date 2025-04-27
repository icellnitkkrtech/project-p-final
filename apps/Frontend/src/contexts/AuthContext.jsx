import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/admin/useNotification';
import { Box, useTheme, CircularProgress } from '@mui/material';

const AuthContext = createContext({
  isInitialized: false,
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  role: null
});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { checkAuth, isAuthenticated, isLoading, role } = useAuth();
  const { showError } = useNotification();
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const studentId = localStorage.getItem('studentId');
      if (studentId) {
        return {
          _id: studentId,
          role: 'student'
        };
      }
      return null;
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if we have studentId in localStorage
        const studentId = localStorage.getItem('studentId');
        if (studentId) {
          setUser({
            _id: studentId,
            role: 'student'
          });
          setIsInitialized(true);
          return;
        }

        const authResult = await checkAuth();
        console.log('Auth check result:', authResult);
        
        if (authResult?.user) {
          setUser(authResult.user);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Auth initialization error:', error);
        showError('Authentication failed');
        setUser(null);
        n
      
      }
    };

    initAuth();
  }, []);

  const contextValue = {
    isInitialized,
    user,
    setUser,
    isAuthenticated: !!user?._id,
    role: 'student' // Since we know this is for student
  };

  if (isLoading || !isInitialized) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};