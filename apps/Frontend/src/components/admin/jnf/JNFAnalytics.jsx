
import { Typography, Box, useTheme } from '@mui/material';

const JNFAnalytics = () => {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography 
        variant="h6" 
        sx={{ 
          color: theme.palette.text.primary,
          mb: 2 
        }}
      >
        JNF Analytics
      </Typography>
    </Box>
  );
};

export default JNFAnalytics;