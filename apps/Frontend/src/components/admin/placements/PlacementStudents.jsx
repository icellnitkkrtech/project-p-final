import React, { useState } from "react";
import {
  Tabs, Tab, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Checkbox
} from "@mui/material";

const StudentTable = ({ title, students = [], selectable = false, selectedStudents = [], onSelect, onSelectAll }) => (
  <TableContainer >
    <Typography variant="h5" sx={{ p: 2 }}>{title}</Typography>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            {selectable && <Checkbox size="small" onChange={onSelectAll} />}
          </TableCell>
          {!selectable && (
              <TableCell></TableCell> 
              )}
          <TableCell >ID</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Branch</TableCell>
          <TableCell>CGPA</TableCell>
          <TableCell>Backlogs</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {students.length > 0 ? (
          students.map((student) => (
            <TableRow key={student.studentId}>
              <TableCell>
                {selectable && (
                  <Checkbox
                    size="small"
                    checked={selectedStudents.some((s) => s.studentId === student.studentId)}
                    onChange={() => onSelect(student)}
                  />
                )}
              </TableCell>
              {!selectable && (
              <TableCell></TableCell> 
              )}
              <TableCell>{student.studentId}</TableCell>
              <TableCell>{student.studentName}</TableCell>
              <TableCell>{student.studentEmail}</TableCell>
              <TableCell>{student.studentBranch}</TableCell>
              <TableCell>{student.studentCgpa}</TableCell>
              <TableCell>{student.studentBacklogs}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} align="center">
              No students found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

const PlacementStudents = ({ appliedStudents = [], appearedStudents = [], selectedStudents = [] }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [updatedSelectedStudents, setUpdatedSelectedStudents] = useState(selectedStudents);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleToggleStudent = (student) => {
    setUpdatedSelectedStudents((prev) =>
      prev.some((s) => s.studentId === student.studentId)
        ? prev.filter((s) => s.studentId !== student.studentId)
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

  return (
    <Box sx={{ width: "100%", margin: "auto", mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Applied" />
          <Tab label="Appeared" />
          <Tab label="Selected" />
        </Tabs>
        {tabIndex === 1 && (
          <Button variant="contained" color="primary" onClick={() => setIsUpdating(!isUpdating)}>
            {isUpdating ? "Confirm" : "Select"}
          </Button>
        )}
      </Box>

      {tabIndex === 0 && (
        <StudentTable students={appliedStudents} />
      )}
      {tabIndex === 1 && (
        <StudentTable
          students={appearedStudents}
          selectable={isUpdating}
          selectedStudents={updatedSelectedStudents}
          onSelect={handleToggleStudent}
          onSelectAll={handleSelectAll}
        />
      )}
      {tabIndex === 2 && <StudentTable students={updatedSelectedStudents} />}
    </Box>
  );
};

export default PlacementStudents;
