import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import DriveDetailDialog from "../../components/admin/assignedDrives/DriveDetailDialog";
import AssignedDrivesList from "../../components/admin/assignedDrives/AssignedDrivesList";
import jnfDetails from "../../components/admin/jnfManagement/jnfDetails";
import DrivesHeader from "../../components/admin/assignedDrives/DrivesHeader";

const AssignedDrives = () => {
  // State to hold the assigned drives
    const [assignedDrives, setAssignedDrives] = useState([]);
    const [selectedDrive, setSelectedDrive] = useState(null);
    const [tab, setTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

  // Mock data for testing (replace this with actual data passed from the parent or API)
  const mockAssignedDrives = [jnfDetails[0], jnfDetails[1]];

  // Simulate fetching assigned drives (replace with real API call if necessary)
  React.useEffect(() => {
    setAssignedDrives(mockAssignedDrives);
  }, []);

  return (
    <>
      <Box sx={{ p: 4 }}>
        <DrivesHeader
            tab = {tab}
            setTab= {setTab}
            />
      </Box>
      {/* Assigned Drives List */}
      <AssignedDrivesList
        assignedDrives={assignedDrives}
        onViewDetails={(drive) => setSelectedDrive(drive)}
      />

      {/* Drive Detail Dialog */}
      {selectedDrive && (
        <DriveDetailDialog
          drive={selectedDrive}
          onClose={() => setSelectedDrive(null)}
        />
      )}
    </>
  );
};

export default AssignedDrives;
