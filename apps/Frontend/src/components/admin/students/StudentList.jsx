import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Menu,
  MenuItem,
  ListItemIcon,
  Avatar,
  Chip,
  Drawer,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Slider,
  Divider,
  InputAdornment,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import {
  Search,
  FilterList,
  Edit,
  Block,
  Download,
  Mail,
  Person,
  Sort,
  Clear,
  Save,
  MoreVert,
  ViewList,
  ViewModule
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import studentService from '../../../services/admin/studentService';
import { useAudit } from '../../../hooks/admin/useAudit';
import StudentDetailsView from './StudentDetailsView';
import EditStudentForm from './forms/EditStudentForm';

const StudentList = ({ onStudentSelect, onProfileClick }) => {
  const { logEvent } = useAudit();
  // State for filters
  const [filters, setFilters] = useState({
    search: '',
    batch: [],
    branch: [],
    section: [],
    status: [],
    gender: [],
    placementStatus: [],
    cgpaRange: [0, 10],
    backlogsRange: [0, 10],
    hasInternship: null,
    hasProjects: null,
    hasCertifications: null,
    activeBacklogs: null,
    eligibilityStatus: [],
    offerStatus: [],
    interviewStatus: [],
    skillTags: [],
    location: [],
    category: [],
    admissionType: [],
    feesStatus: [],
    hostelStatus: []
  });

  // State for drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // State for sorting
  const [sortConfig, setSortConfig] = useState({
    field: 'name',
    direction: 'asc'
  });

  // State for pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for students
  const [students, setStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Debar dialog state
  const [openDebarDialog, setOpenDebarDialog] = useState(false);
  const [debarReason, setDebarReason] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [detailsViewOpen, setDetailsViewOpen] = useState(false);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    personalInfo: {},
    academics: {}
  });

  // Filter options
  const filterOptions = {
    batch: ['2020-24', '2021-25', '2022-26', '2023-27'],
    branch: ['CSE', 'IT', 'ECE', 'EEE', 'MECH'],
    section: ['A', 'B', 'C', 'D'],
    status: ['Active', 'Inactive', 'Alumni', 'Suspended'],
    gender: ['Male', 'Female', 'Other'],
    placementStatus: ['Placed', 'Unplaced', 'Not Eligible', 'Opted Out'],
    eligibilityStatus: ['Eligible', 'Not Eligible', 'Conditional'],
    offerStatus: ['No Offers', 'Single Offer', 'Multiple Offers'],
    interviewStatus: ['Scheduled', 'Completed', 'Not Started'],
    skillTags: ['Python', 'Java', 'React', 'Node.js', 'Machine Learning'],
    location: ['On Campus', 'Off Campus'],
    category: ['General', 'OBC', 'SC', 'ST'],
    admissionType: ['Regular', 'Management Quota', 'Sports Quota'],
    feesStatus: ['Paid', 'Pending', 'Defaulter'],
    hostelStatus: ['Day Scholar', 'Hosteller']
  };

  // Add state for tracking updates
  const [refreshData, setRefreshData] = useState(false);

  // Add this new state
  const [viewMode, setViewMode] = useState('table');

  // Modify the useEffect to respond to refreshData changes
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await studentService.getStudents(filters, { page, rowsPerPage });
        console.log("Fetched students data:", response);

        if (response && response.data && Array.isArray(response.data)) {
          setStudents(response.data);
        } else {
          setStudents([]);
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        setStudents([]);
      }
    };

    fetchStudents();
  }, [filters, page, rowsPerPage, refreshData]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    logEvent('filter', 'StudentList', `Applied filter: ${field} = ${value}`);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      batch: [],
      branch: [],
      // ... reset all filters
    });
  };

  const handleSaveFilters = () => {
    // Save current filters as preset
    console.log('Saving filters:', filters);
  };

  // Handle form input changes
  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Handle edit button click
  const handleEditClick = (student, event) => {
    event.stopPropagation();
    setSelectedStudentId(student._id);
    setEditDialogOpen(true);
  };

  // Handle student update
  const handleUpdateStudent = async (updatedData) => {
    try {
      const response = await studentService.updateStudent(selectedStudentId, updatedData);
      if (response.success) {
        // Refresh the student list
        fetchStudents();
        setEditDialogOpen(false);
        // Show success message
        // You'll need to implement your own success message handling
      }
    } catch (error) {
      console.error('Error updating student:', error);
      // Show error message
      // You'll need to implement your own error message handling
    }
  };

  const handleSendEmail = async (student, event) => {
    event.stopPropagation();
    try {
      // Your existing email logic
      logEvent('communication', 'Student', `Sent email to student: ${student.name} (${student.rollNo})`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleDebarClick = (studentId) => {
    setSelectedStudentId(studentId);
    setDebarReason('');
    setOpenDebarDialog(true);
  };

  const handleCloseDebarDialog = () => {
    setOpenDebarDialog(false);
    setDebarReason('');
    setSelectedStudentId(null);
  };

  const handleDeleteStudent = async () => {
    if (!debarReason.trim()) {
      setErrorMessage('Please provide a reason for debarring the student.');
      return;
    }

    try {
      const response = await studentService.deleteStudent(selectedStudentId, debarReason);
      
      if (response.status === 204) {
        setStudents((prevStudents) => 
          prevStudents.filter(student => student._id !== selectedStudentId)
        );
        setSuccessMessage('Student has been debarred successfully');
        handleCloseDebarDialog();
      }
    } catch (error) {
      console.error('Error debarring student:', error);
      setErrorMessage('An error occurred while debarring the student.');
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Roll Number', 'Department', 'Batch', 'CGPA', '10th Marks', '12th Marks'], // Header
      ...students.map(student => [
        student.personalInfo.name,
        student.personalInfo.rollNumber,
        student.personalInfo.department,
        student.personalInfo.batch,
        student.academics.cgpa,
        student.academics.tenthMarks,
        student.academics.twelfthMarks,
      ]),
    ]
      .map(e => e.join(',')) // Convert each row to a comma-separated string
      .join('\n'); // Join all rows with a newline character

    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'students_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1);
    fetchStudents();
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
    fetchStudents();
  };

  const handleProfileClick = (student) => {
    setSelectedStudentId(student._id);
    setDetailsViewOpen(true);
  };

  // Filter drawer content
  const filterDrawerContent = (
    <Box sx={{ width: 320, p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Filters</Typography>
        <Box>
          <IconButton onClick={handleClearFilters} title="Clear filters">
            <Clear />
          </IconButton>
          <IconButton onClick={handleSaveFilters} title="Save filters">
            <Save />
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Academic Filters */}
      <Typography variant="subtitle1" gutterBottom>
        Academic Details
      </Typography>
      
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Batch</InputLabel>
        <Select
          multiple
          value={filters.batch}
          onChange={(e) => handleFilterChange('batch', e.target.value)}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
        >
          {filterOptions.batch.map((batch) => (
            <MenuItem key={batch} value={batch}>
              {batch}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Branch</InputLabel>
        <Select
          multiple
          value={filters.branch}
          onChange={(e) => handleFilterChange('branch', e.target.value)}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
        >
          {filterOptions.branch.map((branch) => (
            <MenuItem key={branch} value={branch}>
              {branch}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography gutterBottom>CGPA Range</Typography>
      <Slider
        value={filters.cgpaRange}
        onChange={(e, newValue) => handleFilterChange('cgpaRange', newValue)}
        valueLabelDisplay="auto"
        min={0}
        max={10}
        step={0.1}
      />

      <Typography gutterBottom>Backlogs</Typography>
      <Slider
        value={filters.backlogsRange}
        onChange={(e, newValue) => handleFilterChange('backlogsRange', newValue)}
        valueLabelDisplay="auto"
        min={0}
        max={10}
      />

      {/* Placement Filters */}
      <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
        Placement Status
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Placement Status</InputLabel>
        <Select
          multiple
          value={filters.placementStatus}
          onChange={(e) => handleFilterChange('placementStatus', e.target.value)}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
        >
          {filterOptions.placementStatus.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.hasInternship}
              onChange={(e) => handleFilterChange('hasInternship', e.target.checked)}
            />
          }
          label="Has Internship Experience"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.hasCertifications}
              onChange={(e) => handleFilterChange('hasCertifications', e.target.checked)}
            />
          }
          label="Has Certifications"
        />
      </FormGroup>

      {/* Additional Filters */}
      <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
        Additional Filters
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Category</InputLabel>
        <Select
          multiple
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
        >
          {filterOptions.category.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Fees Status</InputLabel>
        <Select
          multiple
          value={filters.feesStatus}
          onChange={(e) => handleFilterChange('feesStatus', e.target.value)}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
        >
          {filterOptions.feesStatus.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  // Apply filtering logic
  const filteredStudents = students.filter(student => {
    const { personalInfo, academics } = student;

    // Example filter conditions
    const matchesSearch = filters.search ? personalInfo.name.toLowerCase().includes(filters.search.toLowerCase()) : true;
    const matchesBatch = filters.batch.length ? filters.batch.includes(academics.batch) : true;
    const matchesBranch = filters.branch.length ? filters.branch.includes(academics.branch) : true;
    const matchesCGPA = filters.cgpaRange ? (academics.cgpa >= filters.cgpaRange[0] && academics.cgpa <= filters.cgpaRange[1]) : true;

    return matchesSearch && matchesBatch && matchesBranch && matchesCGPA;
  });

  // Filter students based on search term
  const searchFilteredStudents = filteredStudents.filter(student => {
    const rollNumber = String(student.personalInfo.rollNumber).toLowerCase();
    const name = student.personalInfo.name.toLowerCase();
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return rollNumber.includes(lowerCaseSearchTerm) || name.includes(lowerCaseSearchTerm);
  });

  // Add this new handler
  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
              <TextField
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ flexGrow: 1 }}
              />
              
              <Box display="flex" gap={2} alignItems="center">
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={handleViewModeChange}
                  size="small"
                  sx={{
                    '& .MuiToggleButton-root': {
                      border: 'none',
                      '&.Mui-selected': {
                        bgcolor: theme => theme.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.08)'
                          : 'rgba(25, 118, 210, 0.08)',
                      }
                    }
                  }}
                >
                  <ToggleButton value="table" aria-label="table view">
                    <ViewList />
                  </ToggleButton>
                  <ToggleButton value="card" aria-label="card view">
                    <ViewModule />
                  </ToggleButton>
                </ToggleButtonGroup>
                
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => setDrawerOpen(true)}
                >
                  Filters
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleExport}
                >
                  Export
                </Button>
              </Box>
            </Box>

            {/* Active Filters Display */}
            <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
              {Object.entries(filters).map(([key, value]) => {
                if (Array.isArray(value) && value.length > 0) {
                  return value.map((v) => (
                    <Chip
                      key={`${key}-${v}`}
                      label={`${key}: ${v}`}
                      onDelete={() => {
                        const newValue = filters[key].filter(item => item !== v);
                        handleFilterChange(key, newValue);
                      }}
                      size="small"
                      sx={{
                        bgcolor: theme => theme.palette.mode === 'dark' 
                          ? 'rgba(255,255,255,0.05)' 
                          : 'rgba(25, 118, 210, 0.08)',
                        '& .MuiChip-deleteIcon': {
                          color: theme => theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.7)'
                            : theme.palette.primary.main
                        }
                      }}
                    />
                  ));
                }
                return null;
              })}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Student List */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}
            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}
            
            {viewMode === 'table' ? (
              // Table View (existing)
              <>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Roll No</TableCell>
                      <TableCell>Batch</TableCell>
                      <TableCell>Branch</TableCell>
                      <TableCell>CGPA</TableCell>
                      <TableCell>Placement Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {searchFilteredStudents.length > 0 ? (
                      searchFilteredStudents.map((student) => {
                        const { personalInfo, academics } = student;
                        return(
                        <TableRow key={student._id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar 
                                src={student.personalInfo?.photo} 
                                alt={student.personalInfo?.name}
                                onClick={() => handleProfileClick(student)}
                                sx={{ 
                                  cursor: 'pointer',
                                  '&:hover': {
                                    opacity: 0.8,
                                    transform: 'scale(1.1)',
                                    transition: 'all 0.2s ease-in-out'
                                  }
                                }}
                              />
                              <Typography>{student.personalInfo?.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography>{student.personalInfo.rollNumber}</Typography>
                          </TableCell>
                          <TableCell>
                          <Typography>{personalInfo?.batch || "N/A"}</Typography>
                          </TableCell>
                          <TableCell>
                          <Typography>{personalInfo?.department || "N/A"}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{student.academics.cgpa}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={student.verificationStatus || "N/A"}
                              color={student.verificationStatus === "verified" ? "success" : "default"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box display="flex" gap={1}>
                              <Tooltip title="Edit">
                                <IconButton onClick={(e) => handleEditClick(student, e)}>
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Send Email">
                                <IconButton onClick={(e) => handleSendEmail(student, e)}>
                                  <Mail />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Debar Student">
                                <IconButton 
                                  onClick={() => handleDebarClick(student._id)}
                                  sx={{ color: 'error.main' }}
                                >
                                  <Block />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )})
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography>No students found</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </>
            ) : (
              // Card View (new)
              <Grid container spacing={3}>
                {searchFilteredStudents.length > 0 ? (
                  searchFilteredStudents.map((student) => {
                    const { personalInfo, academics } = student;
                    return (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={student._id}>
                        <Card 
                          elevation={0}
                          sx={{
                            height: '100%',
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: theme => theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.1)' 
                              : 'rgba(0, 0, 0, 0.08)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: theme => theme.palette.mode === 'dark'
                                ? '0 4px 20px rgba(0, 0, 0, 0.5)'
                                : '0 4px 20px rgba(25, 118, 210, 0.15)',
                            }
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box 
                              display="flex" 
                              flexDirection="column" 
                              alignItems="center" 
                              mb={2}
                            >
                              <Avatar 
                                src={personalInfo?.photo} 
                                alt={personalInfo?.name}
                                onClick={() => handleProfileClick(student)}
                                sx={{ 
                                  width: 80,
                                  height: 80,
                                  mb: 2,
                                  cursor: 'pointer',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                  border: '3px solid',
                                  borderColor: theme => theme.palette.mode === 'dark'
                                    ? 'rgba(255,255,255,0.1)'
                                    : theme.palette.primary.main,
                                  '&:hover': {
                                    transform: 'scale(1.05)',
                                    transition: 'all 0.2s ease-in-out'
                                  }
                                }}
                              />
                              <Typography 
                                variant="h6" 
                                align="center"
                                sx={{ 
                                  fontWeight: 600,
                                  mb: 0.5
                                }}
                              >
                                {personalInfo?.name}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                color="textSecondary" 
                                align="center"
                              >
                                {personalInfo?.rollNumber}
                              </Typography>
                            </Box>
                            
                            <Box 
                              sx={{
                                display: 'grid',
                                gap: 1.5,
                                mb: 2,
                                p: 2,
                                borderRadius: 1,
                                bgcolor: theme => theme.palette.mode === 'dark'
                                  ? 'rgba(255,255,255,0.03)'
                                  : 'rgba(25, 118, 210, 0.04)'
                              }}
                            >
                              <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" color="textSecondary">
                                  Batch
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                  {personalInfo?.batch || "N/A"}
                                </Typography>
                              </Box>
                              
                              <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" color="textSecondary">
                                  Branch
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                  {personalInfo?.department || "N/A"}
                                </Typography>
                              </Box>
                              
                              <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" color="textSecondary">
                                  CGPA
                                </Typography>
                                <Typography 
                                  variant="body2" 
                                  fontWeight={600}
                                  sx={{
                                    color: theme => 
                                      parseFloat(academics?.cgpa) >= 8.5 
                                        ? theme.palette.success.main 
                                        : parseFloat(academics?.cgpa) >= 7.5
                                          ? theme.palette.primary.main
                                          : 'inherit'
                                  }}
                                >
                                  {academics?.cgpa || "N/A"}
                                </Typography>
                              </Box>
                              
                              <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="body2" color="textSecondary">
                                  Status
                                </Typography>
                                <Chip
                                  label={student.verificationStatus || "N/A"}
                                  color={student.verificationStatus === "verified" ? "success" : "default"}
                                  size="small"
                                  sx={{ 
                                    fontWeight: 500,
                                    textTransform: 'capitalize',
                                    '& .MuiChip-label': { px: 1 }
                                  }}
                                />
                              </Box>
                            </Box>
                            
                            <Box 
                              display="flex" 
                              justifyContent="center" 
                              gap={1}
                              sx={{
                                '& .MuiIconButton-root': {
                                  color: theme => theme.palette.mode === 'dark'
                                    ? 'rgba(255,255,255,0.7)'
                                    : theme.palette.primary.main,
                                  '&:hover': {
                                    bgcolor: theme => theme.palette.mode === 'dark'
                                      ? 'rgba(255,255,255,0.05)'
                                      : 'rgba(25, 118, 210, 0.08)'
                                  }
                                }
                              }}
                            >
                              <Tooltip title="Edit">
                                <IconButton onClick={(e) => handleEditClick(student, e)}>
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Send Email">
                                <IconButton onClick={(e) => handleSendEmail(student, e)}>
                                  <Mail />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Debar Student">
                                <IconButton 
                                  onClick={() => handleDebarClick(student._id)}
                                  sx={{ 
                                    color: theme => theme.palette.error.main
                                  }}
                                >
                                  <Block />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })
                ) : (
                  <Grid item xs={12}>
                    <Box p={4} textAlign="center">
                      <Typography>No students found</Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            )}
            
            <TablePagination
              component="div"
              count={100}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {filterDrawerContent}
      </Drawer>

      {/* Debar Confirmation Dialog */}
      <Dialog 
        open={openDebarDialog} 
        onClose={handleCloseDebarDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: 'error.main', 
          color: 'error.contrastText',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Block /> Debar Student
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to debar this student? This action cannot be undone.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for Debarring"
            fullWidth
            multiline
            rows={4}
            value={debarReason}
            onChange={(e) => setDebarReason(e.target.value)}
            required
            error={!debarReason.trim()}
            helperText={!debarReason.trim() ? "Reason is required" : ""}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={handleCloseDebarDialog}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteStudent}
            variant="contained" 
            color="error"
            startIcon={<Block />}
            disabled={!debarReason.trim()}
          >
            Debar Student
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add the Dialog wrapper for StudentDetailsView */}
      <Dialog 
        open={detailsViewOpen}
        onClose={() => setDetailsViewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          {selectedStudentId && (
            <StudentDetailsView 
              studentId={selectedStudentId} 
              onClose={() => setDetailsViewOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Student Form Dialog */}
      <EditStudentForm
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedStudentId(null);
        }}
        studentId={selectedStudentId}
        onUpdate={handleUpdateStudent}
      />
    </Grid>
  );
};

export default StudentList;