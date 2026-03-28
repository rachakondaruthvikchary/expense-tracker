#!/usr/bin/env node
/**
 * Complete App Functionality Test
 * Tests: Signup → Login → Update Profile → Add Transaction → Get Budget
 */

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

const testUser = {
  name: 'Complete Test User',
  email: `apptest${Date.now()}@test.com`,
  password: 'TestPass123',
  confirmPassword: 'TestPass123',
};

async function runCompleteTest() {
  try {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 COMPLETE APP FUNCTIONALITY TEST');
    console.log('='.repeat(60) + '\n');

    // =============================================
    // 1. SIGNUP
    // =============================================
    console.log('✅ TEST 1: USER SIGNUP');
    console.log('📝 Creating account with:', testUser.email);
    
    const signupRes = await api.post('/auth/signup', testUser);
    if (!signupRes.data.token) throw new Error('No token returned from signup');
    
    const token = signupRes.data.token;
    const userId = signupRes.data.user._id;
    api.defaults.headers.Authorization = `Bearer ${token}`;
    
    console.log('✓ User created successfully');
    console.log('  Name:', signupRes.data.user.name);
    console.log('  Email:', signupRes.data.user.email);
    console.log('  Budget:', signupRes.data.user.monthlyBudget);
    console.log('  Currency:', signupRes.data.user.currency);

    // =============================================
    // 2. LOGIN
    // =============================================
    console.log('\n✅ TEST 2: USER LOGIN');
    console.log('🔐 Logging in...');
    
    const loginRes = await api.post('/auth/login', {
      email: testUser.email,
      password: testUser.password,
    });
    if (!loginRes.data.token) throw new Error('No token returned from login');
    
    console.log('✓ Login successful');
    console.log('  Token:', loginRes.data.token.substring(0, 30) + '...');

    // =============================================
    // 3. GET PROFILE
    // =============================================
    console.log('\n✅ TEST 3: GET USER PROFILE');
    console.log('👤 Fetching profile...');
    
    const profileRes = await api.get('/auth/profile');
    console.log('✓ Profile retrieved');
    console.log('  Name:', profileRes.data.user.name);
    console.log('  Email:', profileRes.data.user.email);
    console.log('  Member since:', new Date(profileRes.data.user.createdAt).toLocaleDateString());

    // =============================================
    // 4. UPDATE PROFILE
    // =============================================
    console.log('\n✅ TEST 4: UPDATE PROFILE');
    console.log('💾 Updating profile with new budget and currency...');
    
    const updateRes = await api.put('/auth/profile', {
      name: 'Updated Test User',
      monthlyBudget: 6500,
      currency: 'EUR',
      theme: 'light',
    });
    if (!updateRes.data.user) throw new Error('No user returned from update');
    
    console.log('✓ Profile updated');
    console.log('  Name:', updateRes.data.user.name);
    console.log('  Budget:', updateRes.data.user.monthlyBudget);
    console.log('  Currency:', updateRes.data.user.currency);

    // =============================================
    // 5. VERIFY PROFILE PERSISTED
    // =============================================
    console.log('\n✅ TEST 5: VERIFY PROFILE PERSISTED');
    console.log('🔍 Fetching profile again to confirm...');
    
    const verifyRes = await api.get('/auth/profile');
    const isNameUpdated = verifyRes.data.user.name === 'Updated Test User';
    const isBudgetUpdated = verifyRes.data.user.monthlyBudget === 6500;
    const isCurrencyUpdated = verifyRes.data.user.currency === 'EUR';
    
    if (isNameUpdated && isBudgetUpdated && isCurrencyUpdated) {
      console.log('✓ All profile updates persisted correctly!');
      console.log('  Name:', verifyRes.data.user.name);
      console.log('  Budget:', verifyRes.data.user.monthlyBudget);
      console.log('  Currency:', verifyRes.data.user.currency);
    } else {
      throw new Error('Profile updates not persisted');
    }

    // =============================================
    // 6. ADD TRANSACTION
    // =============================================
    console.log('\n✅ TEST 6: ADD TRANSACTION');
    console.log('💰 Adding expense transaction...');
    
    const transactionRes = await api.post('/transactions', {
      title: 'Test Expense',
      amount: 250,
      category: 'food',
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
    });
    if (!transactionRes.data.transaction) throw new Error('No transaction returned');
    
    console.log('✓ Transaction added');
    console.log('  Title:', transactionRes.data.transaction.title);
    console.log('  Amount:', transactionRes.data.transaction.amount);
    console.log('  Category:', transactionRes.data.transaction.category);

    // =============================================
    // 7. GET BUDGET
    // =============================================
    console.log('\n✅ TEST 7: GET BUDGET');
    console.log('📊 Fetching budget status...');
    
    const budgetRes = await api.get('/budget/status');
    console.log('✓ Budget retrieved');
    console.log('  Monthly Limit:', budgetRes.data.budget.limit);
    console.log('  Spent:', budgetRes.data.budget.spent);
    console.log('  Remaining:', budgetRes.data.budget.remaining);

    // =============================================
    // SUCCESS
    // =============================================
    console.log('\n' + '='.repeat(60));
    console.log('🎉 ALL TESTS PASSED - APP IS WORKING PERFECTLY!');
    console.log('='.repeat(60) + '\n');
    console.log('✅ Signup working');
    console.log('✅ Login working');
    console.log('✅ Profile fetch working');
    console.log('✅ Profile update working');
    console.log('✅ Profile persistence working');
    console.log('✅ Transaction creation working');
    console.log('✅ Budget retrieval working');
    console.log('\n🚀 Your app is ready to use!\n');

  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('❌ TEST FAILED');
    console.error('='.repeat(60) + '\n');
    
    if (error.response) {
      console.error('API Error:');
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data?.message);
      console.error('Details:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
    
    process.exit(1);
  }
}

runCompleteTest().then(() => {
  process.exit(0);
});
