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
  const [isPredictions, setIsPredictions] = useState(true);
  const { data: kpiData } = useGetKpisQuery();

  const { formattedData, regressionStats } = useMemo(() => {
    if (!kpiData) return { formattedData: [], regressionStats: null };
    const monthData = kpiData[0].monthlyData;

    const formatted: Array<DataPoint> = monthData.map(
      ({ revenue }, i: number) => {
        return [i, parseFloat(revenue.replace(/[$,]/g, ""))];
      }
    );
    const regressionLine = regression.linear(formatted);

    // Calculate additional statistics
    const actualValues = formatted.map(point => point[1]);
    const predictedValues = regressionLine.points.map(point => point[1]);
    const avgActual = actualValues.reduce((a, b) => a + b, 0) / actualValues.length;
    
    // Calculate trend direction and strength
    const firstValue = actualValues[0];
    const lastValue = actualValues[actualValues.length - 1];
    const trendDirection = lastValue > firstValue ? 'increasing' : 'decreasing';
    const trendStrength = Math.abs((lastValue - firstValue) / firstValue * 100);

    const stats = {
      rSquared: regressionLine.r2,
      equation: regressionLine.string,
      trendDirection,
      trendStrength,
      avgRevenue: avgActual,
    };

    // Create combined data with both historical and future predictions
    const allData = monthData.map(({ month, revenue }, i: number) => {
      return {
        name: month,
        actualRevenue: parseFloat(revenue.replace(/[$,]/g, "")),
        regressionLine: regressionLine.points[i][1],
        predictedRevenue: regressionLine.predict(i + 12)[1], // 12 months ahead prediction
      };
    });

    // Add future months for extended predictions
    const futureMonths = [
      "Jan (Next)", "Feb (Next)", "Mar (Next)", "Apr (Next)", 
      "May (Next)", "Jun (Next)", "Jul (Next)", "Aug (Next)", 
      "Sep (Next)", "Oct (Next)", "Nov (Next)", "Dec (Next)"
    ];

    const futureData = futureMonths.map((month, i) => {
      const futureIndex = monthData.length + i;
      const prediction = regressionLine.predict(futureIndex)[1];
      return {
        name: month,
        actualRevenue: null,
        regressionLine: regressionLine.predict(futureIndex)[1],
        predictedRevenue: prediction,
      };
    });

    const result = [...allData, ...futureData];
    return { formattedData: result, regressionStats: stats };
  }, [kpiData]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Container 
        maxWidth={false} 
        sx={{ 
          px: { xs: 0.5, sm: 1, md: 2, lg: 3 },
          py: { xs: 1, sm: 2 },
          minHeight: '100vh',
          width: '100%',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <DashboardBox 
            width="100%" 
            height={{ xs: 'auto', md: '100vh' }}
            minHeight={{ xs: '700px', sm: '750px', md: '800px' }}
            maxHeight={{ xs: 'none', md: '100vh' }}
            p={{ xs: '1rem', sm: '1.5rem', md: '2rem' }}
            overflow={{ xs: 'visible', md: 'hidden' }}
            className="hover-lift"
            sx={{
              background: palette.mode === 'light'
                ? `linear-gradient(135deg, ${palette.background.paper}F0, ${palette.background.paper}E0)`
                : `linear-gradient(135deg, ${palette.background.paper}CC, ${palette.background.paper}99)`,
              display: 'flex',
              flexDirection: 'column',
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
                  {regressionStats && (
                    <Chip
                      label={`R² = ${(regressionStats.rSquared * 100).toFixed(1)}%`}
                      size="small"
                      sx={{
                        backgroundColor: `${palette.tertiary.main}20`,
                        color: palette.tertiary.main,
                        fontWeight: 500,
                      }}
                    />
                  )}
                </Box>

                {/* Statistical Insights */}
                {regressionStats && (
                  <Box sx={{ 
                    mt: { xs: 2, md: 3 }, 
                    p: { xs: 1.5, md: 2 }, 
                    backgroundColor: `${palette.background.paper}80`,
                    borderRadius: 2,
                    border: `1px solid ${palette.grey[800]}20`,
                  }}>
                    <Typography variant="h6" sx={{ 
                      mb: { xs: 1, md: 1.5 }, 
                      color: palette.text.primary, 
                      fontSize: { xs: '0.9rem', md: '1rem' }
                    }}>
                      📊 Statistical Insights
                    </Typography>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, 
                      gap: { xs: 1, md: 2 }
                    }}>
                      <Box>
                        <Typography variant="body2" sx={{ 
                          color: palette.text.secondary, 
                          fontSize: { xs: '0.75rem', md: '0.85rem' },
                          lineHeight: 1.4
                        }}>
                          <strong>Accuracy:</strong> {(regressionStats.rSquared * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ 
                          color: palette.text.secondary, 
                          fontSize: { xs: '0.75rem', md: '0.85rem' },
                          lineHeight: 1.4
                        }}>
                          <strong>Trend:</strong> {regressionStats.trendDirection} {regressionStats.trendStrength.toFixed(1)}%
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ 
                          color: palette.text.secondary, 
                          fontSize: { xs: '0.75rem', md: '0.85rem' },
                          lineHeight: 1.4
                        }}>
                          <strong>Avg Revenue:</strong> ${(regressionStats.avgRevenue / 1000).toFixed(0)}k
                        </Typography>
                      </Box>
                      <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1', lg: 'auto' } }}>
                        <Typography variant="body2" sx={{ 
                          color: palette.text.secondary, 
                          fontSize: { xs: '0.7rem', md: '0.8rem' },
                          lineHeight: 1.4,
                          fontFamily: 'monospace'
                        }}>
                          <strong>Model:</strong> {regressionStats.equation}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
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


            


            <Box sx={{ 
              width: '100%', 
              flex: { xs: 'none', md: 1 },
              height: { 
                xs: '400px',    // Fixed height for mobile
                sm: '420px',    // Mobile landscape / small tablet
                md: '450px',    // Tablet
                lg: '500px',    // Desktop
                xl: '550px'     // Large desktop
              },
              position: 'relative',
              minHeight: '350px',
              mt: { xs: 2, md: 3 },
              border: { xs: `1px solid ${palette.grey[800]}20`, md: 'none' },
              borderRadius: { xs: 2, md: 0 },
              backgroundColor: { xs: `${palette.background.paper}40`, md: 'transparent' },
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={formattedData}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 10,
                    bottom: 60,
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
                tick={{ fontSize: 9, fill: palette.text.secondary }}
                interval={formattedData.length > 18 ? 1 : 0} // Show every other tick if too many data points
                angle={formattedData.length > 12 ? -35 : 0}
                textAnchor={formattedData.length > 12 ? "end" : "middle"}
                height={formattedData.length > 12 ? 55 : 40}
                minTickGap={5}
              >
                <Label 
                  value="Month" 
                  offset={formattedData.length > 12 ? -10 : -5} 
                  position="insideBottom"
                  style={{ textAnchor: 'middle', fill: palette.text.secondary, fontSize: '11px' }}
                />
              </XAxis>
              <YAxis
                domain={["dataMin - 1000", "dataMax + 1000"]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: palette.text.secondary }}
                tickFormatter={(v) => {
                  const absV = Math.abs(v);
                  if (absV >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
                  if (absV >= 1000) return `$${(v / 1000).toFixed(0)}k`;
                  return `$${v.toFixed(0)}`;
                }}
                width={50}
                tickCount={6}
              >
                <Label
                  value="Revenue"
                  angle={-90}
                  offset={5}
                  position="insideLeft"
                  style={{ textAnchor: 'middle', fill: palette.text.secondary, fontSize: '10px' }}
                />
              </YAxis>
              <Tooltip
                contentStyle={{
                  backgroundColor: palette.background.paper,
                  border: `1px solid ${palette.grey[700]}`,
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  padding: '12px',
                }}
                labelStyle={{ 
                  color: palette.text.primary,
                  fontWeight: 600,
                  marginBottom: '8px',
                }}
                formatter={(value: any, name: string) => {
                  if (value === null) return ['N/A', name];
                  const formattedValue = `$${value.toLocaleString()}`;
                  const color = name === 'Actual Revenue' ? palette.primary.main :
                               name === 'Regression Line' ? palette.tertiary.main :
                               palette.secondary.main;
                  return [
                    <span style={{ color, fontWeight: 600 }}>{formattedValue}</span>,
                    <span style={{ color: palette.text.secondary }}>{name}</span>
                  ];
                }}
                labelFormatter={(label) => (
                  <div style={{ 
                    borderBottom: `1px solid ${palette.grey[700]}`, 
                    paddingBottom: '4px',
                    marginBottom: '8px',
                    color: palette.text.primary,
                    fontWeight: 600,
                  }}>
                    📅 {label}
                  </div>
                )}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                iconSize={12}
                wrapperStyle={{ 
                  paddingBottom: '15px',
                  color: palette.text.primary,
                  fontSize: '12px',
                  lineHeight: '1.2',
                }}
                formatter={(value) => (
                  <span style={{ fontSize: '11px', color: palette.text.primary }}>
                    {value}
                  </span>
                )}
              />
              <Line
                type="monotone"
                dataKey="actualRevenue"
                stroke={palette.primary.main}
                strokeWidth={2.5}
                dot={{ fill: palette.primary.main, strokeWidth: 1.5, r: 4 }}
                activeDot={{ r: 6, stroke: palette.primary.main, strokeWidth: 2 }}
                connectNulls={false}
                name="Actual Revenue"
              />
              <Line
                type="monotone"
                dataKey="regressionLine"
                stroke={palette.tertiary.main}
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="3 3"
                connectNulls={true}
                name="Regression Line"
              />
              {isPredictions && (
                <Line
                  type="monotone"
                  strokeDasharray="4 4"
                  dataKey="predictedRevenue"
                  stroke={palette.secondary.main}
                  strokeWidth={2.5}
                  dot={{ fill: palette.secondary.main, strokeWidth: 1.5, r: 3.5 }}
                  activeDot={{ r: 5.5, stroke: palette.secondary.main, strokeWidth: 2 }}
                  connectNulls={false}
                  name="Predicted Revenue"
                />
              )}
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </DashboardBox>
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default Predictions;
