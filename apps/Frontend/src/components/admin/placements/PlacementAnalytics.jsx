import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';

const PlacementAnalytics = () => {
  const analyticsData = [
    {
      title: "Total Companies",
      count: "45",
      Icon: BusinessIcon,
      color: "#1976d2",
      trend: "+5 this month"  
    },
    {
      title: "Students Placed",
      count: "234",
      Icon: PeopleIcon,
      color: "#2e7d32",
      trend: "75% placement rate"
    },
    {
      title: "Avg Package",
      count: "8.5 LPA",
      Icon: AttachMoneyIcon,
      color: "#ed6c02",
      trend: "+12% from last year"
    },
    {
      title: "Highest Package",
      count: "24 LPA",
      Icon: TrendingUpIcon,
      color: "#9c27b0",
      trend: "Tech Corp"
    }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {analyticsData.map((item, index) => {
        const IconComponent = item.Icon;
        return (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Grid container spacing={3} alignItems="center">
                  <Grid item>
                    <div style={{
                      backgroundColor: `${item.color}15`,
                      borderRadius: '12px',
                      padding: '12px',
                    }}>
                      <IconComponent sx={{ color: item.color }} />
                    </div>
                  </Grid>
                  <Grid item xs>
                    <Typography color="textSecondary" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="h5">
                      {item.count}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'success.main' }}>
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