import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useGetKpisQuery, useGetTransactionsQuery } from '../state/api';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Scatter,
  ScatterChart,
} from 'recharts';

interface Anomaly {
  id: string;
  type: 'revenue' | 'expense' | 'transaction' | 'pattern';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  value: number;
  expectedValue: number;
  deviation: number;
  date: string;
  recommendations: string[];
}

const AnomalyDetection: React.FC = () => {
  const theme = useTheme();
  const { data: kpiData } = useGetKpisQuery();
  const { data: transactionsData } = useGetTransactionsQuery();
  const [selectedAnomalyType, setSelectedAnomalyType] = useState<string>('all');

  const { anomalies, chartData, statistics } = useMemo(() => {
    if (!kpiData || !kpiData[0]) return { anomalies: [], chartData: [], statistics: null };

    const monthlyData = kpiData[0].monthlyData;
    const dailyData = kpiData[0].dailyData;

    // Calculate statistical measures
    const revenues = monthlyData.map(m => parseFloat(m.revenue.replace(/[$,]/g, '')));
    const expenses = monthlyData.map(m => parseFloat(m.expenses.replace(/[$,]/g, '')));
    
    const avgRevenue = revenues.reduce((sum, val) => sum + val, 0) / revenues.length;
    const avgExpenses = expenses.reduce((sum, val) => sum + val, 0) / expenses.length;
    
    // Calculate standard deviations
    const revenueStdDev = Math.sqrt(
      revenues.reduce((sum, val) => sum + Math.pow(val - avgRevenue, 2), 0) / revenues.length
    );
    const expenseStdDev = Math.sqrt(
      expenses.reduce((sum, val) => sum + Math.pow(val - avgExpenses, 2), 0) / expenses.length
    );

    const detectedAnomalies: Anomaly[] = [];

    // Revenue anomaly detection
    monthlyData.forEach((month, index) => {
      const revenue = parseFloat(month.revenue.replace(/[$,]/g, ''));
      const expense = parseFloat(month.expenses.replace(/[$,]/g, ''));
      const deviation = Math.abs(revenue - avgRevenue) / revenueStdDev;

      // Revenue anomalies (2+ standard deviations)
      if (deviation > 2) {
        const isHigh = revenue > avgRevenue;
        detectedAnomalies.push({
          id: `revenue-${index}`,
          type: 'revenue',
          severity: deviation > 3 ? 'high' : 'medium',
          title: `${isHigh ? 'Unusually High' : 'Unusually Low'} Revenue`,
          description: `${month.month} revenue of $${revenue.toLocaleString()} is ${deviation.toFixed(1)} standard deviations ${isHigh ? 'above' : 'below'} average`,
          value: revenue,
          expectedValue: avgRevenue,
          deviation: deviation,
          date: month.month,
          recommendations: isHigh 
            ? ['Investigate what drove this exceptional performance', 'Consider if this is sustainable', 'Analyze contributing factors for replication']
            : ['Review sales performance and market conditions', 'Check for seasonal factors', 'Investigate potential operational issues']
        });
      }

      // Expense anomalies
      const expenseDeviation = Math.abs(expense - avgExpenses) / expenseStdDev;
      if (expenseDeviation > 2) {
        const isHigh = expense > avgExpenses;
        detectedAnomalies.push({
          id: `expense-${index}`,
          type: 'expense',
          severity: expenseDeviation > 3 ? 'high' : 'medium',
          title: `${isHigh ? 'Unusually High' : 'Unusually Low'} Expenses`,
          description: `${month.month} expenses of $${expense.toLocaleString()} is ${expenseDeviation.toFixed(1)} standard deviations ${isHigh ? 'above' : 'below'} average`,
          value: expense,
          expectedValue: avgExpenses,
          deviation: expenseDeviation,
          date: month.month,
          recommendations: isHigh
            ? ['Review expense categories for unusual spending', 'Check for one-time costs or errors', 'Implement cost control measures']
            : ['Verify if expense reduction is sustainable', 'Check for deferred expenses', 'Ensure quality is maintained']
        });
      }

      // Profit margin anomalies
      const profit = revenue - expense;
      const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
      const avgProfitMargin = revenues.map((rev, i) => 
        rev > 0 ? ((rev - expenses[i]) / rev) * 100 : 0
      ).reduce((sum, val) => sum + val, 0) / revenues.length;

      if (Math.abs(profitMargin - avgProfitMargin) > 10) { // 10% deviation
        detectedAnomalies.push({
          id: `margin-${index}`,
          type: 'pattern',
          severity: Math.abs(profitMargin - avgProfitMargin) > 20 ? 'high' : 'medium',
          title: `Unusual Profit Margin`,
          description: `${month.month} profit margin of ${profitMargin.toFixed(1)}% deviates significantly from average of ${avgProfitMargin.toFixed(1)}%`,
          value: profitMargin,
          expectedValue: avgProfitMargin,
          deviation: Math.abs(profitMargin - avgProfitMargin),
          date: month.month,
          recommendations: [
            'Analyze cost structure changes',
            'Review pricing strategy effectiveness',
            'Check for operational efficiency changes'
          ]
        });
      }
    });

    // Transaction pattern anomalies (if transaction data is available)
    if (transactionsData && transactionsData.length > 0) {
      const transactionAmounts = transactionsData.map(t => t.amount);
      const avgTransaction = transactionAmounts.reduce((sum, val) => sum + val, 0) / transactionAmounts.length;
      const transactionStdDev = Math.sqrt(
        transactionAmounts.reduce((sum, val) => sum + Math.pow(val - avgTransaction, 2), 0) / transactionAmounts.length
      );

      transactionsData.forEach((transaction, index) => {
        const deviation = Math.abs(transaction.amount - avgTransaction) / transactionStdDev;
        if (deviation > 3) { // Very unusual transactions
          detectedAnomalies.push({
            id: `transaction-${index}`,
            type: 'transaction',
            severity: 'high',
            title: 'Unusual Transaction Amount',
            description: `Transaction of $${transaction.amount.toLocaleString()} is ${deviation.toFixed(1)} standard deviations from average`,
            value: transaction.amount,
            expectedValue: avgTransaction,
            deviation: deviation,
            date: transaction.createdAt || 'Unknown',
            recommendations: [
              'Verify transaction legitimacy',
              'Check for data entry errors',
              'Review transaction approval process'
            ]
          });
        }
      });
    }

    // Create chart data with anomaly markers
    const processedChartData = monthlyData.map((month, index) => {
      const revenue = parseFloat(month.revenue.replace(/[$,]/g, ''));
      const expense = parseFloat(month.expenses.replace(/[$,]/g, ''));
      const hasRevenueAnomaly = detectedAnomalies.some(a => a.id === `revenue-${index}`);
      const hasExpenseAnomaly = detectedAnomalies.some(a => a.id === `expense-${index}`);

      return {
        name: month.month.substring(0, 3),
        revenue,
        expense,
        avgRevenue,
        avgExpenses,
        revenueUpperBound: avgRevenue + (2 * revenueStdDev),
        revenueLowerBound: avgRevenue - (2 * revenueStdDev),
        expenseUpperBound: avgExpenses + (2 * expenseStdDev),
        expenseLowerBound: avgExpenses - (2 * expenseStdDev),
        hasRevenueAnomaly,
        hasExpenseAnomaly,
      };
    });

    const stats = {
      totalAnomalies: detectedAnomalies.length,
      highSeverity: detectedAnomalies.filter(a => a.severity === 'high').length,
      mediumSeverity: detectedAnomalies.filter(a => a.severity === 'medium').length,
      lowSeverity: detectedAnomalies.filter(a => a.severity === 'low').length,
      revenueAnomalies: detectedAnomalies.filter(a => a.type === 'revenue').length,
      expenseAnomalies: detectedAnomalies.filter(a => a.type === 'expense').length,
      avgRevenue,
      avgExpenses,
      revenueStdDev,
      expenseStdDev,
    };

    return { 
      anomalies: detectedAnomalies.sort((a, b) => {
        const severityOrder = { high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      }), 
      chartData: processedChartData, 
      statistics: stats 
    };
  }, [kpiData, transactionsData]);

  const filteredAnomalies = selectedAnomalyType === 'all' 
    ? anomalies 
    : anomalies.filter(a => a.type === selectedAnomalyType);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.info.main;
      default: return theme.palette.grey[500];
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <ErrorIcon />;
      case 'medium': return <WarningIcon />;
      case 'low': return <InfoIcon />;
      default: return <InfoIcon />;
    }
  };

  if (!statistics) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading anomaly detection...</Typography>
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
          Anomaly Detection
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
          AI-powered detection of unusual patterns in your financial data
        </Typography>
      </Box>

      {/* Statistics Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                {statistics.totalAnomalies}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Anomalies
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
                {statistics.highSeverity}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                High Severity
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                {statistics.mediumSeverity}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Medium Severity
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.info.main }}>
                {statistics.lowSeverity}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Low Severity
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {['all', 'revenue', 'expense', 'transaction', 'pattern'].map(type => (
          <Button
            key={type}
            variant={selectedAnomalyType === type ? 'contained' : 'outlined'}
            onClick={() => setSelectedAnomalyType(type)}
            size="small"
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
            {type !== 'all' && (
              <Chip 
                label={anomalies.filter(a => a.type === type).length} 
                size="small" 
                sx={{ ml: 1, height: 16 }}
              />
            )}
          </Button>
        ))}
      </Box>

      <Grid container spacing={3}>
        {/* Anomaly Chart */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Revenue & Expense Trends with Anomaly Detection
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                    }}
                  />
                  
                  {/* Control bounds */}
                  <ReferenceLine y={statistics.avgRevenue} stroke={theme.palette.primary.main} strokeDasharray="5 5" />
                  <ReferenceLine y={statistics.avgExpenses} stroke={theme.palette.secondary.main} strokeDasharray="5 5" />
                  
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                    dot={(props: any) => {
                      const { payload } = props;
                      return payload?.hasRevenueAnomaly ? (
                        <circle
                          cx={props.cx}
                          cy={props.cy}
                          r={6}
                          fill={theme.palette.error.main}
                          stroke={theme.palette.error.main}
                          strokeWidth={2}
                        />
                      ) : (
                        <circle
                          cx={props.cx}
                          cy={props.cy}
                          r={3}
                          fill={theme.palette.primary.main}
                        />
                      );
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke={theme.palette.secondary.main}
                    strokeWidth={2}
                    dot={(props: any) => {
                      const { payload } = props;
                      return payload?.hasExpenseAnomaly ? (
                        <circle
                          cx={props.cx}
                          cy={props.cy}
                          r={6}
                          fill={theme.palette.warning.main}
                          stroke={theme.palette.warning.main}
                          strokeWidth={2}
                        />
                      ) : (
                        <circle
                          cx={props.cx}
                          cy={props.cy}
                          r={3}
                          fill={theme.palette.secondary.main}
                        />
                      );
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Anomaly List */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsIcon sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Detected Anomalies
                </Typography>
              </Box>
              
              {filteredAnomalies.length === 0 ? (
                <Alert severity="success">
                  No anomalies detected in the selected category
                </Alert>
              ) : (
                <List sx={{ maxHeight: 500, overflow: 'auto' }}>
                  {filteredAnomalies.map((anomaly, index) => (
                    <motion.div
                      key={anomaly.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Box sx={{ color: getSeverityColor(anomaly.severity), mr: 1 }}>
                              {getSeverityIcon(anomaly.severity)}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {anomaly.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {anomaly.date} • {anomaly.severity} severity
                              </Typography>
                            </Box>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            {anomaly.description}
                          </Typography>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                              Deviation Score
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(anomaly.deviation * 20, 100)}
                              sx={{ mt: 0.5, mb: 1 }}
                              color={anomaly.severity === 'high' ? 'error' : anomaly.severity === 'medium' ? 'warning' : 'info'}
                            />
                          </Box>

                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                            Recommendations:
                          </Typography>
                          <List dense>
                            {anomaly.recommendations.map((rec, i) => (
                              <ListItem key={i} sx={{ py: 0.5, px: 0 }}>
                                <ListItemIcon sx={{ minWidth: 20 }}>
                                  <Box
                                    sx={{
                                      width: 6,
                                      height: 6,
                                      borderRadius: '50%',
                                      backgroundColor: getSeverityColor(anomaly.severity),
                                    }}
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  primary={rec}
                                  primaryTypographyProps={{ variant: 'body2' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    </motion.div>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnomalyDetection;