// Utility functions for calculating dynamic percentage changes

/**
 * Calculate percentage change between two values
 * @param current - Current period value
 * @param previous - Previous period value
 * @returns Formatted percentage string with + or - sign
 */
export const calculatePercentageChange = (current: number, previous: number): string => {
  if (previous === 0) return "0%";
  
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
};

/**
 * Parse currency string to number
 * @param currencyString - String like "$1,234.56"
 * @returns Numeric value
 */
export const parseCurrency = (currencyString: string): number => {
  return parseFloat(currencyString.replace(/[$,]/g, ""));
};

/**
 * Calculate revenue growth from monthly data
 * @param monthlyData - Array of monthly data
 * @returns Percentage change string
 */
export const calculateRevenueGrowth = (monthlyData: any[]): string => {
  if (!monthlyData || monthlyData.length < 2) return "0%";
  
  const current = parseCurrency(monthlyData[monthlyData.length - 1].revenue);
  const previous = parseCurrency(monthlyData[monthlyData.length - 2].revenue);
  
  return calculatePercentageChange(current, previous);
};

/**
 * Calculate expense growth from monthly data
 * @param monthlyData - Array of monthly data
 * @returns Percentage change string
 */
export const calculateExpenseGrowth = (monthlyData: any[]): string => {
  if (!monthlyData || monthlyData.length < 2) return "0%";
  
  const current = parseCurrency(monthlyData[monthlyData.length - 1].expenses);
  const previous = parseCurrency(monthlyData[monthlyData.length - 2].expenses);
  
  return calculatePercentageChange(current, previous);
};

/**
 * Calculate profit growth from monthly data
 * @param monthlyData - Array of monthly data
 * @returns Percentage change string
 */
export const calculateProfitGrowth = (monthlyData: any[]): string => {
  if (!monthlyData || monthlyData.length < 2) return "0%";
  
  const currentRevenue = parseCurrency(monthlyData[monthlyData.length - 1].revenue);
  const currentExpenses = parseCurrency(monthlyData[monthlyData.length - 1].expenses);
  const currentProfit = currentRevenue - currentExpenses;
  
  const previousRevenue = parseCurrency(monthlyData[monthlyData.length - 2].revenue);
  const previousExpenses = parseCurrency(monthlyData[monthlyData.length - 2].expenses);
  const previousProfit = previousRevenue - previousExpenses;
  
  return calculatePercentageChange(currentProfit, previousProfit);
};

/**
 * Calculate operational expenses growth from monthly data
 * @param monthlyData - Array of monthly data
 * @returns Percentage change string
 */
export const calculateOperationalExpensesGrowth = (monthlyData: any[]): string => {
  if (!monthlyData || monthlyData.length < 2) return "0%";
  
  const current = parseCurrency(monthlyData[monthlyData.length - 1].operationalExpenses);
  const previous = parseCurrency(monthlyData[monthlyData.length - 2].operationalExpenses);
  
  return calculatePercentageChange(current, previous);
};

/**
 * Calculate average product margin growth
 * @param productData - Array of product data
 * @returns Percentage change string (simulated for demo)
 */
export const calculateProductMarginGrowth = (productData: any[]): string => {
  if (!productData || productData.length === 0) return "0%";
  
  // Calculate average margin
  const totalMargin = productData.reduce((sum, product) => {
    const price = parseCurrency(product.price);
    const expense = parseCurrency(product.expense);
    return sum + ((price - expense) / price);
  }, 0);
  
  const averageMargin = totalMargin / productData.length;
  
  // Simulate growth based on margin health (this would ideally come from historical data)
  if (averageMargin > 0.3) return "+5.2%";
  if (averageMargin > 0.2) return "+2.8%";
  if (averageMargin > 0.1) return "+1.4%";
  return "-0.5%";
};

/**
 * Calculate expense category growth (simulated based on total expenses)
 * @param expensesByCategory - Object with expense categories
 * @param totalExpenses - Total expenses string
 * @returns Percentage change string
 */
export const calculateExpenseCategoryGrowth = (expensesByCategory: any, totalExpenses: string): string => {
  if (!expensesByCategory) return "0%";
  
  const total = parseCurrency(totalExpenses);
  const salaries = parseCurrency(expensesByCategory.salaries);
  const supplies = parseCurrency(expensesByCategory.supplies);
  const services = parseCurrency(expensesByCategory.services);
  
  // Calculate efficiency ratio (lower expenses relative to revenue is better)
  const efficiencyRatio = (salaries + supplies + services) / total;
  
  // Simulate growth based on efficiency (this would ideally come from historical data)
  if (efficiencyRatio < 0.8) return "+3.1%";
  if (efficiencyRatio < 0.9) return "+1.8%";
  return "-0.7%";
};