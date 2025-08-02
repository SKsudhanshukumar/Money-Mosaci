import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
}) => {
  const theme = useTheme();

  const getColorValue = (colorName: string) => {
    switch (colorName) {
      case 'primary':
        return theme.palette.primary.main;
      case 'secondary':
        return theme.palette.secondary.main;
      case 'success':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const colorValue = getColorValue(color);
  const isPositive = change >= 0;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <Card
        sx={{
          height: '100%',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          background: theme.palette.background.paper,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${colorValue}, ${colorValue}80)`,
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: `${colorValue}12`,
                color: colorValue,
              }}
            >
              {icon}
            </Box>
            
            <Box display="flex" alignItems="center" gap={0.5}>
              {isPositive ? (
                <TrendingUpIcon 
                  fontSize="small" 
                  sx={{ color: theme.palette.success.main }} 
                />
              ) : (
                <TrendingDownIcon 
                  fontSize="small" 
                  sx={{ color: theme.palette.error.main }} 
                />
              )}
              <Typography
                variant="body2"
                fontWeight={600}
                color={isPositive ? 'success.main' : 'error.main'}
              >
                {isPositive ? '+' : ''}{change.toFixed(1)}%
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="h4"
            fontWeight={700}
            color="text.primary"
            gutterBottom
          >
            {value}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={500}
          >
            {title}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;