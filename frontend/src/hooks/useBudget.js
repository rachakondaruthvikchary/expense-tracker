import { useState, useCallback } from 'react';
import { budgetService } from '../services/budgetService.js';

/**
 * Custom hook for budget operations
 */
export const useBudget = () => {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alerts, setAlerts] = useState([]);

  const fetchBudgetStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await budgetService.getBudgetStatus();
      console.log('📊 useBudget: Budget response:', response);
      
      if (response && response.budget) {
        setBudget(response.budget);
        setAlerts(response.budget.alerts || []);
      } else {
        console.warn('⚠️ useBudget: No budget in response:', response);
      }
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch budget status';
      console.error('❌ useBudget: Fetch failed:', errorMsg, err);
      setError(errorMsg);
      // Don't set budget to null on error - let UI handle gracefully
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const setMonthlyBudget = useCallback(async (month, year, totalLimit, categoryLimits, alertThreshold) => {
    try {
      setLoading(true);
      setError(null);
      const response = await budgetService.setMonthlyBudget(
        month,
        year,
        totalLimit,
        categoryLimits,
        alertThreshold
      );
      setBudget(response.budget);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to set budget';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    budget,
    loading,
    error,
    alerts,
    fetchBudgetStatus,
    setMonthlyBudget,
  };
};
