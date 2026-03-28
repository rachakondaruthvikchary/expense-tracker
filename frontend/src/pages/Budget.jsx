import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useBudget } from '../hooks/useBudget.js';
import { formatCurrencyWithUser } from '../utils/formatCurrency.js';

export const Budget = () => {
  const { user } = useAuth();
  const { budget, loading, error, alerts, fetchBudgetStatus, setMonthlyBudget } = useBudget();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    totalLimit: '',
    alertThreshold: 0.8,
  });

  useEffect(() => {
    console.log('📊 Budget page: Mounting, fetching budget status');
    fetchBudgetStatus();
  }, [fetchBudgetStatus]);

  useEffect(() => {
    if (budget) {
      console.log('📊 Budget page: Budget loaded:', budget.totalLimit);
      setFormData({
        totalLimit: budget.totalLimit,
        alertThreshold: budget.alertThreshold || 0.8,
      });
    }
  }, [budget]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const now = new Date();
      await setMonthlyBudget(
        now.getMonth() + 1,
        now.getFullYear(),
        parseFloat(formData.totalLimit),
        new Map(),
        parseFloat(formData.alertThreshold)
      );
      setShowForm(false);
      await fetchBudgetStatus();
    } catch (err) {
      console.error('Error setting budget:', err);
      alert('Failed to set budget: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FBF9F4' }}>
        <div style={{ textAlign: 'center', fontSize: '18px', color: '#5a5a6f' }}>⏳ Loading budget...</div>
      </div>
    );
  }

  if (!budget) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FBF9F4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ maxWidth: '500px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>
            💰 No Budget Set
          </h1>
          <p style={{ fontSize: '16px', color: '#5a5a6f', marginBottom: '32px' }}>
            Create your first budget to start tracking and managing your expenses effectively.
          </p>
          
          {error && (
            <div style={{ padding: '16px', marginBottom: '20px', borderRadius: '8px', backgroundColor: '#fff3cd', borderLeft: '4px solid #ff9800', color: '#856404' }}>
              <p style={{ margin: '0 0 12px 0', fontWeight: 'bold' }}>⚠️ {error}</p>
              <button
                onClick={() => {
                  console.log('🔄 Retrying budget fetch...');
                  fetchBudgetStatus();
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ff9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🔄 Retry
              </button>
            </div>
          )}
          
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '14px 32px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: '#0d7377',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(13, 115, 119, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(13, 115, 119, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(13, 115, 119, 0.3)';
            }}
          >
            ⚙️ Set Monthly Budget
          </button>
        </div>
      </div>
    );
  }

  const percentageSpent = parseFloat(budget.percentageSpent) || 0;
  const progressColor =
    percentageSpent >= 100
      ? 'bg-danger'
      : percentageSpent >= 80
      ? 'bg-warning'
      : 'bg-success';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FBF9F4', position: 'relative', overflow: 'hidden' }}>
      {/* Atmospheric BG */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-8%',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(244, 162, 97, 0.1), transparent)',
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '-5%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13, 115, 119, 0.07), transparent)',
        pointerEvents: 'none'
      }}></div>

      <div className="max-w-7xl mx-auto px-4 lg:px-0 py-8 md:py-12 relative z-10">
        {/* Header - Animated */}
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start" style={{ animation: 'slideIn 0.7s ease-out' }}>
          <div className="lg:col-span-2">
            <h1 className="text-6xl md:text-7xl font-heading font-bold mb-4" style={{ color: '#1a1a2e', lineHeight: '1.1', letterSpacing: '-1px' }}>
              <span style={{ background: 'linear-gradient(135deg, #0d7377, #F4A261)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Budget</span> control
            </h1>
            <p className="text-lg" style={{ color: '#5a5a6f', fontWeight: 500, animation: 'fadeIn 0.8s ease-out 0.1s both' }}>
              Set limits and monitor your spending
            </p>
          </div>
          <div className="flex justify-end" style={{ animation: 'slideIn 0.7s ease-out 0.15s both' }}>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary px-6 py-2.5 transition-all hover:shadow-lg hover:scale-105"
            >
              {showForm ? '✕ Cancel' : '⚙️ Edit'}
            </button>
          </div>
        </div>

        {/* Edit Form - Animated */}
        {showForm && (
          <div className="mb-12 rounded-3xl p-8 overflow-hidden border group transition-all hover:shadow-xl" style={{ backgroundColor: 'white', borderColor: '#e8e6e1', animation: 'slideIn 0.6s ease-out 0.1s both' }}>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#1a1a2e' }}>Configure Budget</h2>
            <p className="text-sm mb-8" style={{ color: '#5a5a6f' }}>Set your monthly limit and alert threshold</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="label text-sm mb-3">Monthly Budget Limit</label>
                <input
                  type="number"
                  value={formData.totalLimit}
                  onChange={(e) => setFormData({ ...formData, totalLimit: e.target.value })}
                  className="input-field"
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="label text-sm mb-3">Alert Threshold (%)</label>
                <input
                  type="number"
                  value={formData.alertThreshold * 100}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      alertThreshold: parseFloat(e.target.value) / 100,
                    })
                  }
                  className="input-field"
                  placeholder="80"
                  step="5"
                  min="0"
                  max="100"
                />
                <p className="text-xs mt-2" style={{ color: '#5a5a6f' }}>
                  You'll be alerted when spending reaches this percentage
                </p>
              </div>

              <button type="submit" className="btn-primary w-full">
                Save Changes
              </button>
            </form>
          </div>
        )}

        {error && (
          <div className="mb-8 rounded-3xl p-6 border-l-4" style={{ backgroundColor: 'rgba(255, 101, 132, 0.08)', borderColor: '#FF6584', animation: 'slideIn 0.6s ease-out 0.2s both' }}>
            <p className="text-sm font-medium" style={{ color: '#FF6584' }}>Error: {error}</p>
          </div>
        )}

        {/* Budget Overview - Animated */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12" style={{ animation: 'fadeIn 0.6s ease-out 0.25s both' }}>
          {/* Budget Limit - Large */}
          <div className="lg:col-span-2 rounded-3xl p-10 overflow-hidden relative group transition-all hover:shadow-2xl hover:-translate-y-2" style={{ 
            background: 'linear-gradient(135deg, #F4A261 0%, #e88c4a 100%)', 
            color: 'white',
            animation: 'slideIn 0.7s ease-out 0.2s both',
            cursor: 'pointer'
          }}>
            <div className="absolute top-0 right-0 w-48 h-48 opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: 'radial-gradient(circle, white, transparent)' }}></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.15), transparent)' }}></div>
            <div className="relative z-10">
              <p className="text-sm font-semibold tracking-widest mb-3 opacity-80 uppercase">Your Budget Limit</p>
              <h2 className="text-3xl font-bold mb-2">
                {formatCurrencyWithUser(budget.totalLimit || 0, user)}
              </h2>
              <p className="text-sm opacity-75">per month</p>
            </div>
          </div>

          {/* Remaining Budget */}
          <div className={`rounded-3xl p-10 overflow-hidden relative group transition-all hover:shadow-2xl hover:-translate-y-2`} style={{ background: parseFloat(budget.remainingBudget) >= 0 ? 'linear-gradient(135deg, #0d7377, #0a5b60)' : 'linear-gradient(135deg, #FF6584, #ff3d5a)', color: 'white', animation: 'slideIn 0.7s ease-out 0.3s both', cursor: 'pointer' }}>
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: 'radial-gradient(circle, white, transparent)' }}></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.15), transparent)' }}></div>
            <div className="relative z-10">
              <p className="text-sm font-semibold tracking-widest mb-3 opacity-80 uppercase">Remaining</p>
              <h2 className="text-3xl font-bold">
                {formatCurrencyWithUser(budget.remainingBudget || 0, user)}
              </h2>
            </div>
          </div>
        </div>

        {/* Spending Progress - Animated */}
        <div className="mb-12 rounded-3xl p-8 overflow-hidden border group transition-all hover:shadow-xl" style={{ backgroundColor: 'white', borderColor: '#e8e6e1', animation: 'slideIn 0.7s ease-out 0.35s both' }}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold mb-1" style={{ color: '#1a1a2e' }}>Spending Progress</h3>
              <p className="text-sm" style={{ color: '#5a5a6f' }}>You've spent <span style={{ fontWeight: 600 }}>{formatCurrencyWithUser(budget.totalSpent || 0, user)}</span> of <span style={{ fontWeight: 600 }}>{formatCurrencyWithUser(budget.totalLimit || 0, user)}</span></p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold" style={{ color: percentageSpent >= 100 ? '#FF6584' : percentageSpent >= 80 ? '#F4A261' : '#0d7377' }}>
                {percentageSpent.toFixed(0)}%
              </p>
            </div>
          </div>
          <div className="w-full h-4 rounded-full overflow-hidden" style={{ backgroundColor: '#f5f3f0' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(percentageSpent, 100)}%`,
                background: percentageSpent >= 100
                  ? 'linear-gradient(90deg, #FF6584, #ff3d5a)'
                  : percentageSpent >= 80
                  ? 'linear-gradient(90deg, #F4A261, #e88c4a)'
                  : 'linear-gradient(90deg, #0d7377, #0a5b60)',
                boxShadow: '0 0 20px rgba(13, 115, 119, 0.4)'
              }}
            />
          </div>
        </div>

        {/* Alerts - Animated */}
        {alerts.length > 0 && (
          <div className="mb-12 rounded-3xl p-8 overflow-hidden relative group" style={{ background: 'linear-gradient(135deg, rgba(255, 101, 132, 0.08), rgba(244, 162, 97, 0.08))', borderLeft: '4px solid #FF6584', animation: 'slideIn 0.7s ease-out 0.4s both' }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'radial-gradient(circle at 0% 0%, rgba(255, 101, 132, 0.05), transparent)' }}></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-6" style={{ color: '#1a1a2e' }}>Budget Alerts</h3>
              <div className="space-y-3">
                {alerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl transition-all hover:shadow-md hover:scale-105"
                    style={{
                      backgroundColor: alert.severity === 'critical' ? 'rgba(255, 101, 132, 0.1)' : 'rgba(244, 162, 97, 0.1)',
                      borderLeft: `3px solid ${alert.severity === 'critical' ? '#FF6584' : '#F4A261'}`,
                      animation: `slideIn 0.6s ease-out ${0.45 + idx * 0.08}s both`
                    }}
                  >
                    <p className="text-sm font-medium" style={{ color: alert.severity === 'critical' ? '#FF6584' : '#F4A261' }}>
                      {alert.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Category Breakdown - Animated */}
        {budget.categorySpent && Object.keys(budget.categorySpent).length > 0 && (
          <div className="rounded-3xl p-8 overflow-hidden border group transition-all hover:shadow-xl" style={{ backgroundColor: 'white', borderColor: '#e8e6e1', animation: 'slideIn 0.7s ease-out 0.5s both' }}>
            <h3 className="text-xl font-bold mb-8" style={{ color: '#1a1a2e' }}>Spending by Category</h3>
            <div className="space-y-6">
              {Object.entries(budget.categorySpent).map(([category, amount], idx) => {
                const categoryPercentage = (amount / budget.totalSpent) * 100;
                const colors = ['#FF6584', '#F4A261', '#0d7377'];
                const color = colors[idx % colors.length];
                return (
                  <div key={category} style={{ animation: `slideIn 0.6s ease-out ${0.55 + idx * 0.08}s both` }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold" style={{ color: '#1a1a2e', textTransform: 'capitalize' }}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </span>
                      <span className="text-sm font-bold" style={{ color }}>
                        {formatCurrencyWithUser(amount, user)} ({categoryPercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#f5f3f0' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500 hover:shadow-lg"
                        style={{ width: `${categoryPercentage}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Budget;
