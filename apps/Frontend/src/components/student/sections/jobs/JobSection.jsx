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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "../../axios";
import { useOutletContext } from "react-router-dom";
import JobCard from "./JobCard";

const JobSection = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const { student } = useOutletContext();
  const studentId = student._id;
  const theme = useTheme();

  useEffect(() => {
    fetchEligibleJobs();
  }, [studentId]);

  const fetchEligibleJobs = async () => {
    try {
      const response = await axios.get(`/student/eligible-jobs/${studentId}`);
      setJobs(response.data?.data?.jobs || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch jobs");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      setApplying(jobId);
      await axios.post(`/student/apply/${studentId}/${jobId}`);
      fetchEligibleJobs();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(null);
    }
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const handleClose = () => {
    setSelectedJob(null);
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
        <Typography
          variant="h5"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 600,
            fontSize: "1.75rem",
          }}
        >
          Available Jobs
        </Typography>
        <Chip
          label={`${jobs.length} Jobs Found`}
          color="primary"
          variant="outlined"
          sx={{ borderRadius: "6px" }}
        />
      </Box>

      <Grid container spacing={3}>
        {Array.isArray(jobs) &&
          jobs.map((job) => (
            <Grid item xs={12} md={6} key={job._id}>
              <JobCard job={job} onClick={() => handleJobClick(job)} />
            </Grid>
          ))}
      </Grid>

      <Dialog
        open={Boolean(selectedJob)}
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
            bgcolor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h6" component="div">
                {selectedJob?.title}
              </Typography>
              <Typography variant="subtitle2">
                {selectedJob?.company}
              </Typography>
            </Box>
            <IconButton
              onClick={handleClose}
              sx={{
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          {selectedJob && (
            <Box className="space-y-6">
              <Typography variant="body1">{selectedJob.description}</Typography>

              <Box className="grid grid-cols-2 gap-4">
                <Box className="space-y-2">
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    fontWeight={600}
                  >
                    Package Details
                  </Typography>
                  <Typography>
                    {selectedJob.salary?.ctc
                      ? `₹${(selectedJob.salary.ctc / 100000).toFixed(2)} LPA`
                      : "TBD"}
                  </Typography>
                  {selectedJob.salary?.breakup && (
                    <Typography variant="body2" color="text.secondary">
                      {selectedJob.salary.breakup}
                    </Typography>
                  )}
                </Box>

                {/* <Box className="space-y-2">
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    fontWeight={600}
                  >
                    Positions Available
                  </Typography>
                  <Typography>
                    {selectedJob.numberOfPositions || "Not specified"}
                  </Typography>
                </Box> */}
              </Box>

              <Box className="space-y-2">
                <Typography
                  variant="subtitle1"
                  color="primary"
                  fontWeight={600}
                >
                  Eligibility Criteria
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <Typography component="li">
                    Minimum CGPA:{" "}
                    {selectedJob.eligibility?.minCGPA || "Not specified"}
                  </Typography>
                  <Typography component="li">
                    Batch: {selectedJob.eligibility?.batch || "Not specified"}
                  </Typography>
                  {selectedJob.eligibility?.departments && (
                    <Typography component="li">
                      Departments:{" "}
                      {selectedJob.eligibility.departments.join(", ")}
                    </Typography>
                  )}
                </Box>
              </Box>

              {selectedJob.requirements?.length > 0 && (
                <Box className="space-y-2">
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    fontWeight={600}
                  >
                    Requirements
                  </Typography>
                  <Box className="flex flex-wrap gap-2">
                    {selectedJob.requirements.map((req, index) => (
                      <Chip
                        key={index}
                        label={req}
                        variant="outlined"
                        size="small"
                        sx={{ bgcolor: theme.palette.background.default }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Box
                sx={{
                  mt: 4,
                  pt: 2,
                  borderTop: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* <Typography variant="body2" color="text.secondary">
                  Apply Before:{" "}
                  {new Date(selectedJob.applicationDeadline).toLocaleDateString(
                    "en-IN",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </Typography> */}
                <Chip
                  label={
                    applying === selectedJob._id ? "Applying..." : "Apply Now"
                  }
                  color="primary"
                  onClick={() => handleApply(selectedJob._id)}
                  disabled={
                    applying === selectedJob._id ||
                    selectedJob.status !== "open"
                  }
                  sx={{ borderRadius: "6px", py: 2, px: 1 }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {(!jobs || jobs.length === 0) && (
        <Box className="text-center py-8">
          <Typography color="text.secondary">
            No jobs available at the moment.
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default JobSection;
