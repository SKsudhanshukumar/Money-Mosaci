import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CSV parsing utility
export const parseCSV = (csvText) => {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length === 0) return { headers: [], rows: [] };
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows = lines.slice(1).map(line => 
    line.split(',').map(cell => cell.trim().replace(/"/g, ''))
  );
  
  return { headers, rows };
};

// Convert CSV data to JSON format
export const csvToJson = (headers, rows) => {
  return rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });
};

// Load CSV file and convert to JSON
export const loadCSVFile = (fileName) => {
  try {
    const filePath = path.join(__dirname, '../data', fileName);
    const csvText = fs.readFileSync(filePath, 'utf8');
    const { headers, rows } = parseCSV(csvText);
    return csvToJson(headers, rows);
  } catch (error) {
    console.error(`Error loading CSV file ${fileName}:`, error);
    return [];
  }
};

// Data transformation utilities
export const transformFinancialData = (csvData) => {
  return csvData.map(row => ({
    month: row.month,
    revenue: `$${parseFloat(row.revenue || 0).toFixed(2)}`,
    expenses: `$${parseFloat(row.expenses || 0).toFixed(2)}`,
    operationalExpenses: `$${parseFloat(row.operationalExpenses || 0).toFixed(2)}`,
    nonOperationalExpenses: `$${parseFloat(row.nonOperationalExpenses || 0).toFixed(2)}`,
    profit: `$${parseFloat(row.profit || 0).toFixed(2)}`,
    growthRate: parseFloat(row.growthRate || 0),
  }));
};

export const transformDailyData = (csvData) => {
  return csvData.map(row => ({
    date: row.date,
    revenue: `$${parseFloat(row.revenue || 0).toFixed(2)}`,
    expenses: `$${parseFloat(row.expenses || 0).toFixed(2)}`,
    profit: `$${parseFloat(row.profit || 0).toFixed(2)}`,
    dayOfWeek: row.dayOfWeek || '',
  }));
};

export const transformProductData = (csvData) => {
  return csvData.map(row => ({
    _id: row.id,
    name: row.name || `Product ${row.id}`,
    price: `$${parseFloat(row.price || 0).toFixed(2)}`,
    expense: `$${parseFloat(row.expense || 0).toFixed(2)}`,
    category: row.category || 'General',
    description: row.description || '',
    supplier: row.supplier || '',
    inStock: parseInt(row.inStock || 0),
    lastUpdated: row.lastUpdated || new Date().toISOString(),
    transactions: [], // Will be populated separately
  }));
};

export const transformTransactionData = (csvData) => {
  return csvData.map(row => ({
    _id: row.id,
    amount: parseFloat(row.amount || 0),
    buyer: row.buyer || '',
    category: row.category || 'Miscellaneous',
    description: row.description || '',
    paymentMethod: row.paymentMethod || '',
    status: row.status || 'Completed',
    createdAt: row.date || new Date().toISOString(),
  }));
};

// Validation utilities
export const validateCSVStructure = (headers, expectedHeaders) => {
  const errors = [];
  const warnings = [];
  
  // Check for required headers
  const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
  if (missingHeaders.length > 0) {
    errors.push(`Missing required headers: ${missingHeaders.join(', ')}`);
  }
  
  // Check for extra headers
  const extraHeaders = headers.filter(header => !expectedHeaders.includes(header));
  if (extraHeaders.length > 0) {
    warnings.push(`Extra headers found: ${extraHeaders.join(', ')}`);
  }
  
  return { errors, warnings, isValid: errors.length === 0 };
};

// Data type validation
export const validateDataTypes = (data, fieldTypes) => {
  const errors = [];
  
  data.forEach((row, rowIndex) => {
    Object.entries(fieldTypes).forEach(([field, type]) => {
      const value = row[field];
      if (value === undefined || value === '') return;
      
      switch (type) {
        case 'number':
          if (isNaN(parseFloat(value))) {
            errors.push(`Row ${rowIndex + 1}: ${field} should be a number, got "${value}"`);
          }
          break;
        case 'date':
          if (isNaN(Date.parse(value))) {
            errors.push(`Row ${rowIndex + 1}: ${field} should be a valid date, got "${value}"`);
          }
          break;
        case 'currency':
          const cleanValue = value.replace(/[$,]/g, '');
          if (isNaN(parseFloat(cleanValue))) {
            errors.push(`Row ${rowIndex + 1}: ${field} should be a currency value, got "${value}"`);
          }
          break;
      }
    });
  });
  
  return { errors, isValid: errors.length === 0 };
};

// Save processed data back to JSON format
export const saveProcessedData = (data, fileName) => {
  try {
    const filePath = path.join(__dirname, '../data/processed', fileName);
    
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error saving processed data to ${fileName}:`, error);
    return false;
  }
};