#!/usr/bin/env node
/**
 * Test script to debug profile update functionality
 * Tests: Signup → Login → Update Profile
 */

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Test data
const testUser = {
  name: 'Test User',
  email: `testuser${Date.now()}@test.com`,
  password: 'testpass123',
  confirmPassword: 'testpass123',
};

const updatedProfile = {
  name: 'Updated Test User',
  monthlyBudget: 8000,
  currency: 'EUR',
  theme: 'light',
};

async function runTests() {
  let token = null;
  let userId = null;

  try {
    console.log('\n📝 STEP 1: Signing up new user...');
    console.log('📧 Email:', testUser.email);
    
    const signupRes = await api.post('/auth/signup', testUser);
    console.log('✅ Signup successful');
    console.log('Response:', JSON.stringify(signupRes.data, null, 2));
    
    token = signupRes.data.token;
    userId = signupRes.data.user?.id;

    if (!token) {
      throw new Error('❌ No token returned from signup');
    }

    console.log('\n🔐 STEP 2: Logging in...');
    const loginRes = await api.post('/auth/login', {
      email: testUser.email,
      password: testUser.password,
    });
    console.log('✅ Login successful');
    console.log('Token:', loginRes.data.token?.substring(0, 20) + '...');
    token = loginRes.data.token;

    // Add token to future requests
    api.defaults.headers.Authorization = `Bearer ${token}`;

    console.log('\n👤 STEP 3: Getting current profile...');
    const profileRes = await api.get('/auth/profile');
    console.log('✅ Get profile successful');
    console.log('Current profile:', JSON.stringify(profileRes.data.user, null, 2));

    console.log('\n💾 STEP 4: Updating profile...');
    console.log('Update data:', JSON.stringify(updatedProfile, null, 2));
    
    const updateRes = await api.put('/auth/profile', updatedProfile);
    console.log('✅ Profile update successful!');
    console.log('Updated profile:', JSON.stringify(updateRes.data.user, null, 2));

    // Verify the update
    console.log('\n✔️ STEP 5: Verifying update by fetching profile again...');
    const verifyRes = await api.get('/auth/profile');
    console.log('Verified profile:', JSON.stringify(verifyRes.data.user, null, 2));

    // Check if update was persisted
    if (verifyRes.data.user.name === updatedProfile.name &&
        verifyRes.data.user.monthlyBudget === updatedProfile.monthlyBudget &&
        verifyRes.data.user.currency === updatedProfile.currency) {
      console.log('\n🎉 SUCCESS: Profile updates were persisted correctly!');
    } else {
      console.log('\n❌ ERROR: Profile updates were NOT persisted!');
      console.log('Expected:', updatedProfile);
      console.log('Got:', verifyRes.data.user);
    }

  } catch (error) {
    console.error('\n❌ Error occurred:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data?.message);
      console.error('Full response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

runTests().then(() => {
  console.log('\n✅ All tests completed!\n');
  process.exit(0);
});
