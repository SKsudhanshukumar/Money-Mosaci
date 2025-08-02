import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  action,
}) => {
  const theme = useTheme();

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
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
            {action && (
              <Box>{action}</Box>
            )}
          </Box>
          
          <Box>{children}</Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ChartCard;