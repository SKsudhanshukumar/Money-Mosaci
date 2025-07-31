import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, useTheme, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRefresh = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return <ErrorFallback onRefresh={this.handleRefresh} error={this.state.error} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  onRefresh: () => void;
  error?: Error;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ onRefresh, error }) => {
  const theme = useTheme();
  const { palette } = theme;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${palette.background.default} 0%, ${palette.background.light} 100%)`,
        p: 3,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            maxWidth: 500,
            textAlign: 'center',
            borderRadius: '16px',
            background: palette.mode === 'light'
              ? `linear-gradient(135deg, ${palette.background.paper}F0, ${palette.background.elevated}E0)`
              : `linear-gradient(135deg, ${palette.background.paper}CC, ${palette.background.elevated}99)`,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${palette.mode === 'light' ? palette.grey[700] : palette.grey[800]}`,
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${palette.error.main}20, ${palette.warning.main}20)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <ErrorOutlineIcon
                sx={{
                  fontSize: 40,
                  color: palette.error.main,
                }}
              />
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: palette.text.primary,
              }}
            >
              Oops! Something went wrong
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 3,
                color: palette.text.secondary,
                lineHeight: 1.6,
              }}
            >
              We encountered an unexpected error while loading the application. 
              Don't worry, this is usually temporary.
            </Typography>

            {error && (
              <Box
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: '8px',
                  background: `${palette.error.main}10`,
                  border: `1px solid ${palette.error.main}30`,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: palette.error.main,
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    wordBreak: 'break-word',
                  }}
                >
                  {error.message}
                </Typography>
              </Box>
            )}

            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={onRefresh}
              sx={{
                background: `linear-gradient(135deg, ${palette.primary.main}, ${palette.secondary.main})`,
                color: 'white',
                px: 3,
                py: 1.5,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: `0 4px 16px ${palette.primary.main}40`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${palette.primary.dark}, ${palette.secondary.dark})`,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 24px ${palette.primary.main}60`,
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Refresh Page
            </Button>
          </motion.div>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default ErrorBoundary;