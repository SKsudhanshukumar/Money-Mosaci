import { useState, useEffect } from "react";
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
  Chip,
  useMediaQuery,
  Fade,
  Slide
} from "@mui/material";
import { motion } from "framer-motion";
import FlexBetween from "@/components/FlexBetween";
import { useThemeMode } from "../../contexts/ThemeContext";

type Props = {};

const Navbar = (props: Props) => {
  const { palette } = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const location = useLocation();
  const [selected, setSelected] = useState("dashboard");
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  useEffect(() => {
    if (location.pathname === "/") {
      setSelected("dashboard");
    } else if (location.pathname === "/predictions") {
      setSelected("predictions");
    }
  }, [location.pathname]);

  const navItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      path: "/",
      icon: <DashboardIcon sx={{ fontSize: "18px" }} />,
    },
    {
      key: "predictions",
      label: "Predictions",
      path: "/predictions",
      icon: <TrendingUpIcon sx={{ fontSize: "18px" }} />,
    },
  ];
  
  return (
    <Slide direction="down" in={true} timeout={800}>
      <Box
        sx={{
          background: palette.mode === 'light' 
            ? `linear-gradient(135deg, ${palette.background.paper}F0, ${palette.background.elevated}E0)`
            : `linear-gradient(135deg, ${palette.background.paper}CC, ${palette.background.elevated}99)`,
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: `1px solid ${palette.mode === 'light' ? palette.grey[700] : palette.grey[800]}`,
          boxShadow: palette.mode === 'light' 
            ? "0 8px 32px rgba(0, 0, 0, 0.08)" 
            : "0 8px 32px rgba(0, 0, 0, 0.3)",
          mb: "1.5rem",
          p: "1rem 1.5rem",
          position: 'sticky',
          top: '1rem',
          zIndex: 1000,
          transition: 'all 0.3s ease',
        }}
      >
        <FlexBetween>
          {/* LEFT SIDE - LOGO */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FlexBetween gap="0.75rem">
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${palette.primary.main}, ${palette.secondary.main})`,
                  borderRadius: '12px',
                  p: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 16px ${palette.primary.main}40`,
                }}
              >
                <PixIcon sx={{ fontSize: "24px", color: 'white' }} />
              </Box>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{
                    fontSize: isMobile ? "18px" : "20px",
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${palette.primary.main}, ${palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.5px',
                  }}
                >
                  MoneyMosaic
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: palette.text.secondary,
                    fontSize: '10px',
                    fontWeight: 500,
                  }}
                >
                  Financial Dashboard
                </Typography>
              </Box>
            </FlexBetween>
          </motion.div>

          {/* RIGHT SIDE - NAVIGATION */}
          <FlexBetween gap={isMobile ? "1rem" : "2rem"}>
            {/* Navigation Items */}
            <FlexBetween gap={isMobile ? "0.5rem" : "1rem"}>
              {navItems.map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <Chip
                    component={Link}
                    to={item.path}
                    onClick={() => setSelected(item.key)}
                    icon={item.icon}
                    label={isMobile ? "" : item.label}
                    variant={selected === item.key ? "filled" : "outlined"}
                    sx={{
                      height: '36px',
                      fontSize: '14px',
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      ...(selected === item.key ? {
                        background: `linear-gradient(135deg, ${palette.primary.main}, ${palette.secondary.main})`,
                        color: 'white',
                        boxShadow: `0 4px 16px ${palette.primary.main}40`,
                        '& .MuiChip-icon': {
                          color: 'white',
                        },
                      } : {
                        backgroundColor: 'transparent',
                        color: palette.text.secondary,
                        borderColor: palette.grey[600],
                        '&:hover': {
                          backgroundColor: palette.primary.main + '20',
                          borderColor: palette.primary.main,
                          color: palette.primary.main,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 8px 24px ${palette.primary.main}30`,
                        },
                      }),
                    }}
                  />
                </motion.div>
              ))}
            </FlexBetween>
            
            {/* THEME TOGGLE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <Tooltip 
                title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
                arrow
              >
                <IconButton
                  onClick={toggleTheme}
                  sx={{
                    width: '40px',
                    height: '40px',
                    background: palette.mode === 'light' 
                      ? `linear-gradient(135deg, ${palette.warning.main}, ${palette.secondary.main})`
                      : `linear-gradient(135deg, ${palette.primary.main}, ${palette.tertiary.main})`,
                    color: 'white',
                    boxShadow: palette.mode === 'light'
                      ? `0 4px 16px ${palette.warning.main}40`
                      : `0 4px 16px ${palette.primary.main}40`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-2px) scale(1.05)',
                      boxShadow: palette.mode === 'light'
                        ? `0 8px 24px ${palette.warning.main}60`
                        : `0 8px 24px ${palette.primary.main}60`,
                    },
                  }}
                >
                  <Fade in={true} timeout={300}>
                    {mode === 'light' ? 
                      <DarkModeIcon sx={{ fontSize: "20px" }} /> : 
                      <LightModeIcon sx={{ fontSize: "20px" }} />
                    }
                  </Fade>
                </IconButton>
              </Tooltip>
            </motion.div>
          </FlexBetween>
        </FlexBetween>
      </Box>
    </Slide>
  );
};

export default Navbar;
