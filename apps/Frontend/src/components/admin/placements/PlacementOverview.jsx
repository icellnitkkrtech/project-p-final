import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
  Link,
  Fade,
  Grow,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { motion, useInView } from "framer-motion";
import {
  Business as CompanyIcon,
  Work as JobIcon,
  School as EducationIcon,
  Link as LinkIcon,
  ListAlt as ProcessIcon,
  Gavel as BondIcon,
  LocationOn,
  AttachMoney,
  AccessTime,
  School as CourseIcon,
  Groups as BranchIcon,
  CalendarToday,
  Public as DomainIcon,
  BusinessCenter as TypeIcon,
  Description as DescriptionIcon,
  Web as WebsiteIcon,
  Email as EmailIcon,
  CardGiftcard as PerksIcon,
  EventNote as EventIcon,
  CheckCircle as CheckIcon,
  Badge as RoleIcon,
  Apartment as CompanyNameIcon,
  HowToReg as ApplicationIcon,
  Notifications as NotificationsIcon,
  NotificationsActive,
  NotificationsOff,
  NotificationsNone,
  CheckCircle,
  Error,
  People,
  Settings,
  Assessment,
  Group,
  Notifications,
  List,
  Circle,
  Autorenew,
  Upcoming,
} from "@mui/icons-material";
import placementService from "../../../services/admin/placementService";
import PlacementStudents from "./PlacementStudents";
import { styled } from "@mui/material/styles";
import OfferLetterPanel from "./OfferLetterPanel";

const ResponsiveToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: '64px',
  padding: theme.spacing(1, 2),
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
    minHeight: 'auto',
    padding: theme.spacing(1),
    gap: theme.spacing(1),
    '& .MuiTypography-root': {
      fontSize: '1rem',
    },
    '& .MuiButton-root': {
      padding: theme.spacing(0.5, 1),
      fontSize: '0.75rem',
      '& .MuiButton-startIcon': {
        marginRight: theme.spacing(0.5),
      },
    },
  },
}));

const ResponsiveButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    '& .MuiButton-root': {
      flex: '1 1 calc(50% - 8px)',
      minWidth: 'auto',
      maxWidth: 'calc(50% - 8px)',
      fontSize: '0.7rem',
      padding: theme.spacing(0.5, 1),
    },
  },
}));

const TitleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  flex: 1,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    '& .MuiTypography-root': {
      fontSize: '0.9rem',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      marginRight: theme.spacing(0.5),
    },
    '& .MuiChip-root': {
      flexShrink: 0,
      marginLeft: theme.spacing(0.5),
    },
  },
}));

