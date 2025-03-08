import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Tabs,
  Tab,
  Button,
  Avatar,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Edit,
  Delete,
  Mail,
  Phone,
  LocationOn,
  School,
  Work,
  Assignment,
  Assessment,
  Person,
  Download,
  Block,
  CheckCircle
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import studentService from '../../../services/admin/studentService';

const StudentDetailsView = ({ studentId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      const data = await studentService.getStudentById(studentId);
      setStudent(data);
    };
    fetchStudent();
  }, [studentId]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAction = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleDeleteDocument = async (documentId) => {
    await studentService.deleteDocument(studentId, documentId);
    setStudent((prev) => ({
      ...prev,
      documents: prev.documents.filter((doc) => doc.id !== documentId)
    }));
  };

  const renderPersonalInfo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Box textAlign="center">
          <Avatar
            src={student.photo}
            sx={{ width: 150, height: 150, margin: 'auto' }}
          />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {student.name}
          </Typography>
          <Typography color="textSecondary">
            {student.rollNo}
          </Typography>
          <Box mt={2}>
            <Chip
              label={student.status}
              color={student.status === 'active' ? 'success' : 'error'}
            />
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={8}>
        <Table>
          <TableBody>
          
            <TableRow>
              <TableCell><strong>Batch</strong></TableCell>
              <TableCell>{student.batch}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Branch</strong></TableCell>
              <TableCell>{student.branch}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Current Semester</strong></TableCell>
              <TableCell>{student.semester}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell>{student.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell>{student.phone}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );

  const renderAcademics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Semester Performance
        </Typography>
        <Table>
          <TableBody>
            {student.academics.semesters.map((sem) => (
              <TableRow key={sem.semester}>
                <TableCell>Semester {sem.semester}</TableCell>
                <TableCell>SGPA: {sem.sgpa}</TableCell>
                <TableCell>CGPA: {sem.cgpa}</TableCell>
                <TableCell>Backlogs: {sem.backlogs}</TableCell>
                <TableCell>Attendance: {sem.attendance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
      
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Projects
        </Typography>
        {student.academics.projects.map((project, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1">{project.title}</Typography>
              <Typography color="textSecondary">{project.description}</Typography>
              <Box mt={1}>
                <Chip label={project.status} size="small" sx={{ mr: 1 }} />
                <Chip label={`Grade: ${project.grade}`} size="small" />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Grid>
  );

  const renderPlacement = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Placement Status
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Chip
                label={student.placementStatus}
                color={student.placementStatus === 'Placed' ? 'success' : 'default'}
              />
              {student.currentPackage && (
                <Typography>Package: {student.currentPackage}</Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Skills & Certifications
        </Typography>
        <Box mb={2}>
          {student.skills.map((skill) => (
            <Chip key={skill} label={skill} sx={{ mr: 1, mb: 1 }} />
          ))}
        </Box>
        
        <Table>
          <TableBody>
            {student.certifications.map((cert, index) => (
              <TableRow key={index}>
                <TableCell>{cert.name}</TableCell>
                <TableCell>{cert.issuer}</TableCell>
                <TableCell>{new Date(cert.date).toLocaleDateString()}</TableCell>
                <TableCell>{cert.credential}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Internships
        </Typography>
        {student.internships.map((internship, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1">{internship.company}</Typography>
              <Typography color="textSecondary">{internship.role}</Typography>
              <Typography variant="body2">
                Duration: {internship.duration} ({internship.year})
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Grid>
  );

  const renderDocuments = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Documents
        </Typography>
        <Table>
          <TableBody>
            {student.documents.map((doc, index) => (
              <TableRow key={index}>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton>
                    <Download />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteDocument(doc.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );

  if (!student) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      {/* Action Buttons */}
      <Box display="flex" justifyContent="flex-end" gap={2} mb={3}>
        <Button
          startIcon={<Edit />}
          variant="outlined"
          onClick={() => handleAction('edit')}
        >
          Edit Profile
        </Button>
        <Button
          startIcon={<Mail />}
          variant="outlined"
          onClick={() => handleAction('email')}
        >
          Send Email
        </Button>
        <Button
          startIcon={student.status === 'active' ? <Block /> : <CheckCircle />}
          variant="outlined"
          color={student.status === 'active' ? 'error' : 'success'}
          onClick={() => handleAction('status')}
        >
          {student.status === 'active' ? 'Deactivate' : 'Activate'}
        </Button>
      </Box>

      {/* Main Content */}
      <Card>
        <CardContent>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Personal Info" />
            <Tab label="Academics" />
            <Tab label="Placement" />
            <Tab label="Documents" />
            <Tab label="Activities" />
          </Tabs>

          {activeTab === 0 && renderPersonalInfo()}
          {activeTab === 1 && renderAcademics()}
          {activeTab === 2 && renderPlacement()}
          {activeTab === 3 && renderDocuments()}
          {/* Add more tab content */}
        </CardContent>
      </Card>

      {/* Confirmation Dialogs */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {dialogType === 'status' 
            ? `${student.status === 'active' ? 'Deactivate' : 'Activate'} Student`
            : dialogType === 'email' 
            ? 'Send Email'
            : 'Edit Profile'}
        </DialogTitle>
        <DialogContent>
          {/* Add appropriate content based on dialog type */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentDetailsView;
