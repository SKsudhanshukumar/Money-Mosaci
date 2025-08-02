import express from "express";
import KPI from "../models/KPI.js";
import Product from "../models/Product.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// Get comprehensive analytics data
router.get("/", async (req, res) => {
  try {
    console.log("Analytics endpoint called");
    const { dateRange, categories, amountRange } = req.query;
    
    // Build filter query
    let transactionFilter = {};
    let dateFilter = {};
    
    if (dateRange) {
      try {
        const { start, end } = JSON.parse(dateRange);
        if (start && end) {
          dateFilter = {
            createdAt: {
              $gte: new Date(start),
              $lte: new Date(end)
            }
          };
          transactionFilter = { ...transactionFilter, ...dateFilter };
        }
      } catch (e) {
        console.log("Error parsing dateRange:", e);
      }
    }
    
    if (amountRange) {
      try {
        const { min, max } = JSON.parse(amountRange);
        if (min || max) {
          transactionFilter.amount = {};
          if (min) transactionFilter.amount.$gte = min;
          if (max) transactionFilter.amount.$lte = max;
        }
      } catch (e) {
        console.log("Error parsing amountRange:", e);
      }
    }

    // Get KPI data
    console.log("Fetching KPI data...");
    const kpis = await KPI.find();
    const kpi = kpis[0];
    console.log("KPI data found:", !!kpi);
    
    // Get filtered transactions
    console.log("Fetching transactions...");
    const transactions = await Transaction.find(transactionFilter).sort({ createdAt: -1 });
    console.log("Transactions found:", transactions.length);
    
    // Get top products
    console.log("Fetching products...");
    const products = await Product.find().sort({ price: -1 }).limit(10);
    console.log("Products found:", products.length);
    
    // Calculate analytics
    const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount > 0 ? t.amount : 0), 0);
    const totalExpenses = Math.abs(transactions.reduce((sum, t) => sum + (t.amount < 0 ? t.amount : 0), 0));
    const totalProfit = totalRevenue - totalExpenses;
    
    // Calculate growth rates (mock data for demo)
    const revenueGrowth = ((totalRevenue - (kpi?.totalRevenue || 0)) / (kpi?.totalRevenue || 1)) * 100;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    const expenseRatio = totalRevenue > 0 ? (totalExpenses / totalRevenue) * 100 : 0;
    
    // Monthly trends from KPI data
    const monthlyTrends = kpi?.monthlyData?.map(month => ({
      month: month.month,
      revenue: month.revenue,
      expenses: month.expenses,
      profit: month.revenue - month.expenses
    })) || [];
    
    // Recent transactions
    const recentTransactions = transactions.slice(0, 10);
    
    const analyticsData = {
      revenueGrowth: isFinite(revenueGrowth) ? revenueGrowth : 0,
      profitMargin: isFinite(profitMargin) ? profitMargin : 0,
      expenseRatio: isFinite(expenseRatio) ? expenseRatio : 0,
      topProducts: products,
      recentTransactions,
      monthlyTrends,
      summary: {
        totalRevenue,
        totalExpenses,
        totalProfit,
        transactionCount: transactions.length,
        averageTransactionValue: transactions.length > 0 ? totalRevenue / transactions.length : 0
      }
    };
    
    res.status(200).json(analyticsData);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(404).json({ message: error.message });
  }
});

// Get dashboard summary
router.get("/dashboard/summary", async (req, res) => {
  try {
    const kpis = await KPI.find();
    const kpi = kpis[0];
    
    const transactions = await Transaction.find();
    const products = await Product.find();
    
    // Calculate current period totals
    const totalRevenue = kpi?.totalRevenue || 0;
    const totalExpenses = kpi?.totalExpenses || 0;
    const totalProfit = totalRevenue - totalExpenses;
    
    // Mock growth calculations (in real app, compare with previous period)
    const revenueChange = 12.5;
    const expenseChange = -8.3;
    const profitChange = 15.7;
    
    const summary = {
      totalRevenue,
      totalExpenses,
      totalProfit,
      transactionCount: transactions.length,
      productCount: products.length,
      revenueChange,
      expenseChange,
      profitChange
    };
    
    res.status(200).json(summary);
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(404).json({ message: error.message });
  }
});

// Export data endpoint
router.post("/export/:dataType", async (req, res) => {
  try {
    const { dataType } = req.params;
    const { format, ...filters } = req.query;
    
    let data = [];
    let filename = `${dataType}-export`;
    
    switch (dataType) {
      case 'transactions':
        data = await Transaction.find().sort({ createdAt: -1 });
        break;
      case 'products':
        data = await Product.find().sort({ price: -1 });
        break;
      case 'analytics':
        const kpis = await KPI.find();
        data = kpis[0]?.monthlyData || [];
        break;
      default:
        return res.status(400).json({ message: "Invalid data type" });
    }
    
    // In a real application, you would generate the actual file here
    // For now, we'll return a mock response
    const mockFileContent = JSON.stringify(data, null, 2);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.${format}"`);
    res.send(mockFileContent);
    
  } catch (error) {
    console.error("Error exporting data:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;