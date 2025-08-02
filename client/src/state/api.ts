import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Types
export interface KPI {
  id: string;
  _id: string;
  __v: number;
  totalProfit: number | string;
  totalRevenue: number | string;
  totalExpenses: number | string;
  expensesByCategory: Record<string, number | string>;
  monthlyData: Array<{
    id: string;
    month: string;
    revenue: number | string;
    expenses: number | string;
    nonOperationalExpenses: number | string;
    operationalExpenses: number | string;
  }>;
  dailyData: Array<{
    id: string;
    date: string;
    revenue: number | string;
    expenses: number | string;
  }>;
}

export interface Product {
  id: string;
  _id: string;
  __v: number;
  price: number;
  expense: number;
  transactions: string[];
}

export interface Transaction {
  id: string;
  _id: string;
  __v: number;
  buyer: string;
  amount: number;
  productIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CSVData {
  id: string;
  filename: string;
  uploadDate: string;
  data: Record<string, any>[];
  summary: {
    totalRows: number;
    columns: string[];
    dataTypes: Record<string, string>;
  };
}

export interface FilterOptions {
  dateRange?: {
    start: string;
    end: string;
  };
  categories?: string[];
  amountRange?: {
    min: number;
    max: number;
  };
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// API Base URL
const baseUrl = import.meta.env.PROD 
  ? 'https://your-production-api.com' 
  : 'http://localhost:9000';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Add auth token if available
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['KPI', 'Product', 'Transaction', 'CSVData'],
  endpoints: (builder) => ({
    // KPI Endpoints
    getKpis: builder.query<KPI[], void>({
      query: () => '/kpi',
      providesTags: ['KPI'],
    }),
    
    // Product Endpoints
    getProducts: builder.query<Product[], FilterOptions | void>({
      query: (filters) => ({
        url: '/product',
        params: filters || {},
      }),
      providesTags: ['Product'],
    }),
    
    // Transaction Endpoints
    getTransactions: builder.query<{
      data: Transaction[];
      total: number;
      page: number;
      totalPages: number;
    }, FilterOptions | void>({
      query: (filters) => ({
        url: '/transaction',
        params: filters || {},
      }),
      providesTags: ['Transaction'],
    }),
    
    // Advanced transaction search
    searchTransactions: builder.query<Transaction[], {
      searchTerm: string;
      filters?: FilterOptions;
    }>({
      query: ({ searchTerm, filters = {} }) => ({
        url: '/transaction/search',
        params: { q: searchTerm, ...filters },
      }),
      providesTags: ['Transaction'],
    }),
    
    // CSV Data Endpoints
    uploadCSV: builder.mutation<CSVData, FormData>({
      query: (formData) => ({
        url: '/api/csv-data/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['CSVData'],
    }),
    
    getCSVData: builder.query<CSVData[], void>({
      query: () => '/api/csv-data',
      providesTags: ['CSVData'],
    }),
    
    getCSVDataById: builder.query<CSVData, string>({
      query: (id) => `/api/csv-data/${id}`,
      providesTags: ['CSVData'],
    }),
    
    deleteCSVData: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/csv-data/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CSVData'],
    }),
    
    // Analytics Endpoints
    getAnalytics: builder.query<{
      revenueGrowth: number;
      profitMargin: number;
      expenseRatio: number;
      topProducts: Product[];
      recentTransactions: Transaction[];
      monthlyTrends: Array<{
        month: string;
        revenue: number;
        expenses: number;
        profit: number;
      }>;
    }, FilterOptions | void>({
      query: (filters) => ({
        url: '/analytics',
        params: filters || {},
      }),
      providesTags: ['KPI', 'Product', 'Transaction'],
    }),
    
    // Dashboard Summary
    getDashboardSummary: builder.query<{
      totalRevenue: number;
      totalExpenses: number;
      totalProfit: number;
      transactionCount: number;
      productCount: number;
      revenueChange: number;
      expenseChange: number;
      profitChange: number;
    }, void>({
      query: () => '/dashboard/summary',
      providesTags: ['KPI', 'Product', 'Transaction'],
    }),
    
    // Export Data
    exportData: builder.mutation<Blob, {
      type: 'csv' | 'excel' | 'pdf';
      data: 'transactions' | 'products' | 'analytics';
      filters?: FilterOptions;
    }>({
      query: ({ type, data, filters = {} }) => ({
        url: `/analytics/export/${data}`,
        method: 'POST',
        params: { format: type, ...filters },
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetKpisQuery,
  useGetProductsQuery,
  useGetTransactionsQuery,
  useSearchTransactionsQuery,
  useUploadCSVMutation,
  useGetCSVDataQuery,
  useGetCSVDataByIdQuery,
  useDeleteCSVDataMutation,
  useGetAnalyticsQuery,
  useGetDashboardSummaryQuery,
  useExportDataMutation,
} = api;