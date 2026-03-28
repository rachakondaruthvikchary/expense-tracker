/**
 * Calculate financial statistics
 */
export const calculateStats = (transactions) => {
  const stats = {
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    byCategory: {},
    byMonth: {},
  };

  transactions.forEach((transaction) => {
    if (transaction.type === 'income') {
      stats.totalIncome += transaction.amount;
    } else {
      stats.totalExpense += transaction.amount;
    }

    // By category
    if (!stats.byCategory[transaction.category]) {
      stats.byCategory[transaction.category] = {
        total: 0,
        count: 0,
        type: transaction.type,
      };
    }
    stats.byCategory[transaction.category].total += transaction.amount;
    stats.byCategory[transaction.category].count += 1;

    // By month
    const monthKey = new Date(transaction.date).toISOString().slice(0, 7);
    if (!stats.byMonth[monthKey]) {
      stats.byMonth[monthKey] = { income: 0, expense: 0 };
    }
    if (transaction.type === 'income') {
      stats.byMonth[monthKey].income += transaction.amount;
    } else {
      stats.byMonth[monthKey].expense += transaction.amount;
    }
  });

  stats.netBalance = stats.totalIncome - stats.totalExpense;
  return stats;
};

/**
 * Get top spending categories
 */
export const getTopCategories = (transactions, limit = 5) => {
  const categorySpending = {};

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((transaction) => {
      if (!categorySpending[transaction.category]) {
        categorySpending[transaction.category] = 0;
      }
      categorySpending[transaction.category] += transaction.amount;
    });

  return Object.entries(categorySpending)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([category, amount]) => ({ category, amount }));
};

/**
 * Get monthly trend data
 */
export const getMonthlyTrends = (transactions) => {
  const trends = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!trends[monthKey]) {
      trends[monthKey] = { income: 0, expense: 0, date: monthKey };
    }

    if (transaction.type === 'income') {
      trends[monthKey].income += transaction.amount;
    } else {
      trends[monthKey].expense += transaction.amount;
    }
  });

  return Object.values(trends).sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Generate AI Insights
 */
export const generateInsights = (transactions) => {
  const stats = calculateStats(transactions);
  const topCategories = getTopCategories(transactions, 3);
  const insights = [];

  // Insight 1: Spending pattern
  if (stats.totalExpense > 0) {
    const avgMonthly = stats.totalExpense / Object.keys(stats.byMonth).length;
    insights.push({
      type: 'spending_pattern',
      message: `Your average monthly spending is $${avgMonthly.toFixed(2)}`,
      severity: 'info',
    });
  }

  // Insight 2: Top category
  if (topCategories.length > 0) {
    const topCategory = topCategories[0];
    const percentage = ((topCategory.amount / stats.totalExpense) * 100).toFixed(1);
    insights.push({
      type: 'top_category',
      message: `${topCategory.category} is your top spending category at ${percentage}% of total expenses`,
      severity: 'warning',
    });
  }

  // Insight 3: Income vs Expense ratio
  if (stats.totalIncome > 0) {
    const savingsRate = (((stats.totalIncome - stats.totalExpense) / stats.totalIncome) * 100).toFixed(1);
    const severity = savingsRate < 20 ? 'critical' : savingsRate < 50 ? 'warning' : 'success';
    insights.push({
      type: 'savings_rate',
      message: `Your savings rate is ${savingsRate}%`,
      severity,
    });
  }

  return insights;
};
