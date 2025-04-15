import React from 'react';
import { Grid, Card, CardContent, Typography, useTheme } from '@mui/material';
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  Work as WorkIcon,
  CheckCircle as CheckCircleIcon,
  PendingActions as PendingIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';

const PlacementAnalytics = ({ placements }) => {
  const theme = useTheme();

  // Calculate analytics data
  const calculateAnalytics = () => {
    if (!placements || placements.length === 0) {
      return {
        totalPlacements: 0,
        activePlacements: 0,
        closedPlacements: 0,
        avgPackage: 0,
        highestPackage: 0,
        totalCompanies: 0,
        studentsPlaced: 0,
        uniqueCompanies: new Set(),
      };
    }

    let totalPlacements = placements.length;
    let activePlacements = 0;
    let closedPlacements = 0;
    let totalPackage = 0;
    let highestPackage = 0;
    let uniqueCompanies = new Set();
    let studentsPlaced = 0;

    placements.forEach(placement => {
      // Count status
      switch (placement.status) {
        case 'inProgress':
          activePlacements++;
          break;
        case 'closed':
          closedPlacements++;
          break;
      }

      // Track companies
      if (placement.companyDetails?.name) {
        uniqueCompanies.add(placement.companyDetails.name);
      }

      // Calculate packages
      const ctc = parseFloat(placement.jobProfile?.ctc) || 0;
      if (ctc > 0) {
        totalPackage += ctc;
        highestPackage = Math.max(highestPackage, ctc);
      }

      // Count students placed
      if (placement.status === 'closed' && placement.jobProfile?.expectedRecruits) {
        studentsPlaced += parseInt(placement.jobProfile.expectedRecruits) || 0;
      }
    });

    return {
      totalPlacements,
      activePlacements,
      closedPlacements,
      avgPackage: totalPackage / (totalPlacements || 1),
      highestPackage,
      totalCompanies: uniqueCompanies.size,
      studentsPlaced,
    };
  };

  const analytics = calculateAnalytics();

  const analyticsData = [
    {
      title: "Total Placements",
      count: analytics.totalPlacements,
      Icon: WorkIcon,
      color: "#1976d2", // Blue
      trend: `${analytics.totalCompanies} companies`
    },
    {
      title: "Students Placed",
      count: analytics.studentsPlaced,
      Icon: PeopleIcon,
      color: "#2e7d32", // Green
      trend: `${Math.round((analytics.studentsPlaced / (analytics.totalPlacements * 10)) * 100)}% placement rate`
    },
    {
      title: "Avg Package",
      count: `${(analytics.avgPackage / 100000).toFixed(1)} LPA`,
      Icon: AttachMoneyIcon,
      color: "#1976d2", // Blue
      trend: `Highest: ${(analytics.highestPackage / 100000).toFixed(1)} LPA`
    },
    {
      title: "Active Placements",
      count: analytics.activePlacements,
      Icon: AccessTimeIcon,
      color: "#2e7d32", // Green
      trend: `${analytics.closedPlacements} completed`
    }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {analyticsData.map((item, index) => {
        const IconComponent = item.Icon;
        return (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              height: '100%',
              transition: 'transform 0.2s',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[4]
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                backgroundColor: item.color,
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '100%',
                background: `linear-gradient(to right, transparent 50%, ${item.color}20)`,
                opacity: 1,
                zIndex: 0
              }
            }}>
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <div style={{
                      backgroundColor: `${item.color}15`,
                      borderRadius: '12px',
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconComponent sx={{ 
                        color: item.color,
                        fontSize: '1.5rem'
                      }} />
                    </div>
                  </Grid>
                  <Grid item xs>
                    <Typography 
                      variant="subtitle2" 
                      color="text.secondary" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 500,
                        fontSize: '0.875rem'
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 600,
                        color: item.color,
                        mb: 0.5
                      }}
                    >
                      {item.count}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                        fontSize: '0.875rem'
                      }}
                    >
                      {item.trend}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default PlacementAnalytics; 