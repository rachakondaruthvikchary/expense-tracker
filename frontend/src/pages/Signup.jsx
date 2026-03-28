import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export const Signup = () => {
  const navigate = useNavigate();
  const { signup, error, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      await signup(formData.name, formData.email, formData.password, formData.confirmPassword);
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FBF9F4', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Top Banner */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: '#F4A261', color: 'white', padding: '16px', textAlign: 'center', fontSize: '16px', fontWeight: 'bold', zIndex: 1000, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        ✨ Create Your Account
      </div>

      <div style={{ width: '100%', maxWidth: '480px', padding: '20px', marginTop: '80px' }}>
        {/* Main Card */}
        <div style={{ borderRadius: '20px', padding: '40px 32px', border: '2px solid #e8e6e1', backgroundColor: 'white', boxShadow: '0 8px 24px rgba(13, 115, 119, 0.12)' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 12px 0', color: '#1a1a2e' }}>
              🚀
            </h1>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#1a1a2e' }}>
              Get Started
            </h2>
            <p style={{ fontSize: '15px', margin: '0', color: '#5a5a6f', fontWeight: '500' }}>
              Join thousands managing their finances smarter
            </p>
          </div>

          {/* Error Message */}
          {(error || localError) && (
            <div style={{ borderRadius: '12px', padding: '16px', marginBottom: '24px', borderLeft: '5px solid #FF6584', backgroundColor: 'rgba(255, 101, 132, 0.1)', border: '1px solid rgba(255, 101, 132, 0.2)' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#FF6584', margin: 0 }}>
                ⚠️ {error || localError}
              </p>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Full Name Field */}
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
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label style={{ display: 'block', fontWeight: '700', marginBottom: '10px', fontSize: '13px', color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '1px' }}>
                📧 Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
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
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label style={{ display: 'block', fontWeight: '700', marginBottom: '10px', fontSize: '13px', color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '1px' }}>
                🔐 Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
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
                placeholder="Min. 6 characters"
                required
                minLength="6"
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label style={{ display: 'block', fontWeight: '700', marginBottom: '10px', fontSize: '13px', color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '1px' }}>
                ✓ Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
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
                placeholder="Repeat your password"
                required
                minLength="6"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '16px',
                fontWeight: '700',
                color: 'white',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #F4A261, #e88c4a)',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(244, 162, 97, 0.3)',
                marginTop: '10px',
                fontFamily: 'inherit'
              }}
            >
              {loading ? '⏳ Creating account...' : '🎉 Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '28px 0', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e8e6e1' }}></div>
            <span style={{ color: '#5a5a6f', fontSize: '13px', fontWeight: '500' }}>Have account?</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e8e6e1' }}></div>
          </div>

          {/* Login Link */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#5a5a6f', margin: '0 0 12px 0', fontWeight: '500' }}>
              Already have an account?
            </p>
            <Link 
              to="/login" 
              style={{ 
                display: 'inline-block',
                padding: '12px 24px',
                fontWeight: '700',
                color: 'white',
                backgroundColor: '#0d7377',
                textDecoration: 'none',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(13, 115, 119, 0.3)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '14px'
              }}
            >
              🔑 Sign In
            </Link>
          </div>
        </div>

        {/* Footer Info */}
        <div style={{ textAlign: 'center', marginTop: '40px', color: '#5a5a6f', fontSize: '13px' }}>
          <p>✨ Free • 🔒 Secure • 💯 Easy to Use</p>
          <p style={{ marginTop: '8px', opacity: 0.8 }}>No credit card required • Start tracking today</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
