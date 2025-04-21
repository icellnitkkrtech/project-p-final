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
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import reportService from '../../../services/admin/reportService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Get current year and 2 years back for dropdown
const currentYear = new Date().getFullYear();
const years = [
  (currentYear - 2).toString(),
  (currentYear - 1).toString(),
  currentYear.toString(),
  (currentYear + 1).toString(),
];

const StudentReports = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    department: 'all',
    batch: currentYear.toString(),
    category: 'all',
    placementStatus: 'all',
    startDate: dayjs().subtract(1, 'year'),
    endDate: dayjs(),
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await reportService.getFilteredReports('student', filters);
      setData(response);
    } catch (error) {
      console.error('Error fetching student data:', error);
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

  const handleDownload = async (format) => {
    try {
        setLoading(true);
        setError(null);

        // Since we're using table data, we'll send only the necessary data
        const downloadFilters = {
            department: filters.department,
            batch: filters.batch,
            category: filters.category,
            placementStatus: filters.placementStatus
        };

        await reportService.downloadReport('student', downloadFilters, format);
    } catch (error) {
        console.error('Error downloading report:', error);
        setError(`Failed to download ${format.toUpperCase()} report. Please try again.`);
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
              Student Report Filters
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  label="Department"
                  name="department"
                  value={filters.department}
                  onChange={handleFilterChange}
                  margin="normal"
                >
                  <MenuItem value="all">All Departments</MenuItem>
                  <MenuItem value="Computer Engineering">Computer Engineering</MenuItem>
                  <MenuItem value="Information Technology">Information Technology</MenuItem>
                  <MenuItem value="Electronics & Communication">Electronics & Communication</MenuItem>
                  <MenuItem value="Electrical Engineering">Electrical Engineering</MenuItem>
                  <MenuItem value="Mechanical Engineering">Mechanical Engineering</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  label="Batch"
                  name="batch"
                  value={filters.batch}
                  onChange={handleFilterChange}
                  margin="normal"
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  margin="normal"
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="General">General</MenuItem>
                  <MenuItem value="OBC">OBC</MenuItem>
                  <MenuItem value="SC">SC</MenuItem>
                  <MenuItem value="ST">ST</MenuItem>
                  <MenuItem value="EWS">EWS</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  label="Placement Status"
                  name="placementStatus"
                  value={filters.placementStatus}
                  onChange={handleFilterChange}
                  margin="normal"
                >
                  <MenuItem value="all">All Students</MenuItem>
                  <MenuItem value="placed">Placed</MenuItem>
                  <MenuItem value="unplaced">Unplaced</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Start Date"
                  value={filters.startDate}
                  onChange={handleDateChange('startDate')}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                  slotProps={{
                    textField: { fullWidth: true, margin: "normal" }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="End Date"
                  value={filters.endDate}
                  onChange={handleDateChange('endDate')}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                  slotProps={{
                    textField: { fullWidth: true, margin: "normal" }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={handleApplyFilters}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Apply Filters'}
                  </Button>
                  {/* <Button
                    variant="outlined"
                    onClick={() => handleDownload('pdf')}
                    disabled={loading || !data}
                  >
                    Download PDF
                  </Button> */}
                  <Button
                    variant="outlined"
                    onClick={() => handleDownload('excel')}
                    disabled={loading || !data}
                  >
                    Download report
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : data ? (
          <>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Student Summary
                </Typography>
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
                          {data.summary.placedStudents}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Average CGPA
                        </Typography>
                        <Typography variant="h4">
                          {data.summary.averageCGPA}
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
                      Department Distribution
                    </Typography>
                    <Box height={300}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data.departmentData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                            nameKey="department"
                            label={({ department, count }) => `${department}: ${count}`}
                          >
                            {data.departmentData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Placement Status
                    </Typography>
                    <Box height={300}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data.placementData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                            nameKey="status"
                            label={({ status, count }) => `${status}: ${count}`}
                          >
                            {data.placementData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
            </Grid>

            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Student Details
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Records: {data.studentList?.length || 0}
                  </Typography>
                </Box>
                <TableContainer 
                  component={Paper} 
                  sx={{ 
                    boxShadow: 2,
                    "& .MuiTableCell-head": {
                      backgroundColor: "#f5f5f5",
                      fontWeight: 'bold'
                    },
                    "& .MuiTableRow-root:nth-of-type(even)": {
                      backgroundColor: "#fafafa"
                    },
                    "& .MuiTableRow-root:hover": {
                      backgroundColor: "#f5f5f5"
                    }
                  }}
                >
                  <Table sx={{ minWidth: 800 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Roll No.</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>CGPA</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Placement Status</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Company</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Package (LPA)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.studentList && data.studentList.map((student, index) => (
                        <TableRow 
                          key={student.rollNo || index}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell>{student.rollNumber}</TableCell>
                         
                          <TableCell sx={{ fontWeight: 500 }}>{student.name}</TableCell>
                          <TableCell>{student.department}</TableCell>
                          <TableCell>{student.cgpa?.toFixed(2)}</TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                backgroundColor: student.status === 'Placed' ? '#e8f5e9' : '#ffebee',
                                color: student.status === 'Placed' ? '#2e7d32' : '#c62828',
                                py: 0.5,
                                px: 1.5,
                                borderRadius: 1,
                                display: 'inline-block',
                                fontSize: '0.875rem',
                                fontWeight: 500
                              }}
                            >
                              {student.status}
                            </Box>
                          </TableCell>
                          <TableCell>
                            {student.company || (
                              <Typography variant="body2" color="text.secondary">
                                Not Placed
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {student.package ? (
                              `₹${student.package.toFixed(2)}`
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                -
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {data.studentList?.length === 0 && (
                  <Box sx={{ py: 3, textAlign: 'center' }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      No student records found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try adjusting your filters to see more results
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
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

export default StudentReports;