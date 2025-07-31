import { Box, Typography, useTheme, Chip } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import FlexBetween from "./FlexBetween";

type Props = {
  title: string;
  sideText: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
};

const BoxHeader = ({ icon, title, subtitle, sideText, trend = 'neutral' }: Props) => {
  const { palette } = useTheme();
  
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return palette.success.main;
      case 'down':
        return palette.error.main;
      default:
        return palette.secondary.main;
    }
  };

  const getTrendBackground = () => {
    switch (trend) {
      case 'up':
        return `${palette.success.main}20`;
      case 'down':
        return `${palette.error.main}20`;
      default:
        return `${palette.secondary.main}20`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <FlexBetween 
        sx={{ 
          margin: "1.5rem 1rem 0.5rem 1rem",
          pb: 1,
          borderBottom: `1px solid ${palette.mode === 'light' ? palette.grey[700] : palette.grey[800]}`,
        }}
      >
        <FlexBetween gap="0.75rem">
          {icon && (
            <Box
              sx={{
                background: `linear-gradient(135deg, ${palette.primary.main}20, ${palette.secondary.main}20)`,
                borderRadius: '10px',
                p: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {React.cloneElement(icon as React.ReactElement, {
                sx: { fontSize: '18px', color: palette.primary.main },
              })}
            </Box>
          )}
          <Box>
            <Typography 
              variant="h4" 
              sx={{
                fontSize: '1.1rem',
                fontWeight: 600,
                color: palette.text.primary,
                mb: subtitle ? 0.25 : 0,
                lineHeight: 1.2,
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography 
                variant="body2" 
                sx={{
                  color: palette.text.secondary,
                  fontSize: '0.8rem',
                  lineHeight: 1.3,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </FlexBetween>
        
        <Chip
          label={sideText}
          size="small"
          sx={{
            backgroundColor: getTrendBackground(),
            color: getTrendColor(),
            fontWeight: 600,
            fontSize: '0.75rem',
            height: '28px',
            borderRadius: '14px',
            '& .MuiChip-label': {
              px: 1.5,
            },
          }}
        />
      </FlexBetween>
    </motion.div>
  );
};

export default BoxHeader;
