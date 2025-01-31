import React from "react";
import { Card, CardContent, Box, Typography, Button } from "@mui/material";

const SurveyCard = ({ survey, actions }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">{survey.title}</Typography>
          <Typography
            variant="body2"
            color={survey.status === "Published" ? "green" : "gray"}
          >
            {survey.status}
          </Typography>
        </Box>
        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          {actions.map((action, idx) => (
            <Button key={idx} size="small" onClick={action.action}>
              {action.label}
            </Button>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SurveyCard;
