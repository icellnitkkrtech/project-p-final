import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "../../axios";
import { useOutlet, useOutletContext } from "react-router-dom";
const JobSection = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(null);
  const { student, setStudent } = useOutletContext();
  const studentId = student._id;
  useEffect(() => {
    fetchEligibleJobs();
  }, [studentId]);
console.log("studentId",studentId)
  const fetchEligibleJobs = async () => {
    try {
      const response = await axios.get(`/student/eligible-jobs/${studentId}`);
      // Remove /api/v1 since it's now in baseURL
      setJobs(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      setApplying(jobId);
      await axios.post(`/student/apply/${studentId}/${jobId}`);
      // Refresh jobs list
      fetchEligibleJobs();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(null);
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <div className="space-y-6">
      <Box className="flex justify-between items-center">
        <Typography variant="h5">Available Jobs</Typography>
      </Box>

      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} md={6} key={job._id}>
            <Card className="h-full">
              <CardContent>
                <Box className="flex justify-between items-start mb-4">
                  <div>
                    <Typography variant="h6" className="mb-1">
                      {job.title}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      {job.company}
                    </Typography>
                  </div>
                  <Chip
                    label={`₹${job.package} LPA`}
                    color="primary"
                    variant="outlined"
                  />
                </Box>

                <Typography variant="body2" className="mb-4">
                  {job.description}
                </Typography>

                <div className="space-y-3">
                  <div>
                    <Typography variant="subtitle2">Requirements:</Typography>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {job.requirements.map((req, index) => (
                        <Chip
                          key={index}
                          label={req}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <Typography variant="subtitle2">
                      Skills Required:
                    </Typography>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {job.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <Box className="mt-4 flex justify-between items-center">
                  <Typography variant="caption" color="text.secondary">
                    Last Date: {new Date(job.deadline).toLocaleDateString()}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => handleApply(job._id)}
                    disabled={applying === job._id}
                  >
                    {applying === job._id ? "Applying..." : "Apply"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {jobs.length === 0 && (
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
