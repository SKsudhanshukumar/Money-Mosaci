import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Grid,
  Divider,
  Tooltip,
  Badge,
  useTheme,
  useMediaQuery,
  Collapse,
  Paper,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Download as DownloadIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Sort as SortIcon,
  DateRange as DateRangeIcon,
  AttachMoney as AttachMoneyIcon,
  Category as CategoryIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { motion, AnimatePresence } from 'framer-motion';

// Hooks and State
import { useGetTransactionsQuery, useSearchTransactionsQuery, useExportDataMutation } from '../state/api';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  setSearchTerm,
  setDateRange,
  setAmountRange,
  setCategories,
  setSortBy,
  setSortOrder,
  setPage,
  setLimit,
  clearAllFilters,
  clearFilter,
  setQuickFilter,
} from '../state/slices/filtersSlice';
import {
  setViewMode,
  selectAllItems,
  clearSelection,
  addNotification,
} from '../state/slices/uiSlice';

// Components
import TransactionTable from '../components/TransactionTable';
import TransactionGrid from '../components/TransactionGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Travel',
  'Education',
  'Business',
  'Other',
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date' },
  { value: 'amount', label: 'Amount' },
  { value: 'buyer', label: 'Buyer' },
];

const QUICK_FILTERS = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
];

const Transactions: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();

  // Redux state
  const filters = useAppSelector((state) => state.filters);
  const { viewMode, selectedItems } = useAppSelector((state) => state.ui);

  // Local state
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);

  // API queries
  const {
    data: transactionsData,
    isLoading,
    error,
    refetch,
  } = useGetTransactionsQuery({
    searchTerm: filters.searchTerm,
    dateRange: filters.dateRange,
    amountRange: filters.amountRange,
    categories: filters.categories,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    page: filters.page,
    limit: filters.limit,
  });

  const [exportData] = useExportDataMutation();

  // Computed values
  const transactions = transactionsData?.data || [];
  const totalCount = transactionsData?.total || 0;
  const totalPages = transactionsData?.totalPages || 1;
  const activeFiltersCount = filters.activeFilters.length;

  // Handlers
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(event.target.value));
    dispatch(setPage(1));
  };

  const handleDateRangeChange = (field: 'start' | 'end', date: Date | null) => {
    const currentRange = filters.dateRange || { start: '', end: '' };
    const newRange = {
      ...currentRange,
      [field]: date ? date.toISOString().split('T')[0] : '',
    };
    
    if (newRange.start || newRange.end) {
      dispatch(setDateRange(newRange));
    } else {
      dispatch(setDateRange(null));
    }
    dispatch(setPage(1));
  };

  const handleAmountRangeChange = (field: 'min' | 'max', value: string) => {
    const currentRange = filters.amountRange || { min: 0, max: 0 };
    const numValue = parseFloat(value) || 0;
    const newRange = {
      ...currentRange,
      [field]: numValue,
    };
    
    if (newRange.min > 0 || newRange.max > 0) {
      dispatch(setAmountRange(newRange));
    } else {
      dispatch(setAmountRange(null));
    }
    dispatch(setPage(1));
  };

  const handleCategoriesChange = (event: any) => {
    const value = event.target.value;
    dispatch(setCategories(typeof value === 'string' ? value.split(',') : value));
    dispatch(setPage(1));
  };

  const handleSortChange = (sortBy: string) => {
    if (filters.sortBy === sortBy) {
      dispatch(setSortOrder(filters.sortOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      dispatch(setSortBy(sortBy));
      dispatch(setSortOrder('desc'));
    }
    setSortMenuAnchor(null);
  };

  const handleQuickFilter = (period: string) => {
    dispatch(setQuickFilter(period as any));
  };

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    try {
      const blob = await exportData({
        type: format,
        data: 'transactions',
        filters: {
          searchTerm: filters.searchTerm,
          dateRange: filters.dateRange,
          amountRange: filters.amountRange,
          categories: filters.categories,
        },
      }).unwrap();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      dispatch(addNotification({
        type: 'success',
        message: `Transactions exported as ${format.toUpperCase()}`,
      }));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to export transactions',
      }));
    }
    setExportMenuAnchor(null);
  };

  const handleClearFilters = () => {
    dispatch(clearAllFilters());
    dispatch(clearSelection('transactions'));
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const handleLimitChange = (limit: number) => {
    dispatch(setLimit(limit));
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading transactions..." />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load transactions" onRetry={refetch} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box>
        {/* Header */}
        <Box mb={3}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Transactions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and analyze your financial transactions with advanced filtering and search.
          </Typography>
        </Box>

        {/* Search and Filter Bar */}
        <Card sx={{ mb: 3, border: `1px solid ${theme.palette.divider}` }}>
          <CardContent sx={{ pb: 2 }}>
            {/* Main Search Bar */}
            <Box display="flex" gap={2} mb={2} flexWrap="wrap">
              <TextField
                placeholder="Search transactions..."
                value={filters.searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  endAdornment: filters.searchTerm && (
                    <IconButton
                      size="small"
                      onClick={() => dispatch(setSearchTerm(''))}
                    >
                      <ClearIcon />
                    </IconButton>
                  ),
                }}
                sx={{ flex: 1, minWidth: 300 }}
              />

              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                sx={{ textTransform: 'none' }}
              >
                <Badge badgeContent={activeFiltersCount} color="primary">
                  Filters
                </Badge>
                {filtersExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Button>

              <IconButton
                onClick={(e) => setSortMenuAnchor(e.currentTarget)}
                sx={{ border: `1px solid ${theme.palette.divider}` }}
              >
                <SortIcon />
              </IconButton>

              <IconButton
                onClick={(e) => setExportMenuAnchor(e.currentTarget)}
                sx={{ border: `1px solid ${theme.palette.divider}` }}
              >
                <DownloadIcon />
              </IconButton>

              <Box display="flex" gap={1}>
                <Tooltip title="Table View">
                  <IconButton
                    onClick={() => dispatch(setViewMode('table'))}
                    color={viewMode === 'table' ? 'primary' : 'default'}
                  >
                    <ViewListIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Grid View">
                  <IconButton
                    onClick={() => dispatch(setViewMode('grid'))}
                    color={viewMode === 'grid' ? 'primary' : 'default'}
                  >
                    <ViewModuleIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Quick Filters */}
            <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
              {QUICK_FILTERS.map((filter) => (
                <Chip
                  key={filter.value}
                  label={filter.label}
                  onClick={() => handleQuickFilter(filter.value)}
                  variant="outlined"
                  size="small"
                  sx={{ textTransform: 'none' }}
                />
              ))}
            </Box>

            {/* Advanced Filters */}
            <Collapse in={filtersExpanded}>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                {/* Date Range */}
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box display="flex" gap={2} alignItems="center">
                      <DateRangeIcon color="action" />
                      <DatePicker
                        label="Start Date"
                        value={filters.dateRange?.start ? new Date(filters.dateRange.start) : null}
                        onChange={(date) => handleDateRangeChange('start', date)}
                        slotProps={{ textField: { size: 'small', sx: { flex: 1 } } }}
                      />
                      <DatePicker
                        label="End Date"
                        value={filters.dateRange?.end ? new Date(filters.dateRange.end) : null}
                        onChange={(date) => handleDateRangeChange('end', date)}
                        slotProps={{ textField: { size: 'small', sx: { flex: 1 } } }}
                      />
                    </Box>
                  </LocalizationProvider>
                </Grid>

                {/* Amount Range */}
                <Grid item xs={12} md={6}>
                  <Box display="flex" gap={2} alignItems="center">
                    <AttachMoneyIcon color="action" />
                    <TextField
                      label="Min Amount"
                      type="number"
                      size="small"
                      value={filters.amountRange?.min || ''}
                      onChange={(e) => handleAmountRangeChange('min', e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      label="Max Amount"
                      type="number"
                      size="small"
                      value={filters.amountRange?.max || ''}
                      onChange={(e) => handleAmountRangeChange('max', e.target.value)}
                      sx={{ flex: 1 }}
                    />
                  </Box>
                </Grid>

                {/* Categories */}
                <Grid item xs={12}>
                  <Box display="flex" gap={2} alignItems="center">
                    <CategoryIcon color="action" />
                    <FormControl sx={{ flex: 1 }}>
                      <InputLabel>Categories</InputLabel>
                      <Select
                        multiple
                        value={filters.categories}
                        onChange={handleCategoriesChange}
                        input={<OutlinedInput label="Categories" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} size="small" />
                            ))}
                          </Box>
                        )}
                      >
                        {CATEGORIES.map((category) => (
                          <MenuItem key={category} value={category}>
                            <Checkbox checked={filters.categories.indexOf(category) > -1} />
                            <ListItemText primary={category} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>

              {/* Filter Actions */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                <Typography variant="body2" color="text.secondary">
                  {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} applied
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleClearFilters}
                  disabled={activeFiltersCount === 0}
                  sx={{ textTransform: 'none' }}
                >
                  Clear All Filters
                </Button>
              </Box>
            </Collapse>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <Box mt={2}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {filters.searchTerm && (
                    <Chip
                      label={`Search: "${filters.searchTerm}"`}
                      onDelete={() => dispatch(clearFilter('searchTerm'))}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {filters.dateRange && (
                    <Chip
                      label={`Date: ${filters.dateRange.start} - ${filters.dateRange.end}`}
                      onDelete={() => dispatch(clearFilter('dateRange'))}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {filters.amountRange && (
                    <Chip
                      label={`Amount: $${filters.amountRange.min} - $${filters.amountRange.max}`}
                      onDelete={() => dispatch(clearFilter('amountRange'))}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {filters.categories.length > 0 && (
                    <Chip
                      label={`Categories: ${filters.categories.length} selected`}
                      onDelete={() => dispatch(clearFilter('categories'))}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Stack>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Results Summary */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="body2" color="text.secondary">
            Showing {transactions.length} of {totalCount.toLocaleString()} transactions
          </Typography>
          <Box display="flex" gap={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Show:
            </Typography>
            <Select
              size="small"
              value={filters.limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </Box>
        </Box>

        {/* Transactions Display */}
        <AnimatePresence mode="wait">
          {viewMode === 'table' ? (
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TransactionTable
                transactions={transactions}
                totalCount={totalCount}
                currentPage={filters.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                selectedItems={selectedItems.transactions}
                onSelectionChange={(ids) => dispatch(selectAllItems({ type: 'transactions', ids }))}
              />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TransactionGrid
                transactions={transactions}
                totalCount={totalCount}
                currentPage={filters.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sort Menu */}
        <Menu
          anchorEl={sortMenuAnchor}
          open={Boolean(sortMenuAnchor)}
          onClose={() => setSortMenuAnchor(null)}
        >
          {SORT_OPTIONS.map((option) => (
            <MenuItem
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              selected={filters.sortBy === option.value}
            >
              {option.label}
              {filters.sortBy === option.value && (
                <Typography variant="caption" sx={{ ml: 1 }}>
                  ({filters.sortOrder === 'asc' ? '↑' : '↓'})
                </Typography>
              )}
            </MenuItem>
          ))}
        </Menu>

        {/* Export Menu */}
        <Menu
          anchorEl={exportMenuAnchor}
          open={Boolean(exportMenuAnchor)}
          onClose={() => setExportMenuAnchor(null)}
        >
          <MenuItem onClick={() => handleExport('csv')}>
            Export as CSV
          </MenuItem>
          <MenuItem onClick={() => handleExport('excel')}>
            Export as Excel
          </MenuItem>
          <MenuItem onClick={() => handleExport('pdf')}>
            Export as PDF
          </MenuItem>
        </Menu>
      </Box>
    </motion.div>
  );
};

export default Transactions;