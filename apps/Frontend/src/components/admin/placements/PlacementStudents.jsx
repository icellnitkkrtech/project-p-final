import React, { useState, useEffect } from "react";
import {
  Tabs, Tab, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Checkbox
} from "@mui/material";
import placementService from "../../../services/admin/placementService";

const StudentTable = ({ title, students = [] }) => (
  <TableContainer>
    <Typography variant="h5" sx={{ p: 2 }}>{title}</Typography>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Roll Number</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Department</TableCell>
          <TableCell>CGPA</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {students.length > 0 ? (
          students.map((student) => (
            <TableRow key={student._id}>
              <TableCell>{student.personalInfo.rollNumber}</TableCell>
              <TableCell>{student.personalInfo.name}</TableCell>
              <TableCell>{student.personalInfo.department}</TableCell>
              <TableCell>{student.academics.cgpa}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} align="center">
              No students found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

const PlacementStudents = ({ placementId }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [appliedStudents, setAppliedStudents] = useState([]);

  useEffect(() => {
    const fetchAppliedStudents = async () => {
      try {
        console.log('Fetching applied students for placementId:', placementId);
        const response = await placementService.getApplicants(placementId);
        const students = response.applicantStudents || [];
        console.log('Applied Students:', students);
        setAppliedStudents(students);
      } catch (error) {
        console.error('Error fetching applied students:', error);
      }
    };

    if (placementId) {
      fetchAppliedStudents();
    } else {
      console.warn('No placementId provided');
    }
  }, [placementId]);

  useEffect(() => {
    const fetchSelectedStudents = async () => {
      try {
        console.log('Fetching selected students for placementId:', placementId);
        const response = await placementService.getSelectedStudents(placementId);
        const students = response.selectedStudents || [];
        console.log('Selected Students:', students);
        setSelectedStudents(students);
      } catch (error) {
        console.error('Error fetching selected students:', error);
      }
    };

    if (placementId) {
      fetchSelectedStudents();
    } else {
      console.warn('No placementId provided');
    }
  }, [placementId]);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Box sx={{ width: "100%", margin: "auto", mt: 4 }}>
      <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
        <Tab label={`Applied (${appliedStudents.length})`} />
        <Tab label={`Selected (${selectedStudents.length})`} />
      </Tabs>

      {tabIndex === 0 && (
        <StudentTable 
          title="Applied Students" 
          students={appliedStudents} 
        />
      )}
      {tabIndex === 1 && (
        <StudentTable 
          title="Selected Students" 
          students={selectedStudents} 
        />
      )}
    </Box>
  );
};

export default PlacementStudents;
