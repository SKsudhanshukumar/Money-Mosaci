import { Box, Container, useMediaQuery } from "@mui/material";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { themeSettings } from "./theme";
import { ThemeProvider as CustomThemeProvider, useThemeMode } from "./contexts/ThemeContext";
import Navbar from "./scenes/navbar";
import Dashboard from "./scenes/dashboard";
import Predictions from "./scenes/predictions";

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4,
};

// Animated route wrapper
function AnimatedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ width: "100%", height: "100%" }}
    >
      {children}
    </motion.div>
  );
}

function AppContent() {
  const { mode } = useThemeMode();
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="app">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            width="100%"
            sx={{
              background: mode === 'light' 
                ? 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
                : 'linear-gradient(135deg, #0f1419 0%, #1a202c 100%)',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '16px',
                  background: `linear-gradient(135deg, ${theme.palette.primary[500]}, ${theme.palette.primary[600]})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 8px 32px ${theme.palette.primary[500]}40`,
                }}
                className="pulse"
              >
                <Box
                  component="span"
                  sx={{
                    fontSize: '2rem',
                    color: 'white',
                  }}
                >
                  💰
                </Box>
              </Box>
              <Box
                sx={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${theme.palette.primary[500]}, ${theme.palette.secondary[500]})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                MoneyMosaic
              </Box>
            </motion.div>
          </Box>
        </ThemeProvider>
      </div>
    );
  }
  
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box 
            sx={{
              width: "100%", 
              minHeight: "100vh",
              background: mode === 'light' 
                ? 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
                : 'linear-gradient(135deg, #0f1419 0%, #1a202c 100%)',
              position: 'relative',
              overflow: 'hidden',
              
              // Animated background pattern
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: mode === 'light'
                  ? 'radial-gradient(circle at 25% 25%, rgba(56, 178, 172, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)'
                  : 'radial-gradient(circle at 25% 25%, rgba(56, 178, 172, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(245, 158, 11, 0.05) 0%, transparent 50%)',
                pointerEvents: 'none',
                zIndex: 0,
              },
            }}
          >
            <Container 
              maxWidth={false} 
              sx={{ 
                position: 'relative',
                zIndex: 1,
                px: { xs: 1, sm: 2, md: 3, lg: 4 },
                py: { xs: 2, sm: 3 },
                maxWidth: '1600px',
                mx: 'auto',
              }}
            >
              <Navbar />
              <AnimatePresence mode="wait">
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      <AnimatedRoute>
                        <Dashboard />
                      </AnimatedRoute>
                    } 
                  />
                  <Route 
                    path="/predictions" 
                    element={
                      <AnimatedRoute>
                        <Predictions />
                      </AnimatedRoute>
                    } 
                  />
                </Routes>
              </AnimatePresence>
            </Container>
          </Box>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

function App() {
  return (
    <CustomThemeProvider>
      <AppContent />
    </CustomThemeProvider>
  );
}

export default App;
