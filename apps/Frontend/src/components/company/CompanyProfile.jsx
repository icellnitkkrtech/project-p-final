import React, { useState , useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Avatar,
  Box,
  Paper,
  Divider,
  IconButton,
  Skeleton,
  Alert,
  Stack
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CloudUpload as CloudUploadIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { useOutletContext } from 'react-router-dom';
const CompanyProfile = () => {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const { company, setCompany } = useOutletContext();
  const [profile, setProfile] = useState(company || {});
  
  useEffect(() => {
    if (company) {
      setProfile(company);
    }
  }, [company]);

  const handleSave = async () => {
    try {
      setLoading(true);
      // API call simulation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      setError('');
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '20px auto' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      <Grid container spacing={3}>
        {/* Company Header Card */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: 'primary.main'
                  }}
                >
                  <BusinessIcon sx={{ fontSize: 60 }} />
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h4">{profile.companyName}</Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {profile.industry}
                </Typography>
              </Grid>
              {!isEditing && (
                <Grid item>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Company Details Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Company Information
                </Typography>
                <Divider />
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    value={profile.companyName}
                    onChange={(e) => setProfile({...profile, companyName: e.target.value})}
                    disabled={!isEditing || loading}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    disabled={!isEditing || loading}
                    required
                    type="email"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Website"
                    value={profile.website}
                    onChange={(e) => setProfile({...profile, website: e.target.value})}
                    disabled={!isEditing || loading}
                  />
                </Grid>
                {/* <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Industry"
                    value={profile.industry}
                    onChange={(e) => setProfile({...profile, industry: e.target.value})}
                    disabled={!isEditing || loading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={profile.description}
                    onChange={(e) => setProfile({...profile, description: e.target.value})}
                    disabled={!isEditing || loading}
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Founded Year"
                    value={profile.founded}
                    onChange={(e) => setProfile({...profile, founded: e.target.value})}
                    disabled={!isEditing || loading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Company Size"
                    value={profile.size}
                    onChange={(e) => setProfile({...profile, size: e.target.value})}
                    disabled={!isEditing || loading}
                  />
                </Grid> */}
              </Grid>

              {isEditing && (
                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompanyProfile;