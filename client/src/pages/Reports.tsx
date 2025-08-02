import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Description as CsvIcon,
  Download as DownloadIcon,
  Schedule as ScheduleIcon,
  Email as EmailIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { motion } from 'framer-motion';

// Hooks and State
import { useExportDataMutation } from '../state/api';
import { useAppDispatch } from '../hooks/redux';
import { addNotification } from '../state/slices/uiSlice';

const REPORT_TEMPLATES = [
  {
    id: 'financial-summary',
    name: 'Financial Summary',
    description: 'Complete overview of revenue, expenses, and profit',
    icon: <AssessmentIcon />,
    formats: ['pdf', 'excel'],
    lastGenerated: '2024-01-15',
  },
  {
    id: 'transaction-report',
    name: 'Transaction Report',
    description: 'Detailed list of all transactions with filters',
    icon: <CsvIcon />,
    formats: ['csv', 'excel', 'pdf'],
    lastGenerated: '2024-01-14',
  },
  {
    id: 'monthly-analysis',
    name: 'Monthly Analysis',
    description: 'Month-over-month performance analysis',
    icon: <AssessmentIcon />,
    formats: ['pdf', 'excel'],
    lastGenerated: '2024-01-10',
  },
  {
    id: 'product-performance',
    name: 'Product Performance',
    description: 'Analysis of top-performing products and categories',
    icon: <AssessmentIcon />,
    formats: ['pdf', 'excel', 'csv'],
    lastGenerated: '2024-01-12',
  },
];

const SCHEDULED_REPORTS = [
  {
    id: 'weekly-summary',
    name: 'Weekly Financial Summary',
    frequency: 'Weekly',
    nextRun: '2024-01-22',
    format: 'pdf',
    recipients: ['admin@company.com'],
  },
  {
    id: 'monthly-report',
    name: 'Monthly Performance Report',
    frequency: 'Monthly',
    nextRun: '2024-02-01',
    format: 'excel',
    recipients: ['finance@company.com', 'ceo@company.com'],
  },
];

