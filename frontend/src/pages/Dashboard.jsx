import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTransactions } from '../hooks/useTransactions.js';
import { transactionService } from '../services/transactionService.js';
import Charts from '../components/Charts.jsx';
import { formatCurrencyWithUser } from '../utils/formatCurrency.js';
import { formatDistanceToNow } from 'date-fns';

export const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [summaryData, insightsData] = await Promise.all([
          transactionService.getDashboardSummary(),
          transactionService.getInsights(),
        ]);
        setSummary(summaryData.summary);
        setInsights(insightsData.insights);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-2">⏳</div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FBF9F4', position: 'relative', overflow: 'hidden' }}>
      {/* Atmospheric Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13, 115, 119, 0.08), transparent)',
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '-5%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 101, 132, 0.06), transparent)',
        pointerEvents: 'none'
      }}></div>

      <div className="max-w-7xl mx-auto px-4 lg:px-0 py-8 md:py-12 relative z-10">
        
        {/* Header Section - Animated */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start" style={{ animation: 'slideIn 0.7s ease-out' }}>
          <div className="lg:col-span-2">
            <h1 className="font-heading text-6xl md:text-7xl font-bold mb-4" style={{ color: '#1a1a2e', lineHeight: '1.1', letterSpacing: '-1px' }}>
              Welcome back,<br /><span style={{ background: 'linear-gradient(135deg, #0d7377, #FF6584)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{user?.name}</span>
            </h1>
            <p className="text-lg md:text-xl" style={{ color: '#5a5a6f', fontWeight: 500, animation: 'fadeIn 0.8s ease-out 0.1s both' }}>
              Your financial outlook for this period
            </p>
          </div>
          <div className="hidden lg:block h-32 rounded-2xl p-6 overflow-hidden relative group transition-all hover:shadow-lg hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, #FFE66D, #F4A261)', animation: 'fadeIn 0.8s ease-out 0.2s both', cursor: 'pointer' }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.2), transparent)' }}></div>
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <p className="text-xs font-bold tracking-widest" style={{ color: 'rgba(26, 26, 46, 0.7)', textTransform: 'uppercase' }}>💡 Smart Tip</p>
              </div>
              <p className="font-bold text-sm leading-tight" style={{ color: '#1a1a2e' }}>Every dollar saved today compounds into freedom tomorrow</p>
            </div>
          </div>
        </div>

        {/* Key Metrics - Staggered Animation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12" style={{ animation: 'fadeIn 0.6s ease-out 0.2s both' }}>
          {/* Monthly Budget - Large Card */}
          <div className="lg:col-span-2 rounded-3xl p-8 lg:p-10 overflow-hidden relative group transition-transform hover:scale-105 hover:shadow-2xl" style={{ 
            background: 'linear-gradient(135deg, #0d7377 0%, #0a5b60 100%)', 
            color: 'white',
            animation: 'slideIn 0.7s ease-out 0.1s both',
            cursor: 'pointer'
          }}>
            <div className="absolute top-0 right-0 w-40 h-40 opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: 'radial-gradient(circle, white, transparent)' }}></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.1), transparent)' }}></div>
            <div className="relative z-10">
              <p className="text-sm font-semibold tracking-widest mb-3 opacity-80 uppercase">Monthly Budget Limit</p>
              <h2 className="text-3xl font-bold mb-4">
                {formatCurrencyWithUser(user?.monthlyBudget || 0, user)}
              </h2>
              <p className="text-sm opacity-75">Your allocated budget for this month</p>
            </div>
          </div>

          {/* Total Expenses - Tall Card */}
          <div className="rounded-3xl p-8 lg:p-10 overflow-hidden relative group transition-transform hover:scale-105 hover:shadow-2xl" style={{ 
            background: 'linear-gradient(135deg, #FF6584 0%, #ff3d5a 100%)', 
            color: 'white',
            animation: 'slideIn 0.7s ease-out 0.2s both',
            cursor: 'pointer'
          }}>
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: 'radial-gradient(circle, white, transparent)' }}></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.1), transparent)' }}></div>
            <div className="relative z-10">
              <p className="text-sm font-semibold tracking-widest mb-3 opacity-80 uppercase">Total Spent</p>
              <h2 className="text-3xl font-bold">
                {formatCurrencyWithUser(summary?.totalExpense || 0, user)}
              </h2>
            </div>
          </div>
        </div>

        {/* Budget Status & Insights Grid - Staggered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12" style={{ animation: 'fadeIn 0.6s ease-out 0.3s both' }}>
          
          {/* Budget Remaining */}
          <div className="rounded-3xl p-8 overflow-hidden border group transition-all hover:shadow-xl hover:-translate-y-1" style={{ backgroundColor: 'white', borderColor: '#e8e6e1', animation: 'slideIn 0.7s ease-out 0.25s both' }}>
            <h3 className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: '#5a5a6f' }}>Budget Remaining</h3>
            {user?.monthlyBudget ? (
              <>
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-2" style={{ color: '#0d7377' }}>
                    {formatCurrencyWithUser(Math.max(0, (user.monthlyBudget - (summary?.totalExpense || 0))), user)}
                  </h2>
                  <div className="flex justify-between text-sm mb-3" style={{ color: '#5a5a6f' }}>
                    <span>{((summary?.totalExpense || 0) / user.monthlyBudget * 100).toFixed(0)}% used</span>
                    <span>{formatCurrencyWithUser(summary?.totalExpense || 0, user)} / {formatCurrencyWithUser(user.monthlyBudget, user)}</span>
                  </div>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#f5f3f0' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(((summary?.totalExpense || 0) / user.monthlyBudget) * 100, 100)}%`,
                      background: ((summary?.totalExpense || 0) / user.monthlyBudget) * 100 > 100
                        ? 'linear-gradient(90deg, #FF6584, #ff3d5a)'
                        : ((summary?.totalExpense || 0) / user.monthlyBudget) * 100 > 80
                        ? 'linear-gradient(90deg, #F4A261, #e88c4a)'
                        : 'linear-gradient(90deg, #0d7377, #0a5b60)',
                      boxShadow: '0 0 15px rgba(13, 115, 119, 0.3)'
                    }}
                  ></div>
                </div>
              </>
            ) : (
              <div>
                <p className="text-gray-400 text-sm mb-4">No budget set yet</p>
                <a href="/profile" className="btn-primary inline-block text-sm">
                  Set Your Budget
                </a>
              </div>
            )}
          </div>

          {/* Spending Status */}
          <div className="rounded-3xl p-8 overflow-hidden border group transition-all hover:shadow-xl hover:-translate-y-1" style={{ backgroundColor: 'white', borderColor: '#e8e6e1', animation: 'slideIn 0.7s ease-out 0.35s both' }}>
            <h3 className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: '#5a5a6f' }}>This Month's Spending</h3>
            {summary?.totalExpense > 0 ? (
              <>
                <h2 className="text-3xl font-bold mb-2" style={{ color: '#FF6584' }}>
                  {formatCurrencyWithUser(summary.totalExpense, user)}
                </h2>
                <p className="text-sm" style={{ color: '#5a5a6f' }}>across {summary?.transactionCount || 0} transactions</p>
              </>
            ) : (
              <div>
                <h2 className="text-4xl font-bold" style={{ color: '#0d7377' }}>$0.00</h2>
                <p className="text-sm mt-2" style={{ color: '#5a5a6f' }}>No expenses recorded yet</p>
              </div>
            )}
          </div>
        </div>
        {/* AI Insights - Animated */}
        {insights.length > 0 && (
          <div className="mb-12 rounded-3xl p-8 overflow-hidden relative group" style={{ background: 'linear-gradient(135deg, rgba(13, 115, 119, 0.08), rgba(244, 162, 97, 0.08))', borderLeft: '4px solid #0d7377', animation: 'slideIn 0.7s ease-out 0.4s both' }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'radial-gradient(circle at 0% 0%, rgba(13, 115, 119, 0.05), transparent)' }}></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#1a1a2e' }}>Financial Insights</h3>
              <p className="text-sm mb-6" style={{ color: '#5a5a6f' }}>Patterns & recommendations based on your spending</p>
              <div className="space-y-3">
                {insights.map((insight, idx) => {
                  const severityStyles = {
                    critical: { bg: 'rgba(255, 101, 132, 0.1)', border: '#FF6584', color: '#FF6584' },
                    warning: { bg: 'rgba(244, 162, 97, 0.1)', border: '#F4A261', color: '#F4A261' },
                    success: { bg: 'rgba(13, 115, 119, 0.1)', border: '#0d7377', color: '#0d7377' }
                  };
                  const style = severityStyles[insight.severity] || severityStyles.warning;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl transition-all hover:shadow-md hover:scale-105 hover:-translate-x-1"
                      style={{ backgroundColor: style.bg, borderLeft: `3px solid ${style.border}`, animation: `slideIn 0.6s ease-out ${0.45 + idx * 0.08}s both` }}
                    >
                      <p className="text-sm font-medium" style={{ color: style.color }}>
                        {insight.message}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Charts Section - Animated */}
        <div className="mb-12 rounded-3xl p-8 overflow-hidden border group transition-all hover:shadow-xl" style={{ backgroundColor: 'white', borderColor: '#e8e6e1', animation: 'slideIn 0.7s ease-out 0.5s both' }}>
          <div className="mb-8" style={{ animation: 'fadeIn 0.6s ease-out 0.55s both' }}>
            <h3 className="text-2xl font-bold mb-2" style={{ color: '#1a1a2e' }}>Spending Trends</h3>
            <p className="text-sm" style={{ color: '#5a5a6f' }}>Your expense patterns over time</p>
          </div>
          <div style={{ animation: 'fadeIn 0.8s ease-out 0.6s both' }}>
            <Charts user={user} />
          </div>
        </div>

        {/* Top Categories - Grid Animated */}
        {summary?.topCategories?.length > 0 && (
          <div className="rounded-3xl p-8 overflow-hidden border group transition-all hover:shadow-xl" style={{ backgroundColor: 'white', borderColor: '#e8e6e1', animation: 'slideIn 0.7s ease-out 0.6s both' }}>
            <h3 className="text-2xl font-bold mb-8" style={{ color: '#1a1a2e' }}>
              Top Spending Categories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {summary.topCategories.map((cat, idx) => (
                <div 
                  key={idx} 
                  className="p-6 rounded-2xl transition-all hover:shadow-lg hover:scale-105 hover:-translate-y-1 cursor-pointer group"
                  style={{ 
                    backgroundColor: '#FBF9F4',
                    borderLeft: `4px solid ${idx === 0 ? '#FF6584' : idx === 1 ? '#F4A261' : '#0d7377'}`,
                    animation: `slideIn 0.6s ease-out ${0.65 + idx * 0.08}s both`
                  }}
                >
                  <p className="text-xs font-semibold tracking-widest uppercase mb-3 group-hover:scale-110 transition-transform" style={{ color: '#5a5a6f' }}>
                    {cat.category}
                  </p>
                  <p className="text-3xl font-bold group-hover:scale-110 transition-transform origin-left" style={{ color: idx === 0 ? '#FF6584' : idx === 1 ? '#F4A261' : '#0d7377' }}>
                    {formatCurrencyWithUser(cat.amount, user)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
