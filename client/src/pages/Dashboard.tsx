import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  ShoppingCart as ShoppingCartIcon,
  Analytics as AnalyticsIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

// Hooks and State
import { useGetKpisQuery, useGetTransactionsQuery } from '../state/api';

// Components
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// Mock data for fallback
const mockKpiData = {
  totalRevenue: 125000,
  totalExpenses: 87000,
  totalProfit: 38000,
  monthlyData: [
    { month: 'Jan', revenue: 45000, expenses: 32000 },
    { month: 'Feb', revenue: 52000, expenses: 35000 },
    { month: 'Mar', revenue: 48000, expenses: 33000 },
    { month: 'Apr', revenue: 61000, expenses: 38000 },
    { month: 'May', revenue: 55000, expenses: 36000 },
    { month: 'Jun', revenue: 67000, expenses: 41000 },
  ],
  expensesByCategory: {
    'Operations': 25000,
    'Marketing': 18000,
    'Technology': 15000,
    'Administration': 12000,
    'Other': 17000,
  }
};

const mockTransactions = [
  { id: '1', buyer: 'John Smith', amount: 2500, createdAt: '2024-01-15T10:30:00Z' },
  { id: '2', buyer: 'Sarah Johnson', amount: 1800, createdAt: '2024-01-15T09:15:00Z' },
  { id: '3', buyer: 'Mike Wilson', amount: 3200, createdAt: '2024-01-14T16:45:00Z' },
  { id: '4', buyer: 'Emily Davis', amount: 950, createdAt: '2024-01-14T14:20:00Z' },
  { id: '5', buyer: 'David Brown', amount: 4100, createdAt: '2024-01-13T11:30:00Z' },
];

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [refreshing, setRefreshing] = useState(false);

  // API queries with error handling
  const { 
    data: kpis, 
    isLoading: kpisLoading, 
    error: kpisError,
    refetch: refetchKpis 
  } = useGetKpisQuery();
  
  const { 
    data: transactionsData, 
    isLoading: transactionsLoading,
    refetch: refetchTransactions 
  } = useGetTransactionsQuery({ limit: 5 });

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchKpis(), refetchTransactions()]);
    setRefreshing(false);
  };

  if (kpisLoading || transactionsLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  // Use mock data if API fails or returns no data
  const kpi = kpis?.[0] || mockKpiData;
  const transactions = transactionsData?.data || mockTransactions;
  
  // Helper function to parse currency strings
  const parseCurrency = (value: number | string): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      return parseFloat(value.replace(/[$,]/g, '')) || 0;
    }
    return 0;
  };

  // Calculate metrics
  const totalRevenue = parseCurrency(kpi.totalRevenue);
  const totalExpenses = parseCurrency(kpi.totalExpenses);
  const totalProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Prepare chart data
  const monthlyData = kpi.monthlyData || mockKpiData.monthlyData;
  const revenueData = monthlyData.map(item => ({
    month: item.month,
    revenue: parseCurrency(item.revenue),
    expenses: parseCurrency(item.expenses),
    profit: parseCurrency(item.revenue) - parseCurrency(item.expenses),
  }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
                Financial Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Welcome back! Here's your financial overview for today.
              </Typography>
            </Box>
            
            <Box display="flex" gap={1} alignItems="center">
              {(kpisError || !kpis) && (
                <Chip
                  label="Using sample data"
                  color="warning"
                  variant="outlined"
                  size="small"
                />
              )}
              <Tooltip title="Refresh data">
                <IconButton 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  sx={{ 
                    border: `1px solid ${theme.palette.divider}`,
                    '&:hover': { borderColor: theme.palette.primary.main }
                  }}
                >
                  <RefreshIcon sx={{ 
                    animation: refreshing ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    }
                  }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        {/* Key Metrics */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Total Revenue"
              value={formatCurrency(totalRevenue)}
              change={12.5}
              icon={<AccountBalanceIcon />}
              color="primary"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Total Expenses"
              value={formatCurrency(totalExpenses)}
              change={-8.3}
              icon={<TrendingDownIcon />}
              color="error"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Net Profit"
              value={formatCurrency(totalProfit)}
              change={15.7}
              icon={<TrendingUpIcon />}
              color="success"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Profit Margin"
              value={`${profitMargin.toFixed(1)}%`}
              change={3.2}
              icon={<AnalyticsIcon />}
              color="secondary"
            />
          </Grid>
        </Grid>

        {/* Charts and Recent Activity */}
        <Grid container spacing={3} mb={4}>
          {/* Revenue Trend Chart */}
          <Grid item xs={12} lg={8}>
            <ChartCard
              title="Revenue vs Expenses"
              subtitle="Monthly comparison of revenue and expenses"
            >
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.error.main} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={theme.palette.error.main} stopOpacity={0} />
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
                    stroke={theme.palette.primary.main}
                    fill="url(#revenueGradient)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke={theme.palette.error.main}
                    fill="url(#expenseGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

          {/* Recent Transactions */}
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                height: '100%',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={600}>
                    Recent Transactions
                  </Typography>
                  <Button
                    size="small"
                    sx={{ textTransform: 'none' }}
                    href="/transactions"
                  >
                    View All
                  </Button>
                </Box>
                
                <List sx={{ p: 0 }}>
                  {transactions.slice(0, 5).map((transaction, index) => (
                    <React.Fragment key={transaction.id}>
                      <ListItem sx={{ px: 0, py: 1.5 }}>
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              backgroundColor: theme.palette.primary.main,
                            }}
                          >
                            <ReceiptIcon fontSize="small" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight={500}>
                              {transaction.buyer}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(transaction.createdAt)}
                            </Typography>
                          }
                        />
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="success.main"
                        >
                          {formatCurrency(transaction.amount)}
                        </Typography>
                      </ListItem>
                      {index < transactions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Profit Trend */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ChartCard
              title="Profit Trend"
              subtitle="Monthly profit analysis"
            >
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueData}>
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
                    formatter={(value: number) => [formatCurrency(value), 'Profit']}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke={theme.palette.success.main}
                    strokeWidth={3}
                    dot={{ fill: theme.palette.success.main, strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: theme.palette.success.main, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};

export default Dashboard;