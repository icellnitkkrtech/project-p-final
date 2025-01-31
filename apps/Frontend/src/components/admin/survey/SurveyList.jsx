import React from "react";
import { Box } from "@mui/material";
import SurveyCard from "./SurveyCard";

const SurveyList = ({ surveys, getSurveyActions }) => {
  return (
    <Box sx={{ p: 4}}>
      {surveys.map((survey, index) => (
        <SurveyCard key={index} survey={survey} actions={getSurveyActions(survey.status, index)} />
      ))}
    </Box>
  );
};

export default SurveyList;
