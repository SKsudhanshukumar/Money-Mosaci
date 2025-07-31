import React from 'react';
import { Box, Typography, useTheme, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ReactNode;
  subtitle?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  delay?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  subtitle,
  color = 'primary',
  delay = 0,
}) => {
  const { palette } = useTheme();

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return <TrendingUpIcon sx={{ fontSize: '16px' }} />;
      case 'decrease':
        return <TrendingDownIcon sx={{ fontSize: '16px' }} />;
      default:
        return <TrendingFlatIcon sx={{ fontSize: '16px' }} />;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return palette.success.main;
      case 'decrease':
        return palette.error.main;
      default:
        return palette.grey[500];
    }
  };

  const getColorPalette = () => {
    switch (color) {
      case 'secondary':
        return palette.secondary;
      case 'success':
        return palette.success;
      case 'warning':
        return palette.warning;
      case 'error':
        return palette.error;
      default:
        return palette.primary;
    }
  };

  const colorPalette = getColorPalette();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -4 }}
    >
      <Box
        sx={{
          background: palette.mode === 'light'
            ? `linear-gradient(135deg, ${palette.background.paper}F0, ${palette.background.elevated}E0)`
            : `linear-gradient(135deg, ${palette.background.paper}CC, ${palette.background.elevated}99)`,
          borderRadius: '16px',
          p: '1.5rem',
          border: `1px solid ${palette.mode === 'light' ? palette.grey[700] : palette.grey[800]}`,
          boxShadow: palette.mode === 'light'
            ? "0 4px 20px rgba(0, 0, 0, 0.08)"
            : "0 8px 32px rgba(0, 0, 0, 0.3)",
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backdropFilter: 'blur(10px)',
          
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: palette.mode === 'light'
              ? "0 12px 40px rgba(0, 0, 0, 0.15)"
              : "0 20px 60px rgba(0, 0, 0, 0.4)",
          },

          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${colorPalette.main}, ${colorPalette.light})`,
            borderRadius: '16px 16px 0 0',
          },
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              color: palette.text.secondary,
              fontSize: '0.875rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {title}
          </Typography>
          {icon && (
            <Box
              sx={{
                background: `linear-gradient(135deg, ${colorPalette.main}20, ${colorPalette.light}20)`,
                borderRadius: '12px',
                p: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {React.cloneElement(icon as React.ReactElement, {
                sx: { fontSize: '20px', color: colorPalette.main },
              })}
            </Box>
          )}
        </Box>

        {/* Value */}
        <Typography
          variant="h2"
          sx={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: palette.text.primary,
            mb: 1,
            lineHeight: 1,
          }}
        >
          {value}
        </Typography>

        {/* Subtitle and Change */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: palette.text.secondary,
                fontSize: '0.875rem',
              }}
            >
              {subtitle}
            </Typography>
          )}
          
          {change !== undefined && (
            <Chip
              icon={getChangeIcon()}
              label={`${change > 0 ? '+' : ''}${change}%`}
              size="small"
              sx={{
                backgroundColor: `${getChangeColor()}20`,
                color: getChangeColor(),
                fontWeight: 600,
                fontSize: '0.75rem',
                '& .MuiChip-icon': {
                  color: getChangeColor(),
                },
              }}
            />
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export default MetricCard;