import React from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  fullScreen = false,
}) => {
  const theme = useTheme();

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={3}
        p={4}
        textAlign="center"
      >
        <Alert
          severity="error"
          sx={{
            borderRadius: 2,
            border: `1px solid ${theme.palette.error.main}20`,
            backgroundColor: `${theme.palette.error.main}08`,
          }}
        >
          <AlertTitle sx={{ fontWeight: 600 }}>
            Something went wrong
          </AlertTitle>
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        </Alert>

        {onRetry && (
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
              py: 1,
            }}
          >
            Try Again
          </Button>
        )}
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

export default ErrorMessage;