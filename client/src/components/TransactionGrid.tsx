import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
  IconButton,
  Pagination,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Transaction } from '../state/api';

interface TransactionGridProps {
  transactions: Transaction[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const TransactionGrid: React.FC<TransactionGridProps> = ({
  transactions,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const theme = useTheme();

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

  const getStatusColor = (amount: number) => {
    return amount > 0 ? 'success' : 'error';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Grid container spacing={3}>
        {transactions.map((transaction, index) => (
          <Grid item xs={12} sm={6} lg={4} key={transaction.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card
                sx={{
                  height: '100%',
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          backgroundColor: theme.palette.primary.main,
                        }}
                      >
                        <ReceiptIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          #{transaction.id.slice(-6)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Transaction ID
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Tooltip title="More actions">
                      <IconButton size="small">
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {/* Buyer Info */}
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <PersonIcon fontSize="small" color="action" />
                    <Typography variant="body2" fontWeight={500}>
                      {transaction.buyer}
                    </Typography>
                  </Box>

                  {/* Amount */}
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Amount
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
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
                        variant="h6"
                        fontWeight={600}
                        color={getStatusColor(transaction.amount)}
                      >
                        {formatCurrency(transaction.amount)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Products */}
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Products
                    </Typography>
                    <Chip
                      label={`${transaction.productIds.length} item${transaction.productIds.length !== 1 ? 's' : ''}`}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  </Box>

                  {/* Date */}
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Date
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatDate(transaction.createdAt)}
                    </Typography>
                  </Box>

                  {/* Status */}
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label="Completed"
                      size="small"
                      color="success"
                      variant="filled"
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={4}
        p={2}
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
    </motion.div>
  );
};

export default TransactionGrid;