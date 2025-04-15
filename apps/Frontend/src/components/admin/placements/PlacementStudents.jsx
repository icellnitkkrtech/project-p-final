import React, { useState, useEffect } from "react";
import {
  Tabs, Tab, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, CircularProgress, Alert, TablePagination
} from "@mui/material";
import {
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Numbers as NumbersIcon,
  Engineering as EngineeringIcon,
  Grade as GradeIcon,
  Error as ErrorIcon,
  School as SchoolIcon
} from "@mui/icons-material";
import placementService from "../../../services/admin/placementService";

const StudentTable = ({ title, students = [], loading = false, error = null }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
            <TableCell 
              sx={{ 
                fontWeight: 600,
                backgroundColor: 'background.paper',
                color: 'primary.main'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NumbersIcon fontSize="small" />
                S.No
              </Box>
            </TableCell>
            <TableCell 
              sx={{ 
                fontWeight: 600,
                backgroundColor: 'background.paper',
                color: 'primary.main'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NumbersIcon fontSize="small" />
                Roll Number
              </Box>
            </TableCell>
            <TableCell 
              sx={{ 
                fontWeight: 600,
                backgroundColor: 'background.paper',
                color: 'primary.main'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon fontSize="small" />
                Name
              </Box>
            </TableCell>
            <TableCell 
              sx={{ 
                fontWeight: 600,
                backgroundColor: 'background.paper',
                color: 'primary.main'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EngineeringIcon fontSize="small" />
                Department
              </Box>
            </TableCell>
            <TableCell 
              sx={{ 
                fontWeight: 600,
                backgroundColor: 'background.paper',
                color: 'primary.main'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SchoolIcon fontSize="small" />
                Batch
              </Box>
            </TableCell>
            <TableCell 
              sx={{ 
                fontWeight: 600,
                backgroundColor: 'background.paper',
                color: 'primary.main'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GradeIcon fontSize="small" />
                CGPA
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              </TableCell>
            </TableRow>
          ) : students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
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
                  <TableCell>{index + 1 + (page * rowsPerPage)}</TableCell>
                  <TableCell>{student.personalInfo?.rollNumber}</TableCell>
                  <TableCell>{student.personalInfo?.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={student.personalInfo?.department} 
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={student.personalInfo?.batch} 
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={student.academics?.cgpa} 
                      color="primary"
                      size="small"
                    />
                  </TableCell>
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

const PlacementStudents = ({ placementId }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [appliedStudents, setAppliedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [appliedResponse, selectedResponse] = await Promise.all([
          placementService.getApplicants(placementId),
          placementService.getSelectedStudents(placementId)
        ]);

        setAppliedStudents(appliedResponse.applicantStudents || []);
        setSelectedStudents(selectedResponse.selectedStudents || []);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Failed to fetch students data');
      } finally {
        setLoading(false);
      }
    };

    if (placementId) {
      fetchData();
    }
  }, [placementId]);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

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
            label={`Applied (${appliedStudents.length})`} 
            iconPosition="start"
          />
          <Tab 
            icon={<CheckCircleIcon />} 
            label={`Selected (${selectedStudents.length})`} 
            iconPosition="start"
          />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabIndex === 0 && (
            <StudentTable 
              title="Applied Students" 
              students={appliedStudents}
              loading={loading}
              error={error}
            />
          )}
          {tabIndex === 1 && (
            <StudentTable 
              title="Selected Students" 
              students={selectedStudents}
              loading={loading}
              error={error}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PlacementStudents;
