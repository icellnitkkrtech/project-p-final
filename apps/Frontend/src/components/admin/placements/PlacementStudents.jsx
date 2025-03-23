import React, { useState, useEffect } from "react";
import {
  Tabs, Tab, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Checkbox
} from "@mui/material";
import placementService from "../../../services/admin/placementService";

const StudentTable = ({ title, students = [], selectable = false, selectedStudents = [], onSelect, onSelectAll }) => (
  <TableContainer>
    <Typography variant="h5" sx={{ p: 2 }}>{title}</Typography>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            {selectable && <Checkbox size="small" onChange={onSelectAll} />}
          </TableCell>
          {!selectable && <TableCell></TableCell>}
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
              <TableCell>
                {selectable && (
                  <Checkbox
                    size="small"
                    checked={selectedStudents.some((s) => s._id === student._id)}
                    onChange={() => onSelect(student)}
                  />
                )}
              </TableCell>
              {!selectable && <TableCell></TableCell>}
              <TableCell>{student.personalInfo.rollNumber}</TableCell>
              <TableCell>{student.personalInfo.name}</TableCell>
              <TableCell>{student.personalInfo.department}</TableCell>
              <TableCell>{student.academics.cgpa}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} align="center">
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
  const [updatedSelectedStudents, setUpdatedSelectedStudents] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [appliedStudents, setAppliedStudents] = useState([]);
  const [appearedStudents, setAppearedStudents] = useState([]);

  useEffect(() => {
    const fetchAppliedStudents = async () => {
      try {
        const response = await placementService.getApplicants(placementId);
        if (response.data && response.data.applicantStudents) {
          setAppliedStudents(response.data.applicantStudents);
        }
      } catch (error) {
        console.error('Error fetching applied students:', error);
      }
    };

    if (placementId) {
      fetchAppliedStudents();
    }
  }, [placementId]);

  useEffect(() => {
    const fetchAppearedStudents = async () => {
      try {
        const response = await placementService.getAppearedStudents(placementId);
        if (response.data && response.data.appearedStudents) {
          setAppearedStudents(response.data.appearedStudents);
        }
      } catch (error) {
        console.error('Error fetching appeared students:', error);
      }
    };

    if (placementId) {
      fetchAppearedStudents();
    }
  }, [placementId]);

  useEffect(() => {
    const fetchSelectedStudents = async () => {
      try {
        const response = await placementService.getSelectedStudents(placementId);
        if (response.data && response.data.selectedStudents) {
          setSelectedStudents(response.data.selectedStudents);
          setUpdatedSelectedStudents(response.data.selectedStudents);
        }
      } catch (error) {
        console.error('Error fetching selected students:', error);
      }
    };

    if (placementId) {
      fetchSelectedStudents();
    }
  }, [placementId]);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleToggleStudent = (student) => {
    setUpdatedSelectedStudents((prev) =>
      prev.some((s) => s._id === student._id)
        ? prev.filter((s) => s._id !== student._id)
        : [...prev, student]
    );
  };

  const handleSelectAll = () => {
    const students = appearedStudents;
    if (updatedSelectedStudents.length === students.length) {
      setUpdatedSelectedStudents([]);
    } else {
      setUpdatedSelectedStudents(students);
    }
  };

  const handleSelectionConfirm = async () => {
    try {
      await placementService.updateSelectedStudents(placementId, updatedSelectedStudents);
      setSelectedStudents(updatedSelectedStudents);
      setIsUpdating(false);
    } catch (error) {
      console.error('Error updating selected students:', error);
    }
  };

  return (
    <Box sx={{ width: "100%", margin: "auto", mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
          <Tab label={`Applied (${appliedStudents.length})`} />
          <Tab label={`Appeared (${appearedStudents.length})`} />
          <Tab label={`Selected (${selectedStudents.length})`} />
        </Tabs>
        {tabIndex === 1 && (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => {
              if (isUpdating) {
                handleSelectionConfirm();
              } else {
                setIsUpdating(true);
              }
            }}
          >
            {isUpdating ? "Confirm" : "Select"}
          </Button>
        )}
      </Box>

      {tabIndex === 0 && (
        <StudentTable 
          title="Applied Students" 
          students={appliedStudents} 
        />
      )}
      {tabIndex === 1 && (
        <StudentTable
          title="Appeared Students"
          students={appearedStudents}
          selectable={isUpdating}
          selectedStudents={updatedSelectedStudents}
          onSelect={handleToggleStudent}
          onSelectAll={handleSelectAll}
        />
      )}
      {tabIndex === 2 && (
        <StudentTable 
          title="Selected Students" 
          students={selectedStudents} 
        />
      )}
    </Box>
  );
};

export default PlacementStudents;
