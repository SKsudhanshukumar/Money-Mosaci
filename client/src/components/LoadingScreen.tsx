import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bgcolor="background.default"
      zIndex={9999}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={3}
        >
          {/* Logo */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                mb: 2,
              }}
            >
              F
            </Box>
          </motion.div>

          {/* Loading Spinner */}
          <Box position="relative">
            <CircularProgress
              size={50}
              thickness={4}
              sx={{
                color: theme.palette.primary.main,
              }}
            />
            <Box
              position="absolute"
              top="50%"
              left="50%"
              sx={{
                transform: 'translate(-50%, -50%)',
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%': {
                    transform: 'translate(-50%, -50%) scale(0.8)',
                    opacity: 0.7,
                  },
                  '50%': {
                    transform: 'translate(-50%, -50%) scale(1)',
                    opacity: 0.3,
                  },
                  '100%': {
                    transform: 'translate(-50%, -50%) scale(0.8)',
                    opacity: 0.7,
                  },
                },
              }}
            />
          </Box>

          {/* Loading Text */}
          <Box textAlign="center">
            <Typography
              variant="h6"
              fontWeight={600}
              color="text.primary"
              gutterBottom
            >
              FinanceApp
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Loading your financial dashboard...
            </Typography>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

export default LoadingScreen;