import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface CSVUploadResponse {
  message: string;
  fileName: string;
  headers: string[];
  rowCount: number;
  validation: {
    errors: string[];
    warnings: string[];
    isValid: boolean;
  };
  preview: any[];
  data: any[] | null;
}

export interface CSVImportRequest {
  dataType: string;
  data: any[];
  mapping: Array<{
    sourceColumn: string;
    targetField: string;
    dataType: 'string' | 'number' | 'date' | 'currency';
  }>;
}

export interface CSVImportResponse {
  message: string;
  fileName: string;
  recordCount: number;
  data: any[];
}

export interface CSVValidationRequest {
  headers: string[];
  dataType: string;
}

export interface CSVValidationResponse {
  validation: {
    errors: string[];
    warnings: string[];
    isValid: boolean;
  };
  suggestedMapping: Array<{
    sourceColumn: string;
    targetField: string;
    dataType: string;
  }>;
}

export interface CSVDataResponse {
  message: string;
  data: any[];
  count: number;
}

export const csvApi = createApi({
  reducerPath: "csvApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL || "http://localhost:9000",
  }),
  tagTypes: ["CSVData"],
  endpoints: (builder) => ({
    // Upload CSV file
    uploadCSV: builder.mutation<CSVUploadResponse, FormData>({
      query: (formData) => ({
        url: "/api/csv-data/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["CSVData"],
    }),

    // Import processed CSV data
    importCSVData: builder.mutation<CSVImportResponse, CSVImportRequest>({
      query: (importData) => ({
        url: "/api/csv-data/import",
        method: "POST",
        body: importData,
      }),
      invalidatesTags: ["CSVData"],
    }),

    // Validate CSV structure
    validateCSV: builder.mutation<CSVValidationResponse, CSVValidationRequest>({
      query: (validationData) => ({
        url: "/api/csv-data/validate",
        method: "POST",
        body: validationData,
      }),
    }),

    // Load existing CSV data
    loadCSVData: builder.query<CSVDataResponse, string>({
      query: (dataType) => `/api/csv-data/load/${dataType}`,
      providesTags: ["CSVData"],
    }),

    // Download CSV template
    downloadTemplate: builder.query<Blob, string>({
      query: (dataType) => ({
        url: `/api/csv-data/templates/${dataType}`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Get all available data types
    getDataTypes: builder.query<string[], void>({
      query: () => "/api/csv-data/types",
      transformResponse: () => ["monthly", "financial", "daily", "products", "transactions", "budget"],
    }),
  }),
});

export const {
  useUploadCSVMutation,
  useImportCSVDataMutation,
  useValidateCSVMutation,
  useLoadCSVDataQuery,
  useLazyDownloadTemplateQuery,
  useGetDataTypesQuery,
} = csvApi;