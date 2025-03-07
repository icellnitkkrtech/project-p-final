import React, { useState } from "react";
import { Container, Tabs, Tab, Paper, Typography, Box } from "@mui/material";
import PlacementData from "../../components/admin/placements/PlacementData";
import PlacementNotifications from "../../components/admin/placements/PlacementNotifations";
import PlacementOverview from "../../components/admin/placements/PlacementOverview";
import PlacementStudents from "../../components/admin/placements/PlacementStudents";
import PlacementRounds from "../../components/admin/placements/PlacementRounds";

const DriveManagement = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const drive = PlacementData[0];
  const applicationDetails = { ...drive.applicationDetails };

  return (
    <Container>
      <Tabs value={tabIndex} onChange={handleChange} centered>
        <Tab label="Drive Overview" />
        <Tab label="Students" />
        <Tab label="Rounds" />
        <Tab label="Notifications" />
      </Tabs>
      <Box mt={2}>
        {tabIndex === 0 && (
            <PlacementOverview />
        )}
        {tabIndex === 1 && (
            <PlacementStudents 
            appliedStudents = {applicationDetails.appliedStudents}
            appearedStudents = {applicationDetails.appearedStudents}
            selectedStudents = {applicationDetails.selectedStudents}
            />
        )}
        {tabIndex === 2 && (
            <PlacementRounds />
        )}
        {tabIndex === 3 && (
            <PlacementNotifications students={applicationDetails.appliedStudents}/>
        )}
      </Box>
    </Container>
  );
};

export default DriveManagement;
