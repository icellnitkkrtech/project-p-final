import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  Typography,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Paper,
  Divider,
  CircularProgress
} from '@mui/material';
import { Close, School, Work, Person } from '@mui/icons-material';
import studentService from '../../../services/admin/studentService';

const StudentDetailsView = ({ studentId, onClose }) => {
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await studentService.getStudentById(studentId);
        if (response.statusCode === 200) {
          setStudent(response.data);
        }
      } catch (error) {
        console.error('Error fetching student:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  const renderPersonalInfo = () => (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
          <Avatar
            src={student?.personalInfo?.photo}
            sx={{ 
              width: 150, 
              height: 150, 
              margin: 'auto',
              border: '3px solid',
              borderColor: 'primary.main' 
            }}
          />
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
            {student?.personalInfo?.name}
          </Typography>
          <Chip 
            label={student?.personalInfo?.rollNumber}
            color="primary"
            sx={{ mt: 1 }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 3,
            '& .MuiTypography-subtitle2': {
              color: 'text.secondary',
              mb: 0.5
            }
          }}>
            <Box>
              <Typography variant="subtitle2">Department</Typography>
              <Typography variant="body1" fontWeight={500}>
                {student?.personalInfo?.department}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">Batch</Typography>
              <Typography variant="body1" fontWeight={500}>
                {student?.personalInfo?.batch}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">gender</Typography>
              <Typography variant="body1" fontWeight={500}>
                {student?.personalInfo?.gender}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">Category</Typography>
              <Typography variant="body1" fontWeight={500}>
                {student?.personalInfo?.category}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderAcademicInfo = () => (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3
          }}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.neutral' }}>
              <Typography variant="h4" color="primary.main">
                {student?.academics?.cgpa}
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 1 }}>CGPA</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.neutral' }}>
              <Typography variant="h4" color="primary.main">
                {student?.academics?.tenthMarks}%
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 1 }}>10th Marks</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.neutral' }}>
              <Typography variant="h4" color="primary.main">
                {student?.academics?.twelfthMarks}%
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 1 }}>12th Marks</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderPlacementInfo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle2" color="textSecondary">Status</Typography>
        <Typography>{student?.placement?.status}</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle2" color="textSecondary">Offers Received</Typography>
        <Typography>{student?.placement?.offersReceived}</Typography>
      </Grid>
      {student?.placement?.status === 'placed' && (
        <>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">Company</Typography>
            <Typography>{student?.placement?.company}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">Role</Typography>
            <Typography>{student?.placement?.role}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">Package (LPA)</Typography>
            <Typography>{student?.placement?.highestPackage}</Typography>
          </Grid>
        </>
      )}
    </Grid>
  );

  return (
    <Dialog 
      open 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h6">Student Details</Typography>
        <IconButton color="inherit" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                px: 3,
                pt: 2,
                borderBottom: 1,
                borderColor: 'divider'
              }}
            >
              <Tab icon={<Person />} label="Personal" />
              <Tab icon={<School />} label="Academic" />
              <Tab icon={<Work />} label="Placement" />
            </Tabs>
            <Box sx={{ p: 3 }}>
              {activeTab === 0 && renderPersonalInfo()}
              {activeTab === 1 && renderAcademicInfo()}
              {activeTab === 2 && renderPlacementInfo()}
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailsView;
