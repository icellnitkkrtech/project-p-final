import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const JobCard = ({ drive, onClick }) => {
  const formatSalary = (salary) => {
    if (!salary) return "Package: TBD";
    const ctc = salary.ctc ? salary.ctc.toFixed(2) : 0;
    return `₹${ctc} LPA`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <Card
      className="h-full cursor-pointer transition-all duration-200"
      onClick={onClick}
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box className="flex justify-between items-start mb-3">
          <Box className="flex-1">
            <Box className="flex items-center gap-2 mb-1">
              <BusinessIcon color="primary" sx={{ fontSize: "1.2rem" }} />
              <Typography
                variant="subtitle1"
                sx={{
                  color: "primary.main",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                {drive.companyDetails?.name}
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                fontSize: "1.1rem",
                color: "text.primary",
                mb: 0.5,
              }}
            >
              {drive.placementDrive_title}
            </Typography>
          </Box>
          <Box className="flex flex-col items-end gap-2">
            <Chip
              label={drive.status}
              color={drive.status === "inProgress" ? "success" : "default"}
              size="small"
              sx={{
                borderRadius: "4px",
                textTransform: "capitalize",
              }}
            />
            <IconButton
              size="small"
              sx={{
                bgcolor: "primary.50",
                "&:hover": { bgcolor: "primary.100" },
              }}
            >
              <ArrowForwardIcon color="primary" fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Details */}
        <Box className="space-y-2 mb-4">
          <Box className="flex items-center gap-3">
            <Box className="flex items-center gap-1">
              <CurrencyRupeeIcon
                sx={{ fontSize: "1rem", color: "primary.main" }}
              />
              <Typography variant="body2" className="font-medium">
                {formatSalary(drive.jobProfile?.salary)}
              </Typography>
            </Box>
            {drive.jobProfile?.location && (
              <Box className="flex items-center gap-1">
                <LocationOnIcon
                  sx={{ fontSize: "1rem", color: "primary.main" }}
                />
                <Typography variant="body2" className="font-medium">
                  {drive.jobProfile.location}
                </Typography>
              </Box>
            )}
          </Box>
          <Box className="flex items-center gap-1">
            <ListAltIcon sx={{ fontSize: "1rem", color: "primary.main" }} />
            <Typography variant="body2" className="font-medium">
              {drive.selectionProcess?.[0]?.rounds?.length || 0} Round Selection
            </Typography>
          </Box>
          <Box className="flex items-center gap-1">
            <CalendarTodayIcon
              sx={{ fontSize: "1rem", color: "primary.main" }}
            />
            <Typography variant="body2" className="font-medium">
              Apply by{" "}
              {formatDate(drive.applicationDetails?.applicationDeadline)}
            </Typography>
          </Box>
        </Box>

        {/* Tags */}
        <Box className="flex flex-wrap gap-1.5">
          <Chip
            label={`Min. CGPA: ${drive.eligibilityCriteria?.minCgpa || "N/A"}`}
            size="small"
            sx={{
              bgcolor: "primary.50",
              color: "primary.main",
              fontSize: "0.75rem",
              height: "24px",
              "& .MuiChip-label": { px: 1 },
            }}
          />
          {drive.jobProfile?.jobType && (
            <Chip
              label={
                drive.jobProfile.jobType === "fte" ? "Full Time" : "Internship"
              }
              size="small"
              sx={{
                bgcolor: "success.50",
                color: "success.main",
                fontSize: "0.75rem",
                height: "24px",
                "& .MuiChip-label": { px: 1 },
              }}
            />
          )}
          {drive.companyDetails?.domain && (
            <Chip
              label={drive.companyDetails.domain}
              size="small"
              sx={{
                bgcolor: "info.50",
                color: "info.main",
                fontSize: "0.75rem",
                height: "24px",
                "& .MuiChip-label": { px: 1 },
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobCard;
