import express from 'express';
import { setMonthlyBudget, getBudgetStatus, getBudgetHistory, deleteBudget } from '../controllers/budgetController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All budget routes require authentication
router.use(authMiddleware);

router.post('/', setMonthlyBudget);
router.get('/status', getBudgetStatus);
router.get('/history', getBudgetHistory);
router.delete('/:id', deleteBudget);

export default router;
