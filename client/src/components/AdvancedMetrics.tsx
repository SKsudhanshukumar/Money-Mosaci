import React, { useMemo } from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PercentIcon from '@mui/icons-material/Percent';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useGetKpisQuery, useGetProductsQuery, useGetTransactionsQuery } from '../state/api';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: React.ReactNode;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  icon, 
  color 
}) => {
  const theme = useTheme();
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          background: `linear-gradient(135deg, ${color}15, ${color}08)`,
          border: `1px solid ${color}30`,
          borderRadius: 3,
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${color}, ${color}80)`,
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box
              sx={{
                background: `${color}20`,
                borderRadius: 2,
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
            {trend && trendValue && (
              <Chip
                icon={trend === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                label={trendValue}
                size="small"
                sx={{
                  backgroundColor: trend === 'up' ? `${theme.palette.success.main}20` : `${theme.palette.error.main}20`,
                  color: trend === 'up' ? theme.palette.success.main : theme.palette.error.main,
                  fontWeight: 600,
                }}
              />
            )}
          </Box>
          
          <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 0.5 }}>
            {value}
          </Typography>
          
          <Typography variant="h6" sx={{ color: theme.palette.text.secondary, mb: 1, fontWeight: 500 }}>
            {title}
          </Typography>
          
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.4 }}>
            {subtitle}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const AdvancedMetrics: React.FC = () => {
  const theme = useTheme();
  const { data: kpiData } = useGetKpisQuery();
  const { data: productsData } = useGetProductsQuery();
  const { data: transactionsData } = useGetTransactionsQuery();

  const metrics = useMemo(() => {
    if (!kpiData || !kpiData[0]) return null;

    const kpi = kpiData[0];
    const totalRevenue = parseFloat(kpi.totalRevenue.replace(/[$,]/g, ''));
    const totalExpenses = parseFloat(kpi.totalExpenses.replace(/[$,]/g, ''));
    const totalProfit = parseFloat(kpi.totalProfit.replace(/[$,]/g, ''));

    // Calculate monthly data for trends
    const monthlyData = kpi.monthlyData.map(month => ({
      revenue: parseFloat(month.revenue.replace(/[$,]/g, '')),
      expenses: parseFloat(month.expenses.replace(/[$,]/g, '')),
      operationalExpenses: parseFloat(month.operationalExpenses.replace(/[$,]/g, '')),
      nonOperationalExpenses: parseFloat(month.nonOperationalExpenses.replace(/[$,]/g, '')),
    }));

    // Profit Margin
    const profitMargin = ((totalProfit / totalRevenue) * 100);
    const avgMonthlyRevenue = monthlyData.reduce((sum, month) => sum + month.revenue, 0) / monthlyData.length;
    const avgMonthlyProfit = monthlyData.reduce((sum, month) => sum + (month.revenue - month.expenses), 0) / monthlyData.length;
    const avgProfitMargin = (avgMonthlyProfit / avgMonthlyRevenue) * 100;
    const profitMarginTrend = profitMargin > avgProfitMargin ? 'up' : 'down';

    // Operating Ratio
    const totalOperationalExpenses = monthlyData.reduce((sum, month) => sum + month.operationalExpenses, 0);
    const operatingRatio = (totalOperationalExpenses / totalRevenue) * 100;
    const operatingRatioTrend = operatingRatio < 60 ? 'up' : 'down'; // Lower is better

    // Revenue Growth Rate (comparing last 3 months to previous 3 months)
    const lastThreeMonths = monthlyData.slice(-3);
    const previousThreeMonths = monthlyData.slice(-6, -3);
    const lastThreeRevenue = lastThreeMonths.reduce((sum, month) => sum + month.revenue, 0);
    const previousThreeRevenue = previousThreeMonths.reduce((sum, month) => sum + month.revenue, 0);
    const revenueGrowthRate = ((lastThreeRevenue - previousThreeRevenue) / previousThreeRevenue) * 100;

    // Expense Ratio
    const expenseRatio = (totalExpenses / totalRevenue) * 100;
    const expenseRatioTrend = expenseRatio < 50 ? 'up' : 'down'; // Lower is better

    // Break-even Analysis
    const avgMonthlyExpenses = monthlyData.reduce((sum, month) => sum + month.expenses, 0) / monthlyData.length;
    const breakEvenRevenue = avgMonthlyExpenses;
    const breakEvenDays = Math.ceil((breakEvenRevenue / avgMonthlyRevenue) * 30);

    // Cash Flow Trend
    const cashFlowTrend = monthlyData.map(month => month.revenue - month.expenses);
    const avgCashFlow = cashFlowTrend.reduce((sum, flow) => sum + flow, 0) / cashFlowTrend.length;
    const lastMonthCashFlow = cashFlowTrend[cashFlowTrend.length - 1];
    const cashFlowDirection = lastMonthCashFlow > avgCashFlow ? 'up' : 'down';

    return {
      profitMargin: {
        value: `${profitMargin.toFixed(1)}%`,
        trend: profitMarginTrend,
        trendValue: `${Math.abs(profitMargin - avgProfitMargin).toFixed(1)}%`,
      },
      operatingRatio: {
        value: `${operatingRatio.toFixed(1)}%`,
        trend: operatingRatioTrend,
        trendValue: `${operatingRatio.toFixed(1)}%`,
      },
      revenueGrowthRate: {
        value: `${revenueGrowthRate.toFixed(1)}%`,
        trend: revenueGrowthRate > 0 ? 'up' : 'down',
        trendValue: `${Math.abs(revenueGrowthRate).toFixed(1)}%`,
      },
      expenseRatio: {
        value: `${expenseRatio.toFixed(1)}%`,
        trend: expenseRatioTrend,
        trendValue: `${expenseRatio.toFixed(1)}%`,
      },
      breakEvenDays: {
        value: `${breakEvenDays}`,
        trend: breakEvenDays < 15 ? 'up' : 'down',
        trendValue: `${breakEvenDays} days`,
      },
      cashFlow: {
        value: `$${(avgCashFlow / 1000).toFixed(1)}k`,
        trend: cashFlowDirection,
        trendValue: `$${Math.abs(lastMonthCashFlow - avgCashFlow).toFixed(0)}`,
      },
    };
  }, [kpiData]);

  if (!metrics) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading advanced metrics...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            mb: 1,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Advanced Financial Metrics
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
          Comprehensive financial analysis and key performance indicators
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Profit Margin"
            value={metrics.profitMargin.value}
            subtitle="Percentage of revenue retained as profit after all expenses"
            trend={metrics.profitMargin.trend}
            trendValue={metrics.profitMargin.trendValue}
            icon={<PercentIcon sx={{ color: theme.palette.success.main }} />}
            color={theme.palette.success.main}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Operating Ratio"
            value={metrics.operatingRatio.value}
            subtitle="Operating expenses as percentage of total revenue"
            trend={metrics.operatingRatio.trend}
            trendValue={metrics.operatingRatio.trendValue}
            icon={<AccountBalanceIcon sx={{ color: theme.palette.warning.main }} />}
            color={theme.palette.warning.main}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Revenue Growth"
            value={metrics.revenueGrowthRate.value}
            subtitle="Quarter-over-quarter revenue growth rate"
            trend={metrics.revenueGrowthRate.trend}
            trendValue={metrics.revenueGrowthRate.trendValue}
            icon={<TimelineIcon sx={{ color: theme.palette.primary.main }} />}
            color={theme.palette.primary.main}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Expense Ratio"
            value={metrics.expenseRatio.value}
            subtitle="Total expenses as percentage of revenue"
            trend={metrics.expenseRatio.trend}
            trendValue={metrics.expenseRatio.trendValue}
            icon={<TrendingDownIcon sx={{ color: theme.palette.error.main }} />}
            color={theme.palette.error.main}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Break-even Point"
            value={metrics.breakEvenDays.value}
            subtitle="Days needed to cover monthly expenses"
            trend={metrics.breakEvenDays.trend}
            trendValue={metrics.breakEvenDays.trendValue}
            icon={<AccountBalanceIcon sx={{ color: theme.palette.info.main }} />}
            color={theme.palette.info.main}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Avg Cash Flow"
            value={metrics.cashFlow.value}
            subtitle="Average monthly cash flow (revenue - expenses)"
            trend={metrics.cashFlow.trend}
            trendValue={metrics.cashFlow.trendValue}
            icon={<TrendingUpIcon sx={{ color: theme.palette.secondary.main }} />}
            color={theme.palette.secondary.main}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdvancedMetrics;