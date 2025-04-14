import React, { useState, useEffect } from "react";
import { Container,Dialog, DialogActions, DialogContent, DialogTitle, Box, TextField, Button, MenuItem, Typography, Grid,Stepper, Step, StepLabel, Checkbox, FormControlLabel, Stack, Paper, Grid2, Snackbar, Alert } from "@mui/material";
import placementService from "../../../services/admin/placementService";
import { time } from "framer-motion";
import jnfService from "../../../services/admin/jnfService";
import placementSessionService from "../../../services/admin/placementSessionService";
// add a form fild in the last step for placement session       
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
  { dept: "Computer Engineering", spl: "Machine Learning" },
  { dept: "Information Technology", spl: "Data Science" },
  { dept: "Electronics & Communication Engineering",spl: "VLSI Design" },
  { dept: "Electrical Engineering", spl: "Power System" },
  { dept: "Mechanical Engineering", spl: "Automobile Design" },
  { dept: "Civil Engineering", spl: "Structural Engineering" },
  { dept: "Production & Industrial Engineering", spl: "Manufacturing Engineering" }
];

const msc = [
  { dept: "Computer Engineering", spl: "Machine Learning" },
  { dept: "Information Technology", spl: "Data Science" },
  { dept: "Electronics & Communication Engineering",spl: "VLSI Design" },
  { dept: "Electrical Engineering", spl: "Power System" },
  { dept: "Mechanical Engineering", spl: "Automobile Design" },
  { dept: "Civil Engineering", spl: "Structural Engineering" },
  { dept: "Production & Industrial Engineering", spl: "Manufacturing Engineering" }
];

const phd = [
  { dept: "Computer Engineering", spl: "Machine Learning" },
  { dept: "Information Technology", spl: "Data Science" },
  { dept: "Electronics & Communication Engineering",spl: "VLSI Design" },
  { dept: "Electrical Engineering", spl: "Power System" },
  { dept: "Mechanical Engineering", spl: "Automobile Design" },
  { dept: "Civil Engineering", spl: "Structural Engineering" },
  { dept: "Production & Industrial Engineering", spl: "Manufacturing Engineering" }
];

const steps = ["Company Details", "Job Details", "Eligiblity Details", "Selection & POC Details", "Additional Details"];

