import React, { Suspense } from 'react';
import { Box, CssBaseline, ThemeProvider, CircularProgress, Container } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

// Theme and Context
import { themeSettings } from './theme';
import { ThemeProvider as CustomThemeProvider, useThemeMode } from './contexts/ThemeContext';
import { store } from './state/store';

// Components
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Transactions = React.lazy(() => import('./pages/Transactions'));
const Reports = React.lazy(() => import('./pages/Reports'));
const Settings = React.lazy(() => import('./pages/Settings'));

// Loading fallback component
const PageLoader = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="60vh"
  >
    <CircularProgress size={40} thickness={4} />
  </Box>
);

// Main App Content Component
function AppContent() {
  const { mode } = useThemeMode();
  const theme = React.useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          background: mode === 'light'
            ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, #f1f5f9 100%)`
            : `linear-gradient(135deg, ${theme.palette.background.default} 0%, #1e293b 100%)`,
          position: 'relative',
          
          // Professional background pattern
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: mode === 'light'
              ? `
                radial-gradient(circle at 20% 80%, rgba(33, 150, 243, 0.03) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(0, 150, 136, 0.03) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(33, 150, 243, 0.02) 0%, transparent 50%)
              `
              : `
                radial-gradient(circle at 20% 80%, rgba(33, 150, 243, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(0, 150, 136, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(33, 150, 243, 0.04) 0%, transparent 50%)
              `,
            pointerEvents: 'none',
            zIndex: 0,
          },
        }}
      >
        <BrowserRouter>
          <Navbar />
          
          <Container 
            maxWidth={false} 
            sx={{ 
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 2, sm: 3 },
              maxWidth: '1400px',
              mx: 'auto',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </Container>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
}

// Root App Component
function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <CustomThemeProvider>
          <Suspense fallback={<LoadingScreen />}>
            <AppContent />
          </Suspense>
        </CustomThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;