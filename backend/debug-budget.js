#!/usr/bin/env node
/**
 * Budget Test Debug
 */

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function debugBudget() {
  try {
    console.log('\n=== DEBUG BUDGET ISSUE ===\n');

    // 1. Create a test user
    console.log('1. Creating test user...');
    const api = axios.create({ baseURL: API_URL });
    
    const userRes = await api.post('/auth/signup', {
      name: 'Budget Test User',
      email: `budgettest${Date.now()}@test.com`,
      password: 'TestPass123!',
      confirmPassword: 'TestPass123!',
    });
    
    const token = userRes.data.token;
    api.defaults.headers.Authorization = `Bearer ${token}`;
    console.log('✅ User created');

    // 2. Try to set budget
    console.log('\n2. Setting budget with month, year, totalLimit...');
    const now = new Date();
    const budgetData = {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      totalLimit: 10000,
      alertThreshold: 80,
    };
    console.log('   Request data:', JSON.stringify(budgetData, null, 2));

    try {
      const budgetRes = await api.post('/budget', budgetData);
      console.log('✅ Budget created successfully');
      console.log('   Response:', JSON.stringify(budgetRes.data, null, 2));
    } catch (budgetErr) {
      console.log('❌ Budget creation failed');
      console.log('   Status:', budgetErr.response?.status);
      console.log('   Error:', JSON.stringify(budgetErr.response?.data, null, 2));
      
      // Let's check what fields the backend expects
      console.log('\n3. Trying alternative field names...');
      
      const altData = {
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        limit: 10000,
      };
      
      try {
        const altRes = await api.post('/budget', altData);
        console.log('✅ Budget created with alternative field');
        console.log('   Fields used:', Object.keys(altData));
      } catch (err) {
        console.log('❌ Alternative also failed');
        console.log('   Error:', JSON.stringify(err.response?.data, null, 2));
      }
    }

  } catch (error) {
    console.error('Fatal Error:', error.message);
  }
}

debugBudget();
