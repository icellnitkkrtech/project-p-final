import { useState } from 'react';
import { Grid, Box, Tabs, Tab, Paper } from '@mui/material';
import StudentList from '../../components/admin/students/StudentList';
import StudentRegistration from '../../components/admin/students/StudentRegistration';
import StudentBulkUpload from '../../components/admin/students/StudentBulkUpload';
import StudentAnalytics from '../../components/admin/students/StudentAnalytics';
import StudentDetailsView from '../../components/admin/students/StudentDetailsView';
import StudentProfileManager from '../../components/admin/students/StudentProfileManager';
import { useSearchParams } from 'react-router-dom';

const Students = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = parseInt(searchParams.get('tab') || '0');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleTabChange = (event, newValue) => {
    setSearchParams({ tab: newValue.toString() });
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setActiveTab(-1); // Custom value for details view
  };
  
  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = (updatedData) => {
    // Handle save logic
    studentService.updateStudent(selectedStudent.id, updatedData).then(() => {
      console.log('Profile updated:', updatedData);
      setIsEditing(false);
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <Box>
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={selectedStudent ? -1 : currentTab} 
          onChange={handleTabChange}
        >
          <Tab label="All Students" />
          <Tab label="Add Student" />
          <Tab label="Bulk Upload" />
          <Tab label="Analytics" />
        </Tabs>
      </Paper>

      {selectedStudent ? (
        isEditing ? (
          <StudentDetailsView
          studentId={selectedStudent.id}
          onEdit={handleEditProfile}
          onBack={() => setSelectedStudent(null)}
        />
        ) : 
        (
          <StudentDetailsView
            studentId={selectedStudent.id}
            onEdit={handleEditProfile}
            onBack={() => setSelectedStudent(null)}
          />
        )
      ) : (
        <>
          {currentTab === 0 && <StudentList onStudentSelect={handleStudentSelect} />}
          {currentTab === 1 && <StudentRegistration />}
          {currentTab === 2 && <StudentBulkUpload />}
          {currentTab === 3 && <StudentAnalytics />}
        </>
      )}
    </Box>
  );
};

export default Students;