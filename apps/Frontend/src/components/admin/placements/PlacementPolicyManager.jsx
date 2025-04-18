import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Button, TextField, Grid, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogActions, DialogContent, DialogTitle, FormControl,
  InputLabel, Select, MenuItem, Switch, FormControlLabel, Divider,
  Alert, Snackbar, Card, CardContent, Chip, Tooltip, CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Policy as PolicyIcon,
  Business as BusinessIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import placementService from '../../../services/admin/placementService';

const PlacementPolicyManager = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [newPolicy, setNewPolicy] = useState({
    name: '',
    description: '',
    policyType: 'placement_percentage',
    threshold: 40,
    eligibleFor: 'psu_only',
    isActive: true,
    appliesTo: {
      courses: ['btech', 'mtech', 'phd'],
      branches: []
    }
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const policyTypes = [
    { value: 'placement_percentage', label: 'Placement Percentage Threshold' },
    { value: 'placement_count', label: 'Placement Count Threshold' },
    { value: 'cgpa_threshold', label: 'CGPA Threshold' },
    { value: 'custom', label: 'Custom Policy' }
  ];

  const eligibilityOptions = [
    { value: 'psu_only', label: 'PSUs Only', icon: <BusinessIcon fontSize="small" /> },
    { value: 'all_drives', label: 'All Available Drives', icon: <SchoolIcon fontSize="small" /> },
    { value: 'no_drives', label: 'No Further Drives', icon: <PolicyIcon fontSize="small" /> },
    { value: 'custom_companies', label: 'Custom Company Types', icon: <BusinessIcon fontSize="small" /> }
  ];

  const courseOptions = [
    { value: 'btech', label: 'B.Tech' },
    { value: 'mtech', label: 'M.Tech' },
    { value: 'phd', label: 'PhD' },
    { value: 'mba', label: 'MBA' },
    { value: 'mca', label: 'MCA' }
  ];

  const branchOptions = [
    { value: 'cse', label: 'Computer Science Engineering' },
    { value: 'it', label: 'Information Technology' },
    { value: 'ece', label: 'Electronics & Communication' },
    { value: 'ee', label: 'Electrical Engineering' },
    { value: 'me', label: 'Mechanical Engineering' },
    { value: 'ce', label: 'Civil Engineering' },
    { value: 'pie', label: 'Production & Industrial Engineering' }
  ];

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      // This would be replaced with an actual API call
      const response = await placementService.getPlacementPolicies();
      setPolicies(response.data || []);
    } catch (error) {
      console.error('Error fetching policies:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load placement policies',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (policy = null) => {
    if (policy) {
      setEditingPolicy(policy);
      setNewPolicy({ ...policy });
    } else {
      setEditingPolicy(null);
      setNewPolicy({
        name: '',
        description: '',
        policyType: 'placement_percentage',
        threshold: 40,
        eligibleFor: 'psu_only',
        isActive: true,
        appliesTo: {
          courses: ['btech', 'mtech', 'phd'],
          branches: []
        }
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPolicy(null);
  };

  const handleSavePolicy = async () => {
    try {
      setLoading(true);
      
      if (editingPolicy) {
        // Update existing policy
        await placementService.updatePlacementPolicy(editingPolicy._id, newPolicy);
        setSnackbar({
          open: true,
          message: 'Policy updated successfully',
          severity: 'success'
        });
      } else {
        // Create new policy
        await placementService.createPlacementPolicy(newPolicy);
        setSnackbar({
          open: true,
          message: 'New policy created successfully',
          severity: 'success'
        });
      }
      
      fetchPolicies();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving policy:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save policy',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePolicy = async (policyId) => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      try {
        setLoading(true);
        await placementService.deletePlacementPolicy(policyId);
        fetchPolicies();
        setSnackbar({
          open: true,
          message: 'Policy deleted successfully',
          severity: 'success'
        });
      } catch (error) {
        console.error('Error deleting policy:', error);
        setSnackbar({
          open: true,
          message: 'Failed to delete policy',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleActive = async (policy) => {
    try {
      const updatedPolicy = { ...policy, isActive: !policy.isActive };
      await placementService.updatePlacementPolicy(policy._id, updatedPolicy);
      fetchPolicies();
      setSnackbar({
        open: true,
        message: `Policy ${updatedPolicy.isActive ? 'activated' : 'deactivated'} successfully`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error toggling policy status:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update policy status',
        severity: 'error'
      });
    }
  };

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setNewPolicy({
        ...newPolicy,
        [parent]: {
          ...newPolicy[parent],
          [child]: value
        }
      });
    } else {
      setNewPolicy({
        ...newPolicy,
        [field]: value
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Placement Eligibility Policies
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />} 
            onClick={fetchPolicies}
            sx={{ mr: 1 }}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => handleOpenDialog()}
            disabled={loading}
          >
            Add New Policy
          </Button>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Placement policies determine student eligibility for different types of placement drives based on criteria like placement percentage, CGPA, etc.
      </Alert>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : policies.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            No policies found. Create a new policy to get started.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => handleOpenDialog()}
            sx={{ mt: 2 }}
          >
            Add First Policy
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {policies.map((policy) => (
            <Grid item xs={12} md={6} key={policy._id}>
              <Card 
                variant="outlined" 
                sx={{ 
                  borderLeft: '4px solid',
                  borderColor: policy.isActive ? 'success.main' : 'text.disabled',
                  opacity: policy.isActive ? 1 : 0.7
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" component="h2">
                      {policy.name}
                      <Chip 
                        size="small" 
                        label={policy.isActive ? "Active" : "Inactive"} 
                        color={policy.isActive ? "success" : "default"}
                        sx={{ ml: 1, fontSize: '0.7rem' }}
                      />
                    </Typography>
                    <Box>
                      <Tooltip title="Edit Policy">
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDialog(policy)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Policy">
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleDeletePolicy(policy._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1, mb: 2 }}>
                    {policy.description}
                  </Typography>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Policy Type:</strong>
                      </Typography>
                      <Typography variant="body2">
                        {policyTypes.find(t => t.value === policy.policyType)?.label || policy.policyType}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Threshold:</strong>
                      </Typography>
                      <Typography variant="body2">
                        {policy.threshold}
                        {policy.policyType === 'placement_percentage' ? '%' : ''}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Eligible For:</strong>
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {eligibilityOptions.find(o => o.value === policy.eligibleFor)?.icon}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {eligibilityOptions.find(o => o.value === policy.eligibleFor)?.label || policy.eligibleFor}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Applies To:</strong>
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {policy.appliesTo.courses.map(course => (
                          <Chip 
                            key={course} 
                            label={courseOptions.find(c => c.value === course)?.label || course} 
                            size="small" 
                            variant="outlined"
                          />
                        ))}
                      </Box>
                      {policy.appliesTo.branches.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                          {policy.appliesTo.branches.map(branch => (
                            <Chip 
                              key={branch} 
                              label={branchOptions.find(b => b.value === branch)?.label || branch} 
                              size="small" 
                              variant="outlined"
                              color="primary"
                            />
                          ))}
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={policy.isActive} 
                          onChange={() => handleToggleActive(policy)}
                          color="success"
                        />
                      }
                      label={policy.isActive ? "Active" : "Inactive"}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Policy Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPolicy ? 'Edit Policy' : 'Create New Policy'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Policy Name"
                fullWidth
                value={newPolicy.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={2}
                value={newPolicy.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Policy Type</InputLabel>
                <Select
                  value={newPolicy.policyType}
                  onChange={(e) => handleChange('policyType', e.target.value)}
                  label="Policy Type"
                >
                  {policyTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={`Threshold ${newPolicy.policyType === 'placement_percentage' ? '(%)' : ''}`}
                type="number"
                fullWidth
                value={newPolicy.threshold}
                onChange={(e) => handleChange('threshold', Number(e.target.value))}
                InputProps={{ 
                  inputProps: { 
                    min: 0, 
                    max: newPolicy.policyType === 'placement_percentage' ? 100 : undefined 
                  } 
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Eligible For</InputLabel>
                <Select
                  value={newPolicy.eligibleFor}
                  onChange={(e) => handleChange('eligibleFor', e.target.value)}
                  label="Eligible For"
                >
                  {eligibilityOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {option.icon}
                        <Typography sx={{ ml: 1 }}>{option.label}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Applies To:
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Courses</InputLabel>
                <Select
                  multiple
                  value={newPolicy.appliesTo.courses}
                  onChange={(e) => handleChange('appliesTo.courses', e.target.value)}
                  label="Courses"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip 
                          key={value} 
                          label={courseOptions.find(c => c.value === value)?.label || value} 
                          size="small" 
                        />
                      ))}
                    </Box>
                  )}
                >
                  {courseOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Branches (Optional)</InputLabel>
                <Select
                  multiple
                  value={newPolicy.appliesTo.branches}
                  onChange={(e) => handleChange('appliesTo.branches', e.target.value)}
                  label="Branches (Optional)"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip 
                          key={value} 
                          label={branchOptions.find(b => b.value === value)?.label || value} 
                          size="small" 
                          color="primary"
                        />
                      ))}
                    </Box>
                  )}
                >
                  {branchOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="caption" color="textSecondary">
                If no branches are selected, the policy applies to all branches in the selected courses.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={newPolicy.isActive} 
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                    color="success"
                  />
                }
                label="Policy Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSavePolicy} 
            variant="contained" 
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={loading || !newPolicy.name}
          >
            {loading ? 'Saving...' : 'Save Policy'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PlacementPolicyManager; 