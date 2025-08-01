import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  Alert,
  IconButton,
  useTheme,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useGetKpisQuery } from '../state/api';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface Budget {
  id: string;
  name: string;
  category: string;
  period: 'monthly' | 'quarterly' | 'yearly';
  budgetAmount: number;
  actualAmount: number;
  startDate: string;
  endDate: string;
  status: 'on-track' | 'warning' | 'over-budget';
  notes: string;
}

interface BudgetFormData {
  name: string;
  category: string;
  period: 'monthly' | 'quarterly' | 'yearly';
  budgetAmount: string;
  startDate: string;
  endDate: string;
  notes: string;
}

const BUDGET_CATEGORIES = [
  'Revenue',
  'Marketing',
  'Operations',
  'Salaries',
  'Supplies',
  'Services',
  'Travel',
  'Technology',
  'Other'
];

const COLORS = ['#3f51b5', '#f44336', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4', '#795548', '#607d8b'];

const BudgetManager: React.FC = () => {
  const theme = useTheme();
  const { data: kpiData } = useGetKpisQuery();
  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: '1',
      name: 'Monthly Revenue Target',
      category: 'Revenue',
      period: 'monthly',
      budgetAmount: 20000,
      actualAmount: 18500,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      status: 'warning',
      notes: 'Q1 revenue target'
    },
    {
      id: '2',
      name: 'Marketing Spend',
      category: 'Marketing',
      period: 'monthly',
      budgetAmount: 5000,
      actualAmount: 4200,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      status: 'on-track',
      notes: 'Digital marketing campaigns'
    },
    {
      id: '3',
      name: 'Operational Expenses',
      category: 'Operations',
      period: 'monthly',
      budgetAmount: 12000,
      actualAmount: 13500,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      status: 'over-budget',
      notes: 'Includes rent, utilities, and supplies'
    }
  ]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<BudgetFormData>({
    name: '',
    category: '',
    period: 'monthly',
    budgetAmount: '',
    startDate: '',
    endDate: '',
    notes: ''
  });

  const budgetAnalytics = useMemo(() => {
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.budgetAmount, 0);
    const totalActual = budgets.reduce((sum, budget) => sum + budget.actualAmount, 0);
    const variance = totalActual - totalBudget;
    const variancePercentage = totalBudget > 0 ? (variance / totalBudget) * 100 : 0;

    const statusCounts = budgets.reduce((acc, budget) => {
      acc[budget.status] = (acc[budget.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryBreakdown = budgets.reduce((acc, budget) => {
      if (!acc[budget.category]) {
        acc[budget.category] = { budget: 0, actual: 0, count: 0 };
      }
      acc[budget.category].budget += budget.budgetAmount;
      acc[budget.category].actual += budget.actualAmount;
      acc[budget.category].count += 1;
      return acc;
    }, {} as Record<string, { budget: number; actual: number; count: number }>);

    const chartData = Object.entries(categoryBreakdown).map(([category, data]) => ({
      category,
      budget: data.budget,
      actual: data.actual,
      variance: data.actual - data.budget,
      variancePercentage: data.budget > 0 ? ((data.actual - data.budget) / data.budget) * 100 : 0
    }));

    const pieData = Object.entries(categoryBreakdown).map(([category, data]) => ({
      name: category,
      value: data.budget,
      actual: data.actual
    }));

    return {
      totalBudget,
      totalActual,
      variance,
      variancePercentage,
      statusCounts,
      categoryBreakdown,
      chartData,
      pieData
    };
  }, [budgets]);

  const handleOpenDialog = (budget?: Budget) => {
    if (budget) {
      setEditingBudget(budget);
      setFormData({
        name: budget.name,
        category: budget.category,
        period: budget.period,
        budgetAmount: budget.budgetAmount.toString(),
        startDate: budget.startDate,
        endDate: budget.endDate,
        notes: budget.notes
      });
    } else {
      setEditingBudget(null);
      setFormData({
        name: '',
        category: '',
        period: 'monthly',
        budgetAmount: '',
        startDate: '',
        endDate: '',
        notes: ''
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingBudget(null);
  };

  const handleSaveBudget = () => {
    const budgetAmount = parseFloat(formData.budgetAmount);
    if (!formData.name || !formData.category || isNaN(budgetAmount)) {
      return;
    }

    const newBudget: Budget = {
      id: editingBudget?.id || Date.now().toString(),
      name: formData.name,
      category: formData.category,
      period: formData.period,
      budgetAmount,
      actualAmount: editingBudget?.actualAmount || 0,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: 'on-track', // Will be calculated based on actual vs budget
      notes: formData.notes
    };

    // Calculate status
    const variance = (newBudget.actualAmount / newBudget.budgetAmount) * 100;
    if (variance > 110) {
      newBudget.status = 'over-budget';
    } else if (variance > 90) {
      newBudget.status = 'on-track';
    } else {
      newBudget.status = 'warning';
    }

    if (editingBudget) {
      setBudgets(prev => prev.map(b => b.id === editingBudget.id ? newBudget : b));
    } else {
      setBudgets(prev => [...prev, newBudget]);
    }

    handleCloseDialog();
  };

  const handleDeleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return theme.palette.success.main;
      case 'warning': return theme.palette.warning.main;
      case 'over-budget': return theme.palette.error.main;
      default: return theme.palette.grey[500];
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track': return <CheckCircleIcon />;
      case 'warning': return <WarningIcon />;
      case 'over-budget': return <TrendingUpIcon />;
      default: return <CheckCircleIcon />;
    }
  };

  const renderOverviewTab = () => (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                ${(budgetAnalytics.totalBudget / 1000).toFixed(0)}k
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Budget
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>
                ${(budgetAnalytics.totalActual / 1000).toFixed(0)}k
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Actual Spend
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: budgetAnalytics.variance >= 0 ? theme.palette.error.main : theme.palette.success.main 
                }}
              >
                {budgetAnalytics.variance >= 0 ? '+' : ''}${(budgetAnalytics.variance / 1000).toFixed(1)}k
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Variance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: budgetAnalytics.variancePercentage >= 0 ? theme.palette.error.main : theme.palette.success.main 
                }}
              >
                {budgetAnalytics.variancePercentage >= 0 ? '+' : ''}{budgetAnalytics.variancePercentage.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Variance %
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Budget vs Actual by Category
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={budgetAnalytics.chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                    }}
                  />
                  <Legend />
                  <Bar dataKey="budget" fill={theme.palette.primary.main} name="Budget" />
                  <Bar dataKey="actual" fill={theme.palette.secondary.main} name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Budget Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={budgetAnalytics.pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {budgetAnalytics.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderBudgetsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Budget Items
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Budget
        </Button>
      </Box>

      <Grid container spacing={3}>
        {budgets.map((budget, index) => (
          <Grid item xs={12} md={6} lg={4} key={budget.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {budget.name}
                      </Typography>
                      <Chip
                        label={budget.category}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    </Box>
                    <Box>
                      <IconButton size="small" onClick={() => handleOpenDialog(budget)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteBudget(budget.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Budget: ${budget.budgetAmount.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Actual: ${budget.actualAmount.toLocaleString()}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((budget.actualAmount / budget.budgetAmount) * 100, 100)}
                      sx={{ height: 8, borderRadius: 4 }}
                      color={
                        budget.status === 'on-track' ? 'success' :
                        budget.status === 'warning' ? 'warning' : 'error'
                      }
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {((budget.actualAmount / budget.budgetAmount) * 100).toFixed(1)}% used
                      </Typography>
                      <Chip
                        icon={getStatusIcon(budget.status)}
                        label={budget.status.replace('-', ' ')}
                        size="small"
                        sx={{
                          backgroundColor: `${getStatusColor(budget.status)}20`,
                          color: getStatusColor(budget.status),
                        }}
                      />
                    </Box>
                  </Box>

                  {budget.notes && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      {budget.notes}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

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
          Budget Management
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
          Create, track, and analyze your budgets with real-time variance reporting
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Overview" />
          <Tab label="Budget Items" />
        </Tabs>
      </Box>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 0 ? renderOverviewTab() : renderBudgetsTab()}
        </motion.div>
      </AnimatePresence>

      {/* Add/Edit Budget Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingBudget ? 'Edit Budget' : 'Add New Budget'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Budget Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                >
                  {BUDGET_CATEGORIES.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Period</InputLabel>
                <Select
                  value={formData.period}
                  onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value as any }))}
                >
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Budget Amount"
                type="number"
                value={formData.budgetAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, budgetAmount: e.target.value }))}
                InputProps={{ startAdornment: '$' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveBudget}>
            {editingBudget ? 'Update' : 'Create'} Budget
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BudgetManager;