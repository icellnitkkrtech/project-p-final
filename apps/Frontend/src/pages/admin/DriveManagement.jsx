import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Tabs, Tab, Box, CircularProgress, Typography, IconButton, Badge, Tooltip } from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import PlacementOverview from "../../components/admin/placements/PlacementOverview";
import PlacementRounds from "../../components/admin/placements/PlacementRounds";
import NotificationPanel from "../../components/admin/placements/NotificationPanel";
import placementService from "../../services/admin/placementService"; // Import your API service

const DriveManagement = () => {
  const { placementId } = useParams(); // Get dynamic placement ID from URL
  const [tabIndex, setTabIndex] = useState(0);
  const [placementData, setPlacementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3); // Example count

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
    <Container sx={{ mt: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: 'divider',
        mb: 2
      }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleChange} 
          centered
          sx={{ flex: 1 }}
        >
          <Tab label="Overview" />
          <Tab label="Rounds" />
        </Tabs>
        
        <Box sx={{ pr: 2 }}>
          <Tooltip title="Notifications">
            <IconButton 
              onClick={() => setShowNotifications(true)}
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'action.hover' 
                } 
              }}
            >
              <Badge 
                badgeContent={unreadCount} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    right: -3,
                    top: 3,
                    border: '2px solid',
                    borderColor: 'background.paper',
                    padding: '0 4px',
                  }
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box mt={2}>
        {tabIndex === 0 && <PlacementOverview id={placementId} />}
        {tabIndex === 1 && <PlacementRounds placementId={placementId} placementTitle={placementData?.placementDrive_title} />}
      </Box>

      {showNotifications && (
        <NotificationPanel onClose={() => setShowNotifications(false)} />
      )}
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
