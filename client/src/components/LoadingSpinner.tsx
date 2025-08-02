import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 40,
  fullScreen = false,
}) => {
  const theme = useTheme();

  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
        p={4}
      >
        <Box position="relative">
          <CircularProgress
            size={size}
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
              width: size * 0.6,
              height: size * 0.6,
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
        
        <Typography
          variant="body1"
          color="text.secondary"
          fontWeight={500}
          textAlign="center"
        >
          {message}
        </Typography>
      </Box>
    </motion.div>
  );

  if (fullScreen) {
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="background.default"
        zIndex={9999}
      >
        {content}
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
    >
      {content}
    </Box>
  );
};

export default LoadingSpinner;