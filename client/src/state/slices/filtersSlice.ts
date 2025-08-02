import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DateRange {
  start: string;
  end: string;
}

export interface AmountRange {
  min: number;
  max: number;
}

export interface FiltersState {
  dateRange: DateRange | null;
  categories: string[];
  amountRange: AmountRange | null;
  searchTerm: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
  activeFilters: string[];
  savedFilters: Array<{
    id: string;
    name: string;
    filters: Partial<FiltersState>;
    createdAt: string;
  }>;
}

const initialState: FiltersState = {
  dateRange: null,
  categories: [],
  amountRange: null,
  searchTerm: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 25,
  activeFilters: [],
  savedFilters: [],
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<DateRange | null>) => {
      state.dateRange = action.payload;
      if (action.payload) {
        if (!state.activeFilters.includes('dateRange')) {
          state.activeFilters.push('dateRange');
        }
      } else {
        state.activeFilters = state.activeFilters.filter(f => f !== 'dateRange');
      }
    },
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
      if (action.payload.length > 0) {
        if (!state.activeFilters.includes('categories')) {
          state.activeFilters.push('categories');
        }
      } else {
        state.activeFilters = state.activeFilters.filter(f => f !== 'categories');
      }
    },
    addCategory: (state, action: PayloadAction<string>) => {
      if (!state.categories.includes(action.payload)) {
        state.categories.push(action.payload);
        if (!state.activeFilters.includes('categories')) {
          state.activeFilters.push('categories');
        }
      }
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(cat => cat !== action.payload);
      if (state.categories.length === 0) {
        state.activeFilters = state.activeFilters.filter(f => f !== 'categories');
      }
    },
    setAmountRange: (state, action: PayloadAction<AmountRange | null>) => {
      state.amountRange = action.payload;
      if (action.payload) {
        if (!state.activeFilters.includes('amountRange')) {
          state.activeFilters.push('amountRange');
        }
      } else {
        state.activeFilters = state.activeFilters.filter(f => f !== 'amountRange');
      }
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      if (action.payload.trim()) {
        if (!state.activeFilters.includes('searchTerm')) {
          state.activeFilters.push('searchTerm');
        }
      } else {
        state.activeFilters = state.activeFilters.filter(f => f !== 'searchTerm');
      }
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1; // Reset to first page when changing limit
    },
    clearAllFilters: (state) => {
      state.dateRange = null;
      state.categories = [];
      state.amountRange = null;
      state.searchTerm = '';
      state.activeFilters = [];
      state.page = 1;
    },
    clearFilter: (state, action: PayloadAction<string>) => {
      const filterType = action.payload;
      switch (filterType) {
        case 'dateRange':
          state.dateRange = null;
          break;
        case 'categories':
          state.categories = [];
          break;
        case 'amountRange':
          state.amountRange = null;
          break;
        case 'searchTerm':
          state.searchTerm = '';
          break;
      }
      state.activeFilters = state.activeFilters.filter(f => f !== filterType);
    },
    saveFilter: (state, action: PayloadAction<{
      name: string;
      filters: Partial<FiltersState>;
    }>) => {
      const savedFilter = {
        id: Date.now().toString(),
        name: action.payload.name,
        filters: action.payload.filters,
        createdAt: new Date().toISOString(),
      };
      state.savedFilters.push(savedFilter);
    },
    loadSavedFilter: (state, action: PayloadAction<string>) => {
      const savedFilter = state.savedFilters.find(f => f.id === action.payload);
      if (savedFilter) {
        const { filters } = savedFilter;
        state.dateRange = filters.dateRange || null;
        state.categories = filters.categories || [];
        state.amountRange = filters.amountRange || null;
        state.searchTerm = filters.searchTerm || '';
        state.sortBy = filters.sortBy || 'createdAt';
        state.sortOrder = filters.sortOrder || 'desc';
        state.activeFilters = filters.activeFilters || [];
        state.page = 1;
      }
    },
    deleteSavedFilter: (state, action: PayloadAction<string>) => {
      state.savedFilters = state.savedFilters.filter(f => f.id !== action.payload);
    },
    // Quick filter presets
    setQuickFilter: (state, action: PayloadAction<'today' | 'week' | 'month' | 'quarter' | 'year'>) => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (action.payload) {
        case 'today':
          state.dateRange = {
            start: today.toISOString().split('T')[0],
            end: today.toISOString().split('T')[0],
          };
          break;
        case 'week':
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          state.dateRange = {
            start: weekStart.toISOString().split('T')[0],
            end: weekEnd.toISOString().split('T')[0],
          };
          break;
        case 'month':
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          state.dateRange = {
            start: monthStart.toISOString().split('T')[0],
            end: monthEnd.toISOString().split('T')[0],
          };
          break;
        case 'quarter':
          const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
          const quarterEnd = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0);
          state.dateRange = {
            start: quarterStart.toISOString().split('T')[0],
            end: quarterEnd.toISOString().split('T')[0],
          };
          break;
        case 'year':
          const yearStart = new Date(now.getFullYear(), 0, 1);
          const yearEnd = new Date(now.getFullYear(), 11, 31);
          state.dateRange = {
            start: yearStart.toISOString().split('T')[0],
            end: yearEnd.toISOString().split('T')[0],
          };
          break;
      }
      
      if (!state.activeFilters.includes('dateRange')) {
        state.activeFilters.push('dateRange');
      }
      state.page = 1;
    },
  },
});

export const {
  setDateRange,
  setCategories,
  addCategory,
  removeCategory,
  setAmountRange,
  setSearchTerm,
  setSortBy,
  setSortOrder,
  setPage,
  setLimit,
  clearAllFilters,
  clearFilter,
  saveFilter,
  loadSavedFilter,
  deleteSavedFilter,
  setQuickFilter,
} = filtersSlice.actions;

export default filtersSlice.reducer;