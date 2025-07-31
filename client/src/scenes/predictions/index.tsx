import DashboardBox from "../../components/DashboardBox";
import FlexBetween from "../../components/FlexBetween";
import { useGetKpisQuery } from "../../state/api";
import { Box, Button, Typography, useTheme, Container, Chip } from "@mui/material";
import { motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PredictionsIcon from "@mui/icons-material/Analytics";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import regression, { DataPoint } from "regression";

const Predictions = () => {
  const { palette } = useTheme();
  const [isPredictions, setIsPredictions] = useState(false);
  const { data: kpiData } = useGetKpisQuery();

  const formattedData = useMemo(() => {
    if (!kpiData) return [];
    const monthData = kpiData[0].monthlyData;

    const formatted: Array<DataPoint> = monthData.map(
      ({ revenue }, i: number) => {
        return [i, parseFloat(revenue.replace(/[$,]/g, ""))];
      }
    );
    const regressionLine = regression.linear(formatted);

    return monthData.map(({ month, revenue }, i: number) => {
      return {
        name: month,
        "Actual Revenue": parseFloat(revenue.replace(/[$,]/g, "")),
        "Regression Line": regressionLine.points[i][1],
        "Predicted Revenue": regressionLine.predict(i + 12)[1],
      };
    });
  }, [kpiData]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <DashboardBox 
            width="100%" 
            height="100vh" 
            p="2rem" 
            overflow="hidden"
            className="hover-lift"
            sx={{
              background: palette.mode === 'light'
                ? `linear-gradient(135deg, ${palette.background.paper}F0, ${palette.background.elevated}E0)`
                : `linear-gradient(135deg, ${palette.background.paper}CC, ${palette.background.elevated}99)`,
            }}
          >
            <FlexBetween 
              sx={{ 
                mb: 3,
                flexDirection: { xs: 'column', md: 'row' },
                gap: { xs: 2, md: 1 },
                alignItems: { xs: 'flex-start', md: 'center' },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Box
                    sx={{
                      background: `linear-gradient(135deg, ${palette.primary.main}20, ${palette.secondary.main}20)`,
                      borderRadius: '12px',
                      p: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PredictionsIcon sx={{ fontSize: '24px', color: palette.primary.main }} />
                  </Box>
                  <Typography 
                    variant="h3" 
                    sx={{
                      fontSize: { xs: '1.5rem', md: '2rem' },
                      fontWeight: 700,
                      background: `linear-gradient(135deg, ${palette.primary.main}, ${palette.secondary.main})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Revenue Predictions
                  </Typography>
                </Box>
                <Typography 
                  variant="body1" 
                  sx={{
                    color: palette.text.secondary,
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    maxWidth: '600px',
                  }}
                >
                  Advanced revenue forecasting using linear regression analysis. 
                  Visualize historical trends and predict future performance.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<TrendingUpIcon />}
                    label="Linear Regression"
                    size="small"
                    sx={{
                      backgroundColor: `${palette.primary.main}20`,
                      color: palette.primary.main,
                      fontWeight: 500,
                    }}
                  />
                  <Chip
                    label="12-Month Forecast"
                    size="small"
                    sx={{
                      backgroundColor: `${palette.secondary.main}20`,
                      color: palette.secondary.main,
                      fontWeight: 500,
                    }}
                  />
                </Box>
              </Box>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => setIsPredictions(!isPredictions)}
                  startIcon={isPredictions ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  variant="contained"
                  sx={{
                    background: isPredictions 
                      ? `linear-gradient(135deg, ${palette.error.main}, ${palette.warning.main})`
                      : `linear-gradient(135deg, ${palette.primary.main}, ${palette.secondary.main})`,
                    color: 'white',
                    px: 3,
                    py: 1.5,
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    boxShadow: isPredictions
                      ? `0 4px 16px ${palette.error.main}40`
                      : `0 4px 16px ${palette.primary.main}40`,
                    '&:hover': {
                      background: isPredictions
                        ? `linear-gradient(135deg, ${palette.error.dark}, ${palette.warning.dark})`
                        : `linear-gradient(135deg, ${palette.primary.dark}, ${palette.secondary.dark})`,
                      transform: 'translateY(-2px)',
                      boxShadow: isPredictions
                        ? `0 8px 24px ${palette.error.main}60`
                        : `0 8px 24px ${palette.primary.main}60`,
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {isPredictions ? 'Hide' : 'Show'} Predictions
                </Button>
              </motion.div>
            </FlexBetween>
            
            <ResponsiveContainer width="100%" height="80%">
              <LineChart
                data={formattedData}
                margin={{
                  top: 20,
                  right: 75,
                  left: 20,
                  bottom: 80,
                }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={palette.mode === 'light' ? palette.grey[600] : palette.grey[700]}
                  opacity={0.3}
                />
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fontSize: 12, fill: palette.text.secondary }}
                >
                  <Label 
                    value="Month" 
                    offset={-5} 
                    position="insideBottom"
                    style={{ textAnchor: 'middle', fill: palette.text.secondary }}
                  />
                </XAxis>
                <YAxis
                  domain={[12000, 26000]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: palette.text.secondary }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                >
                  <Label
                    value="Revenue (USD)"
                    angle={-90}
                    offset={-5}
                    position="insideLeft"
                    style={{ textAnchor: 'middle', fill: palette.text.secondary }}
                  />
                </YAxis>
                <Tooltip
                  contentStyle={{
                    backgroundColor: palette.background.paper,
                    border: `1px solid ${palette.grey[700]}`,
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}
                  labelStyle={{ color: palette.text.primary }}
                  formatter={(value: any) => [`$${value.toLocaleString()}`, '']}
                />
                <Legend 
                  verticalAlign="top" 
                  wrapperStyle={{ 
                    paddingBottom: '20px',
                    color: palette.text.primary,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="Actual Revenue"
                  stroke={palette.primary.main}
                  strokeWidth={3}
                  dot={{ fill: palette.primary.main, strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: palette.primary.main, strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="Regression Line"
                  stroke={palette.tertiary.main}
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="2 2"
                />
                {isPredictions && (
                  <Line
                    type="monotone"
                    strokeDasharray="5 5"
                    dataKey="Predicted Revenue"
                    stroke={palette.secondary.main}
                    strokeWidth={3}
                    dot={{ fill: palette.secondary.main, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: palette.secondary.main, strokeWidth: 2 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </DashboardBox>
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default Predictions;
