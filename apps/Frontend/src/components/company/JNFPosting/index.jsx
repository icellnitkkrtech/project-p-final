import React, { useState } from 'react';
import axios from '../axios';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { 
    Snackbar, 
    Alert, 
    CircularProgress, 
    Backdrop, 
    AlertTitle 
} from '@mui/material';
import {
    Box,
    Container,
    Paper,
    Stepper,
    Step,
    StepLabel,
    Typography,
    Button,
    useTheme,
    Stack,
    Divider
} from '@mui/material';
import {
    Business as BusinessIcon,
    Work as WorkIcon,
    Group as GroupIcon,
    Assessment as AssessmentIcon,
    Info as InfoIcon,
    Preview as PreviewIcon,
    CheckCircle as CheckIcon
} from '@mui/icons-material';

// Keep existing imports
import CompanyDetailsStep from './steps/CompanyDetailsStep';
import JobProfileStep from './steps/JobProfilesStep';
import ReviewStep from './steps/ReviewStep';
import SelectionProcessStep from './steps/SelectionProcessSteps';
import EligibleBranchesStep from './steps/EligibleBranchesStep';
import AdditionalDetailsStep from './steps/AdditionalDetailsStep';

const steps = [
    { number: 1, title: 'Company Details', icon: BusinessIcon },
    { number: 2, title: 'Job Profile', icon: WorkIcon },
    { number: 3, title: 'Eligible Branches', icon: GroupIcon },
    { number: 4, title: 'Selection Process', icon: AssessmentIcon },
    { number: 5, title: 'Additional Details', icon: InfoIcon },
    { number: 6, title: 'Review', icon: PreviewIcon }
];

