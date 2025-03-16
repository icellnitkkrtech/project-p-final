import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/admin/useNotification';
import { Box, useTheme } from '@mui/material';

const AuthContext = createContext({
  isInitialized: false,
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
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
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '60px',
            height: '60px',
            position: 'relative',
            '&:before': {
              content: '""',
              width: 'calc(100%/3)',
              height: 'calc(100%/3)',
              position: 'absolute',
              bgcolor: theme.palette.primary.main,
              animation: 'l8-1 1.5s infinite alternate',
            },
            animation: 'l8-0 1.5s infinite alternate',
            background: `
              var(--c1) 0    0,    var(--c2) 50%  0,    var(--c1) 100% 0,
              var(--c2) 0    50%,                       var(--c2) 100% 50%,
              var(--c1) 0    100%, var(--c2) 50%  100%, var(--c1) 100% 100%
            `,
            backgroundRepeat: 'no-repeat',
            '--c1': `linear-gradient(${theme.palette.primary.dark} 0 0)`,
            '--c2': `linear-gradient(${theme.palette.primary.main} 0 0)`,
            '--s': 'calc(100%/3) calc(100%/3)',
            '@keyframes l8-0': {
              '0%,12.49%':   { backgroundSize: 'var(--s),0 0,0 0,0 0,0 0,0 0,0 0,0 0' },
              '12.5%,24.9%': { backgroundSize: 'var(--s),var(--s),0 0,0 0,0 0,0 0,0 0,0 0' },
              '25%,37.4%':   { backgroundSize: 'var(--s),var(--s),var(--s),0 0,0 0,0 0,0 0,0 0' },
              '37.5%,49.9%': { backgroundSize: 'var(--s),var(--s),var(--s),0 0,var(--s),0 0,0 0,0 0' },
              '50%,61.4%':   { backgroundSize: 'var(--s),var(--s),var(--s),0 0,var(--s),0 0,0 0,var(--s)' },
              '62.5%,74.9%': { backgroundSize: 'var(--s),var(--s),var(--s),0 0,var(--s),0 0,var(--s),var(--s)' },
              '75%,86.4%':   { backgroundSize: 'var(--s),var(--s),var(--s),0 0,var(--s),var(--s),var(--s),var(--s)' },
              '87.5%,100%':  { backgroundSize: 'var(--s),var(--s),var(--s),var(--s),var(--s),var(--s),var(--s),var(--s)' }
            },
            '@keyframes l8-1': {
              '0%,5%':    { transform: 'translate(0,0)' },
              '12.5%':    { transform: 'translate(100%,0)' },
              '25%':      { transform: 'translate(200%,0)' },
              '37.5%':    { transform: 'translate(200%,100%)' },
              '50%':      { transform: 'translate(200%,200%)' },
              '62.5%':    { transform: 'translate(100%,200%)' },
              '75%':      { transform: 'translate(0,200%)' },
              '87.5%':    { transform: 'translate(0,100%)' },
              '95%,100%': { transform: 'translate(100%,100%)' }
            }
          }}
        />
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={{ isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
}; 