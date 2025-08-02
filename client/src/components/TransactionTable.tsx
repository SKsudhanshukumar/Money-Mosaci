import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Box,
  Pagination,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Transaction } from '../state/api';

interface TransactionTableProps {
  transactions: Transaction[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  selectedItems: string[];
  onSelectionChange: (ids: string[]) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
  selectedItems,
  onSelectionChange,
}) => {
  const theme = useTheme();

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      onSelectionChange(transactions.map(t => t.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (id: string) => {
    const selectedIndex = selectedItems.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedItems, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedItems.slice(1));
    } else if (selectedIndex === selectedItems.length - 1) {
      newSelected = newSelected.concat(selectedItems.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedItems.slice(0, selectedIndex),
        selectedItems.slice(selectedIndex + 1),
      );
    }

    onSelectionChange(newSelected);
  };

  const isSelected = (id: string) => selectedItems.indexOf(id) !== -1;
  const isAllSelected = transactions.length > 0 && selectedItems.length === transactions.length;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < transactions.length;

  const getStatusColor = (amount: number) => {
    return amount > 0 ? 'success' : 'error';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
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
      transition={{ duration: 0.3 }}
    >
      <Paper
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.background.elevated }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Transaction
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Buyer
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Amount
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Date
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Status
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Actions
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction, index) => {
                const isItemSelected = isSelected(transaction.id);
                
                return (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    component={TableRow}
                    hover
                    selected={isItemSelected}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={() => handleSelectOne(transaction.id)}
                        color="primary"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: theme.palette.primary.main,
                          }}
                        >
                          <ReceiptIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            Transaction #{transaction.id.slice(-6)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {transaction.productIds.length} product{transaction.productIds.length !== 1 ? 's' : ''}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {transaction.buyer}
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="right">
                      <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                        {transaction.amount > 0 ? (
                          <TrendingUpIcon 
                            fontSize="small" 
                            sx={{ color: theme.palette.success.main }} 
                          />
                        ) : (
                          <TrendingDownIcon 
                            fontSize="small" 
                            sx={{ color: theme.palette.error.main }} 
                          />
                        )}
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color={getStatusColor(transaction.amount)}
                        >
                          {formatCurrency(transaction.amount)}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(transaction.createdAt)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label="Completed"
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    
                    <TableCell align="center">
                      <Tooltip title="More actions">
                        <IconButton size="small">
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Pagination */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          borderTop={`1px solid ${theme.palette.divider}`}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {((currentPage - 1) * 25) + 1} to {Math.min(currentPage * 25, totalCount)} of {totalCount} entries
          </Typography>
          
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Box>
      </Paper>
    </motion.div>
  );
};

export default TransactionTable;