import { useEffect, useState } from "react";
import { Box, Paper, Tabs, Tab, Typography, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Checkbox } from "@mui/material";
import StudentTable from "./StudentTable"; // Ensure this is the correct import
import placementService from "../../../services/admin/placementService";

const RoundStudents = ({ placementId, roundId, selectable = false, onSelectionChange }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [appliedStudents, setAppliedStudents] = useState([]);
  const [appearedStudents, setAppearedStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [updatedSelectedStudents, setUpdatedSelectedStudents] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        console.log("Fetching students for placementId:", placementId, "roundId:", roundId);

        const [applied, appeared, selected] = await Promise.all([
          placementService.getApplicantsForRound(placementId, roundId),
          placementService.getAppearedStudentsForRound(placementId, roundId),
          placementService.getSelectedStudentsForRound(placementId, roundId),
        ]);

        console.log("Fetched Data:", { applied, appeared, selected });

        setAppliedStudents(applied || []);
        setAppearedStudents(appeared || []);
        setSelectedStudents(selected || []);
        setUpdatedSelectedStudents(selected || []);

        console.log("State Updated:", { applied, appeared, selected });
      } catch (err) {
        setError(err.message || "Failed to fetch students data");
        console.error("Error fetching students:", err);
      }
    };

    if (placementId && roundId) {
      fetchStudents();
    } else {
      console.warn("Skipping fetch: Missing placementId or roundId");
    }
  }, [placementId, roundId]);

  const handleTabChange = (_event, newValue) => {
    setTabIndex(newValue);
  };

  const handleStudentSelect = (studentId) => {
    const newSelected = selectedIds.includes(studentId)
      ? selectedIds.filter(id => id !== studentId)
      : [...selectedIds, studentId];
    
    setSelectedIds(newSelected);
    if (onSelectionChange) {
      onSelectionChange(newSelected);
    }
  };

  const handleSelectAll = (event) => {
    const newSelected = event.target.checked ? appearedStudents.map(student => student._id) : [];
    setSelectedIds(newSelected);
    if (onSelectionChange) {
      onSelectionChange(newSelected);
    }
  };

  const handleUpdateSelected = async () => {
    setIsUpdating(true);
    try {
      console.log("Updating selected students:", updatedSelectedStudents);
      await placementService.updateSelectedStudents(roundId, updatedSelectedStudents);
      setSelectedStudents(updatedSelectedStudents);
    } catch (err) {
      setError(err.message || "Failed to update selected students");
      console.error("Error updating selected students:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Paper elevation={3}>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="Applied Students" />
          <Tab label="Appeared Students" />
          {!selectable && <Tab label="Selected Students" />}
        </Tabs>

        <Box sx={{ p: 2 }}>
          {tabIndex === 0 && (
            <StudentTable 
              title="Applied Students" 
              students={appliedStudents}
              selectable={selectable}
              selectedStudents={selectedIds}
              onSelect={handleStudentSelect}
              onSelectAll={handleSelectAll}
            />
          )}
          
          {tabIndex === 1 && (
            <Box>
              <StudentTable
                title="Appeared Students"
                students={appearedStudents}
                selectable={selectable}
                selectedStudents={selectedIds}
                onSelect={handleStudentSelect}
                onSelectAll={handleSelectAll}
              />
              {!selectable && (
                <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                  <Button variant="contained" onClick={handleUpdateSelected} disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Update Selected"}
                  </Button>
                </Box>
              )}
            </Box>
          )}
          
          {tabIndex === 2 && !selectable && (
            <StudentTable 
              title="Selected Students" 
              students={selectedStudents} 
            />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default RoundStudents;
