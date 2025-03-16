import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  AdminPanelSettings
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const AdminLogin = () => {
  const theme = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await handleLogin(formData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (values) => {
    try {
      const response = await authService.login(values);
      if (response.success) {
        localStorage.setItem('authToken', response.data.authToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        login(response.data);
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: 0,
      }}
    >
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          width: '50%',
          p: 6,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a237e 0%, #283593 100%)'
            : 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          justifyContent: 'center',
        }}
      >
        {/* ... Left section content ... */}
      </Box>

      <Box 
        sx={{
          width: { xs: '100%', md: '50%' },
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.palette.mode === 'dark'
            ? '#121212'
            : '#f5f5f5',
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          {/* Header Section */}
          <AdminPanelSettings 
            sx={{ 
              fontSize: 48, 
              color: 'primary.main',
              mb: 1
            }} 
          />
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              textAlign: 'center',
              fontSize: { xs: '1.75rem', sm: '2.25rem' }
            }}
          >
            Admin Login
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              mb: 3,
              textAlign: 'center'
            }}
          >
            Welcome back! Please login to your account
          </Typography>

          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                width: '100%',
                mb: 2 
              }}
            >
              {error}
            </Alert>
          )}

          {/* Form Fields */}
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />

          {/* Submit Button */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Sign In
          </Button>

          {/* Footer Text */}
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              mt: 2,
              textAlign: 'center'
            }}
          >
            Protected by enterprise-grade security
          </Typography>
        </Box>
      </Box>

      {/* Loader */}
      {isLoading && (
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
      )}
    </Box>
  );
};

export default AdminLogin; 