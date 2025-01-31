import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  InputBase,
  Card,
  CardContent,
  Grid,
  Breadcrumbs,
  Link,
  Badge,
  Stack,
  Paper
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  PostAdd as PostAddIcon,
  Notifications as NotificationIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  ChevronRight as ChevronRightIcon,
  ExitToApp as LogoutIcon,
  Email, 
  Phone
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import CompanyProfile from './CompanyProfile';
import JNFPosting from './JNFPosting';

const drawerWidth = 280;

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const CompanyDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const menuItems = [
    { text: 'Post New JNF', icon: <PostAddIcon />, index: 0 },
    { text: 'Your Profile', icon: <BusinessIcon />, index: 1 },
  ];

  const drawer = (
    <Box>
      <Toolbar sx={{ 
        background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
        color: 'white'
      }}>
        <Typography variant="h6" noWrap component="div">
          Tech Corp
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            selected={activeTab === item.index}
            onClick={() => setActiveTab(item.index)}
            sx={{ 
              cursor: 'pointer',
              '&.Mui-selected': {
                background: alpha(theme.palette.primary.main, 0.1),
                borderRight: `3px solid ${theme.palette.primary.main}`,
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.2),
                }
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: activeTab === item.index ? 'primary.main' : 'inherit'
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: activeTab === item.index ? 600 : 400,
                  color: activeTab === item.index ? 'primary.main' : 'inherit'
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Stack 
            direction="row" 
            spacing={3} 
            alignItems="center"
            sx={{ 
              ml: 2,
              display: { xs: 'none', sm: 'flex' } // Hide on mobile
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email fontSize="small" />
              <Typography variant="body2">support@techcorp.com</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone fontSize="small" />
              <Typography variant="body2">+91 1234567890</Typography>
            </Box>
          </Stack>

          {/* <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search> */}

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton color="inherit" onClick={handleNotificationOpen}>
              <Badge badgeContent={4} color="error">
                <NotificationIcon />
              </Badge>
            </IconButton>
            
            <IconButton color="inherit">
              <SettingsIcon />
            </IconButton>

            <Avatar
              onClick={handleProfileMenuOpen}
              sx={{ 
                cursor: 'pointer',
                bgcolor: alpha(theme.palette.common.white, 0.2),
                '&:hover': { bgcolor: alpha(theme.palette.common.white, 0.3) }
              }}
            >
              TC
            </Avatar>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ 
          width: { md: drawerWidth }, 
          flexShrink: { md: 0 } 
        }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
              boxShadow: '4px 0 10px rgba(0,0,0,0.05)'
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component={motion.main}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8
        }}
      >
        <motion.div variants={itemVariants}>
          <Box sx={{ mb: 4 }}>
            {activeTab === 0 && <JNFPosting />}
            {activeTab === 1 && <CompanyProfile />}
          </Box>
        </motion.div>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        sx={{ mt: 2 }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <PersonIcon sx={{ mr: 1 }} /> Profile
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <SettingsIcon sx={{ mr: 1 }} /> Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleProfileMenuClose}>
          <LogoutIcon sx={{ mr: 1 }} /> Logout
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        sx={{ mt: 2 }}
      >
        <MenuItem onClick={handleNotificationClose}>
          New application received
        </MenuItem>
        <MenuItem onClick={handleNotificationClose}>
          JNF status updated
        </MenuItem>
        <MenuItem onClick={handleNotificationClose}>
          Profile update reminder
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default CompanyDashboard;