const PlacementOverview = ({ id }) => {
  const [placementData, setPlacementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  const [openDeclareResultDialog, setOpenDeclareResultDialog] = useState(false);
  const [selectedRound, setSelectedRound] = useState(null);
  const [showOfferLetters, setShowOfferLetters] = useState(false);

  useEffect(() => {
    const fetchPlacement = async () => {
      try {
        setLoading(true);
        const data = await placementService.getPlacement(id);
        setPlacementData(data);
      } catch (err) {
        setError("Failed to load placement data.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlacement();
  }, [id]);

  useEffect(() => {
    // Fetch notifications for this placement
    const fetchNotifications = async () => {
      try {
        const response = await placementService.getPlacementNotifications(id);
        setNotifications(response.data.data);
        setUnreadCount(response.data.data.filter(n => !n.read).length);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchNotifications();
  }, [id]);

  const handleRoundClick = (round) => {
    setSelectedRound(round);
  };

  const handleOpenEditDialog = () => {
    // Implementation of handleOpenEditDialog
  };

  const handleOpenStudentDialog = () => {
    setStudentDialogOpen(true);
  };

  const handleCloseStudentDialog = () => {
    setStudentDialogOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }
  if (error) return <Typography color="error">{error}</Typography>;
  if (!placementData)
    return <Typography>No placement data available.</Typography>;

  const {
    placementDrive_title,
    companyDetails,
    jobProfile,
    eligibilityCriteria,
    selectionProcess,
    applicationDetails,
    eligibleBranchesForProfiles,
    bondDetails,
  } = placementData;

  const SectionHeader = ({ icon: Icon, title, color = "primary" }) => (
    <Box display="flex" alignItems="center" gap={1} mb={2}>
      <Icon sx={{ 
        color: theme.palette.primary.main,
        fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
      }} />
      <Typography 
        variant="h6" 
        color="primary" 
        fontWeight="bold"
        sx={{
          fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
        }}
      >
        {title}
      </Typography>
    </Box>
  );

  const InfoRow = ({ icon: Icon, label, value, color = "primary" }) => (
    value !== undefined && value !== null && (
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Icon sx={{ 
          color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
          mr: 1,
          fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
        }} />
        <Typography
          variant="body1"
          sx={{
            mr: 1,
            fontWeight: 'medium',
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
            color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
          }}
        >
          {label}:
        </Typography>
        <Typography 
          variant="body1" 
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
            color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
          }}
        >
          {value}
        </Typography>
      </Box>
    )
  );

  const InfoChip = ({ icon: Icon, label, value, color = "primary", href }) => (
    value !== undefined && value !== null && (
      <Chip
        icon={<Icon sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' } }} />}
        label={href ? (
          <Link 
            href={href} 
            target="_blank"
            rel="noopener noreferrer"
            sx={{ 
              color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
              textDecoration: 'none',
              fontSize: { xs: '0.625rem', sm: '0.75rem', md: '0.875rem' },
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            {value}
          </Link>
        ) : `${label}: ${value}`}
        variant="outlined"
        sx={{ 
          m: 0.5,
          borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
          color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
          '& .MuiChip-icon': {
            color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
          },
          '& .MuiChip-label': {
            px: 1,
            whiteSpace: 'nowrap',
            fontSize: { xs: '0.625rem', sm: '0.75rem', md: '0.875rem' }
          }
        }}
      />
    )
  );

  const InfoSection = ({ title, content, icon: Icon = DescriptionIcon, isBulletList = false }) => (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        {isBulletList ? (
          <span style={{ 
            fontSize: { xs: '1rem', sm: '1.25em', md: '1.5em' },
            lineHeight: 1, 
            color: theme.palette.primary.main 
          }}>•</span>
        ) : (
          <Icon sx={{ 
            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
            color: theme.palette.primary.main 
          }} />
        )}
        <Typography
          variant="subtitle2"
          color="primary"
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
          }}
        >
          {title}
        </Typography>
      </Box>
      <Typography 
        variant="body2" 
        sx={{
          fontSize: { xs: '0.625rem', sm: '0.75rem', md: '0.875rem' },
          color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
        }}
      >
        {content}
      </Typography>
    </Box>
  );

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatRoundName = (name) => {
    // Split by capital letters and join with spaces
    const words = name.replace(/([A-Z])/g, ' $1').trim();
    // Capitalize first letter of each word and make rest lowercase
    return words.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const hasCompanyDetails = companyDetails?.name || companyDetails?.email || 
    companyDetails?.website || companyDetails?.companyType || 
    companyDetails?.domain || companyDetails?.description;

  const hasJobProfile = jobProfile?.designation || jobProfile?.placeOfPosting || 
    jobProfile?.course || jobProfile?.ctc || jobProfile?.takeHome || 
    jobProfile?.stipend || jobProfile?.trainingPeriod || 
    jobProfile?.internDuration || jobProfile?.jobDescription?.description || 
    jobProfile?.perks;

  const hasEligibilityCriteria = eligibilityCriteria?.minCgpa || 
    eligibilityCriteria?.backlogAllowed;

  const hasEligibleBranches = eligibleBranchesForProfiles?.some(profile => 
    Object.values(profile.branches).some(branches => 
      branches.some(branch => branch.eligible)
    )
  );

  const hasApplicationDetails = applicationDetails?.applicationDeadline || 
    applicationDetails?.applicationLink;

  const hasSelectionProcess = selectionProcess?.some(process => 
    process.rounds?.length > 0 || process.tentativeDate || process.expectedRecruits
  );

  const getSectionColor = (index) => {
    return 'primary'; // Always return primary (blue) color
  };

  const AnimatedPaper = ({ children, color, delay = 0 }) => {
    return (
      <Paper
        id={`section-${color}`}
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
          borderBottom: `4px solid ${theme.palette.primary.main}`,
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.02)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 8px 16px rgba(0, 0, 0, 0.3)' 
              : '0 8px 16px rgba(0, 0, 0, 0.1)',
            '&::before': {
              opacity: 0.8
            }
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '30%',
            background: `linear-gradient(to bottom, ${theme.palette.primary.main}10, transparent)`,
            zIndex: 0,
            opacity: 0.5,
            transition: 'opacity 0.3s ease-in-out'
          },
          '& > *': {
            position: 'relative',
            zIndex: 1,
          }
        }}
      >
        {children}
      </Paper>
    );
  };

  const AnimatedLink = ({ children, ...props }) => (
    <Link
      {...props}
      sx={{
        color: theme.palette.primary.main,
        textDecoration: 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          color: theme.palette.primary.dark,
          transform: 'translateY(-2px)',
        }
      }}
    >
      {children}
    </Link>
  );

  const RoundItem = ({ round }) => (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography 
          variant="subtitle2" 
          color="primary"
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <span style={{ fontSize: '1.5em', lineHeight: 1, color: theme.palette.primary.main }}>•</span>
          Round {round.roundNumber}: {formatRoundName(round.roundName)}
        </Typography>
      </Box>
      {round.details && (
        <Typography 
          variant="body2" 
          sx={{ 
            pl: 4,
            color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
          }}
        >
          {round.details}
        </Typography>
      )}
    </Box>
  );

  const getStatusColor = (status) => {
    if (!status) return theme.palette.mode === 'dark' ? '#9E9E9E' : '#757575';
    
    switch (status.toLowerCase()) {
      case "ongoing":
        return theme.palette.mode === 'dark' ? '#81C784' : '#4CAF50';
      case "completed":
        return theme.palette.mode === 'dark' ? '#64B5F6' : '#2196F3';
      case "upcoming":
        return theme.palette.mode === 'dark' ? '#616161' : '#424242';
      default:
        return theme.palette.mode === 'dark' ? '#9E9E9E' : '#757575';
    }
  };

  const getStatusIcon = (status) => {
    if (!status) return <Circle fontSize="small" sx={{ color: getStatusColor("default") }} />;
    
    switch (status.toLowerCase()) {
      case "ongoing":
        return <Autorenew fontSize="small" sx={{ color: getStatusColor("ongoing") }} />;
      case "upcoming":
        return <Upcoming fontSize="small" sx={{ color: getStatusColor("upcoming") }} />;
      case "completed":
        return <CheckCircle fontSize="small" sx={{ color: getStatusColor("completed") }} />;
      default:
        return <Circle fontSize="small" sx={{ color: getStatusColor("default") }} />;
    }
  };

  const getStatusChipColor = (status) => {
    if (!status) return "default";
    
    switch (status.toLowerCase()) {
      case "ongoing":
        return "success";
      case "completed":
        return "info";
      case "upcoming":
        return "default";
      default:
        return "default";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <Box>
      <AppBar 
        position="static" 
        color="default" 
        elevation={0}
        sx={{ 
          mb: 3,
          borderRadius: 1,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <ResponsiveToolbar>
          <TitleContainer>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '0.9rem', sm: '1.25rem' },
                color: theme.palette.primary.main,
              }}
            >
              {placementDrive_title}
            </Typography>
            <Chip
              label={placementData.status === 'closed' ? 'Closed' : 
                     placementData.status === 'inProgress' ? 'In Progress' :
                     placementData.status === 'hold' ? 'Hold' : 
                     placementData.status}
              size="small"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                fontWeight: 'bold',
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
              }}
            />
          </TitleContainer>
          <ResponsiveButtonGroup>
            <Button
              variant="outlined"
              startIcon={<Group />}
              size={isMobile ? "small" : "medium"}
              onClick={handleOpenStudentDialog}
              sx={{
                minWidth: { xs: 'auto', sm: '140px' },
                whiteSpace: 'nowrap',
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.main + '10',
                  borderColor: theme.palette.primary.main,
                }
              }}
            >
              Participants
            </Button>
            {placementData.status === 'inProgress' && (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                  onClick={() => setOpenDeclareResultDialog(true)}
                  startIcon={<EventIcon />}
                  sx={{ 
                    fontWeight: 500,
                    minWidth: { xs: 'auto', sm: '140px' },
                  }}
                >
                  Declare Results
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                  onClick={() => setShowOfferLetters(!showOfferLetters)}
                  startIcon={<EmailIcon />}
                  sx={{ 
                    fontWeight: 500,
                    minWidth: { xs: 'auto', sm: '140px' },
                  }}
                >
                  {showOfferLetters ? "Hide Offers" : "Manage Offers"}
                </Button>
              </>
            )}
            {placementData.status === 'closed' && (
              <>
                <Button
                  variant="outlined"
                  startIcon={<Assessment />}
                  size={isMobile ? "small" : "medium"}
                  onClick={handleOpenStudentDialog}
                  sx={{
                    minWidth: { xs: 'auto', sm: '140px' },
                    whiteSpace: 'nowrap',
                    color: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main + '10',
                      borderColor: theme.palette.primary.main,
                    }
                  }}
                >
                  View Results
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<EmailIcon />}
                  size={isMobile ? "small" : "medium"}
                  onClick={() => setShowOfferLetters(!showOfferLetters)}
                  sx={{ 
                    fontWeight: 500,
                    minWidth: { xs: 'auto', sm: '140px' },
                  }}
                >
                  {showOfferLetters ? "Hide Offers" : "View Offers"}
                </Button>
              </>
            )}
          </ResponsiveButtonGroup>
        </ResponsiveToolbar>
      </AppBar>
      
      <Dialog
        open={studentDialogOpen}
        onClose={handleCloseStudentDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Participants</DialogTitle>
        <DialogContent>
          <PlacementStudents placementId={id} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStudentDialog}>Close</Button>
        </DialogActions>
      </Dialog>
      <Box 
        sx={{ 
          margin: '0 auto', 
          p: { xs: 1, sm: 1.5, md: 2 },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <CardContent sx={{ flex: 1 }}>
          <Stack spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
            {/* Company Details Section */}
            {hasCompanyDetails && (
              <AnimatedPaper color={getSectionColor(0)}>
                <Stack spacing={2}>
                  {companyDetails?.name && (
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <CompanyIcon sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' } }} />
                      {companyDetails.name}
                    </Typography>
                  )}
                  {companyDetails?.description && (
                    <Typography
                      variant="body1"
                      sx={{
                        color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                        lineHeight: 1.6
                      }}
                    >
                      {companyDetails.description}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                    {companyDetails?.domain && (
                      <InfoChip icon={DomainIcon} label="Domain" value={companyDetails.domain} />
                    )}
                    {companyDetails?.companyType && (
                      <InfoChip icon={TypeIcon} label="Type" value={companyDetails.companyType} />
                    )}
                    {companyDetails?.website && (
                      <InfoChip
                        icon={WebsiteIcon}
                        label="Website" 
                        value={companyDetails.website} 
                        href={companyDetails.website}
                      />
                    )}
                    {companyDetails?.email && (
                      <InfoChip 
                        icon={EmailIcon} 
                        label="Email" 
                        value={companyDetails.email} 
                        href={`mailto:${companyDetails.email}`}
                      />
                    )}
                  </Box>
                </Stack>
              </AnimatedPaper>
            )}

            {/* Job Profile Section */}
            {hasJobProfile && (
              <AnimatedPaper color={getSectionColor(1)}>
                <SectionHeader icon={JobIcon} title="Job Profile" />
                <Grid container spacing={3}>
                  {jobProfile?.designation && (
                    <Grid item xs={12} md={6}>
                      <Paper 
                        elevation={0}
                        sx={{
                          p: 2,
                          height: '100%',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.02)',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <RoleIcon sx={{ 
                            color: theme.palette.primary.main,
                            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
                          }} />
                          <Typography
                            variant="subtitle2"
                            color="primary"
                            sx={{
                              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                            }}
                          >
                            Role
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                          }}
                        >
                          {jobProfile.designation}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                  {jobProfile?.placeOfPosting && (
                    <Grid item xs={12} md={6}>
                      <Paper 
                        elevation={0}
                        sx={{
                          p: 2,
                          height: '100%',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.02)',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <LocationOn sx={{ 
                            color: theme.palette.primary.main,
                            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
                          }} />
                          <Typography
                            variant="subtitle2"
                            color="primary"
                            sx={{
                              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                            }}
                          >
                            Location
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                          }}
                        >
                          {jobProfile.placeOfPosting}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                  {jobProfile?.jobDescription?.description && (
                    <Grid item xs={12} md={6}>
                      <Paper 
                        elevation={0}
                        sx={{
                          p: 2,
                          height: '100%',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.02)',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <DescriptionIcon sx={{ 
                            color: theme.palette.primary.main,
                            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
                          }} />
                          <Typography
                            variant="subtitle2"
                            color="primary"
                            sx={{
                              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                            }}
                          >
                            Job Description
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                            lineHeight: 1.6
                          }}
                        >
                          {jobProfile.jobDescription.description}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                  {jobProfile?.perks && (
                    <Grid item xs={12} md={6}>
                      <Paper 
                        elevation={0}
                        sx={{
                          p: 2,
                          height: '100%',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.02)',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <PerksIcon sx={{ 
                            color: theme.palette.primary.main,
                            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
                          }} />
                          <Typography
                            variant="subtitle2"
                            color="primary"
                            sx={{
                              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                            }}
                          >
                            Health & Benefits
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                            lineHeight: 1.6
                          }}
                        >
                          {jobProfile.perks}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                      {jobProfile?.course && (
                        <InfoChip icon={CourseIcon} label="Course" value={jobProfile.course.toUpperCase()} />
                      )}
                      {jobProfile?.ctc && (
                        <InfoChip icon={AttachMoney} label="CTC" value={`₹${jobProfile.ctc/100000} LPA`} />
                      )}
                      {jobProfile?.takeHome && (
                        <InfoChip icon={AttachMoney} label="Take Home" value={`₹${jobProfile.takeHome/100000} LPA`} />
                      )}
                      {jobProfile?.trainingPeriod && (
                        <InfoChip icon={AccessTime} label="Training" value={jobProfile.trainingPeriod} />
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </AnimatedPaper>
            )}

            {/* Eligible Branches Section */}
            {hasEligibleBranches && (
              <AnimatedPaper color={getSectionColor(2)}>
                <SectionHeader icon={BranchIcon} title="Eligible Branches" />
                <Stack spacing={3}>
                  {eligibleBranchesForProfiles?.map((profile, index) => (
                    <React.Fragment key={index}>
                      {Object.entries(profile.branches).map(([course, branches]) => {
                        const hasEligibleBranches = branches.some(branch => branch.eligible);
                        return hasEligibleBranches && (
                          <Paper 
                            key={course}
                            elevation={0}
                            sx={{
                              p: 2,
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 2,
                              bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.02)',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <CourseIcon sx={{ 
                                color: theme.palette.primary.main,
                                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
                              }} />
                              <Typography
                                variant="subtitle2"
                                color="primary"
                                sx={{
                                  fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                                }}
                              >
                                {course.toUpperCase()}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {branches.map((branch, idx) => (
                                branch.eligible && (
                                  <Chip
                                    key={`${course}-${idx}`}
                                    icon={<CheckIcon />}
                                    label={branch.name || `${branch.department} - ${branch.specialization}`}
                                    variant="outlined"
                                    sx={{ 
                                      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                                      color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                                      '& .MuiChip-icon': {
                                        color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
                                      }
                                    }}
                                  />
                                )
                              ))}
                            </Box>
                          </Paper>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </Stack>
              </AnimatedPaper>
            )}

            {/* Eligibility Criteria Section */}
            {hasEligibilityCriteria && (
              <AnimatedPaper color={getSectionColor(3)}>
                <SectionHeader icon={EducationIcon} title="Eligibility Criteria" />
                <Grid container spacing={3}>
                  {eligibilityCriteria?.minCgpa !== undefined && (
                    <Grid item xs={12} md={6}>
                      <Paper 
                        elevation={0}
                        sx={{
                          p: 2,
                          height: '100%',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.02)',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <EducationIcon sx={{ 
                            color: theme.palette.primary.main,
                            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
                          }} />
                          <Typography
                            variant="subtitle2"
                            color="primary"
                            sx={{
                              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                            }}
                          >
                            CGPA Requirement
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                          }}
                        >
                          {eligibilityCriteria.minCgpa}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                  {eligibilityCriteria?.backlogAllowed !== undefined && (
                    <Grid item xs={12} md={6}>
                      <Paper 
                        elevation={0}
                        sx={{
                          p: 2,
                          height: '100%',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.02)',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Error sx={{ 
                            color: theme.palette.primary.main,
                            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
                          }} />
                          <Typography
                            variant="subtitle2"
                            color="primary"
                            sx={{
                              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                            }}
                          >
                            Backlog Policy
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                          }}
                        >
                          {eligibilityCriteria.backlogAllowed === 0 ? "No Backlogs Allowed" : `Backlogs Allowed: ${eligibilityCriteria.backlogAllowed}`}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </AnimatedPaper>
            )}

            {/* Selection Process Section */}
            {hasSelectionProcess && (
              <AnimatedPaper color={getSectionColor(4)}>
                <SectionHeader icon={ProcessIcon} title="Selection Process" />
                <Grid container spacing={3}>
                  {selectionProcess?.map((process, processIndex) => {
                    const hasProcessData = process.rounds?.length > 0 || 
                      process.tentativeDate || 
                      process.expectedRecruits;

                    return hasProcessData && (
                      <React.Fragment key={processIndex}>
                        {process.rounds?.map((round, index) => (
                          <Grid item xs={12} md={6} key={index}>
                            <Paper 
                              elevation={0}
                              sx={{
                                p: 2,
                                height: '100%',
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 2,
                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.02)',
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography 
                                  variant="subtitle2" 
                                  color="primary"
                                  sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                                  }}
                                >
                                  <span style={{ 
                                    fontSize: '1.5em', 
                                    lineHeight: 1, 
                                    color: theme.palette.primary.main 
                                  }}>•</span>
                                  Round {round.roundNumber}: {formatRoundName(round.roundName)}
                                </Typography>
                              </Box>
                              {round.details && (
                                <Typography 
                                  sx={{ 
                                    pl: 4,
                                    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                    lineHeight: 1.6
                                  }}
                                >
                                  {round.details}
                                </Typography>
                              )}
                            </Paper>
                          </Grid>
                        ))}
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                            {process.tentativeDate && (
                              <Chip
                                icon={<EventIcon />}
                                label={`Tentative Date: ${formatDate(process.tentativeDate)}`}
                                variant="outlined"
                                sx={{ 
                                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                                  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                                  '& .MuiChip-icon': {
                                    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
                                  }
                                }}
                              />
                            )}
                            {process.expectedRecruits && (
                              <Chip
                                icon={<BranchIcon />}
                                label={`Expected Recruits: ${process.expectedRecruits}`}
                                variant="outlined"
                                sx={{ 
                                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                                  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                                  '& .MuiChip-icon': {
                                    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
                                  }
                                }}
                              />
                            )}
                          </Box>
                        </Grid>
                      </React.Fragment>
                    );
                  })}
                </Grid>
              </AnimatedPaper>
            )}

            {/* Bond Details Section */}
            {bondDetails?.hasBond && bondDetails?.details && (
              <AnimatedPaper color={getSectionColor(5)}>
                <SectionHeader icon={BondIcon} title="Bond Details" color={getSectionColor(5)} />
                <Typography variant="body2" color="text.secondary">
                  {bondDetails.details}
                </Typography>
              </AnimatedPaper>
            )}

            {/* Application Details Section */}
            {hasApplicationDetails && (
              <AnimatedPaper color={getSectionColor(6)}>
                <SectionHeader icon={LinkIcon} title="Application Details" />
                <Grid container spacing={3}>
                  {applicationDetails?.applicationDeadline && (
                    <Grid item xs={12} md={6}>
                      <Paper 
                        elevation={0}
                        sx={{
                          p: 2,
                          height: '100%',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.02)',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <CalendarToday sx={{ 
                            color: theme.palette.primary.main,
                            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
                          }} />
                          <Typography
                            variant="subtitle2"
                            color="primary"
                            sx={{
                              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                            }}
                          >
                            Application Deadline
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                          }}
                        >
                          {formatDate(applicationDetails.applicationDeadline)}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                  {applicationDetails?.applicationLink && (
                    <Grid item xs={12} md={6}>
                      <Paper 
                        elevation={0}
                        sx={{
                          p: 2,
                          height: '100%',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.02)',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <ApplicationIcon sx={{ 
                            color: theme.palette.primary.main,
                            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
                          }} />
                          <Typography
                            variant="subtitle2"
                            color="primary"
                            sx={{
                              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                            }}
                          >
                            Application Link
                          </Typography>
                        </Box>
                        <Link 
                          href={applicationDetails.applicationLink}
                          target="_blank" 
                          rel="noopener noreferrer"
                          sx={{ 
                            color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                            textDecoration: 'none',
                            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                            '&:hover': {
                              textDecoration: 'underline'
                            }
                          }}
                        >
                          {applicationDetails.applicationLink}
                        </Link>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </AnimatedPaper>
            )}

            {showOfferLetters && (
              <AnimatedPaper color={getSectionColor(5)}>
                <SectionHeader icon={EmailIcon} title="Offer Letters" />
                <OfferLetterPanel 
                  placementId={id} 
                  companyName={companyDetails?.name}
                  jobProfile={jobProfile}
                />
              </AnimatedPaper>
            )}
          </Stack>
        </CardContent>
      </Box>
    </Box>
  );
};

export default PlacementOverview;
