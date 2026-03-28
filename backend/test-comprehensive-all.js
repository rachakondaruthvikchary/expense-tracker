#!/usr/bin/env node
/**
 * COMPREHENSIVE APP TEST SUITE
 * Tests every feature, every option, every button, every form
 */

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

let testStats = {
  total: 0,
  passed: 0,
  failed: 0,
};

function logTest(name, passed, details = '') {
  testStats.total++;
  if (passed) {
    testStats.passed++;
    console.log(`  ✅ ${name}`);
  } else {
    testStats.failed++;
    console.log(`  ❌ ${name}`);
    if (details) console.log(`     Error: ${details}`);
  }
}

async function runAllTests() {
  console.log('\n' + '='.repeat(70));
  console.log('🔬 COMPREHENSIVE APP TEST SUITE');
  console.log('Testing Every Feature, Option, and Form');
  console.log('='.repeat(70) + '\n');

  let token = null;
  let userId = null;
  let transactionIds = [];
  let budgetId = null;

  try {
    // ======================================================================
    // 1. AUTHENTICATION TESTS
    // ======================================================================
    console.log('\n📋 1. AUTHENTICATION TESTS');
    console.log('-'.repeat(70));

    let testUser = {
      name: 'Comprehensive Test User',
      email: `comptest${Date.now()}@test.com`,
      password: 'TestPass123!',
      confirmPassword: 'TestPass123!',
    };

    // Test 1.1: Signup with valid data
    try {
      const res = await api.post('/auth/signup', testUser);
      logTest('1.1 Signup with valid data', res.data.success && res.data.token);
      token = res.data.token;
      userId = res.data.user._id;
      api.defaults.headers.Authorization = `Bearer ${token}`;
    } catch (err) {
      logTest('1.1 Signup with valid data', false, err.response?.data?.message);
    }

    // Test 1.2: Signup with duplicate email
    try {
      const res = await api.post('/auth/signup', testUser);
      logTest('1.2 Signup duplicate email prevented', res.status !== 201);
    } catch (err) {
      logTest('1.2 Signup duplicate email prevented', err.response?.status === 409);
    }

    // Test 1.3: Signup with mismatched passwords
    try {
      const res = await api.post('/auth/signup', {
        name: 'Test User',
        email: `test${Date.now()}@test.com`,
        password: 'Pass123',
        confirmPassword: 'Pass456',
      });
      logTest('1.3 Mismatched passwords prevented', false);
    } catch (err) {
      logTest('1.3 Mismatched passwords prevented', err.response?.status === 400);
    }

    // Test 1.4: Login with correct credentials
    try {
      const res = await api.post('/auth/login', {
        email: testUser.email,
        password: testUser.password,
      });
      logTest('1.4 Login with correct credentials', res.data.success && res.data.token);
      token = res.data.token;
      api.defaults.headers.Authorization = `Bearer ${token}`;
    } catch (err) {
      logTest('1.4 Login with correct credentials', false, err.response?.data?.message);
    }

    // Test 1.5: Login with incorrect password
    try {
      const res = await api.post('/auth/login', {
        email: testUser.email,
        password: 'WrongPassword',
      });
      logTest('1.5 Login with incorrect password prevented', false);
    } catch (err) {
      logTest('1.5 Login with incorrect password prevented', err.response?.status === 401);
    }

    // Test 1.6: Login with non-existent email
    try {
      const res = await api.post('/auth/login', {
        email: 'nonexistent@test.com',
        password: 'AnyPassword',
      });
      logTest('1.6 Login with non-existent email prevented', false);
    } catch (err) {
      logTest('1.6 Login with non-existent email prevented', err.response?.status === 401);
    }

    // Test 1.7: Get profile (authenticated)
    try {
      const res = await api.get('/auth/profile');
      logTest('1.7 Get user profile', res.data.success && res.data.user._id === userId);
    } catch (err) {
      logTest('1.7 Get user profile', false, err.response?.data?.message);
    }

    // ======================================================================
    // 2. PROFILE UPDATE TESTS
    // ======================================================================
    console.log('\n📋 2. PROFILE UPDATE TESTS');
    console.log('-'.repeat(70));

    // Test 2.1: Update name only
    try {
      const res = await api.put('/auth/profile', {
        name: 'Updated Name',
        monthlyBudget: 5000,
        currency: 'USD',
        theme: 'light',
      });
      logTest('2.1 Update name', res.data.user.name === 'Updated Name');
    } catch (err) {
      logTest('2.1 Update name', false, err.response?.data?.message);
    }

    // Test 2.2: Update monthlyBudget only
    try {
      const res = await api.put('/auth/profile', {
        name: 'Updated Name',
        monthlyBudget: 7500,
        currency: 'USD',
        theme: 'light',
      });
      logTest('2.2 Update monthly budget', res.data.user.monthlyBudget === 7500);
    } catch (err) {
      logTest('2.2 Update monthly budget', false, err.response?.data?.message);
    }

    // Test 2.3: Update currency to EUR
    try {
      const res = await api.put('/auth/profile', {
        name: 'Updated Name',
        monthlyBudget: 7500,
        currency: 'EUR',
        theme: 'light',
      });
      logTest('2.3 Update currency to EUR', res.data.user.currency === 'EUR');
    } catch (err) {
      logTest('2.3 Update currency to EUR', false, err.response?.data?.message);
    }

    // Test 2.4: Update currency to GBP
    try {
      const res = await api.put('/auth/profile', {
        name: 'Updated Name',
        monthlyBudget: 7500,
        currency: 'GBP',
        theme: 'light',
      });
      logTest('2.4 Update currency to GBP', res.data.user.currency === 'GBP');
    } catch (err) {
      logTest('2.4 Update currency to GBP', false, err.response?.data?.message);
    }

    // Test 2.5: Update currency to INR
    try {
      const res = await api.put('/auth/profile', {
        name: 'Updated Name',
        monthlyBudget: 7500,
        currency: 'INR',
        theme: 'light',
      });
      logTest('2.5 Update currency to INR', res.data.user.currency === 'INR');
    } catch (err) {
      logTest('2.5 Update currency to INR', false, err.response?.data?.message);
    }

    // Test 2.6: Update currency to AUD
    try {
      const res = await api.put('/auth/profile', {
        name: 'Updated Name',
        monthlyBudget: 7500,
        currency: 'AUD',
        theme: 'light',
      });
      logTest('2.6 Update currency to AUD', res.data.user.currency === 'AUD');
    } catch (err) {
      logTest('2.6 Update currency to AUD', false, err.response?.data?.message);
    }

    // Test 2.7: Verify profile updates persist
    try {
      const res = await api.get('/auth/profile');
      logTest('2.7 Profile updates persist', 
        res.data.user.currency === 'AUD' && res.data.user.monthlyBudget === 7500);
    } catch (err) {
      logTest('2.7 Profile updates persist', false, err.response?.data?.message);
    }

    // ======================================================================
    // 3. BUDGET TESTS
    // ======================================================================
    console.log('\n📋 3. BUDGET TESTS');
    console.log('-'.repeat(70));

    // Test 3.1: Set monthly budget
    try {
      const res = await api.post('/budget', {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        totalLimit: 10000,
        alertThreshold: 0.80, // Should be decimal 0-1, not percentage
      });
      logTest('3.1 Set monthly budget', res.data.success && res.data.budget.totalLimit === 10000);
      budgetId = res.data.budget._id;
    } catch (err) {
      logTest('3.1 Set monthly budget', false, err.response?.data?.message);
    }

    // Test 3.2: Get budget status
    try {
      const res = await api.get('/budget/status');
      logTest('3.2 Get budget status', res.data.success && res.data.budget);
    } catch (err) {
      logTest('3.2 Get budget status', false, err.response?.data?.message);
    }

    // Test 3.3: Get budget history
    try {
      const res = await api.get('/budget/history?months=12');
      logTest('3.3 Get budget history', res.data.success && Array.isArray(res.data.budgets));
    } catch (err) {
      logTest('3.3 Get budget history', false, err.response?.data?.message);
    }

    // ======================================================================
    // 4. TRANSACTION TESTS - ALL CATEGORIES
    // ======================================================================
    console.log('\n📋 4. TRANSACTION TESTS (All Categories)');
    console.log('-'.repeat(70));

    const categories = ['food', 'travel', 'bills', 'shopping', 'entertainment', 'health', 'education', 'other', 'salary', 'bonus'];
    const types = ['expense', 'income'];

    // Test each category
    for (const category of categories) {
      try {
        const res = await api.post('/transactions', {
          title: `Test ${category}`,
          amount: 100,
          category: category,
          date: new Date().toISOString().split('T')[0],
          type: 'expense',
        });
        logTest(`4.${categories.indexOf(category) + 1} Create transaction - ${category}`, 
          res.data.success && res.data.transaction.category === category);
        transactionIds.push(res.data.transaction._id);
      } catch (err) {
        logTest(`4.${categories.indexOf(category) + 1} Create transaction - ${category}`, 
          false, err.response?.data?.message);
      }
    }

    // Test income transaction
    try {
      const res = await api.post('/transactions', {
        title: 'Salary Income',
        amount: 5000,
        category: 'salary',
        date: new Date().toISOString().split('T')[0],
        type: 'income',
      });
      logTest('4.11 Create income transaction', res.data.success && res.data.transaction.type === 'income');
      transactionIds.push(res.data.transaction._id);
    } catch (err) {
      logTest('4.11 Create income transaction', false, err.response?.data?.message);
    }

    // ======================================================================
    // 5. TRANSACTION FILTER TESTS
    // ======================================================================
    console.log('\n📋 5. TRANSACTION FILTER TESTS');
    console.log('-'.repeat(70));

    // Test 5.1: Filter by category
    try {
      const res = await api.get('/transactions?category=food');
      logTest('5.1 Filter transactions by category', res.data.success && Array.isArray(res.data.transactions));
    } catch (err) {
      logTest('5.1 Filter transactions by category', false, err.response?.data?.message);
    }

    // Test 5.2: Filter by type (expense)
    try {
      const res = await api.get('/transactions?type=expense');
      logTest('5.2 Filter transactions by type (expense)', res.data.success && Array.isArray(res.data.transactions));
    } catch (err) {
      logTest('5.2 Filter transactions by type (expense)', false, err.response?.data?.message);
    }

    // Test 5.3: Filter by type (income)
    try {
      const res = await api.get('/transactions?type=income');
      logTest('5.3 Filter transactions by type (income)', res.data.success && Array.isArray(res.data.transactions));
    } catch (err) {
      logTest('5.3 Filter transactions by type (income)', false, err.response?.data?.message);
    }

    // Test 5.4: Filter by date range
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const endDate = new Date();
      const res = await api.get(`/transactions?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`);
      logTest('5.4 Filter transactions by date range', res.data.success && Array.isArray(res.data.transactions));
    } catch (err) {
      logTest('5.4 Filter transactions by date range', false, err.response?.data?.message);
    }

    // Test 5.5: Get all transactions (no filter)
    try {
      const res = await api.get('/transactions');
      logTest('5.5 Get all transactions (no filter)', res.data.success && Array.isArray(res.data.transactions));
    } catch (err) {
      logTest('5.5 Get all transactions (no filter)', false, err.response?.data?.message);
    }

    // ======================================================================
    // 6. TRANSACTION UPDATE/DELETE TESTS
    // ======================================================================
    console.log('\n📋 6. TRANSACTION UPDATE/DELETE TESTS');
    console.log('-'.repeat(70));

    if (transactionIds.length > 0) {
      const testTransactionId = transactionIds[0];

      // Test 6.1: Get single transaction
      try {
        const res = await api.get(`/transactions/${testTransactionId}`);
        logTest('6.1 Get single transaction', res.data.success && res.data.transaction._id === testTransactionId);
      } catch (err) {
        logTest('6.1 Get single transaction', false, err.response?.data?.message);
      }

      // Test 6.2: Update transaction
      try {
        const res = await api.put(`/transactions/${testTransactionId}`, {
          title: 'Updated Test Transaction',
          amount: 250,
          category: 'entertainment',
          date: new Date().toISOString().split('T')[0],
          type: 'expense',
        });
        logTest('6.2 Update transaction', res.data.success && res.data.transaction.title === 'Updated Test Transaction');
      } catch (err) {
        logTest('6.2 Update transaction', false, err.response?.data?.message);
      }

      // Test 6.3: Delete transaction
      try {
        const res = await api.delete(`/transactions/${testTransactionId}`);
        logTest('6.3 Delete transaction', res.data.success);
      } catch (err) {
        logTest('6.3 Delete transaction', false, err.response?.data?.message);
      }

      // Test 6.4: Verify deletion
      try {
        const res = await api.get(`/transactions/${testTransactionId}`);
        logTest('6.4 Verify transaction deleted', false, 'Transaction still exists');
      } catch (err) {
        logTest('6.4 Verify transaction deleted', err.response?.status === 404);
      }
    }

    // ======================================================================
    // 7. DASHBOARD & ANALYTICS TESTS
    // ======================================================================
    console.log('\n📋 7. DASHBOARD & ANALYTICS TESTS');
    console.log('-'.repeat(70));

    // Test 7.1: Get dashboard summary
    try {
      const res = await api.get('/transactions/dashboard');
      logTest('7.1 Get dashboard summary', res.data.success && res.data.summary);
    } catch (err) {
      logTest('7.1 Get dashboard summary', false, err.response?.data?.message);
    }

    // Test 7.2: Get chart data
    try {
      const res = await api.get('/transactions/chart-data');
      logTest('7.2 Get chart data', res.data.success && res.data.chartData);
    } catch (err) {
      logTest('7.2 Get chart data', false, err.response?.data?.message);
    }

    // Test 7.3: Get insights
    try {
      const res = await api.get('/transactions/insights');
      logTest('7.3 Get insights', res.data.success && res.data.insights);
    } catch (err) {
      logTest('7.3 Get insights', false, err.response?.data?.message);
    }

    // ======================================================================
    // 8. VALIDATION TESTS
    // ======================================================================
    console.log('\n📋 8. VALIDATION TESTS');
    console.log('-'.repeat(70));

    // Test 8.1: Create transaction without title
    try {
      const res = await api.post('/transactions', {
        amount: 100,
        category: 'food',
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
      });
      logTest('8.1 Missing title validation', false);
    } catch (err) {
      logTest('8.1 Missing title validation', err.response?.status === 400);
    }

    // Test 8.2: Create transaction without amount
    try {
      const res = await api.post('/transactions', {
        title: 'Test',
        category: 'food',
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
      });
      logTest('8.2 Missing amount validation', false);
    } catch (err) {
      logTest('8.2 Missing amount validation', err.response?.status === 400);
    }

    // Test 8.3: Create transaction with negative amount
    try {
      const res = await api.post('/transactions', {
        title: 'Test',
        amount: -100,
        category: 'food',
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
      });
      logTest('8.3 Negative amount validation', false);
    } catch (err) {
      logTest('8.3 Negative amount validation', err.response?.status === 400);
    }

    // Test 8.4: Create transaction with invalid category
    try {
      const res = await api.post('/transactions', {
        title: 'Test',
        amount: 100,
        category: 'invalid_category',
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
      });
      logTest('8.4 Invalid category validation', false);
    } catch (err) {
      logTest('8.4 Invalid category validation', err.response?.status === 400);
    }

    // Test 8.5: Create transaction with invalid type
    try {
      const res = await api.post('/transactions', {
        title: 'Test',
        amount: 100,
        category: 'food',
        date: new Date().toISOString().split('T')[0],
        type: 'invalid_type',
      });
      logTest('8.5 Invalid type validation', false);
    } catch (err) {
      logTest('8.5 Invalid type validation', err.response?.status === 400);
    }

    // ======================================================================
    // 9. ERROR HANDLING TESTS
    // ======================================================================
    console.log('\n📋 9. ERROR HANDLING TESTS');
    console.log('-'.repeat(70));

    // Test 9.1: Access protected route without token
    try {
      const noAuthApi = axios.create({ baseURL: API_URL });
      const res = await noAuthApi.get('/auth/profile');
      logTest('9.1 Protected route without token', false);
    } catch (err) {
      logTest('9.1 Protected route without token', err.response?.status === 401);
    }

    // Test 9.2: Invalid token
    try {
      const badApi = axios.create({
        baseURL: API_URL,
        headers: { Authorization: 'Bearer invalid.token.here' },
      });
      const res = await badApi.get('/auth/profile');
      logTest('9.2 Invalid token rejection', false);
    } catch (err) {
      logTest('9.2 Invalid token rejection', err.response?.status === 401);
    }

    // Test 9.3: Non-existent endpoint
    try {
      const res = await api.get('/nonexistent-endpoint');
      logTest('9.3 Non-existent endpoint', false);
    } catch (err) {
      logTest('9.3 Non-existent endpoint', err.response?.status === 404);
    }

    // Test 9.4: Invalid JSON
    try {
      const res = await api.post('/transactions', 'invalid json');
      logTest('9.4 Invalid JSON handling', false);
    } catch (err) {
      logTest('9.4 Invalid JSON handling', err.response?.status === 400 || err.status === 400);
    }

  } catch (error) {
    console.error('\n❌ CRITICAL ERROR:', error.message);
  }

  // ======================================================================
  // FINAL REPORT
  // ======================================================================
  console.log('\n' + '='.repeat(70));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total Tests: ${testStats.total}`);
  console.log(`✅ Passed: ${testStats.passed}`);
  console.log(`❌ Failed: ${testStats.failed}`);
  console.log(`Success Rate: ${((testStats.passed / testStats.total) * 100).toFixed(1)}%`);
  console.log('='.repeat(70));

  if (testStats.failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! APP IS PERFECT! 🎉\n');
    process.exit(0);
  } else {
    console.log(`\n⚠️  ${testStats.failed} test(s) failed. Review logs above.\n`);
    process.exit(1);
  }
}

runAllTests();
