import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  parseCSV,
  csvToJson,
  loadCSVFile,
  transformFinancialData,
  transformDailyData,
  transformProductData,
  transformTransactionData,
  validateCSVStructure,
  validateDataTypes,
  saveProcessedData
} from '../utils/csvParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.csv');
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Predefined field configurations
const FIELD_CONFIGS = {
  financial: {
    required: ['month', 'revenue', 'expenses'],
    optional: ['operationalExpenses', 'nonOperationalExpenses'],
    types: {
      month: 'string',
      revenue: 'currency',
      expenses: 'currency',
      operationalExpenses: 'currency',
      nonOperationalExpenses: 'currency'
    }
  },
  daily: {
    required: ['date', 'revenue', 'expenses'],
    optional: [],
    types: {
      date: 'date',
      revenue: 'currency',
      expenses: 'currency'
    }
  },
  products: {
    required: ['id', 'price', 'expense'],
    optional: ['name', 'category', 'description'],
    types: {
      id: 'string',
      price: 'currency',
      expense: 'currency',
      name: 'string',
      category: 'string',
      description: 'string'
    }
  },
  transactions: {
    required: ['id', 'amount'],
    optional: ['buyer', 'date', 'category', 'description'],
    types: {
      id: 'string',
      amount: 'currency',
      buyer: 'string',
      date: 'date',
      category: 'string',
      description: 'string'
    }
  }
};

// GET /api/csv-data/load/:type - Load existing CSV data
router.get('/load/:type', (req, res) => {
  try {
    const { type } = req.params;
    
    // Map data types to actual file names
    const fileNameMap = {
      'monthly': 'enhanced_monthly_data.csv',
      'financial': 'sample_financial_data.csv',
      'daily': 'enhanced_daily_data.csv',
      'products': 'sample_products_catalog.csv',
      'transactions': 'sample_transactions_2024.csv',
      'budget': 'sample_budget_data.csv'
    };
    
    const fileName = fileNameMap[type];
    if (!fileName) {
      return res.status(404).json({ 
        message: `Data type '${type}' not supported`,
        data: [] 
      });
    }
    
    const data = loadCSVFile(fileName);
    
    if (data.length === 0) {
      return res.status(404).json({ 
        message: `No ${type} data found`,
        data: [] 
      });
    }

    // Transform data based on type
    let transformedData;
    switch (type) {
      case 'monthly':
      case 'financial':
        transformedData = transformFinancialData(data);
        break;
      case 'daily':
        transformedData = transformDailyData(data);
        break;
      case 'products':
        transformedData = transformProductData(data);
        break;
      case 'transactions':
        transformedData = transformTransactionData(data);
        break;
      case 'budget':
        transformedData = data; // Budget data doesn't need transformation
        break;
      default:
        transformedData = data;
    }

    res.json({
      message: `${type} data loaded successfully`,
      data: transformedData,
      count: transformedData.length
    });
  } catch (error) {
    console.error('Error loading CSV data:', error);
    res.status(500).json({ 
      message: 'Error loading CSV data',
      error: error.message 
    });
  }
});

// POST /api/csv-data/upload - Upload and validate CSV file
router.post('/upload', upload.single('csvFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { dataType, mapping } = req.body;
    
    // Read and parse the uploaded file
    const csvText = fs.readFileSync(req.file.path, 'utf8');
    const { headers, rows } = parseCSV(csvText);
    
    if (rows.length === 0) {
      return res.status(400).json({ message: 'CSV file is empty' });
    }

    // Convert to JSON
    const jsonData = csvToJson(headers, rows);
    
    // Validate structure if dataType is provided
    let validation = { errors: [], warnings: [], isValid: true };
    if (dataType && FIELD_CONFIGS[dataType]) {
      const config = FIELD_CONFIGS[dataType];
      const allRequiredFields = [...config.required, ...config.optional];
      
      validation = validateCSVStructure(headers, allRequiredFields);
      
      if (validation.isValid) {
        const typeValidation = validateDataTypes(jsonData, config.types);
        validation.errors.push(...typeValidation.errors);
        validation.isValid = typeValidation.isValid;
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      message: 'File uploaded and processed successfully',
      fileName: req.file.originalname,
      headers,
      rowCount: rows.length,
      validation,
      preview: jsonData.slice(0, 5), // First 5 rows for preview
      data: validation.isValid ? jsonData : null
    });
  } catch (error) {
    console.error('Error processing uploaded file:', error);
    res.status(500).json({ 
      message: 'Error processing uploaded file',
      error: error.message 
    });
  }
});

