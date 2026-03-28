import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const testUser = {
  name: 'Test User QA',
  email: `testuser-${Date.now()}@test.com`,
  password: 'TestPassword123!',
  confirmPassword: 'TestPassword123!'
};

let token = '';
let userId = '';
let transactionId = '';
let passed = 0;
let failed = 0;

const log = {
  test: (msg) => console.log(`\n🧪 ${msg}`),
  success: (msg) => { console.log(`   ✅ ${msg}`); passed++; },
  error: (msg) => { console.log(`   ❌ ${msg}`); failed++; },
};

const delay = ms => new Promise(r => setTimeout(r, ms));

async function runTests() {
  console.log('\n╔═══════════════════════════════════════╗');
  console.log('║   EXPENSE TRACKER - API TEST SUITE    ║');
  console.log('╚═══════════════════════════════════════╝\n');

  try {
    // Test 1: Health Check
    log.test('Testing Health Check Endpoint');
    try {
      const res = await axios.get(`${API_URL}/health`);
      log.success(`API healthy: ${res.data.message}`);
    } catch (e) {
      log.error(`Health check failed: ${e.message}`);
    }

    await delay(300);

    // Test 2: User Signup
    log.test('Testing User Signup');
    try {
      const res = await axios.post(`${API_URL}/auth/signup`, testUser);
      if (res.data.success) {
        userId = res.data.user._id;
        log.success(`Signup successful: ${res.data.user.email}`);
      }
    } catch (e) {
      log.error(`Signup failed: ${e.response?.data?.message || e.message}`);
    }

    await delay(300);

    // Test 3: User Login
    log.test('Testing User Login');
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      if (res.data.success) {
        token = res.data.token;
        log.success(`Login successful`);
      }
    } catch (e) {
      log.error(`Login failed: ${e.response?.data?.message || e.message}`);
    }

    await delay(300);

    if (!token) {
      console.log('\n❌ Cannot continue without token. Stopping tests.\n');
      process.exit(1);
    }

    // Test 4: Get Profile
    log.test('Testing Get User Profile');
    try {
      const res = await axios.get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        log.success(`Profile retrieved: ${res.data.user.name}`);
      }
    } catch (e) {
      log.error(`Get profile failed: ${e.response?.data?.message || e.message}`);
    }

    await delay(300);

    // Test 5: Create Expense
    log.test('Testing Create Expense Transaction');
    try {
      const res = await axios.post(`${API_URL}/transactions`, {
        title: 'Lunch at restaurant',
        type: 'expense',
        amount: 50.5,
        category: 'food',
        description: 'Delicious lunch',
        paymentMethod: 'card',
        date: new Date().toISOString()
      }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        transactionId = res.data.transaction._id;
        log.success(`Expense created: $${res.data.transaction.amount}`);
      }
    } catch (e) {
      console.log('   Full error:', e.response?.data);
      log.error(`Create expense failed: ${e.response?.data?.message || e.message}`);
    }

    await delay(300);

    // Test 6: Create Income
    log.test('Testing Create Income Transaction');
    try {
      const res = await axios.post(`${API_URL}/transactions`, {
        title: 'Monthly Salary',
        type: 'income',
        amount: 2000,
        category: 'salary',
        description: 'Monthly salary deposit',
        paymentMethod: 'bank_transfer',
        date: new Date().toISOString()
      }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        log.success(`Income created: $${res.data.transaction.amount}`);
      }
    } catch (e) {
      console.log('   Full error:', e.response?.data);
      log.error(`Create income failed: ${e.response?.data?.message || e.message}`);
    }

    await delay(300);

    // Test 7: Get Transactions
    log.test('Testing Get All Transactions');
    try {
      const res = await axios.get(`${API_URL}/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 1, limit: 10 }
      });
      if (res.data.success) {
        log.success(`Fetched ${res.data.transactions.length} transactions (Total: ${res.data.pagination.total})`);
      }
    } catch (e) {
      log.error(`Get transactions failed: ${e.response?.data?.message || e.message}`);
    }

    await delay(300);

    // Test 8: Dashboard Summary
    log.test('Testing Dashboard Summary');
    try {
      const res = await axios.get(`${API_URL}/transactions/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        log.success(`Dashboard: Income: $${res.data.summary.totalIncome}, Expense: $${res.data.summary.totalExpense}`);
      }
    } catch (e) {
      log.error(`Dashboard failed: ${e.response?.data?.message || e.message}`);
    }

    await delay(300);

    // Test 9: AI Insights
    log.test('Testing AI Insights');
    try {
      const res = await axios.get(`${API_URL}/transactions/insights`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        log.success(`Insights generated`);
      }
    } catch (e) {
      log.error(`Insights failed: ${e.response?.data?.message || e.message}`);
    }

    await delay(300);

    // Test 10: Set Budget
    log.test('Testing Set Monthly Budget');
    try {
      const res = await axios.post(`${API_URL}/budget`, {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        totalLimit: 5000,
        categoryLimits: {
          food: 500,
          travel: 800,
          shopping: 1000,
          bills: 2000
        },
        alertThreshold: 0.8
      }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        log.success(`Budget set: $${res.data.budget.totalLimit}`);
      }
    } catch (e) {
      log.error(`Set budget failed: ${e.response?.data?.message || e.message}`);
    }

    await delay(300);

    // Test 11: Get Budget Status
    log.test('Testing Get Budget Status');
    try {
      const res = await axios.get(`${API_URL}/budget/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        log.success(`Budget status: Total $${res.data.budget.totalLimit}, Spent $${res.data.budget.totalSpent} (${res.data.budget.percentageSpent}%)`);
      }
    } catch (e) {
      log.error(`Budget status failed: ${e.response?.data?.message || e.message}`);
    }

    await delay(300);

    // Test 12: Update Transaction
    if (transactionId) {
      log.test('Testing Update Transaction');
      try {
        const res = await axios.put(`${API_URL}/transactions/${transactionId}`, {
          amount: 75.5,
          description: 'Updated lunch expense'
        }, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data.success) {
          log.success(`Transaction updated to: $${res.data.transaction.amount}`);
        }
      } catch (e) {
        log.error(`Update transaction failed: ${e.response?.data?.message || e.message}`);
      }

      await delay(300);

      // Test 13: Delete Transaction
      log.test('Testing Delete Transaction');
      try {
        const res = await axios.delete(`${API_URL}/transactions/${transactionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          log.success(`Transaction deleted successfully`);
        }
      } catch (e) {
        log.error(`Delete transaction failed: ${e.response?.data?.message || e.message}`);
      }
    }

    // Summary
    console.log('\n═══════════════════════════════════════');
    console.log('📊 TEST SUMMARY');
    console.log('═══════════════════════════════════════');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Total: ${passed + failed}`);
    console.log('═══════════════════════════════════════\n');

    if (failed === 0) {
      console.log('🎉 All tests passed! Application is fully functional.\n');
      process.exit(0);
    } else {
      console.log(`⚠️  ${failed} test(s) failed. Review errors above.\n`);
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Test suite error:', error.message);
    process.exit(1);
  }
}

runTests();
