import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  InputAdornment,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Hooks
import { useSearchTransactionsQuery } from '../state/api';

interface SearchBarProps {
  open: boolean;
  onClose: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Search query
  const {
    data: searchResults = [],
    isLoading,
    error,
  } = useSearchTransactionsQuery(
    { searchTerm: debouncedSearchTerm },
    { skip: !debouncedSearchTerm || debouncedSearchTerm.length < 2 }
  );

  const handleClose = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    onClose();
  };

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
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          mt: 8,
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <TextField
            fullWidth
            placeholder="Search transactions, buyers, amounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: isLoading && (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: theme.palette.background.elevated,
                '&:hover': {
                  backgroundColor: theme.palette.background.elevated,
                },
                '&.Mui-focused': {
                  backgroundColor: theme.palette.background.paper,
                },
              },
            }}
          />
        </Box>

        <Box sx={{ minHeight: 200, maxHeight: 400, overflow: 'auto' }}>
          <AnimatePresence>
            {!searchTerm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <SearchIcon
                    sx={{
                      fontSize: 48,
                      color: theme.palette.text.disabled,
                      mb: 2,
                    }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Search your data
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    Start typing to search transactions, buyers, or amounts
                  </Typography>
                  
                  <Box display="flex" gap={1} justifyContent="center" mt={3} flexWrap="wrap">
                    <Chip
                      label="Recent transactions"
                      size="small"
                      variant="outlined"
                      onClick={() => setSearchTerm('recent')}
                    />
                    <Chip
                      label="High amounts"
                      size="small"
                      variant="outlined"
                      onClick={() => setSearchTerm('>1000')}
                    />
                    <Chip
                      label="This month"
                      size="small"
                      variant="outlined"
                      onClick={() => setSearchTerm('month')}
                    />
                  </Box>
                </Box>
              </motion.div>
            )}

            {searchTerm && searchTerm.length < 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Type at least 2 characters to search
                  </Typography>
                </Box>
              </motion.div>
            )}

            {debouncedSearchTerm && debouncedSearchTerm.length >= 2 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {error ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="error">
                      Error searching. Please try again.
                    </Typography>
                  </Box>
                ) : searchResults.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No results found for "{debouncedSearchTerm}"
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    {searchResults.map((transaction) => (
                      <ListItem
                        key={transaction.id}
                        sx={{
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                          },
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          // Handle transaction selection
                          handleClose();
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              backgroundColor: theme.palette.primary.main,
                              width: 40,
                              height: 40,
                            }}
                          >
                            <ReceiptIcon fontSize="small" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="body1" fontWeight={500}>
                                {transaction.buyer}
                              </Typography>
                              <Typography
                                variant="body1"
                                fontWeight={600}
                                color="success.main"
                              >
                                {formatCurrency(transaction.amount)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                              <Typography variant="caption" color="text.secondary">
                                Transaction ID: {transaction.id}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(transaction.createdAt)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {searchResults.length > 0 && (
          <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Showing {searchResults.length} results
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchBar;