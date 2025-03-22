import { useState, useEffect } from "react";
import { Grid, Box, Tabs, Tab, Paper } from "@mui/material";
import StudentList from "../../components/admin/students/StudentList";
import StudentRegistration from "../../components/admin/students/StudentRegistration";
import StudentBulkUpload from "../../components/admin/students/StudentBulkUpload";
import StudentAnalytics from "../../components/admin/students/StudentAnalytics";
import StudentDetailsView from "../../components/admin/students/StudentDetailsView";
import StudentProfileManager from "../../components/admin/students/StudentProfileManager";
import { useSearchParams } from "react-router-dom";
import studentService from "../../services/admin/studentService";
import StudentCGPABulkUpload from "../../components/admin/students/StudentCGPABulkUpload";
const Students = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = parseInt(searchParams.get("tab") || "0");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Add handleStudentSelect function
  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };

  // Handle profile click from student list
  const handleProfileClick = async (studentId) => {
    try {
      // Fetch complete student details
      const studentData = await studentService.getStudentById(studentId);
      setSelectedStudent(studentData);
      // Store current tab in URL before switching to details view
      setSearchParams({
        tab: currentTab.toString(),
        view: "details",
        studentId: studentId,
      });
    } catch (error) {
      console.error("Error fetching student details:", error);
      // Handle error (show notification, etc.)
    }
  };

  const handleTabChange = (event, newValue) => {
    setSearchParams({ tab: newValue.toString() });
    // Clear selected student when switching tabs
    setSelectedStudent(null);
  };

  const handleBackToList = () => {
    setSelectedStudent(null);
    setIsEditing(false);
    // Remove student details from URL and return to previous tab
    setSearchParams({ tab: currentTab.toString() });
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      await studentService.updateStudent(selectedStudent.id, updatedData);
      // Refresh student data after update
      const refreshedData = await studentService.getStudentById(
        selectedStudent.id
      );
      setSelectedStudent(refreshedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating student profile:", error);
      // Handle error (show notification, etc.)
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // Check URL for student details view
  useEffect(() => {
    const viewType = searchParams.get("view");
    const studentId = searchParams.get("studentId");

    if (viewType === "details" && studentId && !selectedStudent) {
      handleProfileClick(studentId);
    }
  }, [searchParams]);

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
          <Tab label="CGPA Update" />
        </Tabs>
      </Paper>

      {selectedStudent ? (
        <Box>
          <StudentDetailsView
            studentId={selectedStudent.id}
            student={selectedStudent}
            onEdit={handleEditProfile}
            onBack={handleBackToList}
            isEditing={isEditing}
            onSave={handleSaveProfile}
            onCancelEdit={handleCancelEdit}
          />
        </Box>
      ) : (
        <>
          {currentTab === 0 && (
            <StudentList
              onStudentSelect={handleStudentSelect}
              onProfileClick={handleProfileClick}
            />
          )}
          {currentTab === 1 && <StudentRegistration />}
          {currentTab === 2 && <StudentBulkUpload />}
          {currentTab === 3 && <StudentAnalytics />}
          {currentTab === 4 && <StudentCGPABulkUpload />}
        </>
      )}
    </Box>
  );
};

export default Students;
