import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Tooltip,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Lock, ExpandMore as ExpandMoreIcon } from "@mui/icons-material";

const PersonalInfoEdit = ({ data, isLocked, onChange }) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <Card>
      <CardContent>
        <Box className="flex items-center justify-between mb-3">
          <Typography variant="h6">Personal Information</Typography>
          {isLocked && (
            <Tooltip title="Information Locked">
              <Lock color="primary" />
            </Tooltip>
          )}
        </Box>

        <Accordion
          expanded={expanded}
          onChange={(e, isExpanded) => setExpanded(isExpanded)}
          className="border rounded-lg"
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            className="hover:bg-gray-50"
          >
            <Typography>
              {data.name
                ? `${data.name} - ${data.rollNumber}`
                : "Personal Details"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Full Name"
                  name="name"
                  value={data.name || ""}
                  onChange={handleChange}
                  disabled={isLocked}
                  error={!data.name}
                  helperText={!data.name && "Name is required"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Roll Number"
                  name="rollNumber"
                  value={data.rollNumber || ""}
                  onChange={handleChange}
                  disabled={isLocked}
                  error={!data.rollNumber}
                  helperText={!data.rollNumber && "Roll number is required"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Gender"
                  name="Gender"
                  value={data.Gender || ""}
                  onChange={handleChange}
                  disabled={isLocked}
                  error={!data.Gender}
                  helperText={!data.Gender && "Gender is required"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Department"
                  name="department"
                  value={data.department || ""}
                  onChange={handleChange}
                  disabled={isLocked}
                  error={!data.department}
                  helperText={!data.department && "Department is required"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Batch"
                  name="batch"
                  type="number"
                  value={data.batch || ""}
                  onChange={handleChange}
                  disabled={isLocked}
                  error={!data.batch}
                  helperText={!data.batch && "Batch year is required"}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoEdit;
