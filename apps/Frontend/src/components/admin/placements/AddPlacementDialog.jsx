import React, { useState } from "react";
import { Container,Dialog, DialogActions, DialogContent, DialogTitle, Box, TextField, Button, MenuItem, Typography, Grid,Stepper, Step, StepLabel, Checkbox, FormControlLabel, Stack, Paper, Grid2, Snackbar, Alert } from "@mui/material";
import placementService from "../../../services/admin/placementService";

const JOB_TYPES = {
  FTE: "fte",
  FTE_INTERN: "fteIntern",
  INTERN_PPO: "internPpo"
};

const COMPANY_TYPES = {
  MNC: "MNC",
  STARTUP: "Start-up",
  PSU: "PSU",
  PRIVATE: "Private",
  NGO: "NGO",
  OTHER: "Other"
};

const COMPANY_DOMAINS = {
  ANALYTICS: "Analytics",
  CONSULTING: "Consulting",
  CORE_TECHNICAL: "Core(Technical)",
  FINANCE: "Finance",
  MANAGEMENT: "Management",
  IT: "IT",
  OTHER: "Other"
};

const SELECTION_PROCESS_ROUNDS = {
  RESUME_SHORTLISTING: "resumeShortlisting",
  PRE_PLACEMENT_TALK: "prePlacementTalk",
  GROUP_DISCUSSION: "groupDiscussion",
  ONLINE_TEST: "onlineTest",
  APTITUDE_TEST: "aptitudeTest",
  TECHNICAL_TEST: "technicalTest",
  TECHNICAL_INTERVIEW: "technicalInterview",
  HR_INTERVIEW: "hrInterview",
  OTHER_ROUNDS: "otherRounds"
};

const branches = [
  "Computer Engineering", "Information Technology", "Electronics & Communication Engineering",
  "Electrical Engineering", "Mechanical Engineering", "Production & Industrial Engineering", "Civil Engineering"
];

const COURSES = {
  BTECH: "btech",
  MTECH: "mtech",
  MSC: "msc",
  PHD: "phd"
};

const btech = [
  "Computer Engineering", "Information Technology", "Electronics & Communication Engineering",
  "Electrical Engineering", "Mechanical Engineering", "Production & Industrial Engineering", "Civil Engineering"
];

const mtech = [
  { department: "Computer Engineering", specialization: ["Computer Engineering", "Information Technology"] },
  { department: "Electronics & Communication Engineering", specialization: ["Electronics & Communication Engineering", "VLSI Design"] },
  { department: "Electrical Engineering", specialization: ["Electrical Engineering", "Power Electronics & Drives"] },
  { department: "Mechanical Engineering", specialization: ["Mechanical Engineering", "Production & Industrial Engineering"] },
  { department: "Civil Engineering", specialization: ["Civil Engineering", "Construction Management"] },
];

const msc = [
  { department: "Computer Science", specialization: ["Computer Science", "Information Technology"] },
  { department: "Electronics", specialization: ["Electronics", "VLSI Design"] },
  { department: "Mathematics", specialization: ["Mathematics", "Statistics"] },
  { department: "Physics", specialization: ["Physics", "Material Science"] },
  { department: "Chemistry", specialization: ["Chemistry", "Organic Chemistry"] },
  { department: "Biotechnology", specialization: ["Biotechnology", "Bioinformatics"] },
];

const phd = [
  { department: "Computer Science", specialization: ["Computer Science", "Information Technology"] },
  { department: "Electronics", specialization: ["Electronics", "VLSI Design"] },
  { department: "Mathematics", specialization: ["Mathematics", "Statistics"] },
  { department: "Physics", specialization: ["Physics", "Material Science"] },
  { department: "Chemistry", specialization: ["Chemistry", "Organic Chemistry"] },
  { department: "Biotechnology", specialization: ["Biotechnology", "Bioinformatics"] },
];



// const mtech = [


const Branches = {
  btech: btech.map(branch => ({ name: branch, eligible: false })),

  
}

const steps = ["Company Details", "Job Details", "Eligiblity Details", "Selection & POC Details", "Additional Details"];

