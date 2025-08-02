import express from "express";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// Get transactions with advanced filtering and pagination
router.get("/", async (req, res) => {
  try {
    const {
      searchTerm,
      dateRange,
      amountRange,
      categories,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 25
    } = req.query;

    // Build filter query
    let filter = {};

    // Search term filter
    if (searchTerm) {
      filter.$or = [
        { buyer: { $regex: searchTerm, $options: 'i' } },
        { _id: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    // Date range filter
    if (dateRange) {
      try {
        const { start, end } = JSON.parse(dateRange);
        if (start && end) {
          filter.createdAt = {
            $gte: new Date(start),
            $lte: new Date(end)
          };
        }
      } catch (e) {
        console.error('Invalid dateRange format:', e);
      }
    }

    // Amount range filter
    if (amountRange) {
      try {
        const { min, max } = JSON.parse(amountRange);
        if (min !== undefined || max !== undefined) {
          filter.amount = {};
          if (min !== undefined) filter.amount.$gte = parseFloat(min);
          if (max !== undefined) filter.amount.$lte = parseFloat(max);
        }
      } catch (e) {
        console.error('Invalid amountRange format:', e);
      }
    }

    // Categories filter (if you have category field in transactions)
    if (categories) {
      try {
        const categoryArray = JSON.parse(categories);
        if (categoryArray.length > 0) {
          filter.category = { $in: categoryArray };
        }
      } catch (e) {
        console.error('Invalid categories format:', e);
      }
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const [transactions, totalCount] = await Promise.all([
      Transaction.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum),
      Transaction.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      data: transactions,
      total: totalCount,
      page: pageNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: error.message });
  }
});

// Search transactions
router.get("/search", async (req, res) => {
  try {
    const { q: searchTerm, limit = 10 } = req.query;

    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const transactions = await Transaction.find({
      $or: [
        { buyer: { $regex: searchTerm, $options: 'i' } },
        { _id: { $regex: searchTerm, $options: 'i' } }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error searching transactions:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get single transaction
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    
    res.status(200).json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ message: error.message });
  }
});

// Legacy endpoint for backward compatibility
router.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .limit(50)
      .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;