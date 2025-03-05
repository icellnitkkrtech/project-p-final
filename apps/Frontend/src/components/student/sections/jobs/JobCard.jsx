import React from "react";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const JobCard = ({ job, onClick }) => {
  const formatSalary = (salary) => {
    if (!salary) return "Package: TBD";
    const ctc = salary.ctc ? (salary.ctc / 100000).toFixed(2) : 0;
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
        borderRadius: "8px",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        },
      }}
    >
      <CardContent>
        <Box className="flex justify-between items-start mb-3">
          <div>
            <Typography
              variant="h6"
              sx={{
                color: "#1A237E",
                fontWeight: 600,
                fontSize: "1.1rem",
                mb: 0.5,
              }}
            >
              {job.title}
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: "0.9rem" }}>
              {job.company}
            </Typography>
          </div>
          <Chip
            label={job.status}
            color={job.status === "open" ? "success" : "default"}
            size="small"
            sx={{
              borderRadius: "4px",
              textTransform: "capitalize",
            }}
          />
        </Box>

        <Box className="flex items-center gap-2 mb-3">
          <CurrencyRupeeIcon sx={{ fontSize: "1rem", color: "#666" }} />
          <Typography variant="body2" color="text.secondary">
            {formatSalary(job.salary)}
          </Typography>
          <CalendarTodayIcon sx={{ fontSize: "1rem", color: "#666", ml: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Apply by {formatDate(job.applicationDeadline)}
          </Typography>
        </Box>

        <Box className="flex flex-wrap gap-1">
          {job.requirements?.slice(0, 2).map((req, index) => (
            <Chip
              key={index}
              label={req}
              variant="outlined"
              size="small"
              sx={{
                backgroundColor: "#F3F4F6",
                fontSize: "0.75rem",
                height: "24px",
              }}
            />
          ))}
          {job.requirements?.length > 2 && (
            <Chip
              label={`+${job.requirements.length - 2} more`}
              variant="outlined"
              size="small"
              sx={{
                backgroundColor: "#F3F4F6",
                fontSize: "0.75rem",
                height: "24px",
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobCard;
