import { Box, Typography, useTheme, Chip } from "@mui/material";
import React from "react";
import FlexBetween from "./FlexBetween";

type Props = {
  title: string;
  sideText: string;
  subtitle?: string;
  icon?: React.ReactNode;
};

const BoxHeader = ({ icon, title, subtitle, sideText }: Props) => {
  const { palette } = useTheme();
  
  // Determine if sideText indicates positive or negative change
  const isPositive = sideText.startsWith('+');
  const isNegative = sideText.startsWith('-');
  
  return (
    <FlexBetween 
      sx={{ 
        margin: "1rem 1rem 0.5rem 1rem",
        pb: 0.75,
        borderBottom: `1px solid ${palette.mode === 'light' ? palette.grey[200] : palette.grey[800]}`,
      }}
    >
      <FlexBetween gap="0.75rem">
        {icon && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '8px',
              backgroundColor: palette.mode === 'light' ? palette.primary[100] : palette.primary[900],
              color: palette.primary[500],
            }}
          >
            {icon}
          </Box>
        )}
        <Box width="100%">
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 0.5,
              fontWeight: 600,
              color: palette.text.primary,
              fontSize: '1.1rem',
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: palette.text.secondary,
                fontSize: '0.875rem',
                lineHeight: 1.4,
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
          fontWeight: 600,
          fontSize: '0.75rem',
          height: 28,
          borderRadius: '14px',
          ...(isPositive && {
            backgroundColor: palette.mode === 'light' ? palette.success[100] : palette.success[900],
            color: palette.success[palette.mode === 'light' ? 700 : 400],
            border: `1px solid ${palette.success[palette.mode === 'light' ? 200 : 800]}`,
          }),
          ...(isNegative && {
            backgroundColor: palette.mode === 'light' ? palette.error[100] : palette.error[900],
            color: palette.error[palette.mode === 'light' ? 700 : 400],
            border: `1px solid ${palette.error[palette.mode === 'light' ? 200 : 800]}`,
          }),
          ...(!isPositive && !isNegative && {
            backgroundColor: palette.mode === 'light' ? palette.grey[100] : palette.grey[800],
            color: palette.text.primary,
            border: `1px solid ${palette.mode === 'light' ? palette.grey[200] : palette.grey[700]}`,
          }),
        }}
      />
    </FlexBetween>
  );
};

export default BoxHeader;
