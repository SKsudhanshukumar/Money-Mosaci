import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner = ({ 
  size = 40, 
  message = "Loading...", 
  fullScreen = false 
}: LoadingSpinnerProps) => {
  const { palette } = useTheme();

  const containerSx = fullScreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
      }
    : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      };

  return (
    <Box sx={containerSx}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CircularProgress
            size={size}
            thickness={4}
            sx={{
              color: palette.primary[500],
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: size * 0.6,
              height: size * 0.6,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${palette.primary[500]}20, ${palette.secondary[500]}20)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{
                fontSize: size * 0.3,
              }}
            >
              💰
            </motion.div>
          </Box>
        </Box>
        {message && (
          <Typography
            variant="body2"
            sx={{
              color: palette.text.secondary,
              fontWeight: 500,
              textAlign: 'center',
            }}
          >
            {message}
          </Typography>
        )}
      </motion.div>
    </Box>
  );
};

export default LoadingSpinner;