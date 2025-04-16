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

const availableMetrics = [
  'Total Students',
  'Placed Students',
  'Average Package',
  'Highest Package',
  'Department-wise Stats',
  'Company-wise Stats',
  'Placement Timeline',
  'Package Distribution',
];

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
      await reportService.generateReport(template);
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    try {
      setLoading(true);
      await reportService.deleteReportTemplate(templateId);
      setTemplates((prev) => prev.filter((t) => t.id !== templateId));
    } catch (error) {
      console.error('Error deleting template:', error);
      setError('Failed to delete template. Please try again.');
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
              <Grid item xs={12} md={6} lg={4} key={template.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">{template.name}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteTemplate(template.id)}
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
                {availableMetrics.map((metric) => (
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
    </Grid>
  );
};

export default CustomReports;