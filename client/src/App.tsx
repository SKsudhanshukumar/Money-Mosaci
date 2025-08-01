import { Box } from "@mui/material";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { themeSettings } from "./theme";
import { ThemeProvider as CustomThemeProvider, useThemeMode } from "./contexts/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./scenes/navbar";
import Dashboard from "./scenes/dashboard";
import Predictions from "./scenes/predictions";
import Analytics from "./scenes/analytics";

function AppContent() {
  const { mode } = useThemeMode();
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  
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
                ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.elevated} 100%)`
                : `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.light} 100%)`,
              padding: { xs: "1rem", sm: "1.5rem", md: "2rem" },
              paddingBottom: "4rem",
              position: 'relative',
              
              // Add animated background elements
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: mode === 'light'
                  ? `radial-gradient(circle at 20% 80%, ${theme.palette.primary.main}12 0%, transparent 50%),
                     radial-gradient(circle at 80% 20%, ${theme.palette.secondary.main}12 0%, transparent 50%),
                     radial-gradient(circle at 40% 40%, ${theme.palette.tertiary.main}08 0%, transparent 50%)`
                  : `radial-gradient(circle at 20% 80%, ${theme.palette.primary.main}20 0%, transparent 50%),
                     radial-gradient(circle at 80% 20%, ${theme.palette.secondary.main}20 0%, transparent 50%),
                     radial-gradient(circle at 40% 40%, ${theme.palette.tertiary.main}15 0%, transparent 50%)`,
                pointerEvents: 'none',
                zIndex: -1,
              },
            }}
          >
            <Navbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </Box>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <CustomThemeProvider>
        <AppContent />
      </CustomThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
