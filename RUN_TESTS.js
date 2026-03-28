/**
 * Comprehensive API Test Suite
 * Tests all major endpoints and features
 * Run: node RUN_TESTS.js
 */

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Test user data
const testUser = {
  name: 'Test User',
  email: `testuser-${Date.now()}@test.com`,
  password: 'TestPassword123!',
  confirmPassword: 'TestPassword123!',
};

let token = '';
let userId = '';
let transactionId = '';
let budgetId = '';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  header: (msg) => console.log(`\n${colors.cyan}═══════════════════════════════${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  test: (msg) => console.log(`${colors.yellow}🧪 ${msg}${colors.reset}`),
  value: (label, value) => console.log(`   ${label}: ${JSON.stringify(value)}`),
};

/**
 * Test 1: Health Check
 */
const testHealthCheck = async () => {
  log.test('Testing Health Check Endpoint');
  try {
    const response = await axios.get(`${API_URL}/health`);
    if (response.data.success) {
      log.success('Health check passed');
      log.value('Status', response.data.message);
      return true;
    }
  } catch (error) {
    log.error(`Health check failed: ${error.message}`);
    return false;
  }
};

/**
 * Test 2: User Signup
 */
const testSignup = async () => {
  log.test('Testing User Signup');
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, testUser);
    if (response.data.success) {
      log.success('User signup successful');
      log.value('Email', response.data.user.email);
      log.value('User ID', response.data.user._id);
      userId = response.data.user._id;
      return true;
    }
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    log.error(`Signup failed: ${msg}`);
    return false;
  }
};

/**
 * Test 3: User Login
 */
const testLogin = async () => {
  log.test('Testing User Login');
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password,
    });
    if (response.data.success) {
      log.success('User login successful');
      token = response.data.token;
      userId = response.data.user._id;
      log.value('Token', token.substring(0, 20) + '...');
      return true;
    }
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    log.error(`Login failed: ${msg}`);
    return false;
  }
};

/**
 * Test 4: Get User Profile
 */
const testGetProfile = async () => {
  log.test('Testing Get User Profile');
  try {
    const response = await axios.get(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.success) {
      log.success('Profile retrieved');
      log.value('Name', response.data.user.name);
      log.value('Email', response.data.user.email);
      return true;
    }
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    log.error(`Get profile failed: ${msg}`);
    return false;
  }
};

/**
 * Test 5: Update User Profile
 */
const testUpdateProfile = async () => {
  log.test('Testing Update User Profile');
  try {
    const response = await axios.put(
      `${API_URL}/auth/profile`,
      {
        name: 'Updated Test User',
        monthlyBudget: 5000,
        currency: 'USD',
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data.success) {
      log.success('Profile updated');
      log.value('New Monthly Budget', response.data.user.monthlyBudget);
      return true;
    }
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    log.error(`Update profile failed: ${msg}`);
    return false;
  }
};

/**
 * Test 6: Create Transaction (Expense)
 */
const testCreateExpense = async () => {
  log.test('Testing Create Expense Transaction');
  try {
    const response = await axios.post(
      `${API_URL}/transactions`,
      {
        type: 'expense',
        amount: 50.5,
        category: 'food',
        description: 'Lunch at restaurant',
        paymentMethod: 'credit_card',
        date: new Date().toISOString(),
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data.success) {
      log.success('Expense created');
      transactionId = response.data.transaction._id;
      log.value('Amount', response.data.transaction.amount);
      log.value('Category', response.data.transaction.category);
      return true;
    }
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    log.error(`Create expense failed: ${msg}`);
    return false;
  }
};

/**
 * Test 7: Create Transaction (Income)
 */
const testCreateIncome = async () => {
  log.test('Testing Create Income Transaction');
  try {
    const response = await axios.post(
      `${API_URL}/transactions`,
      {
        type: 'income',
        amount: 2000,
        category: 'salary',
        description: 'Monthly salary',
        paymentMethod: 'bank_transfer',
        date: new Date().toISOString(),
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data.success) {
      log.success('Income created');
      log.value('Amount', response.data.transaction.amount);
      log.value('Category', response.data.transaction.category);
      return true;
    }
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    log.error(`Create income failed: ${msg}`);
    return false;
  }
};

/**
 * Test 8: Get All Transactions
 */
const testGetTransactions = async () => {
  log.test('Testing Get All Transactions');
  try {
    const response = await axios.get(`${API_URL}/transactions`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page: 1, limit: 10 },
    });
    if (response.data.success) {
      log.success('Transactions retrieved');
      log.value('Count', response.data.transactions.length);
      log.value('Total', response.data.pagination.total);
      return true;
    }
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    log.error(`Get transactions failed: ${msg}`);
    return false;
  }
};

/**
 * Test 9: Filter Transactions
 */
const testFilterTransactions = async () => {
  log.test('Testing Filter Transactions');
  try {
    const response = await axios.get(`${API_URL}/transactions`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        type: 'expense',
        category: 'food',
        page: 1,
        limit: 10,
      },
    });
    if (response.data.success) {
      log.success('Transactions filtered');
      log.value('Filtered Count', response.data.transactions.length);
      return true;
    }
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    log.error(`Filter transactions failed: ${msg}`);
    return false;
  }
};

/**
 * Test 10: Update Transaction
 */
const testUpdateTransaction = async () => {
  log.test('Testing Update Transaction');
  try {
    const response = await axios.put(
      `${API_URL}/transactions/${transactionId}`,
      {
        amount: 75.5,
        description: 'Updated lunch expense',
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data.success) {
      log.success('Transaction updated');
      log.value('New Amount', response.data.transaction.amount);
      return true;
    }
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    log.error(`Update transaction failed: ${msg}`);
    return false;
  }
};

/**
 * Test 11: Get Dashboard Summary
 */
const testDashboardSummary = async () => {
  log.test('Testing Dashboard Summary');
  try {
    const response = await axios.get(`${API_URL}/transactions/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.success) {
      log.success('Dashboard summary retrieved');
      log.value('Total Income', response.data.stats.totalIncome);
      log.value('Total Expense', response.data.stats.totalExpense);
      log.value('Net Balance', response.data.stats.netBalance);
      return true;
    }
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    log.error(`Dashboard summary failed: ${msg}`);
    return false;
  }
};