const AddPlacementDialog = ({ open, handleClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    placementDrive_title: "",
    companyDetails: { name: "", email: "", website: "", companyType: "", domain: "", description: "" },
    jobProfile: { profileId: "negnek", course: "", designation: "", jobDescription: { description: "", attachFile: false, file: "" }, ctc: "", takeHome: "", perks: "", trainingPeriod: "", placeOfPosting: "", jobType: "", stipend: "", internDuration: "" },
    eligibleBranchesForProfiles: [{ profileId: "negnek", branches: { 
      btech: btech.map(branch => ({ name: branch, eligible: false })), 
      // mtech: mtech.map(({ department, specialization }) => ({ department, specialization: specialization.map(s => ({ name: s, eligible: false })) })), 
      // msc: msc.map(({ department, specialization }) => ({ department, specialization: specialization.map(s => ({ name: s, eligible: false })) })), 
      // phd: phd.map(({ department, specialization }) => ({ department, specialization: specialization.map(s => ({ name: s, eligible: false })) })) 
    }}],
    selectionProcess: [{ profileId: "negnek", rounds: [{ roundNumber: 1, roundName: "", details: "" }], expectedRecruits: "", tentativeDate: "" }],
    eligibilityCriteria: { minCgpa: "", backlogAllowed: "" },
    bondDetails: { hasBond: false, details: "" },
    pointOfContact: [{ name: "", designation: "", mobile: "", email: "" }],
    applicationDetails: { applicationDeadline: "", applicationLink: "" },
    createdBy: "345678987653456789876534",
    assignedUser: "345678987653456789876534",
  });

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const handleChange = (e, path) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split(".");
      let obj = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = type === "checkbox" ? checked : value;
      return { ...newData };
    });
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        if (!formData.companyDetails.name || !formData.companyDetails.email || !formData.companyDetails.companyType || !formData.companyDetails.domain) {
          setNotification({
            open: true,
            message: "Please fill all required company details",
            severity: "error"
          });
          return false;
        }
        break;
      case 1:
        if (!formData.jobProfile.profileId || !formData.jobProfile.course || !formData.jobProfile.jobType) {
          setNotification({
            open: true,
            message: "Please fill all required job details",
            severity: "error"
          });
          return false;
        }
        break;
      case 2:
        if (!formData.eligibilityCriteria.minCgpa || !formData.eligibilityCriteria.backlogAllowed) {
          setNotification({
            open: true,
            message: "Please fill all eligibility criteria",
            severity: "error"
          });
          return false;
        }
        break;
      case 3:
        if (!formData.pointOfContact[0].name || !formData.pointOfContact[0].email) {
          setNotification({
            open: true,
            message: "Please fill at least one point of contact",
            severity: "error"
          });
          return false;
        }
        break;
      case 4:
        if (!formData.placementDrive_title || !formData.applicationDetails.applicationDeadline) {
          setNotification({
            open: true,
            message: "Please fill drive title and application deadline",
            severity: "error"
          });
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    try {
      await placementService.createPlacementDrive(formData);
      setNotification({
        open: true,
        message: "Placement drive created successfully!",
        severity: "success"
      });
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      let errorMessage = "Error creating placement drive. ";
      
      // Handle specific error cases
      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else {
        errorMessage += "Please try again.";
      }

      setNotification({
        open: true,
        message: errorMessage,
        severity: "error"
      });
    }
  };

  const handleNotificationClose = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleBack = () => setActiveStep(prev => prev - 1);

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle variant="h5">Add Placement Drive</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        <Container>
        {activeStep === 0 && (
          <>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h5" color="primary">
              Company Details
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: "Company Name", name: "name", value: formData.companyDetails.name, required: true, fullWidth: true },
                { label: "Email", name: "email", value: formData.companyDetails.email, required: true },
                { label: "Website", name: "website", value: formData.companyDetails.website },
                { label: "Company Type", name: "companyType", value: formData.companyDetails.companyType, options: COMPANY_TYPES, select: true, required: true },
                { label: "Domain", name: "domain", value: formData.companyDetails.domain, options: COMPANY_DOMAINS, select: true, required: true },
                { label: "Description", name: "description", value: formData.companyDetails.description, multiline: true, rows: 4, fullWidth: true }
              ].map(({ label, name, value, options, select, required, multiline, rows, fullWidth }, index) => (
                <Grid item xs={12} sm={fullWidth ? 12 : 6} key={index}>
                  <TextField
                    label={label}
                    fullWidth
                    name={name}
                    value={value}
                    onChange={(e) => handleChange(e, `companyDetails.${name}`)}
                    select={select}
                    required={required}
                    multiline={multiline}
                    rows={rows}
                  >
                    {select && Object.values(options).map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
              ))}
            </Grid>
          </>
        )}
        {activeStep === 1 && (
          <Container sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ my: 2 }} color="primary">
              Job Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Profile ID" fullWidth name="profileId" value={formData.jobProfile.profileId} onChange={(e) => handleChange(e, "jobProfile.profileId")} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Designation" fullWidth name="designation" value={formData.jobProfile.designation} onChange={(e) => handleChange(e, "jobProfile.designation")} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select label="Course" fullWidth name="course" value={formData.jobProfile.course} onChange={(e) => handleChange(e, "jobProfile.course")} required>
                  {["btech", "mtech", "msc", "phd"].map((course) => (
                    <MenuItem key={course} value={course}>{course}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select label="Job Type" fullWidth name="jobType" value={formData.jobProfile.jobType} onChange={(e) => handleChange(e, "jobProfile.jobType")} required>
                  {Object.entries(JOB_TYPES).map(([key, value]) => (
                    <MenuItem key={value} value={value}>{key}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField label="Job Description" fullWidth multiline rows={3} name="description" value={formData.jobProfile.jobDescription.description} onChange={(e) => handleChange(e, "jobProfile.jobDescription.description")} />
              </Grid>
              {["CTC", "Take Home Salary", "Training Period", "Place of Posting"].map((field, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <TextField label={field} fullWidth type={field.includes("Salary") ? "number" : "text"} name={field.toLowerCase().replace(/\s/g, '')} value={formData.jobProfile[field.toLowerCase().replace(/\s/g, '')]} onChange={(e) => handleChange(e, `jobProfile.${field.toLowerCase().replace(/\s/g, '')}`)} />
                </Grid>
              ))}
              {formData.jobProfile.jobType !== JOB_TYPES.FTE && (
                <>
                  {["Stipend", "Intern Duration"].map((field, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <TextField label={field} fullWidth name={field.toLowerCase().replace(/\s/g, '')} value={formData.jobProfile[field.toLowerCase().replace(/\s/g, '')]} onChange={(e) => handleChange(e, `jobProfile.${field.toLowerCase().replace(/\s/g, '')}`)} />
                    </Grid>
                  ))}
                </>
              )}
              <Grid item xs={12}>
                <TextField label="Perks" fullWidth name="perks" value={formData.jobProfile.perks} onChange={(e) => handleChange(e, "jobProfile.perks")} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel control={<Checkbox checked={formData.jobProfile.jobDescription.attachFile} onChange={(e) => handleChange(e, "jobProfile.jobDescription.attachFile")} />} label="Attach File" />
              </Grid>
              {formData.jobProfile.jobDescription.attachFile && (
                <Grid item xs={12} sm={6}>
                  <TextField label="File URL" fullWidth name="file" value={formData.jobProfile.jobDescription.file} onChange={(e) => handleChange(e, "jobProfile.jobDescription.file")} required />
                </Grid>
              )}
            </Grid>
          </Container>
        )}
          {activeStep === 2 && (
            <>
              {formData.eligibleBranchesForProfiles.map((profile) =>
                profile.profileId === formData.jobProfile.profileId ? (
                  <Container key={profile.profileId} sx={{ mt: 4 }}>
                    <Typography variant="h5" sx={{ my: 2 }} color="primary">
                      Eligible Branches for {formData.jobProfile.course.toUpperCase()}
                    </Typography>

                    {formData.jobProfile.course === COURSES.BTECH &&
                      profile.branches.btech.map((branch, index) => (
                        <FormControlLabel
                          key={branch.name}
                          control={
                            <Checkbox
                              checked={branch.eligible}
                              onChange={(e) => handleChange(e, `eligibleBranchesForProfiles.0.branches.btech.${index}.eligible`)}
                            />
                          }
                          label={branch.name}
                        />
                      ))}
{/* 
                    {formData.jobProfile.course === COURSES.MTECH &&
                      profile.branches.mtech.map((dept, deptIndex) => (
                        <Box key={dept.department} sx={{ mb: 2 }}>
                          <Typography variant="h6" color="secondary">{dept.department}</Typography>
                          {dept.specialization.map((spec, specIndex) => (
                            <FormControlLabel
                              key={spec.name}
                              control={
                                <Checkbox
                                  checked={spec.eligible}
                                  onChange={(e) =>
                                    handleChange(e, `eligibleBranchesForProfiles.0.branches.mtech.${deptIndex}.specialization.${specIndex}.eligible`)
                                  }
                                />
                              }
                              label={spec.name}
                            />
                          ))}
                        </Box>
                      ))}

                    {formData.jobProfile.course === COURSES.MSC &&
                      profile.branches.msc.map((dept, deptIndex) => (
                        <Box key={dept.department} sx={{ mb: 2 }}>
                          <Typography variant="h6" color="secondary">{dept.department}</Typography>
                          {dept.specialization.map((spec, specIndex) => (
                            <FormControlLabel
                              key={spec.name}
                              control={
                                <Checkbox
                                  checked={spec.eligible}
                                  onChange={(e) =>
                                    handleChange(e, `eligibleBranchesForProfiles.0.branches.msc.${deptIndex}.specialization.${specIndex}.eligible`)
                                  }
                                />
                              }
                              label={spec.name}
                            />
                          ))}
                        </Box>
                      ))} */}

                    {/* {formData.jobProfile.course === COURSES.PHD &&
                      profile.branches.phd.map((dept, deptIndex) => (
                        <Box key={dept.department} sx={{ mb: 2 }}>
                          <Typography variant="h6" color="secondary">{dept.department}</Typography>
                          {dept.specialization.map((spec, specIndex) => (
                            <FormControlLabel
                              key={spec.name}
                              control={
                                <Checkbox
                                  checked={spec.eligible}
                                  onChange={(e) =>
                                    handleChange(e, `eligibleBranchesForProfiles.0.branches.phd.${deptIndex}.specialization.${specIndex}.eligible`)
                                  }
                                />
                              }
                              label={spec.name}
                            />
                          ))}
                        </Box>
                      ))} */}
                  </Container>
                ) : null
              )}


              <Container sx={{ mt: 4 }}>
                <Typography variant="h5" sx={{ my: 2 }} color="primary">
                  Eligibility Criteria
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Minimum CGPA" fullWidth margin="normal" type="number" value={formData.eligibilityCriteria.minCgpa} onChange={(e) => handleChange(e, "eligibilityCriteria.minCgpa")} required />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Backlogs Allowed" fullWidth margin="normal" type="number" value={formData.eligibilityCriteria.backlogAllowed} onChange={(e) => handleChange(e, "eligibilityCriteria.backlogAllowed")} required />
                  </Grid>
                </Grid>
                <TextField label="Other Eligibility Criteria" fullWidth margin="normal" value={formData.eligibilityCriteria.otherEligibility} onChange={(e) => handleChange(e, "eligibilityCriteria.otherEligibility")} />
              </Container>
            </>
          )}
          {activeStep === 3 && (
            <>
              <Typography sx={{ mt: 4 }} variant="h5" color="primary">Selection Process</Typography>
              {formData.selectionProcess[0].rounds.map((round, index) => (
                <Grid container spacing={2} key={index}>
                  <Grid item xs={12} sm={4}>
                    <TextField label="Round Number" fullWidth margin="normal" type="number" value={round.roundNumber} onChange={(e) => handleChange(e, `selectionProcess.0.rounds.${index}.roundNumber`)} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField select label="Round Name" fullWidth margin="normal" value={round.roundName} onChange={(e) => handleChange(e, `selectionProcess.0.rounds.${index}.roundName`)}>
                      {Object.values(SELECTION_PROCESS_ROUNDS).map((roundName) => (
                        <MenuItem key={roundName} value={roundName}>{roundName}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField label="Details" fullWidth margin="normal" value={round.details} onChange={(e) => handleChange(e, `selectionProcess.0.rounds.${index}.details`)} />
                  </Grid>
                </Grid>
              ))}
              <Button variant="outlined" sx={{ mt: 2 }} onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  selectionProcess: [{ ...prev.selectionProcess[0], rounds: [...prev.selectionProcess[0].rounds, { roundNumber: prev.selectionProcess[0].rounds.length + 1, roundName: "", details: "" }] }]
                }));
              }}>
                Add Round
              </Button>

              <Typography sx={{ mt: 4 }} variant="h5" color="primary">Point of Contact</Typography>
              {formData.pointOfContact.map((poc, index) => (
                <Grid container spacing={2} key={index}>
                  <Grid item xs={12}><Typography variant="h6">Contact {index + 1}</Typography></Grid>
                  <Grid item xs={12} sm={6}><TextField label="Name" fullWidth margin="normal" value={poc.name} onChange={(e) => handleChange(e, `pointOfContact.${index}.name`)} required /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="Email" fullWidth margin="normal" value={poc.email} onChange={(e) => handleChange(e, `pointOfContact.${index}.email`)} required /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="Designation" fullWidth margin="normal" value={poc.designation} onChange={(e) => handleChange(e, `pointOfContact.${index}.designation`)} /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="Mobile" fullWidth margin="normal" type="tel" value={poc.mobile} onChange={(e) => handleChange(e, `pointOfContact.${index}.mobile`)} /></Grid>
                </Grid>
              ))}
              <Button variant="outlined" sx={{ mt: 2 }} onClick={() => {
                setFormData((prev) => ({ ...prev, pointOfContact: [...prev.pointOfContact, { name: "", designation: "", mobile: "", email: "" }] }));
              }}>
                Add Another Contact
              </Button>
            </>
          )}
        {activeStep === 4 && (
          <Container>
            <Typography sx={{ mt: 4 }} variant="h5" color="primary">Drive Title</Typography>
            <TextField label="Placement Drive Title" fullWidth margin="normal" name="placementDrive_title" value={formData.placementDrive_title} onChange={(e) => handleChange(e, "placementDrive_title")} required />

            <Typography sx={{ mt: 2 }} variant="h5" color="primary">Application Details</Typography>
            <TextField label="Application Deadline" fullWidth margin="normal" type="date" name="applicationDeadline" value={formData.applicationDetails.applicationDeadline} onChange={(e) => handleChange(e, "applicationDetails.applicationDeadline")} InputLabelProps={{ shrink: true }} required />
            <TextField label="Application Link" fullWidth margin="normal" name="applicationLink" value={formData.applicationDetails.applicationLink} onChange={(e) => handleChange(e, "applicationDetails.applicationLink")} />

            <Typography variant="h5" sx={{ mt: 2 }} color="primary">Bond Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel control={<Checkbox checked={formData.bondDetails.hasBond} onChange={(e) => handleChange(e, "bondDetails.hasBond")} />} label="Does this job have a bond?" />
              </Grid>
              {formData.bondDetails.hasBond && (
                <Grid item xs={12}>
                  <TextField label="Bond Details" fullWidth multiline rows={3} name="details" value={formData.bondDetails.details} onChange={(e) => handleChange(e, "bondDetails.details")} required />
                </Grid>
              )}
            </Grid>
          </Container>
        )}
      </Container>
      </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}
          {activeStep < steps.length - 1 ? <Button onClick={handleNext} color="primary" variant="contained">Next</Button> : <Button onClick={handleSubmit} color="primary" variant="contained">Submit</Button>}
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleNotificationClose} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddPlacementDialog;

