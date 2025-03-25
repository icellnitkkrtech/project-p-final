import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Typography, Checkbox } from "@mui/material";

const StudentTable = ({ title, students = [], selectable = false, selectedStudents = [], onSelect, onSelectAll }) => {
  console.log(`Rendering ${title}:`, { students, selectedStudents });

  if (!Array.isArray(students)) {
    console.error(`Error: students should be an array but got:`, students);
    return null;
  }

  return (
    <TableContainer component={Paper}>
      <Typography variant="h5" sx={{ p: 2 }}>
        {title} ({students.length})
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            {selectable && (
              <TableCell padding="checkbox">
                <Checkbox
                  checked={students.length > 0 && selectedStudents.length === students.length}
                  indeterminate={selectedStudents.length > 0 && selectedStudents.length < students.length}
                  onChange={onSelectAll}
                  inputProps={{ "aria-label": "select all students" }}
                />
              </TableCell>
            )}
            <TableCell>S.No</TableCell>
            <TableCell>Roll Number</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Batch</TableCell>
            <TableCell>CGPA</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={selectable ? 7 : 6} align="center">
                No students available
              </TableCell>
            </TableRow>
          ) : (
            students.map((student, index) => (
              <TableRow key={student._id}>
                {selectable && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedStudents.includes(student._id)}
                      onChange={() => onSelect(student._id)}
                      inputProps={{ "aria-label": `select student ${student._id}` }}
                    />
                  </TableCell>
                )}
                <TableCell>{index + 1}</TableCell>
                <TableCell>{student.personalInfo?.rollNumber}</TableCell>
                <TableCell>{student.personalInfo?.name}</TableCell>
                <TableCell>{student.personalInfo?.department}</TableCell>
                <TableCell>{student.personalInfo?.batch}</TableCell>
                <TableCell>{student.academics?.cgpa}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudentTable;
