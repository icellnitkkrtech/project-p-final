import React from 'react';
import {
  Grid,
  TextField,
  Typography,
  IconButton,
  Card,
  CardContent,
  Box,
  Chip,
  Autocomplete
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

const SkillsForm = ({ formData, onChange }) => {
  const handleCertificationChange = (index, field, value) => {
    const updatedCertifications = [...(formData.certifications || [])];
    updatedCertifications[index] = {
      ...updatedCertifications[index],
      [field]: value
    };
    onChange('certifications', updatedCertifications);
  };

  const addCertification = () => {
    const updatedCertifications = [...(formData.certifications || []), {
      name: '',
      issuer: '',
      date: '',
      credential: ''
    }];
    onChange('certifications', updatedCertifications);
  };

  const removeCertification = (index) => {
    const updatedCertifications = formData.certifications.filter((_, i) => i !== index);
    onChange('certifications', updatedCertifications);
  };

  // Common technical skills for suggestions
  const technicalSkillsSuggestions = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular',
    'Vue.js', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes',
    'Git', 'CI/CD', 'Machine Learning', 'Data Analysis'
  ];

  // Common soft skills for suggestions
  const softSkillsSuggestions = [
    'Communication', 'Leadership', 'Team Work', 'Problem Solving',
    'Time Management', 'Adaptability', 'Critical Thinking',
    'Creativity', 'Emotional Intelligence', 'Conflict Resolution'
  ];

  // Common languages for suggestions
  const languagesSuggestions = [
    'English', 'Hindi', 'Telugu', 'Tamil', 'Kannada',
    'Malayalam', 'Bengali', 'Marathi', 'Gujarati'
  ];

  return (
    <Grid container spacing={3}>
      {/* Technical Skills */}
      <Grid item xs={12}>
        <Autocomplete
          multiple
          options={technicalSkillsSuggestions}
          freeSolo
          value={formData.technical || []}
          onChange={(_, newValue) => onChange('technical', newValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option}
                {...getTagProps({ index })}
                key={index}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Technical Skills"
              placeholder="Add skill"
            />
          )}
        />
      </Grid>

      {/* Soft Skills */}
      <Grid item xs={12}>
        <Autocomplete
          multiple
          options={softSkillsSuggestions}
          freeSolo
          value={formData.softSkills || []}
          onChange={(_, newValue) => onChange('softSkills', newValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option}
                {...getTagProps({ index })}
                key={index}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Soft Skills"
              placeholder="Add skill"
            />
          )}
        />
      </Grid>

      {/* Languages */}
      <Grid item xs={12}>
        <Autocomplete
          multiple
          options={languagesSuggestions}
          freeSolo
          value={formData.languages || []}
          onChange={(_, newValue) => onChange('languages', newValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option}
                {...getTagProps({ index })}
                key={index}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Languages"
              placeholder="Add language"
            />
          )}
        />
      </Grid>

      {/* Certifications */}
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Certifications</Typography>
          <IconButton color="primary" onClick={addCertification}>
            <Add />
          </IconButton>
        </Box>

        {formData.certifications?.map((cert, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} display="flex" justifyContent="flex-end">
                  <IconButton color="error" onClick={() => removeCertification(index)}>
                    <Delete />
                  </IconButton>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Certification Name"
                    value={cert.name}
                    onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Issuing Organization"
                    value={cert.issuer}
                    onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    value={cert.date}
                    onChange={(e) => handleCertificationChange(index, 'date', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Credential ID"
                    value={cert.credential}
                    onChange={(e) => handleCertificationChange(index, 'credential', e.target.value)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Grid>
  );
};

export default SkillsForm; 