// POST /api/csv-data/import - Import processed data
router.post('/import', (req, res) => {
  try {
    const { dataType, data, mapping } = req.body;
    
    if (!dataType || !data || !Array.isArray(data)) {
      return res.status(400).json({ message: 'Invalid import data' });
    }

    // Apply field mapping if provided
    let processedData = data;
    if (mapping && Array.isArray(mapping)) {
      processedData = data.map(row => {
        const mappedRow = {};
        mapping.forEach(map => {
          if (map.sourceColumn && map.targetField && row[map.sourceColumn] !== undefined) {
            let value = row[map.sourceColumn];
            
            // Apply data type transformations
            switch (map.dataType) {
              case 'number':
                value = parseFloat(value) || 0;
                break;
              case 'currency':
                value = parseFloat(value.toString().replace(/[$,]/g, '')) || 0;
                break;
              case 'date':
                value = new Date(value).toISOString();
                break;
              default:
                value = value.toString();
            }
            
            mappedRow[map.targetField] = value;
          }
        });
        return mappedRow;
      });
    }

    // Transform data based on type
    let finalData;
    switch (dataType) {
      case 'financial':
      case 'monthly':
        finalData = transformFinancialData(processedData);
        break;
      case 'daily':
        finalData = transformDailyData(processedData);
        break;
      case 'products':
        finalData = transformProductData(processedData);
        break;
      case 'transactions':
        finalData = transformTransactionData(processedData);
        break;
      default:
        finalData = processedData;
    }

    // Save processed data
    const fileName = `imported_${dataType}_${Date.now()}.json`;
    const saved = saveProcessedData(finalData, fileName);
    
    if (!saved) {
      return res.status(500).json({ message: 'Error saving imported data' });
    }

    res.json({
      message: `${dataType} data imported successfully`,
      fileName,
      recordCount: finalData.length,
      data: finalData.slice(0, 10) // Return first 10 records for confirmation
    });
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).json({ 
      message: 'Error importing data',
      error: error.message 
    });
  }
});

// GET /api/csv-data/templates/:type - Download CSV template
router.get('/templates/:type', (req, res) => {
  try {
    const { type } = req.params;
    
    if (!FIELD_CONFIGS[type]) {
      return res.status(404).json({ message: 'Template type not found' });
    }

    const config = FIELD_CONFIGS[type];
    const headers = [...config.required, ...config.optional];
    const csvContent = headers.join(',') + '\n';
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${type}_template.csv"`);
    res.send(csvContent);
  } catch (error) {
    console.error('Error generating template:', error);
    res.status(500).json({ 
      message: 'Error generating template',
      error: error.message 
    });
  }
});

// GET /api/csv-data/validate - Validate CSV structure
router.post('/validate', (req, res) => {
  try {
    const { headers, dataType } = req.body;
    
    if (!headers || !Array.isArray(headers)) {
      return res.status(400).json({ message: 'Headers array is required' });
    }

    if (!dataType || !FIELD_CONFIGS[dataType]) {
      return res.status(400).json({ message: 'Valid data type is required' });
    }

    const config = FIELD_CONFIGS[dataType];
    const allRequiredFields = [...config.required, ...config.optional];
    
    const validation = validateCSVStructure(headers, allRequiredFields);
    
    res.json({
      validation,
      suggestedMapping: headers.map(header => ({
        sourceColumn: header,
        targetField: allRequiredFields.find(field => 
          field.toLowerCase() === header.toLowerCase() ||
          header.toLowerCase().includes(field.toLowerCase())
        ) || '',
        dataType: config.types[header] || 'string'
      }))
    });
  } catch (error) {
    console.error('Error validating CSV:', error);
    res.status(500).json({ 
      message: 'Error validating CSV',
      error: error.message 
    });
  }
});

export default router;