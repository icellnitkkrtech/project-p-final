import { useEffect, useState } from "react";
import { 
  Box, 
  Paper, 
  Tabs, 
  Tab, 
  Typography, 
  Button, 
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton
} from "@mui/material";
import { 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Checkbox,
  TablePagination
} from "@mui/material";
import {
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Group as GroupIcon,
  Update as UpdateIcon,
  Error as ErrorIcon
} from "@mui/icons-material";
import placementService from "../../../services/admin/placementService";

const StudentTable = ({ 
  title, 
  students = [], 
  selectable = false, 
  selectedStudents = [], 
  onSelect, 
  onSelectAll,
  loading = false
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (student) => {
    if (selectedStudents.includes(student._id)) {
      return (
        <Chip
          icon={<CheckCircleIcon />}
          label="Selected"
          color="success"
          size="small"
        />
      );
    }
    return null;
  };

  return (
    <TableContainer 
      sx={{ 
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        '& .MuiTableHead-root': {
          backgroundColor: 'background.paper',
        },
        '& .MuiTableCell-root': {
          borderColor: 'divider',
        },
        '& .MuiTableRow-root:hover': {
          backgroundColor: 'action.hover',
        }
      }}
    >
      <Table>
        <TableHead
          sx={{
            '& .MuiTableRow-root': {
              borderBottom: '2px solid',
              borderColor: 'primary.main'
            }
          }}
        >
          <TableRow>
            {selectable && (
              <TableCell 
                padding="checkbox"
                sx={{ 
                  backgroundColor: 'background.paper'
                }}
              >
                <Checkbox
                  checked={students.length > 0 && selectedStudents.length === students.length}
                  indeterminate={selectedStudents.length > 0 && selectedStudents.length < students.length}
                  onChange={onSelectAll}
                  inputProps={{ "aria-label": "select all students" }}
                />
              </TableCell>
            )}
            <TableCell 
              sx={{ 
                fontWeight: 600,
                backgroundColor: 'background.paper',
                color: 'primary.main'
              }}
            >S.No</TableCell>
            <TableCell 
              sx={{ 
                fontWeight: 600,
                backgroundColor: 'background.paper',
                color: 'primary.main'
              }}
            >Roll Number</TableCell>
            <TableCell 
              sx={{ 
                fontWeight: 600,
                backgroundColor: 'background.paper',
                color: 'primary.main'
              }}
            >Name</TableCell>
            <TableCell 
              sx={{ 
                fontWeight: 600,
                backgroundColor: 'background.paper',
                color: 'primary.main'
              }}
            >Department</TableCell>
            <TableCell 
              sx={{ 
                fontWeight: 600,
                backgroundColor: 'background.paper',
                color: 'primary.main'
              }}
            >Batch</TableCell>
            <TableCell 
              sx={{ 
                fontWeight: 600,
                backgroundColor: 'background.paper',
                color: 'primary.main'
              }}
            >CGPA</TableCell>
            <TableCell 
              sx={{ 
                fontWeight: 600,
                backgroundColor: 'background.paper',
                color: 'primary.main'
              }}
            >Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={selectable ? 8 : 7} align="center">
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              </TableCell>
            </TableRow>
          ) : students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={selectable ? 8 : 7} align="center">
                <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <PersonIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                  <Typography color="text.secondary">No students available</Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            students
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((student, index) => (
                <TableRow 
                  key={student._id}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedStudents.includes(student._id)}
                        onChange={() => onSelect(student._id)}
                        inputProps={{ "aria-label": `select student ${student._id}` }}
                      />
                    </TableCell>
                  )}
                  <TableCell>{index + 1 + (page * rowsPerPage)}</TableCell>
                  <TableCell>{student.personalInfo?.rollNumber}</TableCell>
                  <TableCell>{student.personalInfo?.name}</TableCell>
                  <TableCell>{student.personalInfo?.department}</TableCell>
                  <TableCell>{student.personalInfo?.batch}</TableCell>
                  <TableCell>{student.academics?.cgpa}</TableCell>
                  <TableCell>{getStatusChip(student)}</TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={students.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      />
    </TableContainer>
  );
};

const RoundStudents = ({ placementId, roundId, selectable = false, onSelectionChange }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [appliedStudents, setAppliedStudents] = useState([]);
  const [appearedStudents, setAppearedStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [updatedSelectedStudents, setUpdatedSelectedStudents] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const [applied, appeared, selected] = await Promise.all([
          placementService.getApplicantsForRound(placementId, roundId),
          placementService.getAppearedStudentsForRound(placementId, roundId),
          placementService.getSelectedStudentsForRound(placementId, roundId),
        ]);

        setAppliedStudents(applied || []);
        setAppearedStudents(appeared || []);
        setSelectedStudents(selected || []);
        setUpdatedSelectedStudents((selected || []).map(student => student._id));
      } catch (err) {
        setError(err.message || "Failed to fetch students data");
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };

    if (placementId && roundId) {
      fetchStudents();
    }
  }, [placementId, roundId]);

  const handleTabChange = (_event, newValue) => {
    setTabIndex(newValue);
  };

  const handleSelectStudent = (studentId) => {
    setUpdatedSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const handleSelectAll = (event) => {
    setUpdatedSelectedStudents(event.target.checked ? appearedStudents.map(s => s._id) : []);
  };

  const handleUpdateSelected = async () => {
    setIsUpdating(true);
    try {
      await placementService.updateSelectedStudents(placementId, roundId, updatedSelectedStudents);
      const updatedSelected = await placementService.getSelectedStudentsForRound(placementId, roundId);
      setSelectedStudents(updatedSelected);
    } catch (err) {
      setError(err.message || "Failed to update selected students");
      console.error("Error updating selected students:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        <ErrorIcon sx={{ mr: 1 }} />
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          centered
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 60,
              textTransform: 'none',
              fontSize: '1rem'
            }
          }}
        >
          <Tab 
            icon={<PersonIcon />} 
            label="Applied Students" 
            iconPosition="start"
          />
          <Tab 
            icon={<GroupIcon />} 
            label="Appeared Students" 
            iconPosition="start"
          />
          <Tab 
            icon={<CheckCircleIcon />} 
            label="Selected Students" 
            iconPosition="start"
          />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabIndex === 0 && (
            <StudentTable 
              title="Applied Students" 
              students={appliedStudents} 
              loading={loading}
            />
          )}
          
          {tabIndex === 1 && (
            <Box>
              <StudentTable
                title="Appeared Students"
                students={appearedStudents}
                selectable
                selectedStudents={updatedSelectedStudents}
                onSelect={handleSelectStudent}
                onSelectAll={handleSelectAll}
                loading={loading}
              />
              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Chip 
                  label={`${updatedSelectedStudents.length} selected`} 
                  color="primary"
                  variant="outlined"
                />
                <Tooltip title="Update selected students">
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleUpdateSelected}
                    disabled={loading}
                    sx={{ 
                      minWidth: 150,
                      textTransform: 'none'
                    }}
                  >
                    {loading ? "Updating..." : "Update Selected"}
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          )}
          
          {tabIndex === 2 && (
            <StudentTable 
              title="Selected Students" 
              students={selectedStudents} 
              loading={loading}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default RoundStudents;
