import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import reportService from '../../../services/admin/reportService';
import FilterDebug from '../../common/FilterDebug';
import DownloadIcon from '@mui/icons-material/Download';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Get current year and 2 years back for dropdown
const currentYear = new Date().getFullYear();
const years = [
  (currentYear - 2).toString(),
  (currentYear - 1).toString(),
  currentYear.toString()
];

const PlacementReports = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [showDebug, setShowDebug] = useState(false);

  const [filters, setFilters] = useState({
    year: currentYear.toString(),
    branch: 'all',
    startDate: dayjs().subtract(1, 'year'),
    endDate: dayjs(),
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await reportService.getFilteredReports('placement', filters);
      
      setData(response);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (name) => (newDate) => {
    setFilters(prev => ({
      ...prev,
      [name]: newDate,
    }));
  };

  const handleApplyFilters = () => {
    fetchData();
  };

  const handleDownload = async (format) => {
    try {
      setLoading(true);
      await reportService.downloadReport('placement', filters, format);
      setError(null);
    } catch (error) {
      console.error('Error downloading report:', error);
      setError(`Failed to download ${format.toUpperCase()} report. Please try again.`);
    } finally {
      setLoading(false);
    }
  };
  const handleChartDownload = async () => {
      try {
        setLoading(true);
        const response = await reportService.downloadCharts('placement', filters);
        
        // Create blob and download
        const url = window.URL.createObjectURL(
          new Blob([response], { type: 'application/pdf' })
        );
  
        // Create and trigger download
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `placement_charts_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
  
        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
  
      } catch (error) {
        console.error('Error downloading charts:', error);
        setError('Failed to download charts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Placement Report Filters
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Academic Year"
                  name="year"
                  value={filters.year}
                  onChange={handleFilterChange}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}-{parseInt(year) + 1}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Branch"
                  name="branch"
                  value={filters.branch}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="all">All Branches</MenuItem>
                  <MenuItem value="cse">Computer Science</MenuItem>
                  <MenuItem value="it">Information Technology</MenuItem>
                  <MenuItem value="ece">Electronics & Communication</MenuItem>
                  <MenuItem value="ee">Electrical Engineering</MenuItem>
                  <MenuItem value="me">Mechanical Engineering</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Start Date"
                  value={filters.startDate}
                  onChange={handleDateChange('startDate')}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="End Date"
                  value={filters.endDate}
                  onChange={handleDateChange('endDate')}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => setShowDebug(!showDebug)}
                  >
                    {showDebug ? 'Hide Debug' : 'Show Debug'}
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={handleApplyFilters}
                    disabled={loading}
                  >
                    Apply Filters
                  </Button>
                </Box>
              </Grid>
            </Grid>
            
            {showDebug && <FilterDebug filters={filters} />}
          </CardContent>
        </Card>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        ) : data ? (
          <>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Placement Summary
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button 
                      variant="outlined" 
                      onClick={() => handleChartDownload()}
                      disabled={loading}
                      startIcon={<DownloadIcon />}
                    >
                      Download PDF
                    </Button>
                    <Button 
                      variant="outlined" 
                      onClick={() => handleDownload('excel')}
                      disabled={loading}
                      startIcon={<DownloadIcon />}
                    >
                      Download Excel
                    </Button>
                  </Stack>
                </Box>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Total Students
                        </Typography>
                        <Typography variant="h4">
                          {data.summary.totalStudents}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Placed Students
                        </Typography>
                        <Typography variant="h4">
                          {data.summary.placedStudents} ({data.summary.placementPercentage}%)
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Average CTC (LPA)
                        </Typography>
                        <Typography variant="h4">
                          {data.summary.averageCTC}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Highest CTC (LPA)
                        </Typography>
                        <Typography variant="h4">
                          {data.summary.highestCTC}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Companies Visited
                        </Typography>
                        <Typography variant="h4">
                          {data.summary.companiesVisited}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Monthly Placement Trend
                    </Typography>
                    <Box height={300}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="placements" fill="#8884d8" name="Placements" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Branch-wise Placement
                    </Typography>
                    <Box height={300}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.branchData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="branch" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="placed" fill="#82ca9d" name="Placed" />
                          <Bar dataKey="total" fill="#8884d8" name="Total" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        ) : (
          <Alert severity="info" sx={{ mb: 3 }}>
            No data available. Please adjust your filters and try again.
          </Alert>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default PlacementReports;

