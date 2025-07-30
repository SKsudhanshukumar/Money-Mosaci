import { Box, Typography, useTheme, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  trend?: 'up' | 'down' | 'neutral';
}

const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = 'primary',
  trend = 'neutral'
}: MetricCardProps) => {
  const { palette } = useTheme();

  const getColorScheme = () => {
    switch (color) {
      case 'success':
        return {
          main: palette.success[500],
          light: palette.success[100],
          dark: palette.success[700],
        };
      case 'error':
        return {
          main: palette.error[500],
          light: palette.error[100],
          dark: palette.error[700],
        };
      case 'warning':
        return {
          main: palette.warning[500],
          light: palette.warning[100],
          dark: palette.warning[700],
        };
      case 'secondary':
        return {
          main: palette.secondary[500],
          light: palette.secondary[100],
          dark: palette.secondary[700],
        };
      default:
        return {
          main: palette.primary[500],
          light: palette.primary[100],
          dark: palette.primary[700],
        };
    }
  };

  const colorScheme = getColorScheme();

  const getTrendIcon = () => {
    if (trend === 'up') return '↗️';
    if (trend === 'down') return '↘️';
    return '➡️';
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card
        sx={{
          height: '100%',
          background: palette.mode === 'light' 
            ? `linear-gradient(135deg, ${colorScheme.light}40, ${colorScheme.light}20)`
            : `linear-gradient(135deg, ${colorScheme.main}20, ${colorScheme.main}10)`,
          border: `1px solid ${palette.mode === 'light' ? colorScheme.light : colorScheme.main}40`,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: colorScheme.main,
            boxShadow: `0 8px 32px ${colorScheme.main}30`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${colorScheme.main}, ${colorScheme.dark})`,
          },
        }}
      >
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: palette.text.secondary,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: '0.75rem',
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: palette.text.primary,
                  fontWeight: 700,
                  fontSize: '1.75rem',
                  mt: 0.5,
                  lineHeight: 1.2,
                }}
              >
                {value}
              </Typography>
            </Box>
            {icon && (
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  backgroundColor: `${colorScheme.main}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colorScheme.main,
                  fontSize: '1.5rem',
                }}
              >
                {icon}
              </Box>
            )}
          </Box>
          
          {change && (
            <Box display="flex" alignItems="center" gap={1}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: trend === 'up' 
                    ? palette.success[500] 
                    : trend === 'down' 
                    ? palette.error[500] 
                    : palette.text.secondary,
                }}
              >
                {getTrendIcon()} {change}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: palette.text.secondary,
                  fontSize: '0.75rem',
                }}
              >
                vs last period
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MetricCard;