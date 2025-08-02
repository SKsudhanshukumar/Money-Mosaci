import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
  ButtonGroup,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon,
  PieChart as PieChartIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
} from 'recharts';

// Hooks and State
import { useGetAnalyticsQuery, useGetKpisQuery } from '../state/api';

// Components
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const TIME_PERIODS = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
];

// Mock data for fallback
const mockMonthlyTrends = [
  { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
  { month: 'Feb', revenue: 52000, expenses: 35000, profit: 17000 },
  { month: 'Mar', revenue: 48000, expenses: 33000, profit: 15000 },
  { month: 'Apr', revenue: 61000, expenses: 38000, profit: 23000 },
  { month: 'May', revenue: 55000, expenses: 36000, profit: 19000 },
  { month: 'Jun', revenue: 67000, expenses: 41000, profit: 26000 },
];

const mockExpenseBreakdown = [
  { name: 'Operations', value: 15000, percentage: '35.7' },
  { name: 'Marketing', value: 12000, percentage: '28.6' },
  { name: 'Technology', value: 8000, percentage: '19.0' },
  { name: 'Administration', value: 7000, percentage: '16.7' },
];

const Analytics: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // API queries with error handling
  const { 
    data: analytics, 
    isLoading: analyticsLoading, 
    error: analyticsError,
    refetch: refetchAnalytics 
  } = useGetAnalyticsQuery();
  
  const { 
    data: kpis, 
    isLoading: kpisLoading,
    refetch: refetchKpis 
  } = useGetKpisQuery();

  const handleRetry = () => {
    refetchAnalytics();
    refetchKpis();
  };

  if (analyticsLoading || kpisLoading) {
    return <LoadingSpinner message="Loading analytics..." />;
  }

  // Helper function to parse currency strings
  const parseCurrency = (value: number | string): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      return parseFloat(value.replace(/[$,]/g, '')) || 0;
    }
    return 0;
  };

  // Use mock data if API fails or returns no data
  const kpi = kpis?.[0];
  const monthlyTrends = analytics?.monthlyTrends?.length > 0 
    ? analytics.monthlyTrends 
    : mockMonthlyTrends;
  
  const expenseBreakdown = kpi?.expensesByCategory 
    ? Object.entries(kpi.expensesByCategory).map(([category, amount]) => ({
        name: category,
        value: parseCurrency(amount),
        percentage: ((parseCurrency(amount) / parseCurrency(kpi?.totalExpenses || 1)) * 100).toFixed(1),
      }))
    : mockExpenseBreakdown;

  const revenueGrowthData = monthlyTrends.map((item, index) => {
    const currentRevenue = parseCurrency(item.revenue);
    const previousRevenue = index > 0 ? parseCurrency(monthlyTrends[index - 1].revenue) : 0;
    
    return {
      ...item,
      revenue: currentRevenue,
      expenses: parseCurrency(item.expenses),
      profit: currentRevenue - parseCurrency(item.expenses),
      growthRate: index > 0 && previousRevenue > 0
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
        : 0,
    };
  });

  const profitabilityData = monthlyTrends.map(item => {
    const revenue = parseCurrency(item.revenue);
    const expenses = parseCurrency(item.expenses);
    const profit = revenue - expenses;
    
    return {
      month: item.month,
      profitMargin: revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : '0',
      revenue,
      expenses,
    };
  });

  const topPerformingProducts = analytics?.topProducts?.slice(0, 5) || [];

  const pieColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate summary metrics
  const totalRevenue = monthlyTrends.reduce((sum, item) => sum + parseCurrency(item.revenue), 0);
  const totalExpenses = monthlyTrends.reduce((sum, item) => sum + parseCurrency(item.expenses), 0);
  const totalProfit = totalRevenue - totalExpenses;
  const avgRevenueGrowth = revenueGrowthData.reduce((sum, item) => sum + item.growthRate, 0) / revenueGrowthData.length;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const expenseRatio = totalRevenue > 0 ? (totalExpenses / totalRevenue) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box>
        {/* Header */}
        <Box mb={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Financial Analytics
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Deep insights into your financial performance and trends.
              </Typography>
            </Box>
            
            <ButtonGroup variant="outlined" size="small">
              {TIME_PERIODS.map((period) => (
                <Button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  variant={selectedPeriod === period.value ? 'contained' : 'outlined'}
                  sx={{ textTransform: 'none' }}
                >
                  {period.label}
                </Button>
              ))}
            </ButtonGroup>
          </Box>

          {/* Show error message if API failed but continue with mock data */}
          {analyticsError && (
            <Box mb={2}>
              <Chip
                label="Using sample data - API connection failed"
                color="warning"
                variant="outlined"
                onClick={handleRetry}
                sx={{ cursor: 'pointer' }}
              />
            </Box>
          )}
        </Box>

        {/* Key Metrics */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Revenue Growth"
              value={`${avgRevenueGrowth.toFixed(1)}%`}
              change={avgRevenueGrowth}
              icon={<TrendingUpIcon />}
              color="primary"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Profit Margin"
              value={`${profitMargin.toFixed(1)}%`}
              change={5.2}
              icon={<AssessmentIcon />}
              color="success"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Expense Ratio"
              value={`${expenseRatio.toFixed(1)}%`}
              change={-2.1}
              icon={<TrendingDownIcon />}
              color="warning"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Active Products"
              value={topPerformingProducts.length.toString() || "5"}
              change={8.3}
              icon={<PieChartIcon />}
              color="secondary"
            />
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} mb={4}>
          {/* Revenue Trend Analysis */}
          <Grid item xs={12} lg={8}>
            <ChartCard
              title="Revenue Trend Analysis"
              subtitle="Monthly revenue, expenses, and profit trends"
            >
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={monthlyTrends}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis
                    dataKey="month"
                    stroke={theme.palette.text.secondary}
                    fontSize={12}
                  />
                  <YAxis
                    stroke={theme.palette.text.secondary}
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                    }}
                    formatter={(value: number, name: string) => [
                      formatCurrency(value),
                      name.charAt(0).toUpperCase() + name.slice(1)
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    fill="url(#revenueGradient)"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                  />
                  <Bar
                    dataKey="expenses"
                    fill={theme.palette.error.main}
                    opacity={0.7}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke={theme.palette.success.main}
                    strokeWidth={3}
                    dot={{ fill: theme.palette.success.main, strokeWidth: 2, r: 4 }}
                  />
                  <Legend />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

          {/* Expense Breakdown */}
          <Grid item xs={12} lg={4}>
            <ChartCard
              title="Expense Breakdown"
              subtitle="Distribution by category"
            >
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                    }}
                    formatter={(value: number, name: string, props: any) => [
                      `${formatCurrency(value)} (${props.payload.percentage}%)`,
                      'Amount'
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>

        {/* Profitability Analysis */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} lg={8}>
            <ChartCard
              title="Profitability Analysis"
              subtitle="Profit margin trends over time"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={profitabilityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis
                    dataKey="month"
                    stroke={theme.palette.text.secondary}
                    fontSize={12}
                  />
                  <YAxis
                    stroke={theme.palette.text.secondary}
                    fontSize={12}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                    }}
                    formatter={(value: number) => [`${value}%`, 'Profit Margin']}
                  />
                  <Line
                    type="monotone"
                    dataKey="profitMargin"
                    stroke={theme.palette.success.main}
                    strokeWidth={3}
                    dot={{ fill: theme.palette.success.main, strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: theme.palette.success.main, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

          {/* Performance Summary */}
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                height: '100%',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Performance Summary
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Key financial metrics
                </Typography>
                
                <List sx={{ p: 0 }}>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemText
                      primary="Total Revenue"
                      secondary={formatCurrency(totalRevenue)}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemText
                      primary="Total Expenses"
                      secondary={formatCurrency(totalExpenses)}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemText
                      primary="Net Profit"
                      secondary={
                        <Typography
                          variant="body2"
                          color={totalProfit > 0 ? 'success.main' : 'error.main'}
                          fontWeight={600}
                        >
                          {formatCurrency(totalProfit)}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider />
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemText
                      primary="Profit Margin"
                      secondary={`${profitMargin.toFixed(1)}%`}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Performance Metrics Table */}
        <Card
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Monthly Performance Metrics
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Detailed breakdown of key financial metrics
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.background.elevated }}>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Month
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" fontWeight={600}>
                        Revenue
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" fontWeight={600}>
                        Expenses
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" fontWeight={600}>
                        Profit
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" fontWeight={600}>
                        Margin
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2" fontWeight={600}>
                        Growth
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {revenueGrowthData.map((row, index) => (
                    <TableRow key={row.month} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {row.month}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {formatCurrency(row.revenue)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {formatCurrency(row.expenses)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          fontWeight={500}
                          color={row.profit > 0 ? 'success.main' : 'error.main'}
                        >
                          {formatCurrency(row.profit)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {((row.profit / row.revenue) * 100).toFixed(1)}%
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {index > 0 && (
                          <Chip
                            label={`${row.growthRate > 0 ? '+' : ''}${row.growthRate.toFixed(1)}%`}
                            size="small"
                            color={row.growthRate > 0 ? 'success' : 'error'}
                            variant="outlined"
                            icon={row.growthRate > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </motion.div>
  );
};

export default Analytics;