const AddPlacementDialog = ({ open, handleClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [formData, setFormData] = useState({
    placementSession: "",
    placementDrive_title: "",
    companyDetails: { name: "", email: "", website: "", companyType: "", domain: "", description: "" },
    jobProfile: { profileId: "negnek", course: "", designation: "", jobDescription: { description: "", attachFile: false, file: "" }, ctc: 0, takeHome: 0, perks: "", trainingPeriod: "", placeOfPosting: "", jobType: "", stipend: 0, internDuration: "" },
    eligibleBranchesForProfiles: [{ profileId: "negnek", branches: { 
      btech: btech.map(branch => ({ name: branch, eligible: false })), 
      mtech: mtech.map(({ dept, spl }) => ({ department:dept, specialization:spl, eligible:false})), 
      msc: msc.map(({ dept, spl }) => ({ department:dept, specialization:spl, eligible:false})), 
      phd: phd.map(({ dept, spl }) => ({ department:dept, specialization:spl, eligible:false}))
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

  const [jnfs, setJnfs] = useState([]);
  const [availableJobProfiles, setAvailableJobProfiles] = useState([]);

  // Add a new state to trigger the navigation effect
  const [shouldCheckNavigation, setShouldCheckNavigation] = useState(false);

  // Add useEffect to handle navigation
  useEffect(() => {
    if (shouldCheckNavigation) {
      findAndNavigateToIncompleteStep();
      setShouldCheckNavigation(false);
    }
  }, [shouldCheckNavigation, formData]);
 
  const [placementSessions, setPlacementSessions] = useState([]);
  const [newSessionName, setNewSessionName] = useState("");
  const [newSessionDescription, setNewSessionDescription] = useState("");
  const [creatingNewSession, setCreatingNewSession] = useState(false);

  useEffect(() => {
    const fetchPlacementSessions = async () => {
      try {
        const response = await placementSessionService.getAll();
        setPlacementSessions(response.data || []);
      } catch (error) {
        console.error("Error fetching placement sessions:", error);
        setNotification({
          open: true,
          message: "Error fetching placement sessions. Please try again.",
          severity: "error"
        });
      }
    };    
    fetchPlacementSessions();
  }, []); 

  const handleSessionChange = (e) => {
    setFormData(prev => ({
      ...prev,
      placementSession: e.target.value
    }));
  };  


  const handleNewSessionChange = (e) => {
    setNewSessionName(e.target.value);
  };

  const handleNewSessionDescriptionChange = (e) => {
    setNewSessionDescription(e.target.value);
  };  

  const handleCreateSession = async () => {
    setCreatingNewSession(true);
    try {
      await placementSessionService.create({ name: newSessionName, description: newSessionDescription }); 
      setNotification({
        open: true,
        message: "Placement session created successfully!",
        severity: "success"
      });
    } catch (error) { 
      console.error("Error creating placement session:", error);
      setNotification({
        open: true,
        message: "Error creating placement session. Please try again.",
        severity: "error"
      });
    } finally {
      setCreatingNewSession(false);
    }
  };

  useEffect(() => {
    const fetchJNFs = async () => {
      try {
        const response = await jnfService.getAll();
        const jnfData = response.data || [];
        console.log('JNF Data:', jnfData);
        setJnfs(Array.isArray(jnfData) ? jnfData : []);
      } catch (error) {
        console.error("Error fetching JNFs:", error);
        setNotification({
          open: true,
          message: "Error fetching JNFs. Please try again.",
          severity: "error"
        });
        setJnfs([]);
      }
    };
    fetchJNFs();
  }, []);

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
        if (!formData.placementDrive_title || !formData.applicationDetails.applicationDeadline || !formData.placementSession) {
          setNotification({
            open: true,
            message: "Please fill drive title, application deadline, and select a placement session",
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


  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    try {
        // Add selectedJNF to the form data
        const submissionData = {
            ...formData,
            selectedJNF: jnfs.find(jnf => 
                jnf.jobProfiles?.some(profile => 
                    profile._id === formData.jobProfile.profileId
                )
            )?._id
        };

        await placementService.createPlacementDrive(submissionData);
        handleClose();
        setConfirmDialog(false);
        setNotification({
            open: true,
            message: "Placement drive created successfully!",
            severity: "success"
        });
    } catch (error) {
        console.error("Error submitting form:", error);
        setNotification({
            open: true,
            message: "Error creating placement drive. Please try again.",
            severity: "error"
        });
    }
};

  const handleSubmit =  ()=> {
      setConfirmDialog(true);
  };

  

  const handleNotificationClose = () => {
    setNotification(prev => ({ ...prev, open: false }));
    window.location.reload();
  };

  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleJNFSelection = (selectedJnf) => {
    if (!selectedJnf) return;

    setAvailableJobProfiles(selectedJnf.jobProfiles || []);
    
    setFormData(prev => ({
      ...prev,
      companyDetails: {
        name: selectedJnf.companyDetails?.name || "",
        email: selectedJnf.companyDetails?.email || "",
        website: selectedJnf.companyDetails?.website || "",
        companyType: selectedJnf.companyDetails?.companyType || "",
        domain: selectedJnf.companyDetails?.domain || "",
        description: selectedJnf.companyDetails?.description || ""
      }
    }));

    // Navigate to step 1 after setting company details
    setActiveStep(1);
  };

  const handleJobProfileSelection = (selectedProfileId, selectedJnf) => {
    if (!selectedProfileId || !selectedJnf) return;

    console.log("\n=== Job Profile Selection Debug ===");
    console.log("Selected Profile ID:", selectedProfileId);
    
    const jobProfile = selectedJnf.jobProfiles.find(profile => profile._id === selectedProfileId);
    console.log("\nFound Job Profile:", jobProfile);

    setFormData(prev => ({
      ...prev,
      jobProfile: {
        ...prev.jobProfile,
        profileId: jobProfile._id || "negnek",
        course: jobProfile.course || "",
        designation: jobProfile.designation || "",
        jobDescription: {
          description: jobProfile.jobDescription?.description || "",
          attachFile: jobProfile.jobDescription?.attachFile || false,
          file: jobProfile.jobDescription?.file || ""
        },
        ctc: (jobProfile.ctc ?? 0),
        takeHome: (jobProfile.takeHome ?? 0),
        perks: jobProfile.perks || "",
        trainingPeriod: jobProfile.trainingPeriod || "",
        placeOfPosting: jobProfile.placeOfPosting || "",
        jobType: jobProfile.jobType || "",
        stipend: (jobProfile.stipend ?? "").toString(),
        internDuration: jobProfile.internDuration || ""
      },
      bondDetails: {
        hasBond: selectedJnf.bondDetails?.hasBond || false,
        details: selectedJnf.bondDetails?.details || ""
      },
      eligibleBranchesForProfiles: [{
        profileId: selectedProfileId,
        branches: {
          btech: btech.map(branchName => {
            const foundBranch = selectedJnf.eligibleBranchesForProfiles[0].branches.btech.find(
              b => b.name === branchName
            );
            console.log(`Checking branch ${branchName}:`, foundBranch);
            return {
              name: branchName,
              eligible: foundBranch?.eligible || false
            };
          }),
          mtech: mtech.map(({ dept, spl }) => ({
            department: dept,
            specialization: spl,
            eligible: selectedJnf.eligibleBranchesForProfiles[0].branches.mtech.some(
              b => b.department === dept && b.specialization === spl && b.eligible
            ) || false
          })),
          msc: msc.map(({ dept, spl }) => ({
            department: dept,
            specialization: spl,
            eligible: selectedJnf.eligibleBranchesForProfiles[0].branches.msc.some(
              b => b.department === dept && b.specialization === spl && b.eligible
            ) || false
          })),
          phd: phd.map(({ dept, spl }) => ({
            department: dept,
            specialization: spl,
            eligible: selectedJnf.eligibleBranchesForProfiles[0].branches.phd.some(
              b => b.department === dept && b.specialization === spl && b.eligible
            ) || false
          }))
        }
      }],
      selectionProcess: [{
        profileId: selectedProfileId,
        rounds: selectedJnf.selectionProcessForProfiles?.find(
          process => process.profileId === "profile-0"
        )?.rounds?.map((round, index) => ({
          roundNumber: index + 1,
          roundName: round.type,
          details: round.details
        })) || [{ roundNumber: 1, roundName: "", details: "" }],
        expectedRecruits: selectedJnf.selectionProcessForProfiles?.find(
          process => process.profileId === "profile-0"
        )?.expectedRecruits?.toString() || "",
        tentativeDate: selectedJnf.selectionProcessForProfiles?.find(
          process => process.profileId === "profile-0"
        )?.tentativeDate ? 
          new Date(selectedJnf.selectionProcessForProfiles.find(
            process => process.profileId === "profile-0"
          ).tentativeDate).toISOString().split('T')[0] : ""
      }],
      eligibilityCriteria: {
        minCgpa: (selectedJnf.eligibilityCriteria?.minCgpa ?? "").toString(),
        backlogAllowed: (selectedJnf.eligibilityCriteria?.backlogAllowed ?? "").toString(),
        otherEligibility: selectedJnf.eligibilityCriteria?.otherEligibility || ""
      },
      pointOfContact: selectedJnf.pointOfContact?.map(poc => ({
        name: poc.name || "",
        designation: poc.designation || "",
        mobile: poc.mobile || "",
        email: poc.email || ""
      })) || [{ name: "", designation: "", mobile: "", email: "" }]
    }));

    // Trigger navigation check
    setShouldCheckNavigation(true);
  };

  const findAndNavigateToIncompleteStep = () => {
    // Check step 0 (Company Details)
    if (!formData.companyDetails.name || 
        !formData.companyDetails.email || 
        !formData.companyDetails.companyType || 
        !formData.companyDetails.domain) {
      setActiveStep(0);
      return;
    }

    // Check step 1 (Job Details)
    if (!formData.jobProfile.profileId || 
        !formData.jobProfile.course || 
        !formData.jobProfile.jobType) {
      setActiveStep(1);
      return;
    }

    // Check step 2 (Eligibility Details)
    if (!formData.eligibilityCriteria.minCgpa || 
        !formData.eligibilityCriteria.backlogAllowed) {
      setActiveStep(2);
      return;
    }

    // Check step 3 (Selection & POC Details)
    if (!formData.pointOfContact[0].name || 
        !formData.pointOfContact[0].email) {
      setActiveStep(3);
      return;
    }

    // Check step 4 (Additional Details)
    if (!formData.placementDrive_title || 
        !formData.applicationDetails.applicationDeadline) {
      setActiveStep(4);
      return;
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h5" color="primary">
              JNF Selection
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Select JNF"
                  defaultValue=""
                  onChange={(e) => {
                    const selectedJnf = jnfs.find(jnf => jnf._id === e.target.value);
                    if (selectedJnf) {
                      handleJNFSelection(selectedJnf);
                    }
                  }}
                >
                  <MenuItem value="" disabled>Select a JNF</MenuItem>
                  {Array.isArray(jnfs) && jnfs.length > 0 ? (
                    jnfs.map((jnf) => (
                      <MenuItem key={jnf._id} value={jnf._id}>
                        {jnf.companyDetails?.name || 'Unnamed Company'} - {jnf._id}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No JNFs available</MenuItem>
                  )}
                </TextField>
              </Grid>

              {/* Add Job Profile Selection */}
              {availableJobProfiles.length > 0 && (
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Select Job Profile"
                    defaultValue=""
                    onChange={(e) => {
                      const selectedJnf = jnfs.find(jnf => 
                        jnf.jobProfiles?.some(profile => profile._id === e.target.value)
                      );
                      if (selectedJnf) {
                        handleJobProfileSelection(e.target.value, selectedJnf);
                      }
                    }}
                  >
                    <MenuItem value="" disabled>Select a Job Profile</MenuItem>
                    {availableJobProfiles.map((profile) => (
                      <MenuItem key={profile._id} value={profile._id}>
                        {profile.designation} - {profile.course} ({profile.jobType})
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}
            </Grid>
            
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
        );
      case 1:
        return (
          <Container sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ my: 2 }} color="primary">
              Job Profile Selection
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Select Job Profile"
                  defaultValue=""
                  onChange={(e) => {
                    const selectedJnf = jnfs.find(jnf => 
                      jnf.jobProfiles?.some(profile => profile._id === e.target.value)
                    );
                    if (selectedJnf) {
                      handleJobProfileSelection(e.target.value, selectedJnf);
                    }
                  }}
                >
                  <MenuItem value="" disabled>Select a Job Profile</MenuItem>
                  {availableJobProfiles.map((profile) => (
                    <MenuItem key={profile._id} value={profile._id}>
                      {profile.designation} - {profile.course} ({profile.jobType})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

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
                <TextField 
                  label="Job Description" 
                  fullWidth 
                  multiline 
                  rows={3} 
                  value={formData.jobProfile.jobDescription.description} 
                  onChange={(e) => handleChange(e, "jobProfile.jobDescription.description")} 
                />
              </Grid>
              {["ctc", "takeHome", "trainingPeriod", "placeOfPosting"].map((field, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <TextField 
                    label={field}
                    fullWidth
                    type={field === "ctc" || field === "takeHome" || field === "stipend" ? "number" : "text"}
                    name={field}
                    value={formData.jobProfile[field]}
                    onChange={(e) => handleChange(e, `jobProfile.${field}`)}
                  />
                </Grid>
              ))}
              {formData.jobProfile.jobType !== JOB_TYPES.FTE && (
                <>
                  {["stipend", "internDuration"].map((field, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <TextField label={field} fullWidth name={field} value={formData.jobProfile[field]} onChange={(e) => handleChange(e, `jobProfile.${field}`)} />
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
        );
      case 2:
        return (
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
                  {formData.jobProfile.course === COURSES.MTECH && (
                    profile?.branches?.mtech?.length > 0 ? (
                      profile.branches.mtech.map(({ department, specialization, eligible }, deptIndex) => (
                        <Box key={department} sx={{ mb: 2 }}>
                          <Typography variant="h6" color="secondary">{department}</Typography>
                          <FormControlLabel
                            key={specialization}
                            control={
                              <Checkbox
                                checked={eligible || false} // Ensure eligible is not undefined
                                onChange={(e) =>
                                  handleChange(e, `eligibleBranchesForProfiles.0.branches.mtech.${deptIndex}.eligible`)
                                }
                              />
                            }
                            label={specialization} // Display specialization name as label
                          />
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        No M.Tech branches available.
                      </Typography>
                    )
                  )}

                  {formData.jobProfile.course === COURSES.MSC && (
                      profile.branches.msc.map(({ department, specialization, eligible }, deptIndex) => (
                        <Box key={department} sx={{ mb: 2 }}>
                          <Typography variant="h6" color="secondary">{department}</Typography>
                          <FormControlLabel
                            key={specialization}
                            control={
                              <Checkbox
                                checked={eligible || false} // Ensure eligible is not undefined
                                onChange={(e) =>
                                  handleChange(e, `eligibleBranchesForProfiles.0.branches.msc.${deptIndex}.eligible`)
                                }
                              />
                            }
                            label={specialization} // Display specialization name as label
                          />
                        </Box>
                      ))
                  )}
                  
                  {formData.jobProfile.course === COURSES.PHD && (
                      profile.branches.phd.map(({ department, specialization, eligible }, deptIndex) => (
                        <Box key={department} sx={{ mb: 2 }}>
                          <Typography variant="h6" color="secondary">{department}</Typography>
                          <FormControlLabel
                            key={specialization}
                            control={
                              <Checkbox
                                checked={eligible || false} // Ensure eligible is not undefined
                                onChange={(e) =>
                                  handleChange(e, `eligibleBranchesForProfiles.0.branches.phd.${deptIndex}.eligible`)
                                }
                              />
                            }
                            label={specialization} // Display specialization name as label
                          />
                        </Box>
                      ))
                  )}
                </Container>
              ) : null
            )}


            <Container sx={{ mt: 4 }}>
              <Typography variant="h5" sx={{ my: 2 }} color="primary">
                Eligibility Criteria
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    label="Minimum CGPA" 
                    fullWidth 
                    margin="normal" 
                    type="number" 
                    value={formData.eligibilityCriteria.minCgpa || ""} 
                    onChange={(e) => handleChange(e, "eligibilityCriteria.minCgpa")} 
                    required 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    label="Backlogs Allowed" 
                    fullWidth 
                    margin="normal" 
                    type="number" 
                    value={formData.eligibilityCriteria.backlogAllowed || ""} 
                    onChange={(e) => handleChange(e, "eligibilityCriteria.backlogAllowed")} 
                    required 
                  />
                </Grid>
              </Grid>
              <TextField label="Other Eligibility Criteria" fullWidth margin="normal" value={formData.eligibilityCriteria.otherEligibility} onChange={(e) => handleChange(e, "eligibilityCriteria.otherEligibility")} />
            </Container>
          </>
        );
      case 3:
        return (
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
        );
      case 4:
        return (
          <Container>
            <Typography variant="h5" color="primary">Drive Title</Typography>
            <TextField label="Placement Drive Title" fullWidth margin="normal" name="placementDrive_title" value={formData.placementDrive_title} onChange={(e) => handleChange(e, "placementDrive_title")} required />

            <Typography variant="h5" color="primary">Application Details</Typography>
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
            
            {/* Add placement session selection here */}
            <Typography variant="h5" sx={{ mt: 3 }} color="primary">Placement Session</Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Select an existing placement session or create a new one
            </Typography>
            
            <TextField
              select
              label="Placement Session"
              fullWidth
              margin="normal"
              value={formData.placementSession}
              onChange={handleSessionChange}
              required
            >
              <MenuItem value="">Select a session</MenuItem>
              {placementSessions.map((session) => (
                <MenuItem key={session._id} value={session._id}>
                  {session.name}
                </MenuItem>
              ))}
            </TextField>
            
            <Typography variant="h6" sx={{ mt: 2 }}>Create New Session</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Session Name" 
                  fullWidth 
                  margin="normal"
                  value={newSessionName}
                  onChange={handleNewSessionChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Session Description" 
                  fullWidth 
                  margin="normal"
                  value={newSessionDescription}
                  onChange={handleNewSessionDescriptionChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleCreateSession}
                  disabled={!newSessionName || creatingNewSession}
                >
                  {creatingNewSession ? "Creating..." : "Create New Session"}
                </Button>
              </Grid>
            </Grid>
          </Container>
        );
      default:
        return "Unknown step";
    }
  };

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
        {getStepContent(activeStep)}
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

      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Confirm Placement Drive</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to create this placement drive?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={handleConfirm} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddPlacementDialog;

