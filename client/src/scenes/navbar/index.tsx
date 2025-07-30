import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PixIcon from "@mui/icons-material/Pix";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { 
  Box, 
  Typography, 
  useTheme, 
  IconButton, 
  Tooltip, 
  Paper,
  Chip,
  useMediaQuery
} from "@mui/material";
import FlexBetween from "@/components/FlexBetween";
import { useThemeMode } from "../../contexts/ThemeContext";

type Props = {};

const Navbar = (props: Props) => {
  const { palette, breakpoints } = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const location = useLocation();
  const isMobile = useMediaQuery(breakpoints.down('sm'));
  
  const navItems = [
    { 
      path: "/", 
      label: "Dashboard", 
      icon: <DashboardIcon sx={{ fontSize: "18px" }} /> 
    },
    { 
      path: "/predictions", 
      label: "Predictions", 
      icon: <TrendingUpIcon sx={{ fontSize: "18px" }} /> 
    },
  ];
  
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'transparent',
        borderRadius: '16px',
        mb: 3,
        p: 2,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${palette.mode === 'light' ? palette.grey[200] : palette.grey[800]}`,
        background: palette.mode === 'light' 
          ? 'rgba(255, 255, 255, 0.8)' 
          : 'rgba(26, 32, 44, 0.8)',
      }}
    >
      <FlexBetween>
        {/* LEFT SIDE - Logo */}
        <FlexBetween gap="1rem">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${palette.primary[500]}, ${palette.primary[600]})`,
              boxShadow: `0 4px 12px ${palette.primary[500]}40`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: `0 6px 20px ${palette.primary[500]}60`,
              }
            }}
          >
            <PixIcon sx={{ fontSize: "24px", color: 'white' }} />
          </Box>
          {!isMobile && (
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${palette.primary[500]}, ${palette.secondary[500]})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                }}
              >
                MoneyMosaic
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: palette.text.secondary,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Financial Dashboard
              </Typography>
            </Box>
          )}
        </FlexBetween>

        {/* CENTER - Navigation */}
        <FlexBetween gap="0.5rem">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Chip
                key={item.path}
                component={Link}
                to={item.path}
                icon={item.icon}
                label={isMobile ? "" : item.label}
                variant={isActive ? "filled" : "outlined"}
                clickable
                sx={{
                  height: 40,
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  ...(isActive ? {
                    backgroundColor: palette.primary[500],
                    color: 'white',
                    borderColor: palette.primary[500],
                    '&:hover': {
                      backgroundColor: palette.primary[600],
                      transform: 'translateY(-1px)',
                      boxShadow: `0 4px 12px ${palette.primary[500]}40`,
                    }
                  } : {
                    backgroundColor: 'transparent',
                    color: palette.text.primary,
                    borderColor: palette.mode === 'light' ? palette.grey[300] : palette.grey[700],
                    '&:hover': {
                      backgroundColor: palette.mode === 'light' ? palette.grey[100] : palette.grey[800],
                      borderColor: palette.primary[400],
                      transform: 'translateY(-1px)',
                    }
                  }),
                  ...(isMobile && {
                    minWidth: 40,
                    width: 40,
                    '& .MuiChip-label': {
                      display: 'none',
                    },
                  }),
                }}
              />
            );
          })}
        </FlexBetween>
        
        {/* RIGHT SIDE - Theme Toggle */}
        <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
          <IconButton
            onClick={toggleTheme}
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              backgroundColor: palette.mode === 'light' ? palette.grey[100] : palette.grey[800],
              color: palette.text.primary,
              border: `1px solid ${palette.mode === 'light' ? palette.grey[200] : palette.grey[700]}`,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: palette.mode === 'light' ? palette.grey[200] : palette.grey[700],
                borderColor: palette.primary[400],
                transform: 'translateY(-1px)',
                boxShadow: `0 4px 12px ${palette.mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.3)'}`,
              },
            }}
          >
            {mode === 'light' ? 
              <DarkModeIcon sx={{ fontSize: "20px" }} /> : 
              <LightModeIcon sx={{ fontSize: "20px" }} />
            }
          </IconButton>
        </Tooltip>
      </FlexBetween>
    </Paper>
  );
};

export default Navbar;
