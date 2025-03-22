import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Typography, Checkbox } from "@mui/material";

const StudentTable = ({ title, students = [], selectable = false, selectedStudents = [], onSelect, onSelectAll }) => {
  console.log(`Rendering ${title}:`, { students, selectedStudents });

  if (!Array.isArray(students)) {
    console.error(`Error: students should be an array but got:`, students);
  }

  return (
    <TableContainer component={Paper}>
      <Typography variant="h5" sx={{ p: 2 }}>
        {title}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            {selectable && (
              <TableCell padding="checkbox">
                <Checkbox
                  checked={students.length > 0 && students.every((id) => selectedStudents.includes(id))}
                  indeterminate={
                    students.some((id) => selectedStudents.includes(id)) &&
                    !students.every((id) => selectedStudents.includes(id))
                  }
                  onChange={onSelectAll}
                  inputProps={{ "aria-label": "select all students" }}
                />
              </TableCell>
            )}
            <TableCell>Student ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} align="center">
                No students available
              </TableCell>
            </TableRow>
          ) : (
            students.map((studentId, index) => (
              <TableRow key={studentId || index}>
                {selectable && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedStudents.includes(studentId)}
                      onChange={() => onSelect(studentId)}
                      inputProps={{ "aria-label": `select student ${studentId}` }}
                    />
                  </TableCell>
                )}
                <TableCell>{studentId}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudentTable;
