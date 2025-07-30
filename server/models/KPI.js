import mongoose from 'mongoose';

const MonthlyDataSchema = new mongoose.Schema({
  month: String,
  revenue: String,
  expenses: String,
  operationalExpenses: String,
  nonOperationalExpenses: String,
});

const DailyDataSchema = new mongoose.Schema({
  date: String,
  revenue: String,
  expenses: String,
});

const KPI = new mongoose.Schema({
  totalProfit: String,
  totalRevenue: String,
  totalExpenses: String,
  monthlyData: [MonthlyDataSchema],
  dailyData: [DailyDataSchema],
  expensesByCategory: {
    salaries: String,
    supplies: String,
    services: String,
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
});

export default mongoose.model('KPI', KPI);
