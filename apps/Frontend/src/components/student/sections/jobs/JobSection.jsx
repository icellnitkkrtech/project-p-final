import React, { useState, useEffect } from "react";
import {
  Typography,
  Chip,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useTheme,
  Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  Business as BusinessIcon,
  LocationOn as LocationOnIcon,
  Today as TodayIcon,
  Timeline as TimelineIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import axios from "../../axios";
import { useOutletContext } from "react-router-dom";
import JobCard from "./JobCard";

const JobSection = () => {
  const [placementDrives, setPlacementDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(null);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const { student } = useOutletContext();
  const studentId = student._id;
  const theme = useTheme();

  useEffect(() => {
    fetchEligibleDrives();
  }, [studentId]);

  const fetchEligibleDrives = async () => {
    try {
      const response = await axios.get(
        `/student/placement-drives/eligible/${studentId}`
      );
      setPlacementDrives(response.data?.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch placement drives"
      );
      setPlacementDrives([]);
    } finally {
      setLoading(false);
    }
  };
  const handleDriveClick = (drive) => {
    setSelectedDrive(drive);
  };

  const handleClose = () => {
    setSelectedDrive(null);
  };
  const handleApply = async (driveId) => {
    try {
      setApplying(driveId);
      await axios.post(
        `/student/placement-drives/apply/${studentId}/${driveId}`
      );
      fetchEligibleDrives();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div className="space-y-6 p-4">
      <Box
        className="flex justify-between items-center mb-6"
        sx={{ borderBottom: `1px solid ${theme.palette.divider}`, pb: 2 }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 600,
              fontSize: "1.75rem",
            }}
          >
            Available Placement Drives
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Explore and apply to placement opportunities tailored for you
          </Typography>
        </Box>
        <Chip
          label={`${placementDrives.length} Drives Found`}
          color="primary"
          variant="outlined"
          sx={{ borderRadius: "6px" }}
        />
      </Box>

      <Grid container spacing={3}>
        {Array.isArray(placementDrives) &&
          placementDrives.map((drive) => (
            <Grid item xs={12} md={6} key={drive._id}>
              <JobCard drive={drive} onClick={() => handleDriveClick(drive)} />
            </Grid>
          ))}
      </Grid>

      <Dialog
        open={Boolean(selectedDrive)}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            bgcolor: theme.palette.background.paper,
          },
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 3,
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                {selectedDrive?.placementDrive_title}
              </Typography>
              <Box className="flex items-center gap-2 mt-1">
                <Typography variant="subtitle2">
                  {selectedDrive?.companyDetails?.name}
                </Typography>
                <Chip
                  label={selectedDrive?.status}
                  size="small"
                  color={
                    selectedDrive?.status === "inProgress"
                      ? "success"
                      : "default"
                  }
                  sx={{ borderRadius: "4px", height: "20px" }}
                />
              </Box>
            </Box>
            <IconButton
              onClick={handleClose}
              sx={{
                color: "inherit",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          {selectedDrive && (
            <Box className="space-y-6">
              {/* Company Info */}
              <Box className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <BusinessIcon
                  sx={{ color: "primary.main", fontSize: "2rem" }}
                />
                <Box>
                  <Typography variant="h6" color="primary.main" gutterBottom>
                    {selectedDrive.companyDetails?.company_name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {selectedDrive.companyDetails?.description}
                  </Typography>
                  <Box className="flex flex-wrap gap-2">
                    {selectedDrive.companyDetails?.domain && (
                      <Chip
                        label={selectedDrive.companyDetails.domain}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                    {selectedDrive.companyDetails?.companyType && (
                      <Chip
                        label={selectedDrive.companyDetails.companyType}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                    <Chip
                      icon={<TodayIcon sx={{ fontSize: "1rem" }} />}
                      label={`Apply by ${formatDate(selectedDrive.applicationDetails?.applicationDeadline)}`}
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Box>

              {/* Job Details */}
              <Box>
                <Box className="flex items-center gap-2 mb-3">
                  <WorkIcon color="primary" />
                  <Typography variant="h6" color="primary">
                    Job Details
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box className="p-4 border rounded-lg bg-gray-50">
                      <Typography
                        variant="subtitle2"
                        color="primary"
                        gutterBottom
                      >
                        Package Details
                      </Typography>
                      <Typography variant="h5" sx={{ mb: 1 }}>
                        ₹{selectedDrive.jobProfile?.ctc} LPA
                      </Typography>
                      {selectedDrive.jobProfile?.takeHome && (
                        <Typography variant="body2" color="text.secondary">
                          Take Home: ₹{selectedDrive.jobProfile.takeHome}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box className="p-4 border rounded-lg bg-gray-50">
                      <Typography
                        variant="subtitle2"
                        color="primary"
                        gutterBottom
                      >
                        Location & Type
                      </Typography>
                      <Box className="flex items-start gap-2">
                        <LocationOnIcon
                          color="primary"
                          sx={{ fontSize: "1.2rem" }}
                        />
                        <Box>
                          <Typography variant="h6">
                            {selectedDrive.jobProfile?.placeOfPosting ||
                              "Not specified"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedDrive.jobProfile?.jobType === "fte"
                              ? "Full Time"
                              : "Internship"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Eligibility */}
              <Box>
                <Box className="flex items-center gap-2 mb-3">
                  <SchoolIcon color="primary" />
                  <Typography variant="h6" color="primary">
                    Eligibility Criteria
                  </Typography>
                </Box>
                <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Box className="p-4 border rounded-lg bg-gray-50">
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      gutterBottom
                    >
                      Academic Requirements
                    </Typography>
                    <Typography variant="body1">
                      Min. CGPA: {selectedDrive.eligibilityCriteria?.minCgpa}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Backlogs:{" "}
                      {selectedDrive.eligibilityCriteria?.backlogAllowed
                        ? "Allowed"
                        : "Not Allowed"}
                    </Typography>
                  </Box>
                  <Box className="p-4 border rounded-lg bg-gray-50">
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      gutterBottom
                    >
                      Eligible Branches
                    </Typography>
                    <Typography variant="body2">
                      {selectedDrive.eligibleBranchesForProfiles?.[0]?.branches?.[
                        selectedDrive.jobProfile?.course
                      ]
                        ?.map((branch) => branch.name)
                        .join(", ")}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Selection Process */}
              <Box>
                <Box className="flex items-center gap-2 mb-3">
                  <TimelineIcon color="primary" />
                  <Typography variant="h6" color="primary">
                    Selection Process
                  </Typography>
                </Box>
                <Box className="flex flex-nowrap gap-2 overflow-x-auto pb-2">
                  {selectedDrive.selectionProcess?.[0]?.rounds?.map(
                    (round, index) => (
                      <Box
                        key={index}
                        className="flex-shrink-0 w-64 p-3 bg-gray-50 rounded-lg border"
                      >
                        <Typography variant="subtitle2" color="primary">
                          Round {index + 1}:{" "}
                          {round.roundName.replace(/([A-Z])/g, " $1").trim()}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          className="block mt-1"
                        >
                          {round.details}
                        </Typography>
                      </Box>
                    )
                  )}
                </Box>
              </Box>

              {/* Bond Details if exists */}
              {selectedDrive.bondDetails && (
                <>
                  <Divider />
                  <Box className="flex items-center gap-2">
                    <InfoIcon color="warning" />
                    <Typography variant="body2" color="warning.main">
                      {selectedDrive.bondDetails.details}
                    </Typography>
                  </Box>
                </>
              )}

              {/* Apply Button */}
              <Box className="flex justify-between items-center pt-4 border-t mt-4">
                <Typography variant="body2" color="text.secondary">
                  Last date to apply:{" "}
                  {formatDate(
                    selectedDrive.applicationDetails?.applicationDeadline
                  )}
                </Typography>
                <Chip
                  label={
                    applying === selectedDrive._id ? "Applying..." : "Apply Now"
                  }
                  color="primary"
                  onClick={() => handleApply(selectedDrive._id)}
                  disabled={
                    applying === selectedDrive._id ||
                    selectedDrive.status !== "inProgress"
                  }
                  sx={{
                    borderRadius: "6px",
                    py: 2,
                    px: 3,
                    fontSize: "1rem",
                    fontWeight: 500,
                  }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {(!placementDrives || placementDrives.length === 0) && (
        <Box className="text-center py-12">
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Placement Drives Available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check back later for new opportunities.
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default JobSection;