const index = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { company, setCompany } = useOutletContext();
    const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Company Details - structure mostly the same
        companyDetails: {
            name: company?.companyName || '',
            email: company?.email || '',
            website: company?.website || '',
            companyType: '',
            domain: '',
            description: ''
        },

        // Job Profiles - now an array with profileId
        jobProfiles: [
            {
                profileId: "profile-0",
                course: 'btech',
                designation: '',
                jobDescription: {
                    description: '',
                    attachFile: false,
                    file: ''
                },
                ctc: '',
                takeHome: '',
                perks: '',
                trainingPeriod: '',
                placeOfPosting: '',
                jobType: 'fte'
            }
        ],

        // Eligible Branches - now linked to job profiles
        eligibleBranchesForProfiles: [
            {
                profileId: "profile-0",
                branches: {
                    btech: [
                        { name: 'Computer Engineering', eligible: false },
                        { name: 'Information Technology', eligible: false },
                        { name: 'Electronics & Communication Engineering', eligible: false },
                        { name: 'Electrical Engineering', eligible: false },
                        { name: 'Mechanical Engineering', eligible: false },
                        { name: 'Production & Industrial Engineering', eligible: false },
                        { name: 'Civil Engineering', eligible: false }
                    ],
                    mtech: [
                        { department: 'Computer Engineering', specialization: 'Cyber Security', eligible: false },
                        { department: 'Electronics and Communication Engineering', specialization: 'Communication Systems', eligible: false },
                        { department: 'Electronics and Communication Engineering', specialization: 'Transportation Engineering', eligible: false },
                        { department: 'Electrical Engineering', specialization: 'Power System', eligible: false },
                        { department: 'Electrical Engineering', specialization: 'Power Electronics & Drives', eligible: false },
                        { department: 'Electrical Engineering', specialization: 'Structural Engineering', eligible: false },
                        { department: 'Electrical Engineering', specialization: 'Geotechnical Engineering', eligible: false },
                        { department: 'Electrical Engineering', specialization: 'Control System', eligible: false },
                        { department: 'Mechanical Engineering', specialization: 'Thermal Engineering', eligible: false },
                        { department: 'Mechanical Engineering', specialization: 'Machine Design', eligible: false },
                        { department: 'Mechanical Engineering', specialization: 'Production & Industrial Engineering', eligible: false },
                        { department: 'School of Renewable Energy and Efficiency', specialization: 'Renewable Energy Systems', eligible: false },
                        { department: 'School of VLSI Design & Embedded System', specialization: 'VLSI Design', eligible: false },
                        { department: 'School of VLSI Design & Embedded System', specialization: 'Embedded System Design', eligible: false },
                        { department: 'Civil Engineering', specialization: 'Environmental Engineering', eligible: false },
                        { department: 'Civil Engineering', specialization: 'Water Resources Engineering', eligible: false },
                        { department: 'Physics', specialization: 'Instrumentation', eligible: false },
                        { department: 'Physics', specialization: 'Nanomaterials and Nanotechnology', eligible: false },
                        { department: 'Master of Computer Applications (MCA)', eligible: false },
                        { department: 'Master of Business Administration (MBA)', eligible: false },
                    ],
                    phd: [
                        { department: 'Computer Science & Engineering', specialization: 'Artificial Intelligence & Machine Learning', eligible: false },
                        { department: 'Computer Science & Engineering', specialization: 'Data Science', eligible: false },
                        { department: 'Computer Science & Engineering', specialization: 'Cybersecurity', eligible: false },
                        { department: 'Electronics & Communication', specialization: 'VLSI Design', eligible: false },
                        { department: 'Electronics & Communication', specialization: 'Communication Systems', eligible: false },
                        { department: 'Electronics & Communication', specialization: 'Signal Processing', eligible: false },
                        { department: 'Electrical Engineering', specialization: 'Power Systems', eligible: false },
                        { department: 'Electrical Engineering', specialization: 'Control Systems', eligible: false },
                        { department: 'Electrical Engineering', specialization: 'Renewable Energy', eligible: false },
                        { department: 'Mechanical Engineering', specialization: 'Thermal Engineering', eligible: false },
                        { department: 'Mechanical Engineering', specialization: 'Manufacturing Systems', eligible: false },
                        { department: 'Mechanical Engineering', specialization: 'Robotics', eligible: false },
                        { department: 'Civil Engineering', specialization: 'Structural Engineering', eligible: false },
                        { department: 'Civil Engineering', specialization: 'Environmental Engineering', eligible: false },
                        { department: 'Civil Engineering', specialization: 'Transportation Engineering', eligible: false },
                        { department: 'Physics', specialization: 'Quantum Computing', eligible: false },
                        { department: 'Physics', specialization: 'Materials Science', eligible: false },
                        { department: 'Chemistry', specialization: 'Polymer Chemistry', eligible: false },
                        { department: 'Chemistry', specialization: 'Analytical Chemistry', eligible: false },
                        { department: 'Mathematics', specialization: 'Applied Mathematics', eligible: false },
                        { department: 'Mathematics', specialization: 'Computational Mathematics', eligible: false }
                    ]
                }
            }
        ],

        // Eligibility Criteria - now an object
        eligibilityCriteria: {
            minCgpa: '',
            backlogAllowed: 0
        },

        // Selection Process - now linked to job profiles
        selectionProcessForProfiles: [
            {
                profileId: "profile-0",
                rounds: [
                    // Will be populated based on selections
                ],
                expectedRecruits: '',
                tentativeDate: ''
            }
        ],

        // Bond Details - now an object with hasBond and details
        bondDetails: {
            hasBond: false,
            details: ''
        },

        pointOfContact: [
            {
                name: '',
                designation: '',
                mobile: '',
                email: ''
            },
        ],

        additionalInfo: {
            sponsorEvents: '',
            internshipOffered: '',
            internshipDuration: '',
            contests: ''
        },

        status: 'draft',
    });

    // Handlers
    const handleCompanyInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            companyDetails: {
                ...prev.companyDetails,
                [name]: value
            }
        }));
    };

    const handleJobProfileChange = (updatedProfiles) => {
        setFormData(prev => {
            // Get list of new profile IDs that need corresponding entries
            const existingProfileIds = prev.eligibleBranchesForProfiles.map(p => p.profileId);
            const updatedProfileIds = updatedProfiles.map(p => p.profileId);
            
            // Find new profiles that need entries created
            const newProfileIds = updatedProfileIds.filter(id => !existingProfileIds.includes(id));
            
            // Find removed profiles that need entries removed
            const removedProfileIds = existingProfileIds.filter(id => !updatedProfileIds.includes(id));
            
            // Create new eligible branches entries for new profiles
            const newEligibleBranches = newProfileIds.map(profileId => ({
                profileId,
                branches: {
                    btech: JSON.parse(JSON.stringify(prev.eligibleBranchesForProfiles[0].branches.btech)),
                    mtech: JSON.parse(JSON.stringify(prev.eligibleBranchesForProfiles[0].branches.mtech)),
                    phd: JSON.parse(JSON.stringify(prev.eligibleBranchesForProfiles[0].branches.phd))
                }
            }));
            
            // Create new selection process entries for new profiles
            const newSelectionProcess = newProfileIds.map(profileId => ({
                profileId,
                rounds: [],
                expectedRecruits: '',
                tentativeDate: ''
            }));
            
            return {
                ...prev,
                jobProfiles: updatedProfiles,
                // Update eligible branches, filtering out removed profiles and adding new ones
                eligibleBranchesForProfiles: [
                    ...prev.eligibleBranchesForProfiles.filter(p => !removedProfileIds.includes(p.profileId)),
                    ...newEligibleBranches
                ],
                // Update selection process, filtering out removed profiles and adding new ones
                selectionProcessForProfiles: [
                    ...prev.selectionProcessForProfiles.filter(p => !removedProfileIds.includes(p.profileId)),
                    ...newSelectionProcess
                ]
            };
        });
    };

    const handleEligibleBranchChange = (profileId, program, index, checked) => {
        setFormData((prev) => ({
            ...prev,
            eligibleBranchesForProfiles: prev.eligibleBranchesForProfiles.map(profile => 
                profile.profileId === profileId 
                ? {
                    ...profile,
                    branches: {
                        ...profile.branches,
                        [program]: profile.branches[program].map((branch, i) =>
                            i === index ? { ...branch, eligible: checked } : branch
                        )
                    }
                }
                : profile
            )
        }));
    };

    const handleSelectionProcess = (profileId, field, value) => {
        // Add a new case for complete round updates (reordering)
        if (field === 'updateAllRounds' || field === 'reorderRounds') {
            setFormData((prev) => {
                const profileIndex = prev.selectionProcessForProfiles.findIndex(p => p.profileId === profileId);
                
                if (profileIndex === -1) return prev;
                
                const updatedProfiles = [...prev.selectionProcessForProfiles];
                updatedProfiles[profileIndex] = {
                    ...updatedProfiles[profileIndex],
                    rounds: value
                };
                
                console.log("Updated profiles with reordered rounds:", updatedProfiles);
                
                return {
                    ...prev,
                    selectionProcessForProfiles: updatedProfiles
                };
            });
            return;
        }
        
        // Handle selection process with rounds structure
        if (['resumeShortlisting', 'prePlacementTalk', 'groupDiscussion', 'onlineTest', 
             'aptitudeTest', 'technicalTest', 'technicalInterview', 'hrInterview'].includes(field)) {
            
            setFormData((prev) => {
                const profileIndex = prev.selectionProcessForProfiles.findIndex(p => p.profileId === profileId);
                
                if (profileIndex === -1) return prev;
                
                const updatedProfile = {...prev.selectionProcessForProfiles[profileIndex]};
                
                if (value) {
                    // Add the round if it's checked
                    const existingRoundIndex = updatedProfile.rounds.findIndex(r => r.type === field);
                    
                    if (existingRoundIndex === -1) {
                        updatedProfile.rounds = [...updatedProfile.rounds, { 
                            type: field,
                            roundNumber: updatedProfile.rounds.length + 1,
                            details: '' 
                        }];
                    }
                } else {
                    // Remove the round if unchecked
                    updatedProfile.rounds = updatedProfile.rounds.filter(round => round.type !== field);
                }
                
                const updatedProfiles = [...prev.selectionProcessForProfiles];
                updatedProfiles[profileIndex] = updatedProfile;
                
                return {
                    ...prev,
                    selectionProcessForProfiles: updatedProfiles
                };
            });
        } else if (field === 'otherRounds') {
            // Handle other rounds details
            setFormData((prev) => {
                const profileIndex = prev.selectionProcessForProfiles.findIndex(p => p.profileId === profileId);
                
                if (profileIndex === -1) return prev;
                
                const updatedProfile = {...prev.selectionProcessForProfiles[profileIndex]};
                const otherRoundIndex = updatedProfile.rounds.findIndex(r => r.type === 'otherRounds');
                
                if (otherRoundIndex === -1 && value) {
                    updatedProfile.rounds = [...updatedProfile.rounds, { 
                        type: 'otherRounds',
                        roundNumber: updatedProfile.rounds.length + 1,
                        details: value 
                    }];
                } else if (otherRoundIndex !== -1) {
                    updatedProfile.rounds[otherRoundIndex].details = value;
                    // Remove if empty
                    if (!value) {
                        updatedProfile.rounds = updatedProfile.rounds.filter((_, i) => i !== otherRoundIndex);
                    }
                }
                
                const updatedProfiles = [...prev.selectionProcessForProfiles];
                updatedProfiles[profileIndex] = updatedProfile;
                
                return {
                    ...prev,
                    selectionProcessForProfiles: updatedProfiles
                };
            });
        } else if (field === 'expectedRecruits' || field === 'tentativeDate') {
            // Handle regular fields
            setFormData((prev) => {
                const profileIndex = prev.selectionProcessForProfiles.findIndex(p => p.profileId === profileId);
                
                if (profileIndex === -1) return prev;
                
                const updatedProfiles = [...prev.selectionProcessForProfiles];
                updatedProfiles[profileIndex] = {
                    ...updatedProfiles[profileIndex],
                    [field]: value
                };
                
                return {
                    ...prev,
                    selectionProcessForProfiles: updatedProfiles
                };
            });
        }
    };

    const handleEligibilityCriteria = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            eligibilityCriteria: {
                ...prev.eligibilityCriteria,
                [field]: value
            }
        }));
    };

    // New handlers for bond details
    const handleBondDetailsChange = (hasBond, details = '') => {
        setFormData((prev) => ({
            ...prev,
            bondDetails: {
                hasBond,
                details: hasBond ? details : ''
            }
        }));
    };

    const handlePointOfContactChange = (updatedContacts) => {
        setFormData(prev => ({
            ...prev,
            pointOfContact: updatedContacts
        }));
    };

    const handleAdditionalInfoChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            additionalInfo: {
                ...prev.additionalInfo,
                [field]: value
            }
        }));
    };

    const validateJNF = () => {
        const errors = [];
        
        // ==================== COMPANY DETAILS VALIDATION ====================
        if (!formData.companyDetails?.name) {
            errors.push("Company Name is required");
        }
        if (!formData.companyDetails?.email) {
            errors.push("Company Email is required");
        } else if (!/^\S+@\S+\.\S+$/.test(formData.companyDetails.email)) {
            errors.push("Company Email format is invalid");
        }
        if (!formData.companyDetails?.companyType) {
            errors.push("Company Type is required");
        }
        if (!formData.companyDetails?.domain) {
            errors.push("Company Domain is required");
        }
        if (!formData.companyDetails?.description || formData.companyDetails.description.trim().length < 10) {
            errors.push("Company Description is required (minimum 10 characters)");
        }
        
        // ==================== JOB PROFILES VALIDATION ====================
        if (!formData.jobProfiles || formData.jobProfiles.length === 0) {
            errors.push("At least one job profile is required");
        } else {
            formData.jobProfiles.forEach((profile, index) => {
                const profileNum = index + 1;
                
                if (!profile.profileId) {
                    errors.push(`Job Profile ${profileNum}: Profile ID is required`);
                }
                
                if (!profile.designation || profile.designation.trim() === '') {
                    errors.push(`Job Profile ${profileNum}: Designation is required`);
                }
                
                // CTC validation for full-time positions
                if (profile.jobType === "fte" || profile.jobType === "fte+intern" || profile.jobType === "intern+ppo") {
                    if (!profile.ctc || profile.ctc.trim() === '') {
                        errors.push(`Job Profile ${profileNum}: CTC is required`);
                    }
                    if (!profile.takeHome || profile.takeHome.trim() === '') {
                        errors.push(`Job Profile ${profileNum}: Take home salary is required`);
                    }
                }
                
                // Validation for internship details
                if (profile.jobType === "fte+intern" || profile.jobType === "intern" || profile.jobType === "intern+ppo") {
                    if (!profile.stipend || profile.stipend.trim() === '') {
                        errors.push(`Job Profile ${profileNum}: Internship stipend is required`);
                    }
                    if (!profile.internDuration || profile.internDuration.trim() === '') {
                        errors.push(`Job Profile ${profileNum}: Internship duration is required`);
                    }
                }
                
                // Job description validation
                if (!profile.jobDescription?.description || profile.jobDescription.description.trim() === '') {
                    errors.push(`Job Profile ${profileNum}: Job description is required`);
                }
                
                // File attachment validation
                if (profile.jobDescription?.attachFile && !profile.jobDescription?.file) {
                    errors.push(`Job Profile ${profileNum}: Job Description file is required when attachment is enabled`);
                }
                
                // Place of posting validation
                if (!profile.placeOfPosting || profile.placeOfPosting.trim() === '') {
                    errors.push(`Job Profile ${profileNum}: Place of posting is required`);
                }
            });
        }
        
        // ==================== ELIGIBLE BRANCHES VALIDATION ====================
        if (!formData.eligibleBranchesForProfiles || formData.eligibleBranchesForProfiles.length === 0) {
            errors.push("Eligible branches information is required");
        } else {
            formData.eligibleBranchesForProfiles.forEach((profileBranches, index) => {
                const profileNum = index + 1;
                
                if (!profileBranches.profileId) {
                    errors.push(`Eligible Branches for Profile ${profileNum}: Profile ID is required`);
                }
                
                // Check if at least one branch is selected
                let hasSelectedBranch = false;
                
                // Check B.Tech branches
                if (profileBranches.branches?.btech && Array.isArray(profileBranches.branches.btech)) {
                    if (profileBranches.branches.btech.some(branch => branch.eligible)) {
                        hasSelectedBranch = true;
                    }
                }
                
                // Check M.Tech branches if B.Tech branches aren't selected
                if (!hasSelectedBranch && profileBranches.branches?.mtech && Array.isArray(profileBranches.branches.mtech)) {
                    if (profileBranches.branches.mtech.some(branch => branch.eligible)) {
                        hasSelectedBranch = true;
                    }
                }
                
                // Check PhD branches if neither B.Tech nor M.Tech branches are selected
                if (!hasSelectedBranch && profileBranches.branches?.phd && Array.isArray(profileBranches.branches.phd)) {
                    if (profileBranches.branches.phd.some(branch => branch.eligible)) {
                        hasSelectedBranch = true;
                    }
                }
                
                if (!hasSelectedBranch) {
                    errors.push(`Eligible Branches for Profile ${profileNum}: At least one branch must be selected`);
                }
            });
        }
        
        // ==================== ELIGIBILITY CRITERIA VALIDATION ====================
        // Validate CGPA
        if (typeof formData.eligibilityCriteria === 'object') {
            if (!formData.eligibilityCriteria.minCgpa || formData.eligibilityCriteria.minCgpa === '') {
                errors.push("Minimum CGPA requirement is required");
            } else {
                const cgpa = parseFloat(formData.eligibilityCriteria.minCgpa);
                if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
                    errors.push("Minimum CGPA must be a number between 0 and 10");
                }
            }
            
            // Convert to string after validation
            formData.eligibilityCriteria = JSON.stringify(formData.eligibilityCriteria);
        }
        
        // ==================== SELECTION PROCESS VALIDATION ====================
        if (!formData.selectionProcessForProfiles || formData.selectionProcessForProfiles.length === 0) {
            errors.push("Selection process information is required");
        } else {
            formData.selectionProcessForProfiles.forEach((profileSelection, index) => {
                const profileNum = index + 1;
                
                if (!profileSelection.profileId) {
                    errors.push(`Selection Process for Profile ${profileNum}: Profile ID is required`);
                }
                
                // Check if rounds are specified
                if (!profileSelection.rounds || profileSelection.rounds.length === 0) {
                    errors.push(`Selection Process for Profile ${profileNum}: At least one selection round is required`);
                } else {
                    profileSelection.rounds.forEach((round, roundIndex) => {
                        if (!round.type) {
                            errors.push(`Selection Process for Profile ${profileNum}, Round ${roundIndex + 1}: Round type is required`);
                        }
                        // Check if other rounds has proper details
                        if (round.type === 'otherRounds' && (!round.details || round.details.trim() === '')) {
                            errors.push(`Selection Process for Profile ${profileNum}, Other Round: Details for other round are required`);
                        }
                    });
                }
                
                // Validate expected recruits
                if (!profileSelection.expectedRecruits || profileSelection.expectedRecruits.trim() === '') {
                    errors.push(`Selection Process for Profile ${profileNum}: Expected number of recruits is required`);
                }
                
                // Validate tentative date
                if (!profileSelection.tentativeDate || profileSelection.tentativeDate.trim() === '') {
                    errors.push(`Selection Process for Profile ${profileNum}: Tentative date is required`);
                }
            });
        }
        
        // ==================== BOND DETAILS VALIDATION ====================
        if (!formData.bondDetails) {
            errors.push("Bond information is required");
        } else {
            if (formData.bondDetails.hasBond === undefined || formData.bondDetails.hasBond === null) {
                errors.push("Bond information (Yes/No) is required");
            }
            
            if (formData.bondDetails.hasBond && (!formData.bondDetails.details || formData.bondDetails.details.trim() === '')) {
                errors.push("Bond details are required when bond is set to Yes");
            }
        }
        
        // ==================== POINT OF CONTACT VALIDATION ====================
        if (!formData.pointOfContact || formData.pointOfContact.length === 0) {
            errors.push("At least one point of contact is required");
        } else {
            formData.pointOfContact.forEach((contact, index) => {
                const contactNum = index + 1;
                
                if (!contact.name || contact.name.trim() === '') {
                    errors.push(`Point of Contact ${contactNum}: Name is required`);
                }
                
                if (!contact.designation || contact.designation.trim() === '') {
                    errors.push(`Point of Contact ${contactNum}: Designation is required`);
                }
                
                if (!contact.email || contact.email.trim() === '') {
                    errors.push(`Point of Contact ${contactNum}: Email is required`);
                } else if (!/^\S+@\S+\.\S+$/.test(contact.email)) {
                    errors.push(`Point of Contact ${contactNum}: Email format is invalid`);
                }
                
                if (!contact.mobile || contact.mobile.trim() === '') {
                    errors.push(`Point of Contact ${contactNum}: Mobile number is required`);
                } else if (!/^\d{10}$/.test(contact.mobile.replace(/\D/g, ''))) {
                    errors.push(`Point of Contact ${contactNum}: Mobile number should be 10 digits`);
                }
            });
        }
    
        return {
            valid: errors.length === 0,
            errors
        };
    };
    
    // LoadingOverlay component
    const LoadingOverlay = () => (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backdropFilter: 'blur(3px)',
                gap: 2
            }}
            open={loading}
        >
            <CircularProgress color="primary" size={60} thickness={4} />
            <Typography variant="h6" component="div" sx={{ mt: 2, fontWeight: 500 }}>
                Submitting your JNF...
            </Typography>
            <Typography variant="body2" color="inherit" sx={{ maxWidth: 300, textAlign: 'center' }}>
                Please wait while we process your Job Notification Form
            </Typography>
        </Backdrop>
    );

    // Format error messages from array to readable text
    const formatErrorMessages = (errors) => {
        if (!errors || !errors.length) return '';
        
        if (errors.length === 1) return errors[0];
        
        return (
            <React.Fragment>
                <AlertTitle sx={{ fontWeight: 'bold', mb: 1 }}>Please fix the following issues:</AlertTitle>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {errors.map((err, index) => (
                        <li key={index}>{err}</li>
                    ))}
                </ul>
            </React.Fragment>
        );
    };

    // Then use this in your handleSubmit function:
    const handleSubmit = async () => {
        try {
            const validation = validateJNF();
            if (!validation.valid) {
                setSnackbar({
                    open: true,
                    message: formatErrorMessages(validation.errors),
                    severity: 'error'
                });
                return;
            }
    
            setLoading(true);
            setError(null);
            
            // Make sure eligibilityCriteria is a string
            const formattedData = {
                ...formData,
                submittedBy: id,
                submissionDate: new Date(),
                eligibilityCriteria: typeof formData.eligibilityCriteria === 'object' 
                    ? JSON.stringify(formData.eligibilityCriteria) 
                    : formData.eligibilityCriteria
            };
      
            console.log("Final formatted data for submission:", formattedData);
            
            const response = await axios.post(`/company/${id}/add-jnf`, formattedData);
            console.log(response);
            if (response.status === 200 || response.status === 201) {
                setSnackbar({
                    open: true,
                    message: 'JNF submitted successfully!',
                    severity: 'success'
                });
                
                // // Optionally navigate to success page or dashboard after delay
                // setTimeout(() => {
                //     navigate(`/company/${id}/dashboard`);
                // }, 2000);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to submit JNF';
            
            setSnackbar({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
            
            setError(errorMessage);
            console.error('Error submitting JNF:', err);
        } finally {
            setLoading(false);
        }
    };
  
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <CompanyDetailsStep
                        formData={formData}
                        handleCompanyInputChange={handleCompanyInputChange}
                    />
                );
            case 2:
                return (
                    <JobProfileStep
                        formData={formData}
                        handleJobProfileChange={handleJobProfileChange}
                    />
                );
            case 3:
                return (
                    <EligibleBranchesStep
                        formData={formData}
                        handleEligibleBranchChange={handleEligibleBranchChange}
                        handleEligibilityCriteria={handleEligibilityCriteria}
                    />
                );
            case 4:
                return (
                    <SelectionProcessStep
                        formData={formData}
                        handleSelectionProcess={handleSelectionProcess}
                    />
                );
            case 5:
                return (
                    <AdditionalDetailsStep
                        formData={formData}
                        handleBondDetailsChange={handleBondDetailsChange}
                        handlePointOfContactChange={handlePointOfContactChange}
                        handleAdditionalInfoChange={handleAdditionalInfoChange}
                    />
                );
            case 6:
                return <ReviewStep formData={formData} />;
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Loading Overlay */}
            <LoadingOverlay />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        bgcolor: 'background.paper'
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            p: 3,
                            background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                            color: 'white'
                        }}
                    >
                        <Typography variant="h4" fontWeight="600">
                            Job Notification Form
                        </Typography>
                    </Box>

                    {/* Steps Navigation */}
                    <Box sx={{ p: 2 }}>
                        <Stepper
                            activeStep={currentStep - 1}
                            alternativeLabel
                            sx={{
                                '& .MuiStepLabel-root': {
                                    cursor: 'pointer'
                                }
                            }}
                        >
                            {steps.map((step) => {
                                const StepIcon = step.icon;
                                return (
                                    <Step
                                        key={step.number}
                                        onClick={() => setCurrentStep(step.number)}
                                    >
                                        <StepLabel
                                            StepIconComponent={() => (
                                                <Box
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        bgcolor: currentStep === step.number
                                                            ? 'primary.main'
                                                            : currentStep > step.number
                                                                ? 'success.main'
                                                                : 'grey.300',
                                                        color: 'white',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    {currentStep > step.number ? (
                                                        <CheckIcon fontSize="small" />
                                                    ) : (
                                                        <StepIcon fontSize="small" />
                                                    )}
                                                </Box>
                                            )}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: currentStep === step.number
                                                        ? 'primary.main'
                                                        : 'text.secondary',
                                                    fontWeight: currentStep === step.number ? 600 : 400
                                                }}
                                            >
                                                {step.title}
                                            </Typography>
                                        </StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>
                    </Box>

                    {/* Form Content */}
                    <Box sx={{ p: 4 }}>
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderStep()}
                        </motion.div>
                    </Box>

                    {/* Navigation Buttons */}
                    <Divider />
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{ p: 3 }}
                    >
                        <Button
                            variant="outlined"
                            disabled={currentStep === 1 || loading}
                            onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                            sx={{ minWidth: 120 }}
                        >
                            Previous
                        </Button>

                        {currentStep === 6 ? (
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleSubmit}
                                disabled={loading}
                                sx={{ 
                                    minWidth: 120,
                                    position: 'relative'
                                }}
                            >
                                {loading ? (
                                    <>
                                        <CircularProgress 
                                            size={24} 
                                            color="inherit" 
                                            sx={{ 
                                                position: 'absolute',
                                                left: '50%',
                                                marginLeft: '-12px'
                                            }}
                                        />
                                        <span style={{ visibility: 'hidden' }}>Submit</span>
                                    </>
                                ) : 'Submit'}
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={() => setCurrentStep(prev => Math.min(prev + 1, 6))}
                                disabled={loading}
                                sx={{ minWidth: 120 }}
                            >
                                Next
                            </Button>
                        )}
                    </Stack>
                </Paper>
            </motion.div>
            
            {/* Enhanced Snackbar for errors and success messages */}
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={snackbar.severity === 'error' ? 10000 : 6000} 
                onClose={() => setSnackbar({...snackbar, open: false})}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{ 
                    '& .MuiAlert-root': {
                        width: '100%', 
                        maxWidth: snackbar.severity === 'error' ? 400 : 300,
                        boxShadow: 3
                    } 
                }}
            >
                <Alert 
                    onClose={() => setSnackbar({...snackbar, open: false})} 
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ 
                        width: '100%',
                        '& .MuiAlert-message': {
                            maxHeight: '300px',
                            overflow: 'auto'
                        }
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
            
            {/* Show persistent error if needed */}
            {error && (
                <Paper 
                    elevation={3} 
                    sx={{ 
                        position: 'fixed', 
                        bottom: 16, 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        bgcolor: 'error.light',
                        color: 'error.contrastText',
                        p: 2,
                        borderRadius: 2,
                        maxWidth: '80%',
                        zIndex: 1000
                    }}
                >
                    <Typography variant="body1">{error}</Typography>
                    <Button 
                        size="small" 
                        sx={{ color: 'inherit', mt: 1 }}
                        onClick={() => setError(null)}
                    >
                        Dismiss
                    </Button>
                </Paper>
            )}
        </Container>
    );
};

export default index;