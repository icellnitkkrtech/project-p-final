import React from "react";
import { Card, CardContent, Typography, Button, Box, Divider } from "@mui/material";

const AssignedDrivesList = ({ assignedDrives, onViewDetails }) => {
  return (
    <Box sx={{ p: 4 }}>
      {assignedDrives.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center">
          No assigned JNF drives available.
        </Typography>
      ) : (
        assignedDrives.map((drive, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {drive.name}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Domain: {drive.domain}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ mt: 1 }}>
                <Typography variant="body1">
                  <strong>Job Profiles:</strong>
                </Typography>
                {drive.jobProfiles.map((profile, idx) => (
                  <Box key={idx} sx={{ ml: 2, my: 1 }}>
                    <Typography>- Designation: {profile.designation}</Typography>
                    <Typography>- CTC: {profile.ctc}</Typography>
                    <Typography>- Location: {profile.placeOfPosting}</Typography>
                  </Box>
                ))}
              </Box>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="textSecondary">
                Assigned to: {drive.assignedUser?.name} | ({drive.assignedUser?.email}) | {drive.assignedUser?.designation}
                <br />
                Assigned on: {drive.assignedDate}
                <br/>
                Assigned by: {drive.assignedBy}
              </Typography>
              <Box sx={{ mt: 2, textAlign: "right", gap: 2 , display: "flex", justifyContent: "flex-end"}}>
                <Button variant="outlined" onClick={() => onPostdrive(drive)}>
                  Post Drive
                </Button>
                <Button variant="outlined" onClick={() => onViewDetails(drive)}>
                  View Details
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default AssignedDrivesList;
