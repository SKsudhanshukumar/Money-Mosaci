import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Avatar,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
} from '@mui/material';
import {
  Person as PersonIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Storage as StorageIcon,
  CloudUpload as CloudUploadIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Hooks and State
import { useThemeMode } from '../contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { updateUser, updatePreferences } from '../state/slices/authSlice';
import { addNotification } from '../state/slices/uiSlice';

const Settings: React.FC = () => {
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'user',
  });

  const [preferences, setPreferences] = useState({
    theme: mode,
    currency: user?.preferences?.currency || 'USD',
    dateFormat: user?.preferences?.dateFormat || 'MM/DD/YYYY',
    notifications: user?.preferences?.notifications ?? true,
    emailReports: true,
    dataRetention: '12',
    autoBackup: true,
  });

  const handleSaveProfile = () => {
    dispatch(updateUser(profileData));
    dispatch(addNotification({
      type: 'success',
      message: 'Profile updated successfully',
    }));
    setEditingProfile(false);
  };

  const handlePreferenceChange = (key: string, value: any) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    
    if (key === 'theme') {
      toggleMode();
    }
    
    dispatch(updatePreferences({ [key]: value }));
    dispatch(addNotification({
      type: 'success',
      message: 'Settings updated successfully',
    }));
  };

  const settingSections = [
    {
      title: 'Profile Settings',
      icon: <PersonIcon />,
      items: [
        {
          label: 'Full Name',
          value: profileData.name,
          type: 'text',
          editable: true,
        },
        {
          label: 'Email Address',
          value: profileData.email,
          type: 'email',
          editable: true,
        },
        {
          label: 'Role',
          value: profileData.role,
          type: 'select',
          options: ['admin', 'user', 'viewer'],
          editable: false,
        },
      ],
    },
    {
      title: 'Appearance',
      icon: <PaletteIcon />,
      items: [
        {
          label: 'Theme',
          value: preferences.theme,
          type: 'switch',
          onChange: () => handlePreferenceChange('theme', preferences.theme === 'light' ? 'dark' : 'light'),
        },
        {
          label: 'Currency',
          value: preferences.currency,
          type: 'select',
          options: ['USD', 'EUR', 'GBP', 'JPY', 'CAD'],
          onChange: (value: string) => handlePreferenceChange('currency', value),
        },
        {
          label: 'Date Format',
          value: preferences.dateFormat,
          type: 'select',
          options: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
          onChange: (value: string) => handlePreferenceChange('dateFormat', value),
        },
      ],
    },
    {
      title: 'Notifications',
      icon: <NotificationsIcon />,
      items: [
        {
          label: 'Push Notifications',
          value: preferences.notifications,
          type: 'switch',
          onChange: () => handlePreferenceChange('notifications', !preferences.notifications),
        },
        {
          label: 'Email Reports',
          value: preferences.emailReports,
          type: 'switch',
          onChange: () => handlePreferenceChange('emailReports', !preferences.emailReports),
        },
      ],
    },
    {
      title: 'Data & Privacy',
      icon: <StorageIcon />,
      items: [
        {
          label: 'Data Retention (months)',
          value: preferences.dataRetention,
          type: 'select',
          options: ['6', '12', '24', '36', 'unlimited'],
          onChange: (value: string) => handlePreferenceChange('dataRetention', value),
        },
        {
          label: 'Auto Backup',
          value: preferences.autoBackup,
          type: 'switch',
          onChange: () => handlePreferenceChange('autoBackup', !preferences.autoBackup),
        },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box>
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account settings and preferences.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Profile Card */}
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                height: 'fit-content',
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box position="relative" display="inline-block" mb={2}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: theme.palette.primary.main,
                      fontSize: '2rem',
                      fontWeight: 600,
                    }}
                  >
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: theme.palette.background.paper,
                      border: `2px solid ${theme.palette.background.paper}`,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <CloudUploadIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {user?.name || 'User Name'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {user?.email || 'user@example.com'}
                </Typography>
                
                <Chip
                  label={user?.role?.toUpperCase() || 'USER'}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />

                <Box display="flex" gap={1} justifyContent="center">
                  {editingProfile ? (
                    <>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveProfile}
                        sx={{ textTransform: 'none' }}
                      >
                        Save
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={() => setEditingProfile(false)}
                        sx={{ textTransform: 'none' }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => setEditingProfile(true)}
                      sx={{ textTransform: 'none' }}
                    >
                      Edit Profile
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Settings Sections */}
          <Grid item xs={12} lg={8}>
            <Box display="flex" flexDirection="column" gap={3}>
              {settingSections.map((section, sectionIndex) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
                >
                  <Card
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 3,
                    }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2} mb={3}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 2,
                            backgroundColor: `${theme.palette.primary.main}12`,
                            color: theme.palette.primary.main,
                          }}
                        >
                          {section.icon}
                        </Box>
                        <Typography variant="h6" fontWeight={600}>
                          {section.title}
                        </Typography>
                      </Box>

                      <List sx={{ p: 0 }}>
                        {section.items.map((item, itemIndex) => (
                          <React.Fragment key={item.label}>
                            <ListItem sx={{ px: 0, py: 2 }}>
                              <ListItemText
                                primary={
                                  <Typography variant="body1" fontWeight={500}>
                                    {item.label}
                                  </Typography>
                                }
                                secondary={
                                  item.type === 'switch' ? undefined : (
                                    <Typography variant="body2" color="text.secondary">
                                      Current: {item.value}
                                    </Typography>
                                  )
                                }
                              />
                              <ListItemSecondaryAction>
                                {item.type === 'switch' ? (
                                  <Switch
                                    checked={item.value}
                                    onChange={item.onChange}
                                    color="primary"
                                  />
                                ) : item.type === 'select' && item.options ? (
                                  <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <Select
                                      value={item.value}
                                      onChange={(e) => item.onChange?.(e.target.value)}
                                      disabled={!item.editable && section.title === 'Profile Settings'}
                                    >
                                      {item.options.map((option) => (
                                        <MenuItem key={option} value={option}>
                                          {option}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                ) : editingProfile && section.title === 'Profile Settings' ? (
                                  <TextField
                                    size="small"
                                    type={item.type}
                                    value={item.value}
                                    onChange={(e) => {
                                      if (item.label === 'Full Name') {
                                        setProfileData({ ...profileData, name: e.target.value });
                                      } else if (item.label === 'Email Address') {
                                        setProfileData({ ...profileData, email: e.target.value });
                                      }
                                    }}
                                    sx={{ minWidth: 200 }}
                                  />
                                ) : null}
                              </ListItemSecondaryAction>
                            </ListItem>
                            {itemIndex < section.items.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Security Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Card
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          backgroundColor: `${theme.palette.error.main}12`,
                          color: theme.palette.error.main,
                        }}
                      >
                        <SecurityIcon />
                      </Box>
                      <Typography variant="h6" fontWeight={600}>
                        Security
                      </Typography>
                    </Box>

                    <Box display="flex" gap={2} flexWrap="wrap">
                      <Button
                        variant="outlined"
                        sx={{ textTransform: 'none' }}
                      >
                        Change Password
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{ textTransform: 'none' }}
                      >
                        Two-Factor Authentication
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        sx={{ textTransform: 'none' }}
                      >
                        Delete Account
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};

export default Settings;