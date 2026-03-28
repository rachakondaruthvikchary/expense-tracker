import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

/**
 * Create or Update Monthly Budget
 */
export const setMonthlyBudget = async (req, res, next) => {
  try {
    const { month, year, totalLimit, categoryLimits, alertThreshold } = req.body;

    if (!month || !year || !totalLimit) {
      return res.status(400).json({
        success: false,
        message: 'Month, year, and total limit are required',
      });
    }

    let budget = await Budget.findOne({
      userId: req.user.id,
      month,
      year,
    });

    if (budget) {
      budget = await Budget.findByIdAndUpdate(
        budget._id,
        { totalLimit, categoryLimits, alertThreshold },
        { new: true, runValidators: true }
      );
    } else {
      budget = new Budget({
        userId: req.user.id,
        month,
        year,
        totalLimit,
        categoryLimits,
        alertThreshold,
      });
      await budget.save();
    }

    res.json({
      success: true,
      message: 'Budget set successfully',
      budget,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Current Month Budget with Status
 */
export const getBudgetStatus = async (req, res, next) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    let budget = await Budget.findOne({
      userId: req.user.id,
      month,
      year,
    });

    if (!budget) {
      // Create default budget if doesn't exist
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      budget = new Budget({
        userId: req.user.id,
        month,
        year,
        totalLimit: user.monthlyBudget || 5000,
      });
      await budget.save();
    }

    // Get current month transactions
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const transactions = await Transaction.find({
      userId: req.user.id,
      type: 'expense',
      date: { $gte: startDate, $lte: endDate },
    });

    let totalSpent = 0;
    const categorySpent = {};

    transactions.forEach((transaction) => {
      totalSpent += transaction.amount;
      if (!categorySpent[transaction.category]) {
        categorySpent[transaction.category] = 0;
      }
      categorySpent[transaction.category] += transaction.amount;
    });

    // Check budget alerts
    const alerts = [];
    const percentageSpent = (totalSpent / budget.totalLimit) * 100;

    if (percentageSpent >= budget.alertThreshold * 100) {
      alerts.push({
        type: 'budget_exceeded',
        message: `You've spent ${percentageSpent.toFixed(1)}% of your monthly budget`,
        severity: percentageSpent >= 100 ? 'critical' : 'warning',
      });
    }

    // Category alerts
    if (budget.categoryLimits && Object.keys(budget.categoryLimits).length > 0) {
      Object.entries(budget.categoryLimits).forEach(([category, limit]) => {
        if (categorySpent[category] && categorySpent[category] > limit) {
          alerts.push({
            type: 'category_exceeded',
            category,
            message: `${category} budget exceeded: $${categorySpent[category].toFixed(2)} of $${limit.toFixed(2)}`,
            severity: 'warning',
          });
        }
      });
    }

    res.json({
      success: true,
      budget: {
        ...budget.toObject(),
        totalSpent,
        categorySpent,
        percentageSpent: percentageSpent.toFixed(1),
        remainingBudget: (budget.totalLimit - totalSpent).toFixed(2),
        alerts,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Budget History
 */
export const getBudgetHistory = async (req, res, next) => {
  try {
    const { months = 12 } = req.query;

    const budgets = await Budget.find({
      userId: req.user.id,
    })
      .sort({ year: -1, month: -1 })
      .limit(parseInt(months));

    res.json({
      success: true,
      budgets,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Budget
 */
export const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found',
      });
    }

    // Check ownership
    if (budget.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access',
      });
    }

    await Budget.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Budget deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
