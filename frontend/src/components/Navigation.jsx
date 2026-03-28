import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export const Navigation = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition" onClick={() => navigate('/dashboard')}>
          <div className="text-3xl">💰</div>
          <div>
            <h1 className="text-xl font-bold text-primary">Expense Tracker</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">Financial Management</p>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 font-medium transition-all rounded-lg"
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => navigate('/transactions')}
            className="px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 font-medium transition-all rounded-lg"
          >
            📋 Transactions
          </button>
          <button
            onClick={() => navigate('/budget')}
            className="px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 font-medium transition-all rounded-lg"
          >
            🎯 Budget
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 font-medium transition-all rounded-lg"
          >
            👤 Profile
          </button>
          
          {/* Divider */}
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-2"></div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="ml-2 px-4 py-2 bg-gradient-to-r from-primary to-indigo-700 text-white rounded-lg hover:shadow-lg transition-all font-medium"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 space-y-2 shadow-lg">
          <button
            onClick={() => {
              navigate('/dashboard');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-medium transition"
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => {
              navigate('/transactions');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-medium transition"
          >
            📋 Transactions
          </button>
          <button
            onClick={() => {
              navigate('/budget');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-medium transition"
          >
            🎯 Budget
          </button>
          <button
            onClick={() => {
              navigate('/profile');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-medium transition"
          >
            👤 Profile
          </button>
          <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-indigo-700 text-white font-medium transition-all hover:shadow-lg mt-2"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
