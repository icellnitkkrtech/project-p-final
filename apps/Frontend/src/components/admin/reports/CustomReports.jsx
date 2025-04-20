import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import reportService from '../../../services/admin/reportService';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const availableMetrics = {
  student: [
    'Name',
    'Department',
    'CGPA',
    'Status',
    'Company',
    'Package (CTC)',
    'Batch',
    'Category'
  ],
  placement: [
    'Programme',
    'No. of Eligible Students',
    'No. of Placement offers',
    'Range of Package (in lakh)',
    'Avg. Package (in lakh)',
    'No. of Students Placed',
    '% of Students Placed',
    'Median Package (in lakh)'
  ],
  company: [
    'Company Name',
    'Visits',
    'Positions',
    'Students Hired',
    'Average Package',
    'Industry',
    'Job Profiles'
  ]
};

const CustomReports = () => {
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: 'placement',
    metrics: [],
    filters: {
      startDate: dayjs().subtract(1, 'year'),
      endDate: dayjs(),
      departments: [],
      categories: [],
    },
  });

  // Fetch saved templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await reportService.getReportTemplates();
        setTemplates(response || []);
      } catch (error) {
        console.error('Error fetching templates:', error);
        setError('Failed to load templates');
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleTemplateChange = (event) => {
    const { name, value } = event.target;
    setNewTemplate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMetricsChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewTemplate((prev) => ({
      ...prev,
      metrics: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSaveTemplate = async () => {
    try {
      setLoading(true);
      const savedTemplate = await reportService.saveReportTemplate(newTemplate);
      setTemplates((prev) => [...prev, savedTemplate]);
      setOpenDialog(false);
      setNewTemplate({
        name: '',
        type: 'placement',
        metrics: [],
        filters: {
          startDate: dayjs().subtract(1, 'year'),
          endDate: dayjs(),
          departments: [],
          categories: [],
        },
      });
    } catch (error) {
      console.error('Error saving template:', error);
      setError('Failed to save template. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (template) => {
    try {
      setLoading(true);
      const reportData = await reportService.generateReport({
        ...template,
        format: 'csv'  // Changed from 'excel' to 'csv'
      });

      if (reportData) {
        setSelectedTemplate({
          ...template,
          data: reportData
        });
      }
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    try {
      // Add confirmation dialog
      if (!window.confirm('Are you sure you want to delete this template?')) {
        return;
      }

      await reportService.deleteReportTemplate(templateId);
      // Refresh templates list after successful deletion
      const response = await reportService.getReportTemplates();
      setTemplates(response || []);
      // Show success message
      alert('Template deleted successfully');
    } catch (error) {
      console.error('Error deleting template:', error);
      // Show error message to user
      alert(error.response?.data?.message || 'Failed to delete template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Header with Add Template Button */}
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Custom Report Templates</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Create New Template
          </Button>
        </Box>
      </Grid>

      {/* Error Message */}
      {error && (
        <Grid item xs={12}>
          <Typography color="error">{error}</Typography>
        </Grid>
      )}

      {/* Loading State */}
      {loading && (
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        </Grid>
      )}

      {/* Saved Templates */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          {templates && templates.length > 0 ? (
            templates.map((template) => (
              <Grid item xs={12} md={6} lg={4} key={template._id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">{template.name}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteTemplate(template._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Typography color="textSecondary" gutterBottom>
                      Type: {template.type}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {template.metrics.map((metric) => (
                        <Chip
                          key={metric}
                          label={metric}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleGenerateReport(template)}
                        fullWidth
                      >
                        Generate Report
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography color="textSecondary" align="center">
                No templates found. Create a new template to get started.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Create Template Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="sm" 
        fullWidth
        aria-labelledby="create-template-dialog"
      >
        <DialogTitle id="create-template-dialog">Create New Report Template</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Template Name"
              name="name"
              value={newTemplate.name}
              onChange={handleTemplateChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Report Type"
              name="type"
              value={newTemplate.type}
              onChange={handleTemplateChange}
              sx={{ mb: 2 }}
            >
              <MenuItem value="placement">Placement Report</MenuItem>
              <MenuItem value="company">Company Report</MenuItem>
              <MenuItem value="student">Student Report</MenuItem>
            </TextField>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Metrics</InputLabel>
              <Select
                multiple
                value={newTemplate.metrics}
                onChange={handleMetricsChange}
                input={<OutlinedInput label="Select Metrics" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {availableMetrics[newTemplate.type].map((metric) => (
                  <MenuItem key={metric} value={metric}>
                    <Checkbox checked={newTemplate.metrics.indexOf(metric) > -1} />
                    <ListItemText primary={metric} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSaveTemplate}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!newTemplate.name || newTemplate.metrics.length === 0}
          >
            Save Template
          </Button>
        </DialogActions>
      </Dialog>

      {/* Global Loading Overlay */}
      {loading && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="rgba(255, 255, 255, 0.7)"
          zIndex={9999}
        >
          <CircularProgress />
        </Box>
      )}

      {/* Report Preview */}
      {selectedTemplate?.data && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Report Preview: {selectedTemplate.name}
            </Typography>
            
            {/* Summary Section */}
            {selectedTemplate.data.summary && (
              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom>Summary</Typography>
                <Grid container spacing={2}>
                  {Object.entries(selectedTemplate.data.summary).map(([key, value]) => (
                    <Grid item xs={12} sm={4} key={key}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="body2" color="textSecondary">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Typography>
                        <Typography variant="h6">
                          {typeof value === 'number' ? value.toLocaleString() : value}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Department Stats Table */}
            {selectedTemplate.data.departmentStats && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Department</TableCell>
                      <TableCell align="right">Total Students</TableCell>
                      <TableCell align="right">Placed</TableCell>
                      <TableCell align="right">Percentage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedTemplate.data.departmentStats.map((dept, index) => (
                      <TableRow key={index}>
                        <TableCell>{dept.department}</TableCell>
                        <TableCell align="right">{dept.total}</TableCell>
                        <TableCell align="right">{dept.placed}</TableCell>
                        <TableCell align="right">{dept.percentage}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};

export default CustomReports;