import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Box,
    useTheme,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Business as BusinessIcon,
    Description as JNFIcon,
    WorkOutline as PlacementsIcon,
    Assessment as ReportsIcon,
    Settings as SettingsIcon,
    History,
    Notifications as NotificationsIcon,
    AutoFixHigh,
} from '@mui/icons-material';
import ListAltIcon from "@mui/icons-material/ListAlt";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useNavigate, useLocation } from 'react-router-dom';
import { useLayout } from '../../../hooks/admin/useLayout';

const menuItems = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
    { title: 'Students', path: '/admin/students', icon: <PeopleIcon /> },
    { title: 'Companies', path: '/admin/companies', icon: <BusinessIcon /> },
    { title: 'JNF', path: '/admin/jnf', icon: <JNFIcon /> },
    { title: 'Placements', path: '/admin/placements', icon: <PlacementsIcon /> },
    { title: 'Survey', path: '/admin/survey', icon: <ListAltIcon /> },
    { title: 'Query', path: '/admin/query', icon: <ChatBubbleOutlineIcon /> },
    { title: 'Reports', path: '/admin/reports', icon: <ReportsIcon /> },
    { title: 'Settings', path: '/admin/settings', icon: <SettingsIcon /> },
    { title: 'Audit Logs', path: '/admin/audit', icon: <History /> },
    { title: 'Notifications', path: '/admin/notifications', icon: <NotificationsIcon /> },
    { title: 'Automation', path: '/admin/automation', icon: <AutoFixHigh /> },
];

const Sidebar = ({ open, onClose, variant = 'permanent', mobile, sx }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { toggleSidebar } = useLayout();

    const handleNavigation = (path) => {
        navigate(path);
        if (mobile) {
            toggleSidebar();
        }
    };

    return (
        <Drawer
            variant={variant}
            open={variant === 'permanent' ? true : open}
            onClose={onClose}
            sx={{
                ...sx,
                '& .MuiDrawer-paper': {
                    ...sx?.['& .MuiDrawer-paper'],
                    overflowX: 'hidden',
                    bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
                    pt: '32px',
                },
            }}
        >
            <Box sx={{ overflow: 'auto' }}>
                {/* Logo */}
                <Box sx={{ 
                    p: 2, 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: mobile ? 'flex-start' : 'center',
                }}>
                    {/* Your logo here */}
                </Box>

                {/* Navigation Items */}
                <List>
                    {menuItems.map((item) => (
                        <ListItem 
                            key={item.path} 
                            disablePadding 
                            sx={{ display: 'block' }}
                        >
                            <ListItemButton
                                onClick={() => handleNavigation(item.path)}
                                selected={location.pathname === item.path}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: mobile || open ? 'initial' : 'center',
                                    px: 2.5,
                                    '&.Mui-selected': {
                                        bgcolor: theme.palette.mode === 'dark' 
                                            ? 'rgba(255, 255, 255, 0.08)'
                                            : 'rgba(0, 0, 0, 0.04)',
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: mobile || open ? 3 : 'auto',
                                        justifyContent: 'center',
                                        color: location.pathname === item.path 
                                            ? theme.palette.primary.main 
                                            : 'inherit',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.title} 
                                    sx={{ 
                                        opacity: mobile || open ? 1 : 0,
                                        display: mobile || open ? 'block' : 'none',
                                        color: location.pathname === item.path 
                                            ? theme.palette.primary.main 
                                            : 'inherit',
                                    }} 
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar; 