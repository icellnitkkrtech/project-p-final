import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  CircularProgress,
  Alert,
  Pagination
} from '@mui/material';
import {
  Business,
  LocationOn,
  Phone,
  Email,
  Language,
  Work,
  Timeline,
  Group,
  AttachMoney,
  CalendarToday,
  Description,
  Edit,
  Close,
  BusinessCenter,
  School,
  TrendingUp,
  FileDownload,
  Visibility,
  WorkOff,
  Add,
  FilterList
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import companyService from '../../../services/admin/companyService';
import CompanyForm from './CompanyForm';

const CompanyDetails = ({ company, open, onClose, isEditMode, onUpdate }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabData, setTabData] = useState({
    visits: [],
    jobProfiles: [],
    placedStudents: []
  });
  
  // State for different data types
  const [companyDetails, setCompanyDetails] = useState(null);
  const [applications, setApplications] = useState([]);

  // Fetch company details when component mounts or company changes
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!company?._id) return;
      
      setLoading(true);
      setError(null);
      try {
        const response = await companyService.getCompanyById(company._id);
        if (response.success) {
          setCompanyDetails(response.data.data);
        } else {
          setError(response.message || 'Failed to fetch company details');
        }
      } catch (err) {
        setError('Failed to fetch company details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [company?._id]);

  const fetchTabData = async () => {
    if (!company?._id) return;
    
    setLoading(true);
    setError(null);
    try {
      switch (currentTab) {
        case 1: // Visits
          const visits = await companyService.getVisitHistory(company._id);
          setTabData(prev => ({ ...prev, visits: visits.data }));
          break;
        case 2: // Job Profiles
          const response = await companyService.getJobProfiles(company._id);
          if (response.success) {
            setTabData(prev => ({ 
              ...prev, 
              jobProfiles: response.data.jobProfiles 
            }));
          } else {
            throw new Error(response.message || 'Failed to fetch job profiles');
          }
          break;
        case 3: // Placed Students
          const students = await companyService.getPlacedStudents(company._id);
          setTabData(prev => ({ ...prev, placedStudents: students.data }));
          break;
        default:
          break;
      }
    } catch (err) {
      console.error('Error fetching tab data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTabData();
  }, [currentTab, company?._id]);

  const handleUpdate = async (updatedData) => {
    setLoading(true);
    setError(null);
    try {
      await companyService.updateCompany(company._id, updatedData);
      onUpdate(); // Call the refresh function
      onClose(); // Close the dialog after successful update
    } catch (err) {
      setError('Failed to update company');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = (application) => {
    // Implement view application details logic
    console.log('View application:', application);
  };

  const handleViewDocuments = (application) => {
    // Implement view documents logic
    console.log('View documents:', application.documents);
  };

  useEffect(() => {
    const fetchApplications = async () => {
        if (!company?._id) return;
        
        setLoading(true);
        try {
            const response = await companyService.getDriveApplications(company._id);
            if (response.success) {
                setApplications(response.data.applications);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            setError('Failed to fetch applications');
        } finally {
            setLoading(false);
        }
    };

    if (currentTab === 4) {
        fetchApplications();
    }
}, [currentTab, company?._id]);

  const CompanyOverview = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card elevation={1}>
          <CardContent>
            <Box textAlign="center" mb={3}>
              <Avatar
                src={companyDetails?.logo}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  margin: 'auto',
                  border: '2px solid #eee'
                }}
              >
                <Business sx={{ fontSize: 60 }} />
              </Avatar>
              <Typography variant="h5" mt={2} fontWeight="bold">
                {companyDetails?.companyName}
              </Typography>
              <Chip 
                label={companyDetails?.status || 'Unknown'} 
                color={companyDetails?.status === 'active' ? 'success' : 'default'}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
            
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <LocationOn color="action" />
                </ListItemIcon>
                <ListItemText 
                  primary="Location"
                  secondary={companyDetails?.location || 'Not specified'}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Email color="action" />
                </ListItemIcon>
                <ListItemText 
                  primary="Email"
                  secondary={companyDetails?.email || 'Not specified'}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Phone color="action" />
                </ListItemIcon>
                <ListItemText 
                  primary="Contact"
                  secondary={companyDetails?.phone || 'Not specified'}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Language color="action" />
                </ListItemIcon>
                <ListItemText 
                  primary="Website"
                  secondary={companyDetails?.website || 'Not specified'}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card elevation={1} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Company Overview
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {companyDetails?.description || 'No company description available.'}
            </Typography>

            <Grid container spacing={2} mt={2}>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center" p={2} bgcolor="background.default" borderRadius={1}>
                  <BusinessCenter color="primary" sx={{ mb: 1 }} />
                  <Typography variant="h6">{companyDetails?.hiringSince || '2023'}</Typography>
                  <Typography variant="body2" color="text.secondary">Hiring Since</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center" p={2} bgcolor="background.default" borderRadius={1}>
                  <School color="primary" sx={{ mb: 1 }} />
                  <Typography variant="h6">{companyDetails?.totalHired || '0'}</Typography>
                  <Typography variant="body2" color="text.secondary">Students Hired</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center" p={2} bgcolor="background.default" borderRadius={1}>
                  <AttachMoney color="primary" sx={{ mb: 1 }} />
                  <Typography variant="h6">₹{(companyDetails?.avgPackage || 0).toLocaleString('en-IN')}</Typography>
                  <Typography variant="body2" color="text.secondary">Avg Package</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center" p={2} bgcolor="background.default" borderRadius={1}>
                  <TrendingUp color="primary" sx={{ mb: 1 }} />
                  <Typography variant="h6">₹{(companyDetails?.highestPackage || 0).toLocaleString('en-IN')}</Typography>
                  <Typography variant="body2" color="text.secondary">Highest Package</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card elevation={1}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <Timeline />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const PlacementStats = () => (
    <Card elevation={1} sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Placement Statistics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Box textAlign="center" p={2} bgcolor="background.default" borderRadius={1}>
              <Typography variant="h6">{companyDetails?.totalApplications || 0}</Typography>
              <Typography variant="body2" color="text.secondary">Total Applications</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box textAlign="center" p={2} bgcolor="background.default" borderRadius={1}>
              <Typography variant="h6">{companyDetails?.shortlisted || 0}</Typography>
              <Typography variant="body2" color="text.secondary">Shortlisted</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box textAlign="center" p={2} bgcolor="background.default" borderRadius={1}>
              <Typography variant="h6">{companyDetails?.selectedStudents || 0}</Typography>
              <Typography variant="body2" color="text.secondary">Selected</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box textAlign="center" p={2} bgcolor="background.default" borderRadius={1}>
              <Typography variant="h6">{companyDetails?.joinedStudents || 0}</Typography>
              <Typography variant="body2" color="text.secondary">Joined</Typography>
            </Box>
          </Grid>
        </Grid>

        <Box mt={3}>
          <Typography variant="subtitle1" gutterBottom>
            Placement Trends
          </Typography>
          <PlacementTrendsChart data={companyDetails?.placementTrends} />
        </Box>
      </CardContent>
    </Card>
  );

  const VisitHistory = () => (
    <Card elevation={1}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Visit History</Typography>
          <Button startIcon={<CalendarToday />} variant="outlined" size="small">
            Schedule Visit
          </Button>
        </Box>
        {tabData.visits.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Visit Date</TableCell>
                <TableCell>Purpose</TableCell>
                <TableCell>Students Attended</TableCell>
                <TableCell>Offers Made</TableCell>
                <TableCell>Avg Package</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tabData.visits.map((visit, index) => (
                <TableRow key={index} hover>
                  <TableCell>{visit.date}</TableCell>
                  <TableCell>{visit.purpose}</TableCell>
                  <TableCell>{visit.studentsAttended}</TableCell>
                  <TableCell>{visit.offersMade}</TableCell>
                  <TableCell>₹{visit.avgPackage?.toLocaleString('en-IN')}</TableCell>
                  <TableCell>
                    <Chip 
                      label={visit.status} 
                      color={visit.status === 'completed' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            minHeight="200px"
          >
            <Typography color="text.secondary">
              No visit history available
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const JobProfiles = () => (
    <Card elevation={1}>
        <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Job Profiles</Typography>
                <Button startIcon={<Work />} variant="outlined" size="small">
                    Add Profile
                </Button>
            </Box>
            {tabData.jobProfiles?.length > 0 ? (
                <Grid container spacing={2}>
                    {tabData.jobProfiles.map((jnf) => (
                        // Map through each job profile in the JNF
                        jnf.jobProfiles.map((profile, index) => (
                            <Grid item xs={12} md={6} key={`${jnf.id}-${index}`}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {profile.designation}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {profile.course?.toUpperCase()}
                                        </Typography>
                                        <Divider sx={{ my: 1 }} />
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Typography variant="caption" color="text.secondary">Package (LPA)</Typography>
                                                <Typography variant="body2">₹{profile.ctc?.toLocaleString('en-IN')}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="caption" color="text.secondary">Job Type</Typography>
                                                <Typography variant="body2">{profile.jobType?.toUpperCase()}</Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="caption" color="text.secondary">Location</Typography>
                                                <Typography variant="body2">{profile.placeOfPosting}</Typography>
                                            </Grid>
                                            {profile.stipend && (
                                                <Grid item xs={6}>
                                                    <Typography variant="caption" color="text.secondary">Stipend</Typography>
                                                    <Typography variant="body2">₹{profile.stipend}</Typography>
                                                </Grid>
                                            )}
                                            <Grid item xs={12}>
                                                <Box mt={1}>
                                                    <Chip 
                                                        label={`CGPA: ${jnf.eligibilityCriteria.minCgpa}`}
                                                        size="small"
                                                        sx={{ mr: 1 }}
                                                    />
                                                    <Chip 
                                                        label={`Backlogs: ${jnf.eligibilityCriteria.backlogAllowed}`}
                                                        size="small"
                                                    />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                        <Box mt={2}>
                                            <Typography variant="caption" color="text.secondary">
                                                Selection Process
                                            </Typography>
                                            <Box display="flex" gap={1} flexWrap="wrap" mt={0.5}>
                                                {jnf.selectionProcess?.[0]?.rounds.map((round, idx) => (
                                                    <Chip 
                                                        key={idx}
                                                        label={round.type.replace(/([A-Z])/g, ' $1').trim()}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ))}
                </Grid>
            ) : (
                <Box 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    minHeight="200px"
                >
                    <Typography color="text.secondary">
                        No job profiles available
                    </Typography>
                </Box>
            )}
        </CardContent>
    </Card>
);

  const PlacedStudents = () => (
    <Card elevation={1}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h6">Placed Students</Typography>
            <Typography variant="body2" color="text.secondary">
              Total Placed: {tabData.placedStudents.length} students
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Button 
              startIcon={<FileDownload />} 
              variant="outlined" 
              size="small"
            >
              Export Data
            </Button>
          </Box>
        </Box>

        {tabData.placedStudents.length > 0 ? (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Roll No.</TableCell>
                  <TableCell>Branch</TableCell>
                  <TableCell>Batch</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Package (LPA)</TableCell>
                  <TableCell>Joining Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tabData.placedStudents.map((student, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar 
                          src={student.photo} 
                          alt={student.name}
                          sx={{ width: 32, height: 32 }}
                        >
                          {student.name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">
                            {student.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {student.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{student.rollNo}</TableCell>
                    <TableCell>
                      <Chip 
                        label={student.branch} 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{student.batch}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {student.position}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {student.department}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        ₹{(student.package || 0).toLocaleString('en-IN')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(student.joiningDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={student.status} 
                        color={getStatusColor(student.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="View Details">
                          <IconButton size="small" color="primary">
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download Offer Letter">
                          <IconButton size="small" color="success">
                            <Description fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Pagination 
                count={Math.ceil(tabData.placedStudents.length / 10)} 
                color="primary" 
                size="small"
              />
            </Box>
          </>
        ) : (
          <Box 
            display="flex" 
            flexDirection="column"
            alignItems="center" 
            justifyContent="center" 
            minHeight="200px"
            gap={2}
          >
            <WorkOff sx={{ fontSize: 48, color: 'text.secondary' }} />
            <Typography color="text.secondary">
              No students have been placed in this company yet
            </Typography>
            <Button 
              variant="outlined" 
              size="small"
              startIcon={<Add />}
            >
              Add Placed Student
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const ApplicationsTab = () => (
    <Card elevation={1}>
        <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Applications</Typography>
                <Box>
                    <Button 
                        startIcon={<FileDownload />} 
                        variant="outlined" 
                        size="small"
                        sx={{ mr: 1 }}
                    >
                        Export
                    </Button>
                    <Button 
                        startIcon={<FilterList />} 
                        variant="outlined" 
                        size="small"
                    >
                        Filter
                    </Button>
                </Box>
            </Box>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Student Name</TableCell>
                        <TableCell>Roll No</TableCell>
                        <TableCell>Applied For</TableCell>
                        <TableCell>Applied Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Current Round</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {applications.map((application) => (
                        <TableRow key={application.studentId} hover>
                            <TableCell>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Avatar src={application.photo}>
                                        {application.name?.charAt(0)}
                                    </Avatar>
                                    <Typography variant="body2">
                                        {application.name}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>{application.rollNo}</TableCell>
                            <TableCell>{application.position}</TableCell>
                            <TableCell>
                                {new Date(application.appliedDate).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </TableCell>
                            <TableCell>
                                <Chip 
                                    label={application.offerDetails?.status || 'Pending'}
                                    color={getApplicationStatusColor(application.offerDetails?.status)}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>
                                {application.currentRound ? (
                                    <Box>
                                        <Typography variant="body2">
                                            {application.currentRound.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {application.currentRound.status}
                                        </Typography>
                                    </Box>
                                ) : (
                                    'Not Started'
                                )}
                            </TableCell>
                            <TableCell>
                                <Box display="flex" gap={1}>
                                    <Tooltip title="View Application">
                                        <IconButton 
                                            size="small"
                                            onClick={() => handleViewApplication(application)}
                                        >
                                            <Visibility fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    {application.documents?.length > 0 && (
                                        <Tooltip title="View Documents">
                                            <IconButton 
                                                size="small"
                                                onClick={() => handleViewDocuments(application)}
                                            >
                                                <Description fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {applications.length === 0 && (
                <Box 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    minHeight="200px"
                >
                    <Typography color="text.secondary">
                        No applications found
                    </Typography>
                </Box>
            )}
        </CardContent>
    </Card>
);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle>
        {isEditMode ? 'Edit Company' : 'Company Details'}
      </DialogTitle>
      
      <DialogContent>
        {isEditMode ? (
          <CompanyForm 
            initialData={companyDetails || company}
            onSubmit={handleUpdate}
            onCancel={onClose}
          />
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={currentTab} 
                onChange={(e, v) => setCurrentTab(v)}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab icon={<Business />} label="Overview" />
                <Tab icon={<Timeline />} label="Visit History" />
                <Tab icon={<Work />} label="Job Profiles" />
                <Tab icon={<Group />} label="Placed Students" />
                <Tab icon={<Business />} label="Applications" />
              </Tabs>
            </Box>

            <Box sx={{ mt: 2 }}>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {currentTab === 0 && <CompanyOverview />}
                  {currentTab === 1 && <VisitHistory />}
                  {currentTab === 2 && <JobProfiles />}
                  {currentTab === 3 && <PlacedStudents />}
                  {currentTab === 4 && <ApplicationsTab />}
                </>
              )}
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'joined':
      return 'success';
    case 'offer_accepted':
      return 'info';
    case 'pending':
      return 'warning';
    case 'declined':
      return 'error';
    default:
      return 'default';
  }
};

const getApplicationStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'accepted':
      return 'success';
    case 'pending':
      return 'warning';
    case 'rejected':
      return 'error';
    case 'withdrawn':
      return 'default';
    default:
      return 'info';
  }
};

export default CompanyDetails;