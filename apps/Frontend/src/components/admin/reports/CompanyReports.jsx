import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Download, FilterList } from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import reportService from '../../../services/admin/reportService';
import FilterDebug from '../../common/FilterDebug';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CompanyReports = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear().toString(),
    industry: 'all',
    status: 'all',
    startDate: dayjs().subtract(1, 'year'),
    endDate: dayjs(),
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await reportService.getFilteredReports('company', filters);
      setData(response);
    } catch (error) {
      console.error('Error fetching company data:', error);
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

  const handleDateChange = (name) => (date) => {
    setFilters(prev => ({
      ...prev,
      [name]: date,
    }));
  };

  const handleApplyFilters = () => {
    fetchData();
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      await reportService.downloadReport('company', filters);
    } catch (error) {
      console.error('Error downloading report:', error);
      setError('Failed to download report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={3}>
        {/* Filters Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  name="year"
                  label="Year"
                  value={filters.year}
                  onChange={handleFilterChange}
                >
                  {[2022, 2023, 2024].map((year) => (
                    <MenuItem key={year} value={year.toString()}>
                      {year}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  name="industry"
                  label="Industry"
                  value={filters.industry}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="all">All Industries</MenuItem>
                  <MenuItem value="it">IT</MenuItem>
                  <MenuItem value="finance">Finance</MenuItem>
                  <MenuItem value="consulting">Consulting</MenuItem>
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
              <Grid item xs={12} container justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setShowDebug(!showDebug)}
                  >
                    {showDebug ? 'Hide Debug' : 'Show Debug'}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={handleApplyFilters}
                    disabled={loading}
                  >
                    {loading ? 'Applying...' : 'Apply Filters'}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Download />}
                    onClick={handleDownload}
                    disabled={loading}
                    sx={{ ml: 1 }}
                  >
                    {loading ? 'Downloading...' : 'Download Report'}
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {showDebug && <FilterDebug filters={filters} />}
            
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Loading State */}
        {loading && (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          </Grid>
        )}

        {/* Data Display */}
        {!loading && data && (
          <>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Company Name</TableCell>
                      <TableCell align="right">Visits</TableCell>
                      <TableCell>Positions</TableCell>
                      <TableCell align="right">Students Hired</TableCell>
                      <TableCell align="right">Average Package</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.companies?.map((company) => (
                      <TableRow key={company.name}>
                        <TableCell component="th" scope="row">
                          {company.name}
                        </TableCell>
                        <TableCell align="right">{company.visits}</TableCell>
                        <TableCell>
                          {Array.isArray(company.positions) ? 
                            company.positions.join(', ') : 
                            company.positions || 'N/A'}
                        </TableCell>
                        <TableCell align="right">{company.studentsHired}</TableCell>
                        <TableCell align="right">{company.averagePackage}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* Charts */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Industry Distribution
                  </Typography>
                  <Box height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Array.isArray(data.industryData) ? data.industryData : []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="industry"
                          label={({ industry, count }) => `${industry}: ${count}`}
                        >
                          {Array.isArray(data.industryData) && data.industryData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Company List
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Industry</TableCell>
                        <TableCell>Offers</TableCell>
                        <TableCell>Avg. CTC (LPA)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.companyList && data.companyList.map((company, index) => (
                        <TableRow key={index}>
                          <TableCell>{company.name}</TableCell>
                          <TableCell>{company.industry}</TableCell>
                          <TableCell>{company.offers}</TableCell>
                          <TableCell>{company.avgCTC}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </>
        )}
      </Grid>
    </LocalizationProvider>
  );
};

export default CompanyReports;