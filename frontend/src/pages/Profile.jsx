import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export const Profile = () => {
  const { user, updateProfile, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    monthlyBudget: 5000,
    currency: 'USD',
    theme: 'light',
  });
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Clear errors and load user data on mount and when user changes
    console.log('👤 Profile: User data updated:', user?.email);
    setLocalError('');
    setSuccess('');
    
    if (user) {
      console.log('✅ Profile: Loading user data:', user);
      setFormData({
        name: user.name || '',
        monthlyBudget: user.monthlyBudget || 5000,
        currency: user.currency || 'USD',
        theme: user.theme || 'light',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'monthlyBudget' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccess('');

    try {
      await updateProfile(
        formData.name,
        formData.monthlyBudget,
        formData.currency,
        formData.theme
      );
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FBF9F4', padding: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <p style={{ fontSize: '18px', color: '#5a5a6f', marginBottom: '20px' }}>⏳ Loading profile...</p>
          <p style={{ fontSize: '14px', color: '#999', marginBottom: '30px' }}>If this persists, try logging out and logging back in.</p>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0d7377',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Sign Out & Re-login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FBF9F4', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '40px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>
            👤 Profile Settings
          </h1>
          <p style={{ fontSize: '16px', color: '#5a5a6f' }}>
            Manage your account and preferences
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {/* Profile Info Card */}
          <div style={{ borderRadius: '16px', padding: '32px', border: '2px solid #e8e6e1', backgroundColor: 'white', boxShadow: '0 8px 24px rgba(13, 115, 119, 0.12)', textAlign: 'center' }}>
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>👤</div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>
              {user.name}
            </h2>
            <p style={{ fontSize: '14px', color: '#5a5a6f', marginBottom: '24px', wordBreak: 'break-all' }}>
              {user.email}
            </p>
            <div style={{ paddingTop: '24px', borderTop: '1px solid #e8e6e1' }}>
              <p style={{ fontSize: '12px', color: '#5a5a6f', marginBottom: '8px' }}>
                Member since
              </p>
              <p style={{ fontWeight: 'bold', color: '#1a1a2e' }}>
                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Settings Form Card */}
          <div style={{ gridColumn: 'span 2', borderRadius: '16px', padding: '32px', border: '2px solid #e8e6e1', backgroundColor: 'white', boxShadow: '0 8px 24px rgba(13, 115, 119, 0.12)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>
              Account Settings
            </h2>
            <p style={{ fontSize: '14px', color: '#5a5a6f', marginBottom: '24px' }}>
              Update your profile information
            </p>

            {localError && (
              <div style={{ borderRadius: '12px', padding: '16px', marginBottom: '20px', borderLeft: '5px solid #FF6584', backgroundColor: 'rgba(255, 101, 132, 0.1)', border: '1px solid rgba(255, 101, 132, 0.2)' }}>
                <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#FF6584', margin: '0' }}>
                  ⚠️ {localError}
                </p>
              </div>
            )}

            {success && (
              <div style={{ borderRadius: '12px', padding: '16px', marginBottom: '20px', borderLeft: '5px solid #06a77d', backgroundColor: 'rgba(6, 168, 125, 0.1)', border: '1px solid rgba(6, 168, 125, 0.2)' }}>
                <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#06a77d', margin: '0' }}>
                  ✅ {success}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Full Name */}
              <div>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '10px', fontSize: '13px', color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  👤 Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    fontSize: '15px',
                    border: '2px solid #e8e6e1',
                    backgroundColor: '#f5f3f0',
                    transition: 'all 0.3s ease',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              {/* Monthly Budget */}
              <div>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '10px', fontSize: '13px', color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  💰 Default Monthly Budget
                </label>
                <input
                  type="number"
                  name="monthlyBudget"
                  value={formData.monthlyBudget}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    fontSize: '15px',
                    border: '2px solid #e8e6e1',
                    backgroundColor: '#f5f3f0',
                    transition: 'all 0.3s ease',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                  step="0.01"
                  min="0"
                  required
                />
                <p style={{ fontSize: '12px', color: '#5a5a6f', marginTop: '8px' }}>
                  This will be used for new budget calculations
                </p>
              </div>

              {/* Currency */}
              <div>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '10px', fontSize: '13px', color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  💵 Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    fontSize: '15px',
                    border: '2px solid #e8e6e1',
                    backgroundColor: '#f5f3f0',
                    transition: 'all 0.3s ease',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                >
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                  <option>INR</option>
                  <option>AUD</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '14px 16px',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: 'white',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #0d7377, #0a5b60)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(13, 115, 119, 0.3)',
                  marginTop: '10px',
                  fontFamily: 'inherit'
                }}
              >
                {loading ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Profile;
