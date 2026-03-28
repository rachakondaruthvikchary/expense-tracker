import { useState, useCallback } from 'react';
import { transactionService } from '../services/transactionService.js';

/**
 * Custom hook for transaction operations
 */
export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({});

  const fetchTransactions = useCallback(async (filters = {}) => {
    try {
      console.log('📋 useTransactions: Fetching with filters', filters);
      setLoading(true);
      setError(null);
      setCurrentFilters(filters);
      const response = await transactionService.getAll(filters);
      console.log('✅ useTransactions: Fetched', response.transactions.length, 'transactions');
      setTransactions(response.transactions);
      setPagination(response.pagination);
      setStats(response.stats);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch transactions';
      console.error('❌ useTransactions: Fetch failed', errorMsg);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTransaction = useCallback(async (transactionData) => {
    try {
      console.log('➕ useTransactions: Creating transaction', transactionData);
      setLoading(true);
      setError(null);
      const response = await transactionService.create(transactionData);
      console.log('✅ useTransactions: Transaction created with ID', response.transaction._id);
      // Refetch with current filters to ensure data consistency
      await fetchTransactions(currentFilters);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create transaction';
      console.error('❌ useTransactions: Create failed', errorMsg);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentFilters, fetchTransactions]);

  const updateTransaction = useCallback(async (id, transactionData) => {
    try {
      console.log('✏️ useTransactions: Updating transaction', id, transactionData);
      setLoading(true);
      setError(null);
      const response = await transactionService.update(id, transactionData);
      console.log('✅ useTransactions: Transaction updated successfully');
      // Refetch with current filters to ensure data consistency
      await fetchTransactions(currentFilters);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update transaction';
      console.error('❌ useTransactions: Update failed', errorMsg);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentFilters, fetchTransactions]);

  const deleteTransaction = useCallback(async (id) => {
    try {
      console.log('🗑️ useTransactions: Deleting transaction', id);
      setLoading(true);
      setError(null);
      await transactionService.delete(id);
      console.log('✅ useTransactions: Transaction deleted successfully');
      // Refetch with current filters to ensure data consistency
      await fetchTransactions(currentFilters);
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete transaction';
      console.error('❌ useTransactions: Delete failed', errorMsg);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentFilters, fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    pagination,
    stats,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
};
