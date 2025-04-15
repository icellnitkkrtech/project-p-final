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
  Event as EventIcon,
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
} from "@mui/icons-material";
import placementService from "../../../services/admin/placementService";
import PlacementStudents from "./PlacementStudents";

const PlacementOverview = ({ id }) => {
  const [placementData, setPlacementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);

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
        color: theme.palette[color].main,
        fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
      }} />
      <Typography 
        variant="h6" 
        color={color} 
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
          color: theme.palette[color].main,
          mr: 1,
          fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
        }} />
        <Typography
          variant="body1"
          sx={{
            mr: 1,
            fontWeight: 'medium',
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
          }}
        >
          {label}:
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
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
              color: 'inherit',
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
          // borderColor: theme.palette[color].main,
          color: theme.palette[color].main,
          '& .MuiChip-icon': {
            color: theme.palette[color].main
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

  const InfoSection = ({ title, content, color = "primary", icon: Icon = DescriptionIcon, isBulletList = false }) => (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        {isBulletList ? (
          <span style={{ 
            fontSize: { xs: '1rem', sm: '1.25em', md: '1.5em' },
            lineHeight: 1, 
            color: theme.palette[color].main 
          }}>•</span>
        ) : (
          <Icon sx={{ 
            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
            color: theme.palette[color].main 
          }} />
        )}
        <Typography
          variant="subtitle2"
          color={color}
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
          }}
        >
          {title}
        </Typography>
      </Box>
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{
          fontSize: { xs: '0.625rem', sm: '0.75rem', md: '0.875rem' }
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
    const colors = ['primary', 'success'];
    return colors[index % 2];
  };

  const AnimatedPaper = ({ children, color, delay = 0 }) => {
    const ref = React.useRef(null);
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.1
        }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, []);

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{
          duration: 0.5,
          delay: delay / 1000,
          ease: [0.25, 0.1, 0.25, 1]
        }}
      >
        <Paper
          id={`section-${color}`}
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            borderLeft: `4px solid ${theme.palette[color].main}`,
            bgcolor: `${theme.palette[color].main}08`,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '30%',
              height: '100%',
              background: `linear-gradient(to left, ${theme.palette[color].main}10, transparent)`,
              zIndex: 0,
            },
            '& > *': {
              position: 'relative',
              zIndex: 1,
            }
          }}
        >
          {children}
        </Paper>
      </motion.div>
    );
  };

  const AnimatedLink = ({ children, color, ...props }) => (
    <Link
      {...props}
      sx={{
        color: theme.palette[color].main,
        textDecoration: 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          color: theme.palette[color].dark,
          transform: 'translateY(-2px)',
        }
      }}
    >
      {children}
    </Link>
  );

  const RoundItem = ({ round, color }) => (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography 
          variant="subtitle2" 
          color={color}
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <span style={{ fontSize: '1.5em', lineHeight: 1 }}>•</span>
          Round {round.roundNumber}: {round.roundName}
        </Typography>
      </Box>
      {round.details && (
        <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
          {round.details}
        </Typography>
      )}
    </Box>
  );

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
        <Toolbar 
          variant="dense"
          sx={{
            minHeight: '64px',
            padding: theme.spacing(1, 2),
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            [theme.breakpoints.down('sm')]: {
              minHeight: '56px',
              padding: theme.spacing(1),
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
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.25rem' },
                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
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
                backgroundColor: placementData.status === 'inProgress' 
                  ? 'info.main' 
                  : placementData.status === 'closed' 
                    ? 'success.main'
                    : placementData.status === 'hold'
                      ? 'warning.main'
                      : 'default.main',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                px: 1,
                '& .MuiChip-label': {
                  px: 1
                }
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Group />}
              size={isMobile ? "small" : "medium"}
              onClick={handleOpenStudentDialog}
              sx={{
                minWidth: { xs: 'auto', sm: '140px' },
                whiteSpace: 'nowrap',
                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                '&:hover': {
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                }
              }}
            >
              Participants
            </Button>
            {placementData.status === 'inProgress' && (
              <Button
                variant="outlined"
                startIcon={<Assessment />}
                size={isMobile ? "small" : "medium"}
                sx={{
                  minWidth: { xs: 'auto', sm: '140px' },
                  whiteSpace: 'nowrap',
                  color: theme.palette.info.main,
                  borderColor: theme.palette.info.main,
                  '&:hover': {
                    backgroundColor: theme.palette.info.main + '10',
                    borderColor: theme.palette.info.main,
                  }
                }}
              >
                Declare Results
              </Button>
            )}
            {placementData.status === 'closed' && (
              <Button
                variant="outlined"
                startIcon={<Assessment />}
                size={isMobile ? "small" : "medium"}
                sx={{
                  minWidth: { xs: 'auto', sm: '140px' },
                  whiteSpace: 'nowrap',
                  color: theme.palette.success.main,
                  borderColor: theme.palette.success.main,
                  '&:hover': {
                    backgroundColor: theme.palette.success.main + '10',
                    borderColor: theme.palette.success.main,
                  }
                }}
              >
                Results
              </Button>
            )}
          </Box>
        </Toolbar>
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
              <AnimatedPaper color={getSectionColor(0)} delay={100}>
                <SectionHeader icon={CompanyIcon} title="Company Details" color={getSectionColor(0)} />
                <Stack spacing={2}>
                  {companyDetails?.name && (
                    <InfoSection 
                      title="Company Name" 
                      content={companyDetails.name} 
                      color={getSectionColor(0)}
                      icon={CompanyNameIcon}
                    />
                  )}
                  {companyDetails?.description && (
                    <InfoSection 
                      title="About Company" 
                      content={companyDetails.description}
                      color={getSectionColor(0)}
                      icon={DescriptionIcon}
                    />
                  )}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                    {companyDetails?.domain && (
                      <InfoChip icon={DomainIcon} label="Domain" value={companyDetails.domain} color={getSectionColor(0)} />
                    )}
                    {companyDetails?.companyType && (
                      <InfoChip icon={TypeIcon} label="Type" value={companyDetails.companyType} color={getSectionColor(0)} />
                    )}
                    {companyDetails?.website && (
                      <InfoChip
                        icon={WebsiteIcon}
                        label="Website" 
                        value={companyDetails.website} 
                        color={getSectionColor(0)}
                        href={companyDetails.website}
                      />
                    )}
                    {companyDetails?.email && (
                      <InfoChip 
                        icon={EmailIcon} 
                        label="Email" 
                        value={companyDetails.email} 
                        color={getSectionColor(0)}
                        href={`mailto:${companyDetails.email}`}
                      />
                    )}
                  </Box>
                </Stack>
              </AnimatedPaper>
            )}

            {/* Job Profile Section */}
            {hasJobProfile && (
              <AnimatedPaper color={getSectionColor(1)} delay={200}>
                <SectionHeader icon={JobIcon} title="Job Profile" color={getSectionColor(1)} />
                <Stack spacing={2}>
                  {jobProfile?.designation && (
                    <InfoSection 
                      title="Role" 
                      content={jobProfile.designation} 
                      color={getSectionColor(1)}
                      icon={RoleIcon}
                    />
                  )}
                  {jobProfile?.placeOfPosting && (
                    <InfoSection 
                      title="Location" 
                      content={jobProfile.placeOfPosting}
                      color={getSectionColor(1)}
                      icon={LocationOn}
                    />
                  )}
                  {jobProfile?.jobDescription?.description && (
                    <InfoSection 
                      title="Job Description" 
                      content={jobProfile.jobDescription.description} 
                      color={getSectionColor(1)}
                      icon={DescriptionIcon}
                    />
                  )}
                  {jobProfile?.perks && (
                    <InfoSection
                      title="Perks & Benefits"
                      content={jobProfile.perks}
                      color={getSectionColor(1)}
                      icon={PerksIcon}
                    />
                  )}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                    {jobProfile?.course && (
                      <InfoChip icon={CourseIcon} label="Course" value={jobProfile.course.toUpperCase()} color={getSectionColor(1)} />
                    )}
                    {jobProfile?.ctc && (
                      <InfoChip icon={AttachMoney} label="CTC" value={`₹${jobProfile.ctc/100000} LPA`} color={getSectionColor(1)} />
                    )}
                    {jobProfile?.takeHome && (
                      <InfoChip icon={AttachMoney} label="Take Home" value={`₹${jobProfile.takeHome/100000} LPA`} color={getSectionColor(1)} />
                    )}
                    {jobProfile?.trainingPeriod && (
                      <InfoChip icon={AccessTime} label="Training" value={jobProfile.trainingPeriod} color={getSectionColor(1)} />
                    )}
                  </Box>
                </Stack>
              </AnimatedPaper>
            )}

            {/* Eligible Branches Section */}
            {hasEligibleBranches && (
              <AnimatedPaper color={getSectionColor(2)} delay={300}>
                <SectionHeader icon={BranchIcon} title="Eligible Branches" color={getSectionColor(2)} />
                <Stack spacing={2}>
                  {eligibleBranchesForProfiles?.map((profile, index) => (
                    <Box key={index}>
                      {Object.entries(profile.branches).map(([course, branches]) => {
                        const hasEligibleBranches = branches.some(branch => branch.eligible);
                        return hasEligibleBranches && (
                          <Box key={course} sx={{ mb: 2 }}>
                            <Typography 
                              variant="body1" 
                              color={`${getSectionColor(2)}.main`}
                              sx={{ 
                                fontWeight: 'medium',
                                mb: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}
                            >
                              <CourseIcon sx={{ color: theme.palette[getSectionColor(2)].main }} />
                              {course.toUpperCase()}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pl: 2 }}>
                              {branches.map((branch, idx) => (
                                branch.eligible && (
                                  <Chip
                                    key={`${course}-${idx}`}
                                    icon={<CheckIcon />}
                                    label={branch.name || `${branch.department} - ${branch.specialization}`}
                                    variant="outlined"
                                    sx={{ 
                                      borderColor: theme.palette[getSectionColor(2)].main,
                                      color: theme.palette[getSectionColor(2)].main,
                                      '& .MuiChip-icon': {
                                        color: theme.palette[getSectionColor(2)].main
                                      }
                                    }}
                                  />
                                )
                              ))}
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  ))}
                </Stack>
              </AnimatedPaper>
            )}

            {/* Eligibility Criteria Section */}
            {hasEligibilityCriteria && (
              <AnimatedPaper color={getSectionColor(3)} delay={400}>
                <SectionHeader icon={EducationIcon} title="Eligibility Criteria" color={getSectionColor(3)} />
                <Stack spacing={2}>
                  {eligibilityCriteria?.minCgpa !== undefined && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                      <Chip
                        icon={<EducationIcon />}
                        label={`CGPA: ${eligibilityCriteria.minCgpa}`}
                        variant="outlined"
                        sx={{ 
                          borderColor: theme.palette[getSectionColor(3)].main,
                          color: theme.palette[getSectionColor(3)].main,
                          '& .MuiChip-icon': {
                            color: theme.palette[getSectionColor(3)].main
                          }
                        }}
                      />
                    </Box>
                  )}
                  {eligibilityCriteria?.backlogAllowed !== undefined && (
                    <InfoSection 
                      title="Backlogs" 
                      content={eligibilityCriteria.backlogAllowed === 0 ? "No Backlogs Allowed" : `Backlogs Allowed: ${eligibilityCriteria.backlogAllowed}`} 
                      color={getSectionColor(3)}
                      isBulletList={true}
                    />
                  )}
                </Stack>
              </AnimatedPaper>
            )}

            {/* Selection Process Section */}
            {hasSelectionProcess && (
              <AnimatedPaper color={getSectionColor(4)} delay={500}>
                <SectionHeader icon={ProcessIcon} title="Selection Process" color={getSectionColor(4)} />
                {selectionProcess?.map((process, processIndex) => {
                  const hasProcessData = process.rounds?.length > 0 || 
                    process.tentativeDate || 
                    process.expectedRecruits;

                  return hasProcessData && (
                    <Box key={processIndex} sx={{ mb: 3 }}>
                      {process.rounds?.length > 0 && (
                        <Stack spacing={2}>
                          {process.rounds.map((round, index) => (
                            <RoundItem 
                              key={index}
                              round={round}
                              color={getSectionColor(4)}
                            />
                          ))}
                        </Stack>
                      )}
                      {process.tentativeDate && (
                        <InfoSection 
                          icon={EventIcon}
                          title="Tentative Date" 
                          content={formatDate(process.tentativeDate)} 
                          color={getSectionColor(4)}
                        />
                      )}
                      {process.expectedRecruits && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                          <Chip
                            icon={<BranchIcon />}
                            label={`Expected Recruits: ${process.expectedRecruits}`}
                            variant="outlined"
                            sx={{ 
                              borderColor: theme.palette[getSectionColor(4)].main,
                              color: theme.palette[getSectionColor(4)].main,
                              '& .MuiChip-icon': {
                                color: theme.palette[getSectionColor(4)].main
                              }
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </AnimatedPaper>
            )}

            {/* Application Details Section */}
            {hasApplicationDetails && (
              <AnimatedPaper color={getSectionColor(5)} delay={600}>
                <SectionHeader icon={LinkIcon} title="Application Details" color={getSectionColor(5)} />
                <Stack spacing={2}>
                  {applicationDetails?.applicationDeadline && (
                    <InfoSection 
                      title="Application Deadline" 
                      content={formatDate(applicationDetails.applicationDeadline)} 
                      color={getSectionColor(5)}
                      icon={CalendarToday}
                    />
                  )}
                  {applicationDetails?.applicationLink && (
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <ApplicationIcon sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }, color: theme.palette[getSectionColor(5)].main }} />
                        <Typography variant="subtitle2" color={getSectionColor(5)}>
                          Application Link
                        </Typography>
                      </Box>
                      <Link 
                        href={applicationDetails.applicationLink}
                        target="_blank" 
                        rel="noopener noreferrer"
                        sx={{ 
                          color: theme.palette[getSectionColor(5)].main,
                          textDecoration: 'underline',
                          fontSize: { xs: '0.625rem', sm: '0.75rem', md: '0.875rem' },
                          '&:hover': {
                            textDecoration: 'none'
                          }
                        }}
                      >
                        {applicationDetails.applicationLink}
                      </Link>
                    </Box>
                  )}
                </Stack>
              </AnimatedPaper>
            )}

            {/* Bond Details Section - Moved to the end */}
            {bondDetails?.hasBond && bondDetails?.details && (
              <AnimatedPaper color={getSectionColor(6)} delay={700}>
                <SectionHeader icon={BondIcon} title="Bond Details" color={getSectionColor(6)} />
                <Typography variant="body2" color="text.secondary">
                  {bondDetails.details}
                </Typography>
              </AnimatedPaper>
            )}
          </Stack>
        </CardContent>
      </Box>
    </Box>
  );
};

export default PlacementOverview;
