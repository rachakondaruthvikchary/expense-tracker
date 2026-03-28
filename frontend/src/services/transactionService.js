import api from './api';

/**
 * Transaction Services
 */
export const transactionService = {
  /**
   * Create Transaction
   */
  create: async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  },

  /**
   * Get All Transactions with Filters
   */
  getAll: async (filters = {}) => {
    const { category, type, startDate, endDate, page = 1, limit = 10 } = filters;
    const response = await api.get('/transactions', {
      params: { category, type, startDate, endDate, page, limit },
    });
    return response.data;
  },

  /**
   * Get Single Transaction
   */
  getById: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  /**
   * Update Transaction
   */
  update: async (id, transactionData) => {
    const response = await api.put(`/transactions/${id}`, transactionData);
    return response.data;
  },

  /**
   * Delete Transaction
   */
  delete: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  /**
   * Get Dashboard Summary
   */
  getDashboardSummary: async () => {
    const response = await api.get('/transactions/dashboard');
    return response.data;
  },

  /**
   * Get AI Insights
   */
  getInsights: async () => {
    const response = await api.get('/transactions/insights');
    return response.data;
  },

  /**
   * Export Transactions to CSV
   */
  exportCSV: async (filters = {}) => {
    const { category, type, startDate, endDate } = filters;
    const response = await api.get('/transactions/export', {
      params: { category, type, startDate, endDate },
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get Chart Data
   */
  getChartData: async () => {
    const response = await api.get('/transactions/chart-data');
    return response.data;
  },
};
