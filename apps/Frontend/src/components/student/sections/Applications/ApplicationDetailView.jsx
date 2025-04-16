import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Button,
} from "@mui/material";
import {
  Business,
  Work,
  School,
  Link as LinkIcon,
  ListAlt,
  Gavel,
  Assessment,
  Description,
  Timeline,
} from "@mui/icons-material";

const ApplicationDetailView = ({ application, onClose, onViewOfferLetter }) => {
  if (!application) return null;

  const {
    placementDrive,
    status,
    appliedAt,
    roundStatus,
    documents,
    offerDetails,
  } = application;
  console.log(application);
  const getStatusClass = (status) => {
    const statusClasses = {
      applied: "bg-amber-100 text-amber-800 border border-amber-200",
      shortlisted: "bg-blue-100 text-blue-800 border border-blue-200",
      "in-process": "bg-purple-100 text-purple-800 border border-purple-200",
      selected: "bg-emerald-100 text-emerald-800 border border-emerald-200",
      rejected: "bg-rose-100 text-rose-800 border border-rose-200",
      "on-hold": "bg-gray-100 text-gray-800 border border-gray-200",
    };
    return statusClasses[status] || statusClasses.applied;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <Card sx={{ maxWidth: "100%", margin: "0 auto", boxShadow: "none" }}>
          <CardContent>
            {/* Header with Close Button */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h5" align="center" color="primary">
                {placementDrive?.placementDrive_title}
              </Typography>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </Box>
            {/* Application Status */}
            <Box mb={3}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Assessment color="primary" />
                <Typography variant="h6" color="primary">
                  Application Status
                </Typography>
              </Box>
              <Box className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusClass(status)}`}
                >
                  {status?.charAt(0).toUpperCase() + status?.slice(1)}
                </span>
                <Typography variant="body2" color="text.secondary">
                  Applied on: {new Date(appliedAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
            {application.offerDetails && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Description color="primary" />
                    <Typography variant="h6" color="primary">
                      Offer Letter
                    </Typography>
                  </Box>

                  <Box p={2} bgcolor="#f5f5f5" borderRadius={1}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Offer Date:</strong>{" "}
                      {formatDate(application.offerDetails.offerDate)}
                    </Typography>

                    {application.offerDetails.response ? (
                      <Typography
                        variant="body2"
                        color={
                          application.offerDetails.response === "accept"
                            ? "success.main"
                            : "error.main"
                        }
                      >
                        <strong>Status:</strong>{" "}
                        {application.offerDetails.response === "accept"
                          ? "Accepted"
                          : "Rejected"}
                        on {formatDate(application.offerDetails.responseDate)}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="warning.main">
                        <strong>Status:</strong> Pending Response
                      </Typography>
                    )}

                    {/* <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<Description />}
                      sx={{ mt: 1 }}
                      onClick={() => {
                        onViewOfferLetter(application);
                      }}
                    >
                      View Offer Letter
                    </Button> */}
                  </Box>
                </Box>
              </>
            )}
            <Divider sx={{ my: 2 }} />
            {/* Company Details */}
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Business color="primary" />
                <Typography variant="h6" color="primary">
                  Company Details
                </Typography>
              </Box>
              <Typography variant="body1">
                <strong>Name:</strong>{" "}
                {placementDrive?.companyDetails?.company_name}
              </Typography>
              <Typography variant="body1">
                <strong>Description:</strong>{" "}
                {placementDrive?.companyDetails?.description}
              </Typography>
              <Typography variant="body1">
                <strong>Domain:</strong>{" "}
                {placementDrive?.companyDetails?.domain}
              </Typography>
              <Typography variant="body1">
                <strong>Type:</strong>{" "}
                {placementDrive?.companyDetails?.companyType}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            {/* Job Profile */}
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Work color="primary" />
                <Typography variant="h6" color="primary">
                  Job Profile
                </Typography>
              </Box>
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <Typography variant="body1">
                  <strong>Role:</strong>{" "}
                  {placementDrive?.jobProfile?.designation}
                </Typography>
                <Typography variant="body1">
                  <strong>Location:</strong>{" "}
                  {placementDrive?.jobProfile?.placeOfPosting}
                </Typography>
                <Typography variant="body1">
                  <strong>Job Type:</strong>{" "}
                  {placementDrive?.jobProfile?.jobType}
                </Typography>
                <Typography variant="body1">
                  <strong>CTC:</strong> ₹{placementDrive?.jobProfile?.ctc} LPA
                </Typography>
                {placementDrive?.jobProfile?.takeHome && (
                  <Typography variant="body1">
                    <strong>Take Home:</strong> ₹
                    {placementDrive?.jobProfile?.takeHome}
                  </Typography>
                )}
                {placementDrive?.jobProfile?.stipend && (
                  <Typography variant="body1">
                    <strong>Stipend:</strong> ₹
                    {placementDrive?.jobProfile?.stipend}
                  </Typography>
                )}
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            {/* Eligibility Criteria */}
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <School color="primary" />
                <Typography variant="h6" color="primary">
                  Eligibility Criteria
                </Typography>
              </Box>
              <Typography variant="body1">
                <strong>Minimum CGPA:</strong>{" "}
                {placementDrive?.eligibilityCriteria?.minCgpa}
              </Typography>
              <Typography variant="body1">
                <strong>Backlogs Allowed:</strong>{" "}
                {placementDrive?.eligibilityCriteria?.backlogAllowed
                  ? "Yes"
                  : "No"}
              </Typography>
              <Typography variant="body1">
                <strong>Eligible Courses:</strong>{" "}
                {placementDrive?.jobProfile?.course}
              </Typography>
              <Typography variant="body1">
                <strong>Eligible Branches:</strong>{" "}
                {placementDrive?.eligibleBranchesForProfiles
                  ?.map((profile) =>
                    profile.branches?.[placementDrive?.jobProfile?.course]
                      ?.map((branch) => branch.name)
                      .join(", ")
                  )
                  .join(", ")}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />

            {/* Selection Process with Status */}
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <ListAlt color="primary" />
                <Typography variant="h6" color="primary">
                  Selection Process Status
                </Typography>
              </Box>
              {placementDrive?.selectionProcess?.[0]?.rounds?.length > 0 ? (
                <Box className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {placementDrive.selectionProcess[0].rounds.map(
                    (round, index) => {
                      // Find matching round status
                      const roundStatus = application.roundStatus?.find(
                        (status) => status.roundNumber === round.roundNumber
                      );

                      return (
                        <Box
                          key={index}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <Typography
                            variant="subtitle2"
                            color="primary"
                            gutterBottom
                          >
                            Round {round.roundNumber}: {round.roundName}
                          </Typography>
                          <Box className="flex flex-wrap gap-2 items-center mt-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                roundStatus?.status === "qualified"
                                  ? "bg-green-100 text-green-800"
                                  : roundStatus?.status === "not-qualified"
                                    ? "bg-red-100 text-red-800"
                                    : roundStatus?.status === "absent"
                                      ? "bg-gray-100 text-gray-800"
                                      : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {roundStatus?.status
                                ? roundStatus.status.charAt(0).toUpperCase() +
                                  roundStatus.status.slice(1)
                                : "Pending"}
                            </span>
                            {roundStatus?.date && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Date:{" "}
                                {new Date(
                                  roundStatus.date
                                ).toLocaleDateString()}
                              </Typography>
                            )}
                          </Box>
                          {roundStatus?.feedback && (
                            <Typography className="mt-2 text-sm text-gray-600">
                              <strong>Feedback:</strong> {roundStatus.feedback}
                            </Typography>
                          )}
                          {round.details && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              className="block mt-1"
                            >
                              {round.details}
                            </Typography>
                          )}
                        </Box>
                      );
                    }
                  )}
                </Box>
              ) : (
                <Typography color="text.secondary" variant="body2">
                  Selection process details not available
                </Typography>
              )}
            </Box>
            {/* Bond Details */}
            {placementDrive?.bondDetails && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Gavel color="primary" />
                    <Typography variant="h6" color="primary">
                      Bond Details
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    <strong>Details:</strong>{" "}
                    {placementDrive.bondDetails.details}
                  </Typography>
                </Box>
              </>
            )}
            {/* Documents Section */}
            {documents?.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Description color="primary" />
                    <Typography variant="h6" color="primary">
                      Documents
                    </Typography>
                  </Box>
                  <Box className="space-y-2">
                    {documents.map((doc, index) => (
                      <Box
                        key={index}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                      >
                        <Typography>{doc.name}</Typography>
                        <Box className="flex items-center gap-3">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              doc.verified
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {doc.verified ? "Verified" : "Pending"}
                          </span>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View
                          </a>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </>
            )}
            {/* Offer Details */}
            {offerDetails && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Gavel color="primary" />
                    <Typography variant="h6" color="primary">
                      Offer Details
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    <strong>Status:</strong> {offerDetails.status}
                  </Typography>
                  {offerDetails.ctc && (
                    <Typography variant="body1">
                      <strong>CTC:</strong> ₹{offerDetails.ctc} LPA
                    </Typography>
                  )}
                  {offerDetails.joiningDate && (
                    <Typography variant="body1">
                      <strong>Joining Date:</strong>{" "}
                      {new Date(offerDetails.joiningDate).toLocaleDateString()}
                    </Typography>
                  )}
                  {offerDetails.location && (
                    <Typography variant="body1">
                      <strong>Location:</strong> {offerDetails.location}
                    </Typography>
                  )}
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ApplicationDetailView;
