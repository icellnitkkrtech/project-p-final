import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Divider, Box } from "@mui/material";
import { Business, Work, School, Link as LinkIcon, ListAlt , Gavel} from "@mui/icons-material";
import placementService from "../../../services/admin/placementService";

const PlacementOverview = ({ id }) => {
  const [placementData, setPlacementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlacement = async () => {
      try {
        setLoading(true);
        const data = await placementService.getPlacement(id);
        setPlacementData(data);
      } catch (err) {
        setError("Failed to load placement data.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlacement();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!placementData) return <Typography>No placement data available.</Typography>;

  const {
    placementDrive_title,
    companyDetails,
    jobProfile,
    eligibilityCriteria,
    selectionProcess,
    applicationDetails,
    eligibleBranchesForProfiles,
    bondDetails,
  } = placementData;

  return (
    <Card sx={{ maxWidth: "95%", margin: "20px auto", padding: 2, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom align="center" color="primary">
          {placementDrive_title}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box >
        {/* Main Title */}
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Business color="primary" />
          <Typography variant="h5" color="primary" fontWeight="bold">
            Company Details
          </Typography>
        </Box>
          
        {/* Company Information */}
          <Typography variant="body1">
          <strong>Name:</strong>{companyDetails?.name}
          </Typography>
          <Typography variant="body1">
          <strong>Description:</strong>{companyDetails?.description}
          </Typography>
          <Typography variant="body1">
            <strong>Domain:</strong> {companyDetails?.domain}
          </Typography>
          <Typography variant="body1">
            <strong>Type:</strong> {companyDetails?.companyType}
          </Typography>
      </Box>

        <Divider sx={{ my: 2 }} />
        <Box display="flex" alignItems="center" gap={1} mt={2}>
          <Work color="primary" />
          <Typography variant="h6" color="primary">Job Profile</Typography>
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", mt: 1 }}>
          <Typography variant="body1"><strong>Role:</strong> {jobProfile?.designation}</Typography>
          <Typography variant="body1"><strong>Location:</strong> {jobProfile?.placeOfPosting}</Typography>
          <Typography variant="body1"><strong>Job Type:</strong> {jobProfile?.jobType}</Typography>
          <Typography variant="body1"><strong>CTC:</strong> ₹{jobProfile?.ctc}</Typography>
          <Typography variant="body1"><strong>Take Home Salary:</strong> ₹{jobProfile?.takeHome}</Typography>
          {jobProfile?.stipend && (
            <Typography variant="body1"><strong>Stipend:</strong> ₹{jobProfile?.stipend}</Typography>
          )}
          <Typography variant="body1"><strong>Training Period:</strong> {jobProfile?.trainingPeriod}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Eligibility Criteria */}
        <Box display="flex" alignItems="center" gap={1}>
          <School color="primary" />
          <Typography variant="h6" color="primary">Eligibility Criteria</Typography>
        </Box>
        <Typography variant="body1"><strong>Minimum CGPA:</strong> {eligibilityCriteria?.minCgpa}</Typography>
        <Typography variant="body1"><strong>Backlogs Allowed:</strong> {eligibilityCriteria?.backlogAllowed}</Typography>
        <Typography variant="body1"><strong>Eligible Courses:</strong> {jobProfile?.course}</Typography>
        <Typography variant="body1"><strong>Eligible Branches:</strong> {
          eligibleBranchesForProfiles?.map(profile => 
            profile.branches?.[jobProfile?.course]?.map(branch => branch.name).join(", ")
          ).join(", ")
        }</Typography>

        <Divider sx={{ my: 2 }} />

        {/* Application Details */}
        <Box display="flex" alignItems="center" gap={1}>
          <LinkIcon color="primary" />
          <Typography variant="h6" color="primary">Application Details</Typography>
        </Box>
        <Typography variant="body1"><strong>Deadline:</strong> {applicationDetails?.applicationDeadline}</Typography>
        <Typography variant="body1"><strong>Link:</strong>
          <a 
            href={applicationDetails?.applicationLink}
            target="_blank"
            rel="noopener noreferrer" 
            style={{ color: "blue", textDecoration: "underline" }}
          >
            {applicationDetails?.applicationLink || "N/A"}
          </a>
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Selection Process */}
        <Box display="flex" alignItems="center" gap={1}>
          <ListAlt color="primary" />
          <Typography variant="h6" color="primary">Selection Process</Typography>
        </Box>
        {selectionProcess?.[0]?.rounds?.length > 0 ? (
          selectionProcess[0].rounds.map((round, index) => (
            <Typography key={index} variant="body1">
              <strong>Round {round.roundNumber}:</strong> {round.roundName} - {round.details}
            </Typography>
          ))
        ) : (
          <Typography variant="body1">No selection rounds specified.</Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Bond Details */}
        <Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Gavel color="primary" />
            <Typography variant="h6" sx={{ color: "#1976d2" }}>Bond Details</Typography>
          </Box>
          <Typography>{bondDetails?.details}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PlacementOverview;