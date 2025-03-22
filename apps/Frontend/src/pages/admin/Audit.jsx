import { Box, Typography, Container, Grid, Card, CardContent, Divider, CircularProgress, Paper } from '@mui/material';
import { AuditLogViewer } from '../../components/admin/audit/AuditLogViewer';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import SecurityIcon from '@mui/icons-material/Security';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PeopleIcon from '@mui/icons-material/People';
import ErrorIcon from '@mui/icons-material/Error';
import { auditService } from '../../services/admin/auditService';

const Audit = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLogs: 0,
    loginAttempts: 0,
    userActions: 0,
    errors: 0
  });

  useEffect(() => {
    const fetchAuditStats = async () => {
      try {
        setLoading(true);
        // In a real implementation, you would call the API
        // const response = await auditService.getStats();
        
        // For now, using mock data
        setTimeout(() => {
          setStats({
            totalLogs: 1248,
            loginAttempts: 356,
            userActions: 782,
            errors: 24
          });
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching audit stats:', error);
        enqueueSnackbar('Failed to load audit statistics', { variant: 'error' });
        setLoading(false);
      }
    };

    fetchAuditStats();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 1, 
            color: 'primary.main',
            fontWeight: 'bold'
          }}
        >
          System Audit
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Monitor and review all system activities and user actions
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <EventNoteIcon 
                sx={{ 
                  fontSize: 48, 
                  color: 'primary.main',
                  mb: 1
                }} 
              />
              <Typography variant="h5" fontWeight="bold">
                {loading ? <CircularProgress size={24} /> : stats.totalLogs}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Audit Logs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <SecurityIcon 
                sx={{ 
                  fontSize: 48, 
                  color: 'info.main',
                  mb: 1
                }} 
              />
              <Typography variant="h5" fontWeight="bold">
                {loading ? <CircularProgress size={24} /> : stats.loginAttempts}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Login Attempts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <PeopleIcon 
                sx={{ 
                  fontSize: 48, 
                  color: 'success.main',
                  mb: 1
                }} 
              />
              <Typography variant="h5" fontWeight="bold">
                {loading ? <CircularProgress size={24} /> : stats.userActions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                User Actions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <ErrorIcon 
                sx={{ 
                  fontSize: 48, 
                  color: 'error.main',
                  mb: 1
                }} 
              />
              <Typography variant="h5" fontWeight="bold">
                {loading ? <CircularProgress size={24} /> : stats.errors}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Error Events
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" color="primary.main" fontWeight="bold" gutterBottom>
          Audit Log History
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <AuditLogViewer />
      </Box>
    </Container>
  );
};

export default Audit; 