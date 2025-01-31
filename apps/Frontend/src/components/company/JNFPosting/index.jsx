import React, { useState } from 'react';
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
    const theme = useTheme();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Company Details
        name: '',
        email: '',
        website: '',
        companyType: '',
        domain: '',
        description: '',

        // Job Profiles
        jobProfiles: [
            {
                course: 'btech',
                designation: '',
                jobDescription: '',
                ctc: '',
                takeHome: '',
                perks: '',
                trainingPeriod: '',
                placeOfPosting: ''
            },
            {
                course: 'mtech',
                designation: '',
                jobDescription: '',
                ctc: '',
                takeHome: '',
                perks: '',
                trainingPeriod: '',
                placeOfPosting: ''
            },
            {
                course: 'mba',
                designation: '',
                jobDescription: '',
                ctc: '',
                takeHome: '',
                perks: '',
                trainingPeriod: '',
                placeOfPosting: ''
            },
            {
                course: 'mca',
                designation: '',
                jobDescription: '',
                ctc: '',
                takeHome: '',
                perks: '',
                trainingPeriod: '',
                placeOfPosting: ''
            },
            {
                course: 'msc',
                designation: '',
                jobDescription: '',
                ctc: '',
                takeHome: '',
                perks: '',
                trainingPeriod: '',
                placeOfPosting: ''
            },
            {
                course: 'phd',
                designation: '',
                jobDescription: '',
                ctc: '',
                takeHome: '',
                perks: '',
                trainingPeriod: '',
                placeOfPosting: ''
            }
        ],

        // Eligible Branches
        eligibleBranches: {
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
        },

        // Eligibility Criteria
        eligibilityCriteria: '',

        // Selection Process
        selectionProcess: {
            resumeShortlisting: false,
            prePlacementTalk: false,
            groupDiscussion: false,
            onlineTest: false,
            aptitudeTest: false,
            technicalTest: false,
            technicalInterview: false,
            hrInterview: false,
            otherRounds: '',
            expectedRecruits: '',
            tentativeDate: '',
            accommodationRequired: false
        },

        // Additional Details
        bondDetails: '',
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

        // Status and Submission Details
        status: 'draft',
        submittedBy: '',
        reviewedBy: '',
        reviewComments: '',
        submissionDate: '',
        reviewDate: ''
    });

    // Handlers
    const handleCompanyInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleJobProfileChange = (courseIndex, field, value) => {
        setFormData((prev) => ({
            ...prev,
            jobProfiles: prev.jobProfiles.map((profile, i) =>
                i === courseIndex ? { ...profile, [field]: value } : profile
            )
        }));
    };

    const handleEligibleBranchChange = (program, index, checked) => {
        setFormData((prev) => ({
            ...prev,
            eligibleBranches: {
                ...prev.eligibleBranches,
                [program]: prev.eligibleBranches[program].map((branch, i) =>
                    i === index ? { ...branch, eligible: checked } : branch
                )
            }
        }));
    };

    const handleSelectionProcess = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            selectionProcess: {
                ...prev.selectionProcess,
                [field]: value
            }
        }));
    };

    const handleEligibilityCriteria = (value) => {
        setFormData((prev) => ({
            ...prev,
            eligibilityCriteria: value
        }));
    };


    // New handlers for Additional Details
    const handleBondDetailsChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            bondDetails: value
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

    const handleSubmit = () => {
        console.log('Form submitted', formData);
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
                    <Box sx={{ p: 2}}>
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

                        {currentStep === 6 ? (
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => console.log('Form submitted', formData)}
                                sx={{ minWidth: 120 }}
                            >
                                Submit
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
                    </Stack>
                </Paper>
            </motion.div>
        </Container>
    );
};

export default index;