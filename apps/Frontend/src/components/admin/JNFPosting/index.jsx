import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

import { useParams } from 'react-router-dom';
import jnfService from '../../../services/admin/jnfService';
import { motion } from 'framer-motion';
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
    Divider,
    IconButton
} from '@mui/material';
import {
    Business as BusinessIcon,
    Work as WorkIcon,
    Group as GroupIcon,
    Assessment as AssessmentIcon,
    Info as InfoIcon,
    Preview as PreviewIcon,
    CheckCircle as CheckIcon,
    Close as CloseIcon
} from '@mui/icons-material';

// Keep existing imports
import CompanyDetailsStep from './steps/CompanyDetailsStep';
import JobProfileStep from './steps/JobProfilesStep';
import ReviewStep from './steps/ReviewStep';
import SelectionProcessStep from './steps/SelectionProcessSteps';
import EligibleBranchesStep from './steps/EligibleBranchesStep';
import AdditionalDetailsStep from './steps/AdditionalDetailsStep';
import DraftConfirmDialog from './DraftConfirmDialog';

const validateJNF = (formData) => {
    const errors = [];

    // Company Details Validation
    if (!formData.companyDetails.name) errors.push('Company name is required');
    if (!formData.companyDetails.email) errors.push('Company email is required');
    if (!formData.companyDetails.companyType) errors.push('Company type is required');
    if (!formData.companyDetails.domain) errors.push('Company domain is required');

    // Job Profiles Validation
    formData.jobProfiles.forEach((profile, index) => {
        if (!profile.designation) errors.push(`Job designation is required for Profile ${index + 1}`);
        // if (!profile.jobDescription.description) errors.push(`Job description is required for Profile ${index + 1}`);
        if (profile.jobDescription.attachFile && !profile.jobDescription.file) {
            errors.push(`Job description file is required when attachment is enabled for Profile ${index + 1}`);
        }
        if (!profile.ctc) errors.push(`CTC is required for Profile ${index + 1}`);
        if (!profile.jobType) errors.push(`Job type is required for Profile ${index + 1}`);
    });

    // Selection Process Validation
    formData.selectionProcessForProfiles.forEach((profile, index) => {
        if (!profile.rounds || profile.rounds.length === 0) {
            errors.push(`At least one selection round is required for Profile ${index + 1}`);
        }
        if (!profile.expectedRecruits) errors.push(`Expected recruits is required for Profile ${index + 1}`);
    });

    // Eligibility Criteria Validation
    if (!formData.eligibilityCriteria.minCgpa) errors.push('Minimum CGPA is required');

    // Bond Details Validation
    if (formData.bondDetails.hasBond && !formData.bondDetails.details) {
        errors.push('Bond details are required when bond is applicable');
    }

    // Point of Contact Validation
    if (!formData.pointOfContact || formData.pointOfContact.length === 0) {
        errors.push('At least one point of contact is required');
    } else {
        formData.pointOfContact.forEach((contact, index) => {
            if (!contact.name) errors.push(`Contact name is required for Contact ${index + 1}`);
            if (!contact.email) errors.push(`Contact email is required for Contact ${index + 1}`);
            if (!contact.mobile) errors.push(`Contact mobile is required for Contact ${index + 1}`);
        });
    }

    return {
        valid: errors.length === 0,
        errors
    };
};

// Add this helper function to format error messages
const formatErrorMessages = (errors) => {
    return errors.join('\n');
};

const steps = [
    { number: 1, title: 'Company Details', icon: BusinessIcon },
    { number: 2, title: 'Job Profile', icon: WorkIcon },
    { number: 3, title: 'Eligible Branches', icon: GroupIcon },
    { number: 4, title: 'Selection Process', icon: AssessmentIcon },
    { number: 5, title: 'Additional Details', icon: InfoIcon },
    { number: 6, title: 'Review', icon: PreviewIcon }
];

