import api from './api';

/**
 * Budget Services
 */
export const budgetService = {
  /**
   * Set Monthly Budget
   */
  setMonthlyBudget: async (month, year, totalLimit, categoryLimits, alertThreshold) => {
    const response = await api.post('/budget', {
      month,
      year,
      totalLimit,
      categoryLimits,
      alertThreshold,
    });
    return response.data;
  },

  /**
   * Get Budget Status
   */
  getBudgetStatus: async () => {
    const response = await api.get('/budget/status');
    return response.data;
  },

  /**
   * Get Budget History
   */
  getBudgetHistory: async (months = 12) => {
    const response = await api.get('/budget/history', {
      params: { months },
    });
    return response.data;
  },

  /**
   * Delete Budget
   */
  deleteBudget: async (id) => {
    const response = await api.delete(`/budget/${id}`);
    return response.data;
  },
};