const Reports: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();

  const [exportData] = useExportDataMutation();
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [reportConfig, setReportConfig] = useState({
    format: 'pdf',
    dateRange: {
      start: null as Date | null,
      end: null as Date | null,
    },
    includeCharts: true,
    includeDetails: true,
  });

  const handleGenerateReport = async (reportId: string, format: string) => {
    try {
      const blob = await exportData({
        type: format as 'csv' | 'excel' | 'pdf',
        data: 'analytics',
        filters: {
          dateRange: reportConfig.dateRange.start && reportConfig.dateRange.end ? {
            start: reportConfig.dateRange.start.toISOString().split('T')[0],
            end: reportConfig.dateRange.end.toISOString().split('T')[0],
          } : undefined,
        },
      }).unwrap();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportId}-report.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      dispatch(addNotification({
        type: 'success',
        message: `Report generated successfully as ${format.toUpperCase()}`,
      }));

      setGenerateDialogOpen(false);
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to generate report',
      }));
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return <PdfIcon sx={{ color: '#d32f2f' }} />;
      case 'excel':
        return <ExcelIcon sx={{ color: '#2e7d32' }} />;
      case 'csv':
        return <CsvIcon sx={{ color: '#1976d2' }} />;
      default:
        return <AssessmentIcon />;
    }
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
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Reports & Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Generate comprehensive financial reports and schedule automated deliveries.
          </Typography>
        </Box>

        {/* Quick Actions */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                },
              }}
              onClick={() => setGenerateDialogOpen(true)}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <AssessmentIcon
                  sx={{
                    fontSize: 48,
                    color: theme.palette.primary.main,
                    mb: 2,
                  }}
                />
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Generate Report
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create custom financial reports
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                },
              }}
              onClick={() => setScheduleDialogOpen(true)}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <ScheduleIcon
                  sx={{
                    fontSize: 48,
                    color: theme.palette.secondary.main,
                    mb: 2,
                  }}
                />
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Schedule Reports
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Automate report generation
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <EmailIcon
                  sx={{
                    fontSize: 48,
                    color: theme.palette.success.main,
                    mb: 2,
                  }}
                />
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Email Reports
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Send reports via email
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <AddIcon
                  sx={{
                    fontSize: 48,
                    color: theme.palette.warning.main,
                    mb: 2,
                  }}
                />
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Custom Template
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create custom report templates
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Report Templates */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} lg={8}>
            <Card
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Report Templates
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Pre-built report templates for common financial analyses
                </Typography>

                <Grid container spacing={2}>
                  {REPORT_TEMPLATES.map((template) => (
                    <Grid item xs={12} sm={6} key={template.id}>
                      <Card
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            boxShadow: theme.shadows[2],
                          },
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
                            <Box
                              sx={{
                                p: 1,
                                borderRadius: 1,
                                backgroundColor: `${theme.palette.primary.main}12`,
                                color: theme.palette.primary.main,
                              }}
                            >
                              {template.icon}
                            </Box>
                            <Box flex={1}>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {template.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {template.description}
                              </Typography>
                            </Box>
                          </Box>

                          <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                            {template.formats.map((format) => (
                              <Chip
                                key={format}
                                icon={getFormatIcon(format)}
                                label={format.toUpperCase()}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>

                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="caption" color="text.secondary">
                              Last: {template.lastGenerated}
                            </Typography>
                            <Button
                              size="small"
                              startIcon={<DownloadIcon />}
                              onClick={() => {
                                setSelectedReport(template.id);
                                setGenerateDialogOpen(true);
                              }}
                              sx={{ textTransform: 'none' }}
                            >
                              Generate
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Scheduled Reports */}
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                height: 'fit-content',
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={600}>
                    Scheduled Reports
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setScheduleDialogOpen(true)}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>

                <List sx={{ p: 0 }}>
                  {SCHEDULED_REPORTS.map((report, index) => (
                    <React.Fragment key={report.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <ScheduleIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight={500}>
                              {report.name}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {report.frequency} • Next: {report.nextRun}
                              </Typography>
                              <Box display="flex" gap={0.5} mt={0.5}>
                                <Chip
                                  label={report.format.toUpperCase()}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.65rem', height: 20 }}
                                />
                              </Box>
                            </Box>
                          }
                        />
                        <Box display="flex" gap={0.5}>
                          <IconButton size="small">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </ListItem>
                      {index < SCHEDULED_REPORTS.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Generate Report Dialog */}
        <Dialog
          open={generateDialogOpen}
          onClose={() => setGenerateDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Generate Report</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={3} pt={1}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={selectedReport}
                  onChange={(e) => setSelectedReport(e.target.value)}
                  label="Report Type"
                >
                  {REPORT_TEMPLATES.map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Format</InputLabel>
                <Select
                  value={reportConfig.format}
                  onChange={(e) => setReportConfig({ ...reportConfig, format: e.target.value })}
                  label="Format"
                >
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="excel">Excel</MenuItem>
                  <MenuItem value="csv">CSV</MenuItem>
                </Select>
              </FormControl>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box display="flex" gap={2}>
                  <DatePicker
                    label="Start Date"
                    value={reportConfig.dateRange.start}
                    onChange={(date) => setReportConfig({
                      ...reportConfig,
                      dateRange: { ...reportConfig.dateRange, start: date }
                    })}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                  <DatePicker
                    label="End Date"
                    value={reportConfig.dateRange.end}
                    onChange={(date) => setReportConfig({
                      ...reportConfig,
                      dateRange: { ...reportConfig.dateRange, end: date }
                    })}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Box>
              </LocalizationProvider>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setGenerateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => handleGenerateReport(selectedReport, reportConfig.format)}
              disabled={!selectedReport}
            >
              Generate Report
            </Button>
          </DialogActions>
        </Dialog>

        {/* Schedule Report Dialog */}
        <Dialog
          open={scheduleDialogOpen}
          onClose={() => setScheduleDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Schedule Report</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={3} pt={1}>
              <TextField
                fullWidth
                label="Report Name"
                placeholder="Enter report name"
              />
              
              <FormControl fullWidth>
                <InputLabel>Report Template</InputLabel>
                <Select label="Report Template">
                  {REPORT_TEMPLATES.map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select label="Frequency">
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Email Recipients"
                placeholder="Enter email addresses separated by commas"
                multiline
                rows={2}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained">
              Schedule Report
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </motion.div>
  );
};

export default Reports;