/**
 * Test 12: Get AI Insights
 */
const testInsights = async () => {
  log.test('Testing Get AI Insights');
  try {
    const response = await axios.get(`${API_URL}/transactions/insights`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.success) {
      log.success('AI insights retrieved');
      log.value('Top Category', response.data.insights.topCategory);
      log.value('Average Daily Spend', response.data.insights.averageDailySpend);
      return true;
    }
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    log.error(`Get insights failed: ${msg}`);
    return false;
  }
};

/**
 * Test 13: Set Monthly Budget
 */
const testSetBudget = async () => {
  log.test('Testing Set Monthly Budget');
  try {
    const response = await axios.post(
      `${API_URL}/budget`,
      {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        totalBudget: 5000,
        categories: {
          food: 500,
          travel: 800,
          shopping: 1000,
          bills: 2000,
          entertainment: 500,
          health: 200,
        },
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data.success) {
      log.success('Monthly budget set');
      budgetId = response.data.budget._id;
      log.value('Total Budget', response.data.budget.totalBudget);
      return true;
    }
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    log.error(`Set budget failed: ${msg}`);
    return false;
  }
};

/**
 * Test 14: Get Current Budget
 */
const testGetBudget = async () => {
  log.test('Testing Get Current Budget');
  try {
    const response = await axios.get(`${API_URL}/budget/current`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.success) {
      log.success('Current budget retrieved');
      log.value('Total Budget', response.data.budget.totalBudget);
      log.value('Total Spent', response.data.budget.totalSpent);
      return true;
    }
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    log.error(`Get budget failed: ${msg}`);
    return false;
  }
};

/**
 * Test 15: Get Budget Status
 */
const testBudgetStatus = async () => {
  log.test('Testing Get Budget Status');
  try {
    const response = await axios.get(`${API_URL}/budget/status`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.success) {
      log.success('Budget status retrieved');
      log.value('Status', response.data.status);
      log.value('Spent Percentage', response.data.spentPercentage + '%');
      return true;
    }
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    log.error(`Get budget status failed: ${msg}`);
    return false;
  }
};

/**
 * Test 16: Delete Transaction
 */
const testDeleteTransaction = async () => {
  log.test('Testing Delete Transaction');
  try {
    const response = await axios.delete(`${API_URL}/transactions/${transactionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.success) {
      log.success('Transaction deleted');
      return true;
    }
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    log.error(`Delete transaction failed: ${msg}`);
    return false;
  }
};

/**
 * Main Test Runner
 */
const runTests = async () => {
  console.log(`\n${colors.cyan}╔═══════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║   Expense Tracker - API Test Suite    ║${colors.reset}`);
  console.log(`${colors.cyan}╚═══════════════════════════════════════╝${colors.reset}`);
  
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'User Signup', fn: testSignup },
    { name: 'User Login', fn: testLogin },
    { name: 'Get Profile', fn: testGetProfile },
    { name: 'Update Profile', fn: testUpdateProfile },
    { name: 'Create Expense', fn: testCreateExpense },
    { name: 'Create Income', fn: testCreateIncome },
    { name: 'Get Transactions', fn: testGetTransactions },
    { name: 'Filter Transactions', fn: testFilterTransactions },
    { name: 'Update Transaction', fn: testUpdateTransaction },
    { name: 'Dashboard Summary', fn: testDashboardSummary },
    { name: 'AI Insights', fn: testInsights },
    { name: 'Set Budget', fn: testSetBudget },
    { name: 'Get Budget', fn: testGetBudget },
    { name: 'Budget Status', fn: testBudgetStatus },
    { name: 'Delete Transaction', fn: testDeleteTransaction },
  ];

  const results = [];
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await test.fn();
    results.push({ name: test.name, passed: result });
    if (result) passed++;
    else failed++;
    await delay(200);
  }

  // Print Summary
  console.log(`\n${colors.cyan}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}TEST SUMMARY${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════${colors.reset}`);
  
  results.forEach(result => {
    const status = result.passed ? `${colors.green}✅${colors.reset}` : `${colors.red}❌${colors.reset}`;
    console.log(`${status} ${result.name}`);
  });

  console.log(`\n${colors.cyan}───────────────────────────────────────${colors.reset}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`${colors.cyan}Total: ${tests.length}${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════${colors.reset}\n`);

  process.exit(failed > 0 ? 1 : 0);
};

// Run all tests
runTests().catch(error => {
  log.error(`Test suite error: ${error.message}`);
  process.exit(1);
});