const Index = forwardRef(({ initialData, onSubmit, isEditing, onClose }, ref) => { // Add onClose to props
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(initialData || {
        // Company Details - structure mostly the same
        companyDetails: {
            name: '',
            email: '',
            website: '',
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

        status: 'pending',
    });

    // Add useEffect to handle initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

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

    const handleSubmit = async () => {
        try {
            const validation = validateJNF(formData);
            if (!validation.valid) {
                alert(formatErrorMessages(validation.errors));
                return;
            }

            setLoading(true);
            setError(null);

            const formDataToSend = new FormData();
            
            // Check for file attachments
            formData.jobProfiles.forEach((profile, index) => {
                if (profile.jobDescription.attachFile && profile.jobDescription.file) {
                    formDataToSend.append('jobDescriptionFile', profile.jobDescription.file);
                    formDataToSend.append('fileJobProfileIndex', index.toString());
                }
            });
            
            // Update data with status change
            const dataToSend = {
                ...formData,
                status: 'pending',
                submissionDate: new Date().toISOString()
            };

// Add the form data
            formDataToSend.append('formData', JSON.stringify(dataToSend));

            let response;
            if (isEditing && formData._id) {
                response = await jnfService.update(formData._id, formDataToSend);
                if (response?.data) {
                    if (onSubmit) {
                        onSubmit(response.data);
                    }
                    if (onClose) {
                        onClose(); // Close dialog after successful update
                    }
                    alert('JNF updated successfully');
                }
            } else {
                response = await jnfService.create(formDataToSend);
                if (response?.data) {
                    if (onSubmit) {
                        onSubmit(response.data);
                        onClose && onClose();
                    }
                }
                if (response.success) {
                    alert('JNF submitted successfully');
                    // Close dialog after successful submission
                    onClose && onClose();
                } 
            }

            // Show success message
            alert(`JNF ${isEditing ? 'updated' : 'submitted'} successfully`);

        } catch (err) {
            setError(err?.message || `Failed to ${isEditing ? 'update' : 'submit'} JNF`);
            alert(`Failed to ${isEditing ? 'update' : 'submit'} JNF: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const [showDraftDialog, setShowDraftDialog] = useState(false);

    // Update handleSaveDraft to validate essential fields
    const handleSaveDraft = async () => {
        try {
            // Validate essential fields
            if (!formData.companyDetails?.name?.trim()) {
                alert('Company name is required even for drafts');
                return;
            }
            if (!formData.companyDetails?.email?.trim()) {
                alert('Company email is required even for drafts');
                return;
            }
            // Validate email format
            const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
            if (!emailRegex.test(formData.companyDetails.email)) {
                alert('Please enter a valid email address');
                return;
            }

            setLoading(true);
            const response = await jnfService.saveDraft(formData);
            if (response.success) {
                alert('Form saved as draft successfully');
                onClose && onClose();
            }
        } catch (error) {
            alert('Failed to save draft: ' + error.message);
        } finally {
            setLoading(false);
            setShowDraftDialog(false);
        }
    };

    // Update handleCloseAttempt if needed
    const handleCloseAttempt = () => {
        // Check if form has any data
        const hasData = Object.keys(formData).some(key => {
            if (typeof formData[key] === 'object') {
                return Object.keys(formData[key]).some(k => formData[key][k]);
            }
            return formData[key];
        });

        if (hasData) {
            setShowDraftDialog(true);
        } else {
            onClose && onClose();
        }
    };

    useImperativeHandle(ref, () => ({
        formData,
        handleSaveDraft,
        hasUnsavedChanges: () => {
            return Object.keys(formData).some(key => {
                if (typeof formData[key] === 'object') {
                    return Object.keys(formData[key]).some(k => 
                        formData[key][k] !== '' && 
                        formData[key][k] !== null && 
                        formData[key][k] !== undefined
                    );
                }
                return formData[key] !== '' && 
                       formData[key] !== null && 
                       formData[key] !== undefined;
            });
        }
    }));

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
                            color: 'white',
                            position: 'relative'
                        }}
                    >
                        <Typography variant="h4" fontWeight="600">
                            Job Notification Form
                        </Typography>
                        {/* Add close button in header */}
                        <Box sx={{ position: 'absolute', right: 16, top: 16 }}>
                            {/* <IconButton
                                onClick={handleCloseAttempt}
                                sx={{ color: 'white' }}
                            >
                                <CloseIcon />
                            </IconButton> */}
                        </Box>
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
                            disabled={currentStep === 1}
                            onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                            sx={{ minWidth: 120 }}
                        >
                            Previous
                        </Button>

                        <Box>
                            <Button
                                variant="outlined"
                                onClick={handleSaveDraft}
                                sx={{ mr: 1 }}
                                disabled={loading}
                            >
                                Save as Draft
                            </Button>
                            {currentStep === 6 ? (
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    sx={{ minWidth: 120 }}
                                >
                                    {loading ? 'Submitting...' : 'Submit'}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={() => setCurrentStep(prev => Math.min(prev + 1, 6))}
                                    sx={{ minWidth: 120 }}
                                >
                                    Next
                                </Button>
                            )}
                        </Box>
                    </Stack>
                </Paper>
            </motion.div>

            {/* Add draft dialog */}
            <DraftConfirmDialog
                open={showDraftDialog}
                onClose={(action) => {
                    setShowDraftDialog(false);
                    switch (action) {
                        case 'discard':
                            // Close without saving
                            onClose && onClose();
                            break;
                        case 'keep':
                            // Just close the dialog and continue editing
                            break;
                        default:
                            break;
                    }
                }}
                onSaveDraft={handleSaveDraft}
            />
        </Container>
    );
});

export default Index;