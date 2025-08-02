import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  sidebarOpen: boolean;
  loading: boolean;
  error: string | null;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: number;
  }>;
  modals: {
    csvUpload: boolean;
    transactionDetails: boolean;
    productDetails: boolean;
    exportData: boolean;
  };
  selectedItems: {
    transactions: string[];
    products: string[];
  };
  viewMode: 'grid' | 'list' | 'table';
  pageSize: number;
}

const initialState: UIState = {
  sidebarOpen: true,
  loading: false,
  error: null,
  notifications: [],
  modals: {
    csvUpload: false,
    transactionDetails: false,
    productDetails: false,
    exportData: false,
  },
  selectedItems: {
    transactions: [],
    products: [],
  },
  viewMode: 'table',
  pageSize: 25,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addNotification: (state, action: PayloadAction<{
      type: 'success' | 'error' | 'warning' | 'info';
      message: string;
    }>) => {
      const notification = {
        id: Date.now().toString(),
        ...action.payload,
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = false;
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((key) => {
        state.modals[key as keyof UIState['modals']] = false;
      });
    },
    selectItem: (state, action: PayloadAction<{
      type: 'transactions' | 'products';
      id: string;
    }>) => {
      const { type, id } = action.payload;
      if (!state.selectedItems[type].includes(id)) {
        state.selectedItems[type].push(id);
      }
    },
    deselectItem: (state, action: PayloadAction<{
      type: 'transactions' | 'products';
      id: string;
    }>) => {
      const { type, id } = action.payload;
      state.selectedItems[type] = state.selectedItems[type].filter(
        (itemId) => itemId !== id
      );
    },
    selectAllItems: (state, action: PayloadAction<{
      type: 'transactions' | 'products';
      ids: string[];
    }>) => {
      const { type, ids } = action.payload;
      state.selectedItems[type] = ids;
    },
    clearSelection: (state, action: PayloadAction<'transactions' | 'products'>) => {
      state.selectedItems[action.payload] = [];
    },
    setViewMode: (state, action: PayloadAction<'grid' | 'list' | 'table'>) => {
      state.viewMode = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setLoading,
  setError,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
  selectItem,
  deselectItem,
  selectAllItems,
  clearSelection,
  setViewMode,
  setPageSize,
} = uiSlice.actions;

export default uiSlice.reducer;