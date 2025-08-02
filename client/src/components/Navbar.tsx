import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Receipt as ReceiptIcon,
  Assessment as ReportsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// Context
import { useThemeMode } from '../contexts/ThemeContext';

// Components
import SearchBar from './SearchBar';

const navigationItems = [
  { path: '/', label: 'Dashboard', icon: DashboardIcon },
  { path: '/analytics', label: 'Analytics', icon: AnalyticsIcon },
  { path: '/transactions', label: 'Transactions', icon: ReceiptIcon },
  { path: '/reports', label: 'Reports', icon: ReportsIcon },
  { path: '/settings', label: 'Settings', icon: SettingsIcon },
];

const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleMode } = useThemeMode();

  // Local state
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);

  // Mock notifications
  const notifications = [
    {
      id: '1',
      type: 'success' as const,
      message: 'Transaction completed successfully',
      timestamp: Date.now() - 300000,
    },
    {
      id: '2',
      type: 'info' as const,
      message: 'Monthly report is ready',
      timestamp: Date.now() - 600000,
    },
  ];

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backdropFilter: 'blur(20px)',
          background: `${theme.palette.background.paper}95`,
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          {/* Logo */}
          <Box display="flex" alignItems="center" gap={2}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/')}
              >
                F
              </Box>
            </motion.div>
            
            <Typography
              variant="h6"
              fontWeight={700}
              color="text.primary"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              FinanceApp
            </Typography>
          </Box>

          {/* Navigation Items - Desktop */}
          {!isMobile && (
            <Box display="flex" gap={1} ml={4}>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);
                
                return (
                  <Button
                    key={item.path}
                    startIcon={<Icon />}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                      backgroundColor: isActive ? `${theme.palette.primary.main}12` : 'transparent',
                      '&:hover': {
                        backgroundColor: isActive 
                          ? `${theme.palette.primary.main}20` 
                          : theme.palette.action.hover,
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}

          <Box flex={1} />

          {/* Right Side Actions */}
          <Box display="flex" alignItems="center" gap={1}>
            {/* Search */}
            <Tooltip title="Search">
              <IconButton
                onClick={() => setSearchOpen(true)}
                sx={{
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>

            {/* Theme Toggle */}
            <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
              <IconButton
                onClick={toggleMode}
                sx={{
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                onClick={handleNotificationOpen}
                sx={{
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <Badge badgeContent={notifications.length} color="primary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Profile */}
            <Tooltip title="Account">
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: theme.palette.primary.main,
                    fontSize: '0.875rem',
                  }}
                >
                  U
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>

        {/* Mobile Navigation */}
        {isMobile && (
          <Box
            sx={{
              display: 'flex',
              overflowX: 'auto',
              px: 2,
              pb: 1,
              gap: 1,
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              
              return (
                <Chip
                  key={item.path}
                  icon={<Icon fontSize="small" />}
                  label={item.label}
                  onClick={() => handleNavigation(item.path)}
                  variant={isActive ? 'filled' : 'outlined'}
                  color={isActive ? 'primary' : 'default'}
                  sx={{
                    minWidth: 'fit-content',
                    '& .MuiChip-label': {
                      fontSize: '0.75rem',
                    },
                  }}
                />
              );
            })}
          </Box>
        )}
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            minWidth: 200,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            User Account
          </Typography>
          <Typography variant="caption" color="text.secondary">
            user@example.com
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/settings'); }}>
          <SettingsIcon sx={{ mr: 2, fontSize: 20 }} />
          Settings
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <AccountCircleIcon sx={{ mr: 2, fontSize: 20 }} />
          Profile
        </MenuItem>
      </Menu>

      {/* Notification Panel */}
      {notificationAnchor && (
        <Box
          sx={{
            position: 'fixed',
            top: 70,
            right: 16,
            width: 350,
            maxHeight: 400,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            boxShadow: theme.shadows[4],
            zIndex: 1300,
          }}
        >
          <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight={600}>
                Notifications
              </Typography>
              <IconButton size="small" onClick={handleNotificationClose}>
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          
          <Box sx={{ p: 2 }}>
            {notifications.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center">
                No new notifications
              </Typography>
            ) : (
              notifications.map((notification) => (
                <Box key={notification.id} sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        </Box>
      )}

      {/* Search Bar */}
      <SearchBar
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
};

export default Navbar;