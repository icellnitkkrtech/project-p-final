import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Avatar, 
  Chip, 
  IconButton, 
  Tooltip
} from '@mui/material';
import { 
  Person, 
  Visibility, 
  Edit, 
  MoreVert
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const StudentCard = ({ student, onProfileClick, onStudentSelect, handleMenuOpen }) => {
  const theme = useTheme();

  return (
    <Card 
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 2,
        border: '1px solid',
        borderColor: theme => theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme => theme.palette.mode === 'dark'
            ? '0 4px 20px rgba(0, 0, 0, 0.5)'
            : '0 4px 20px rgba(25, 118, 210, 0.15)',
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Student Header */}
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Avatar 
            src={student.personalInfo?.photo} 
            alt={student.personalInfo?.name}
            onClick={() => onProfileClick(student)}
            sx={{
              width: 64,
              height: 64,
              cursor: 'pointer',
              bgcolor: theme.palette.primary.main,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          >
            <Person sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                mb: 0.5,
                cursor: 'pointer',
                '&:hover': {
                  color: theme.palette.primary.main
                },
                color: theme.palette.mode === 'dark' ? '#fff' : '#1a1a1a'
              }}
              onClick={() => onProfileClick(student)}
            >
              {student.personalInfo?.name || 'N/A'}
            </Typography>
            <Typography 
              variant="body2"
              sx={{ 
                color: theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.7)'
                  : 'rgba(0,0,0,0.6)'
              }}
            >
              {student.personalInfo?.rollNumber || 'N/A'}
            </Typography>
          </Box>
        </Box>

        {/* Student Details */}
        <Box 
          sx={{
            display: 'grid',
            gap: 2,
            mb: 2,
            p: 2,
            borderRadius: 1,
            bgcolor: theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.03)'
              : 'rgba(25, 118, 210, 0.04)'
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">Department</Typography>
            <Typography variant="body2">{student.personalInfo?.department || 'N/A'}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">Batch</Typography>
            <Typography variant="body2">{student.personalInfo?.batch || 'N/A'}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">CGPA</Typography>
            <Typography variant="body2" fontWeight={500}>
              {student.academics?.cgpa || 'N/A'}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">Status</Typography>
            <Chip
              label={student.verificationStatus || "N/A"}
              color={student.verificationStatus === "verified" ? "success" : "default"}
              size="small"
              sx={{ 
                fontWeight: 500,
                textTransform: 'capitalize'
              }}
            />
          </Box>
        </Box>

        {/* Actions */}
        <Box 
          display="flex" 
          justifyContent="flex-end" 
          gap={1}
          sx={{
            '& .MuiIconButton-root': {
              color: theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.7)'
                : theme.palette.primary.main,
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(25, 118, 210, 0.08)'
              }
            }
          }}
        >
          <Tooltip title="View Details">
            <IconButton 
              size="small" 
              onClick={() => onProfileClick(student)}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Student">
            <IconButton 
              size="small" 
              onClick={() => onStudentSelect(student)}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="More Actions">
            <IconButton 
              size="small"
              onClick={(e) => handleMenuOpen(e, student)}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StudentCard; 