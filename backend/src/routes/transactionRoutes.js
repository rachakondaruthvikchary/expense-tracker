import express from 'express';
import {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getDashboardSummary,
  getInsights,
  exportTransactionsCSV,
  getChartData,
} from '../controllers/transactionController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All transaction routes require authentication
router.use(authMiddleware);

// Dashboard and analytics
router.get('/dashboard', getDashboardSummary);
router.get('/insights', getInsights);
router.get('/chart-data', getChartData);
router.get('/export', exportTransactionsCSV);

// CRUD operations
router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/:id', getTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
