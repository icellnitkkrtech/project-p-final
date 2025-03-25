import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Tabs, Tab, Box, CircularProgress, Typography } from "@mui/material";
import PlacementOverview from "../../components/admin/placements/PlacementOverview";
import PlacementStudents from "../../components/admin/placements/PlacementStudents";
import PlacementRounds from "../../components/admin/placements/PlacementRounds";
import PlacementNotifications from "../../components/admin/placements/PlacementNotifations";
import placementService from "../../services/admin/placementService"; // Import your API service

const DriveManagement = () => {
  const { placementId } = useParams(); // Get dynamic placement ID from URL
  const [tabIndex, setTabIndex] = useState(0);
  const [placementData, setPlacementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Placement Data
  useEffect(() => {
    const fetchPlacement = async () => {
      try {
        setLoading(true);
        const data = await placementService.getPlacement(placementId);
        setPlacementData(data);
      } catch (err) {
        setError("Failed to load placement data.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlacement();
  }, [placementId]);

  console.log("Placement Data:", placementData);

  const handleChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  // Show loading indicator
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  // Show error message
  if (error) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Extract application details
  const applicationDetails = placementData?.applicationDetails || {};

  return (
     <Container>
      <Tabs value={tabIndex} onChange={handleChange} centered>
        <Tab label="Drive Overview" />
        <Tab label="Students" />
        <Tab label="Rounds" />
        <Tab label="Notifications" />
      </Tabs>
      <Box mt={2}>
        {tabIndex === 0 && <PlacementOverview id={placementId} />}
        {tabIndex === 1 && <PlacementStudents placementId={placementId} />}
        {tabIndex === 2 && <PlacementRounds placementId={placementId} />}
        {tabIndex === 3 && <PlacementNotifications students={placementData?.applicationDetails?.appliedStudents} />}
      </Box>
    </Container>
  );
};

export default DriveManagement;

// import { useParams } from "react-router-dom";

// const DriveManagement = () => {
//   const { placementId } = useParams();
//   console.log("Current Placement ID:", placementId);

//   return <div>Drive Management for {placementId}</div>;
// };

// export default DriveManagement;
