import Transaction from '../models/Transaction.js';
import { calculateStats, getTopCategories, generateInsights } from '../utils/analytics.js';
import { convertToCSV, generateCSVFilename } from '../utils/csvExport.js';

/**
 * Create Transaction
 */
export const createTransaction = async (req, res, next) => {
  try {
    const { title, amount, type, category, date, description, paymentMethod, recurring, recurringFrequency } = req.body;

    // Validation
    if (!title || !amount || !type || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, amount, type, and category are required',
      });
    }

    const transaction = new Transaction({
      userId: req.user.id,
      title,
      amount,
      type,
      category,
      date: date || new Date(),
      description,
      paymentMethod,
      recurring,
      recurringFrequency,
    });

    await transaction.save();
    await transaction.populate('userId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Transactions (with filters)
 */
export const getTransactions = async (req, res, next) => {
  try {
    const { category, type, startDate, endDate, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = { userId: req.user.id };

    if (category) filter.category = category;
    if (type) filter.type = type;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email');

    const total = await Transaction.countDocuments(filter);

    // Calculate statistics
    const allTransactions = await Transaction.find(filter);
    const stats = calculateStats(allTransactions);

    res.json({
      success: true,
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
      stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Single Transaction
 */
export const getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate('userId', 'name email');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Check ownership
    if (transaction.userId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access',
      });
    }

    res.json({
      success: true,
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Transaction
 */
export const updateTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Check ownership
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access',
      });
    }

    // Update with request body
    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('userId', 'name email');

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Transaction
 */
export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Check ownership
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access',
      });
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Dashboard Summary
 */
export const getDashboardSummary = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    const stats = calculateStats(transactions);
    const topCategories = getTopCategories(transactions);

    res.json({
      success: true,
      summary: {
        totalIncome: stats.totalIncome,
        totalExpense: stats.totalExpense,
        netBalance: stats.netBalance,
        topCategories,
        transactionCount: transactions.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get AI Insights
 */
export const getInsights = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    const insights = generateInsights(transactions);

    res.json({
      success: true,
      insights,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Export Transactions to CSV
 */
export const exportTransactionsCSV = async (req, res, next) => {
  try {
    const { category, type, startDate, endDate } = req.query;

    // Build filter
    const filter = { userId: req.user.id };

    if (category) filter.category = category;
    if (type) filter.type = type;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    const csv = convertToCSV(transactions);
    const filename = generateCSVFilename();

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Chart Data (for monthly trends)
 */
export const getChartData = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });

    // Format data for charts
    const monthlyData = {};
    
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, income: 0, expense: 0 };
      }

      if (transaction.type === 'income') {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expense += transaction.amount;
      }
    });

    const categoryData = {};
    
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((transaction) => {
        if (!categoryData[transaction.category]) {
          categoryData[transaction.category] = 0;
        }
        categoryData[transaction.category] += transaction.amount;
      });

    const pieChartData = Object.entries(categoryData).map(([name, value]) => ({
      name,
      value,
    }));

    res.json({
      success: true,
      chartData: {
        lineChart: Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month)),
        pieChart: pieChartData,
      },
    });
  } catch (error) {
    next(error);
  }
};
