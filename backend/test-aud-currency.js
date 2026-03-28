#!/usr/bin/env node
/**
 * Test script to verify AUD currency specifically
 */

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

const testUser = {
  name: 'AUD Test User',
  email: `audtest${Date.now()}@test.com`,
  password: 'testpass123',
  confirmPassword: 'testpass123',
};

async function testAUDCurrency() {
  try {
    console.log('\n📝 Testing AUD Currency Fix...');
    
    // Signup
    const signupRes = await api.post('/auth/signup', testUser);
    const token = signupRes.data.token;
    api.defaults.headers.Authorization = `Bearer ${token}`;
    console.log('✅ User created');

    // Update with AUD currency
    console.log('\n💾 Updating profile with AUD currency...');
    const updateRes = await api.put('/auth/profile', {
      name: 'AUD Test User Updated',
      monthlyBudget: 7500,
      currency: 'AUD',
      theme: 'light'
    });

    if (updateRes.data.user.currency === 'AUD') {
      console.log('✅ AUD currency accepted and saved!');
      console.log('Updated profile:', JSON.stringify(updateRes.data.user, null, 2));
    } else {
      console.log('❌ AUD currency not saved');
    }

  } catch (error) {
    console.error('\n❌ Error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data?.message);
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

testAUDCurrency().then(() => {
  console.log('\n✅ AUD Currency test completed!\n');
  process.exit(0);
});
