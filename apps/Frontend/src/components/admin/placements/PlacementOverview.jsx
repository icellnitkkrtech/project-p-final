import React, { useState } from "react";
import { Card, CardContent, Typography, Divider, Collapse, IconButton, Box } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import PlacementData from "./PlacementData";

const PlacementOverview = () => {
  const drive = PlacementData[0];
  const jobProfile = drive.jobProfiles[0];
  
  const [showEligibility, setShowEligibility] = useState(false);
  const [showSelectionProcess, setShowSelectionProcess] = useState(false);

  return (
    <Card sx={{maxWidth: "90%", margin: "20px auto", padding: 3, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom align="center">
          {drive.title}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6">Company Name</Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {drive.companyName} ({drive.companyType})
        </Typography>
        
        <Typography variant="h6" sx={{ mt: 2 }}>Company Description</Typography>
        <Typography variant="subtitle1" color="textSecondary" paragraph>
          {drive.companyDescription}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6">Job Profile</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 1 }}>
          <Typography variant="body1"><strong>Role:</strong> {jobProfile.jobRole}</Typography>
          <Typography variant="body1"><strong>Location:</strong> {jobProfile.location}</Typography>
          <Typography variant="body1"><strong>CTC:</strong> ₹{jobProfile.ctc}</Typography>
          <Typography variant="body1"><strong>Base Salary:</strong> ₹{jobProfile.baseSalary}</Typography>
          <Typography variant="body1"><strong>Stipend:</strong> ₹{jobProfile.stipend}</Typography>
          <Typography variant="body1"><strong>Joining Date:</strong> {jobProfile.expectedJoiningDate}</Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" onClick={() => setShowEligibility(!showEligibility)} sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
          Eligibility Criteria
          <IconButton size="small">{showEligibility ? <ExpandLess /> : <ExpandMore />}</IconButton>
        </Typography>
        <Collapse in={showEligibility}>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, pl: 2 }}>
            {Object.entries(jobProfile.eligibility).map(([key, value]) => (
              <Typography key={key} variant="body1">
                <strong>{key.replace(/([A-Z])/g, ' $1').trim().replace(/\b\w/g, (char) => char.toUpperCase())}:</strong> {value}
              </Typography>
            ))}
          </Box>
        </Collapse>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" onClick={() => setShowSelectionProcess(!showSelectionProcess)} sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
          Selection Process
          <IconButton size="small">{showSelectionProcess ? <ExpandLess /> : <ExpandMore />}</IconButton>
        </Typography>
        <Collapse in={showSelectionProcess}>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, pl: 2 }}>
            {Object.entries(jobProfile.selectionRounds).map(([key, value]) => (
              value && key !== "otherRoundsDescription" ? (
                <Typography key={key} variant="body1">
                  <strong>{key.replace(/([A-Z])/g, ' $1').trim().replace(/\b\w/g, (char) => char.toUpperCase())}:</strong>
                </Typography>
              ) : null
            ))}
            {jobProfile.selectionRounds.otherRounds && (
              <Typography variant="body1"><strong>Other Rounds:</strong> {jobProfile.selectionRounds.otherRoundsDescription}</Typography>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default PlacementOverview;
