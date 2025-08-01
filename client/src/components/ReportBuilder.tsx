import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGetKpisQuery } from '../state/api';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface ReportConfig {
  name: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  metrics: string[];
  chartType: 'line' | 'bar' | 'area';
  groupBy: 'month' | 'quarter' | 'year';
  includeComparison: boolean;
  includeProjections: boolean;
}

const AVAILABLE_METRICS = [
  { id: 'revenue', label: 'Revenue', color: '#3f51b5' },
  { id: 'expenses', label: 'Expenses', color: '#f44336' },
  { id: 'profit', label: 'Profit', color: '#4caf50' },
  { id: 'operationalExpenses', label: 'Operational Expenses', color: '#ff9800' },
  { id: 'nonOperationalExpenses', label: 'Non-Operational Expenses', color: '#9c27b0' },
  { id: 'profitMargin', label: 'Profit Margin %', color: '#00bcd4' },
];

const ReportBuilder: React.FC = () => {
  const theme = useTheme();
  const { data: kpiData } = useGetKpisQuery();
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    name: '',
    dateRange: { start: null, end: null },
    metrics: ['revenue', 'expenses'],
    chartType: 'line',
    groupBy: 'month',
    includeComparison: false,
    includeProjections: false,
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [savedReports, setSavedReports] = useState<ReportConfig[]>([]);

  const processedData = useMemo(() => {
    if (!kpiData || !kpiData[0]) return [];

    const monthlyData = kpiData[0].monthlyData;
    
    return monthlyData.map((month, index) => {
      const revenue = parseFloat(month.revenue.replace(/[$,]/g, ''));
      const expenses = parseFloat(month.expenses.replace(/[$,]/g, ''));
      const operationalExpenses = parseFloat(month.operationalExpenses.replace(/[$,]/g, ''));
      const nonOperationalExpenses = parseFloat(month.nonOperationalExpenses.replace(/[$,]/g, ''));
      const profit = revenue - expenses;
      const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

      return {
        name: month.month.substring(0, 3),
        month: month.month,
        revenue,
        expenses,
        profit,
        operationalExpenses,
        nonOperationalExpenses,
        profitMargin,
      };
    });
  }, [kpiData]);

  const handleMetricToggle = (metricId: string) => {
    setReportConfig(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metricId)
        ? prev.metrics.filter(m => m !== metricId)
        : [...prev.metrics, metricId]
    }));
  };

  const handleSaveReport = () => {
    if (reportConfig.name.trim()) {
      setSavedReports(prev => [...prev, { ...reportConfig }]);
      setReportConfig(prev => ({ ...prev, name: '' }));
    }
  };

  const handleLoadReport = (report: ReportConfig) => {
    setReportConfig(report);
  };

  const handleDeleteReport = (index: number) => {
    setSavedReports(prev => prev.filter((_, i) => i !== index));
  };

  const renderChart = () => {
    const chartData = processedData.filter(item => 
      reportConfig.metrics.some(metric => item[metric as keyof typeof item] !== undefined)
    );

    const chartProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    const renderLines = () => reportConfig.metrics.map(metric => {
      const metricConfig = AVAILABLE_METRICS.find(m => m.id === metric);
      if (!metricConfig) return null;

      switch (reportConfig.chartType) {
        case 'line':
          return (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              stroke={metricConfig.color}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          );
        case 'bar':
          return (
            <Bar
              key={metric}
              dataKey={metric}
              fill={metricConfig.color}
              radius={[2, 2, 0, 0]}
            />
          );
        case 'area':
          return (
            <Area
              key={metric}
              type="monotone"
              dataKey={metric}
              stroke={metricConfig.color}
              fill={`${metricConfig.color}30`}
              strokeWidth={2}
            />
          );
        default:
          return null;
      }
    });

    const ChartComponent = {
      line: LineChart,
      bar: BarChart,
      area: AreaChart,
    }[reportConfig.chartType];

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent {...chartProps}>
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
          <Legend />
          {renderLines()}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            mb: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Custom Report Builder
        </Typography>

        <Grid container spacing={3}>
          {/* Configuration Panel */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: 'fit-content' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Report Configuration
                </Typography>

                <TextField
                  fullWidth
                  label="Report Name"
                  value={reportConfig.name}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
                  sx={{ mb: 2 }}
                />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Select Metrics
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {AVAILABLE_METRICS.map(metric => (
                      <Chip
                        key={metric.id}
                        label={metric.label}
                        onClick={() => handleMetricToggle(metric.id)}
                        color={reportConfig.metrics.includes(metric.id) ? 'primary' : 'default'}
                        variant={reportConfig.metrics.includes(metric.id) ? 'filled' : 'outlined'}
                        sx={{ 
                          borderColor: metric.color,
                          color: reportConfig.metrics.includes(metric.id) ? 'white' : metric.color,
                          backgroundColor: reportConfig.metrics.includes(metric.id) ? metric.color : 'transparent',
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Chart Type</InputLabel>
                  <Select
                    value={reportConfig.chartType}
                    onChange={(e) => setReportConfig(prev => ({ 
                      ...prev, 
                      chartType: e.target.value as 'line' | 'bar' | 'area' 
                    }))}
                  >
                    <MenuItem value="line">Line Chart</MenuItem>
                    <MenuItem value="bar">Bar Chart</MenuItem>
                    <MenuItem value="area">Area Chart</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Group By</InputLabel>
                  <Select
                    value={reportConfig.groupBy}
                    onChange={(e) => setReportConfig(prev => ({ 
                      ...prev, 
                      groupBy: e.target.value as 'month' | 'quarter' | 'year' 
                    }))}
                  >
                    <MenuItem value="month">Month</MenuItem>
                    <MenuItem value="quarter">Quarter</MenuItem>
                    <MenuItem value="year">Year</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Switch
                      checked={reportConfig.includeComparison}
                      onChange={(e) => setReportConfig(prev => ({ 
                        ...prev, 
                        includeComparison: e.target.checked 
                      }))}
                    />
                  }
                  label="Include Year-over-Year Comparison"
                  sx={{ mb: 1 }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={reportConfig.includeProjections}
                      onChange={(e) => setReportConfig(prev => ({ 
                        ...prev, 
                        includeProjections: e.target.checked 
                      }))}
                    />
                  }
                  label="Include Future Projections"
                  sx={{ mb: 2 }}
                />

                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                  <Button
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    onClick={() => setPreviewOpen(true)}
                    disabled={reportConfig.metrics.length === 0}
                  >
                    Preview Report
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveReport}
                    disabled={!reportConfig.name.trim()}
                  >
                    Save Report
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Saved Reports */}
            {savedReports.length > 0 && (
              <Card sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Saved Reports
                  </Typography>
                  {savedReports.map((report, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">{report.name}</Typography>
                      <Box>
                        <Button
                          size="small"
                          onClick={() => handleLoadReport(report)}
                        >
                          Load
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDeleteReport(index)}
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Preview Panel */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Report Preview
                </Typography>
                
                {reportConfig.metrics.length > 0 ? (
                  <Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Metrics: {reportConfig.metrics.map(m => 
                          AVAILABLE_METRICS.find(metric => metric.id === m)?.label
                        ).join(', ')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Chart Type: {reportConfig.chartType} | Group By: {reportConfig.groupBy}
                      </Typography>
                    </Box>
                    {renderChart()}
                  </Box>
                ) : (
                  <Box 
                    sx={{ 
                      height: 400, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'text.secondary'
                    }}
                  >
                    Select metrics to preview your report
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Preview Dialog */}
        <Dialog
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            Report Preview: {reportConfig.name || 'Untitled Report'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ height: 500 }}>
              {renderChart()}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPreviewOpen(false)}>Close</Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => {
                // TODO: Implement export functionality
                console.log('Exporting report...', reportConfig);
              }}
            >
              Export PDF
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default ReportBuilder;