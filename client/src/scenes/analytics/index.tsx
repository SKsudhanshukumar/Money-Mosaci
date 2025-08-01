import React, { useState } from 'react';
import { Box, Container, Tabs, Tab, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AdvancedMetrics from '../../components/AdvancedMetrics';
import ReportBuilder from '../../components/ReportBuilder';
import AnomalyDetection from '../../components/AnomalyDetection';
import BudgetManager from '../../components/BudgetManager';

const Analytics = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: 'Advanced Metrics', component: <AdvancedMetrics /> },
    { label: 'Report Builder', component: <ReportBuilder /> },
    { label: 'Anomaly Detection', component: <AnomalyDetection /> },
    { label: 'Budget Manager', component: <BudgetManager /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        <Box
          sx={{
            width: "100%",
            minHeight: "100vh",
            background: theme.palette.mode === 'light' 
              ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
              : `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
            pb: 4,
          }}
        >
          {/* Tab Navigation */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, pt: 2 }}>
            <Tabs 
              value={activeTab} 
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  minWidth: 120,
                },
                '& .Mui-selected': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                  borderRadius: '8px 8px 0 0',
                }
              }}
            >
              {tabs.map((tab, index) => (
                <Tab key={index} label={tab.label} />
              ))}
            </Tabs>
          </Box>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {tabs[activeTab].component}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Container>
    </motion.div>
  );
};

export default Analytics;