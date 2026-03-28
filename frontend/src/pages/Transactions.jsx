import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTransactions } from '../hooks/useTransactions.js';
import { transactionService } from '../services/transactionService.js';
import TransactionForm from '../components/TransactionForm.jsx';
import TransactionCard from '../components/TransactionCard.jsx';

export const Transactions = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10,
  });

  const {
    transactions,
    loading,
    error,
    pagination,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  useEffect(() => {
    console.log('🔄 Fetching transactions with filters:', filters);
    fetchTransactions(filters);
  }, [filters]);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingId) {
        console.log('✏️ Updating transaction:', editingId, formData);
        await updateTransaction(editingId, formData);
        console.log('✅ Transaction updated successfully');
        setEditingId(null);
        setEditingTransaction(null);
      } else {
        console.log('➕ Creating new transaction:', formData);
        await createTransaction(formData);
        console.log('✅ Transaction created successfully');
      }
      setShowForm(false);
    } catch (err) {
      console.error('❌ Create/Update Error:', err.message, err);
      alert('Failed to save transaction: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setEditingId(transaction._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        console.log('🗑️ Deleting transaction:', id);
        await deleteTransaction(id);
        console.log('✅ Transaction deleted successfully');
      } catch (err) {
        console.error('❌ Delete Error:', err.message, err);
        alert('Failed to delete transaction: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleExport = async () => {
    try {
      console.log('📥 Starting CSV export with filters:', filters);
      const csv = await transactionService.exportCSV(filters);
      console.log('✅ CSV data received:', csv instanceof Blob ? `Blob (${csv.size} bytes)` : 'Response');
      
      // csv is already a Blob from the API, no need to wrap it again
      const url = window.URL.createObjectURL(csv);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      console.log('✅ CSV export successful');
    } catch (err) {
      console.error('❌ Export error:', err.message, err);
      alert('Failed to export transactions: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FBF9F4', position: 'relative', overflow: 'hidden' }}>
      {/* Atmospheric BG */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '-5%',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 101, 132, 0.08), transparent)',
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '5%',
        right: '-10%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13, 115, 119, 0.06), transparent)',
        pointerEvents: 'none'
      }}></div>

      <div className="max-w-7xl mx-auto px-4 lg:px-0 py-8 md:py-12 relative z-10">
        
        {/* Header Section - Animated */}
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start" style={{ animation: 'slideIn 0.7s ease-out' }}>
          <div className="lg:col-span-2">
            <h1 className="text-6xl md:text-7xl font-heading font-bold mb-4" style={{ color: '#1a1a2e', lineHeight: '1.1', letterSpacing: '-1px', animation: 'slideIn 0.7s ease-out' }}>
              Your <span style={{ background: 'linear-gradient(135deg, #0d7377, #FF6584)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>transactions</span>
            </h1>
            <p className="text-lg" style={{ color: '#5a5a6f', fontWeight: 500, animation: 'fadeIn 0.8s ease-out 0.1s both' }}>
              View, manage, and track every expense
            </p>
          </div>
          <div className="flex gap-3 items-start" style={{ animation: 'slideIn 0.7s ease-out 0.15s both' }}>
            <button
              onClick={handleExport}
              className="btn-outline px-5 py-2.5 text-sm transition-all hover:shadow-lg hover:scale-105"
            >
              ↓ Export
            </button>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                setEditingTransaction(null);
              }}
              className="btn-primary px-5 py-2.5 text-sm transition-all hover:shadow-lg hover:scale-105"
            >
              {showForm ? '✕ Cancel' : '+ New'}
            </button>
          </div>
        </div>

        {/* Add/Edit Form - Animated */}
        {showForm && (
          <div className="mb-12 rounded-3xl p-8 overflow-hidden border group transition-all hover:shadow-xl" style={{ backgroundColor: 'white', borderColor: '#e8e6e1', animation: 'slideIn 0.6s ease-out 0.1s both' }}>
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#1a1a2e' }}>
              {editingId ? 'Edit Transaction' : 'Add New Transaction'}
            </h2>
            <p className="text-sm mb-8" style={{ color: '#5a5a6f' }}>
              {editingId ? 'Update your expense details' : 'Record a new expense'}
            </p>
            <TransactionForm
              onSubmit={handleCreateOrUpdate}
              initialData={editingTransaction}
              loading={loading}
            />
          </div>
        )}

        {/* Filters Section - Animated */}
        <div className="mb-12 rounded-3xl p-8 overflow-hidden border group transition-all hover:shadow-xl" style={{ backgroundColor: 'white', borderColor: '#e8e6e1', animation: 'slideIn 0.7s ease-out 0.2s both' }}>
          <h3 className="text-xl font-bold mb-6" style={{ color: '#1a1a2e' }}>Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Type Filter */}
            <div>
              <label className="label text-sm mb-3">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
                className="input-field text-sm"
              >
                <option value="">All Expenses</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="label text-sm mb-3">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
                className="input-field text-sm"
              >
                <option value="">All Categories</option>
                <option value="food">Food</option>
                <option value="travel">Travel</option>
                <option value="bills">Bills</option>
                <option value="shopping">Shopping</option>
                <option value="entertainment">Entertainment</option>
                <option value="health">Health</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Date Range - Start */}
            <div>
              <label className="label text-sm mb-3">From</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value, page: 1 })}
                className="input-field text-sm"
              />
            </div>

            {/* Date Range - End */}
            <div>
              <label className="label text-sm mb-3">To</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value, page: 1 })}
                className="input-field text-sm"
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 rounded-3xl p-6 border-l-4" style={{ backgroundColor: 'rgba(255, 101, 132, 0.08)', borderColor: '#FF6584' }}>
            <p className="text-sm font-medium" style={{ color: '#FF6584' }}>Error: {error}</p>
          </div>
        )}

        {/* Transactions List */}
        {loading ? (
          <div className="rounded-3xl p-16 border text-center" style={{ backgroundColor: 'white', borderColor: '#e8e6e1' }}>
            <p className="text-lg" style={{ color: '#5a5a6f' }}>Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="rounded-3xl p-16 border text-center" style={{ backgroundColor: 'white', borderColor: '#e8e6e1' }}>
            <h3 className="text-2xl font-bold mb-2" style={{ color: '#1a1a2e' }}>No transactions found</h3>
            <p className="text-sm mb-6" style={{ color: '#5a5a6f' }}>
              {filters.type || filters.category || filters.startDate || filters.endDate
                ? 'Try adjusting your filters'
                : 'Start by adding your first transaction'}
            </p>
            {!(filters.type || filters.category || filters.startDate || filters.endDate) && (
              <button
                onClick={() => {
                  setShowForm(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-primary text-sm"
              >
                + Add First Transaction
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <p className="text-sm font-semibold" style={{ color: '#5a5a6f' }}>
                {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="space-y-3 mb-8">
              {transactions.map((transaction) => (
                <TransactionCard
                  key={transaction._id}
                  transaction={transaction}
                  user={user}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="rounded-3xl p-6 border flex items-center justify-center gap-6" style={{ backgroundColor: 'white', borderColor: '#e8e6e1' }}>
                <button
                  onClick={() =>
                    setFilters({
                      ...filters,
                      page: Math.max(1, filters.page - 1),
                    })
                  }
                  disabled={filters.page === 1}
                  className="btn-outline text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: '#5a5a6f' }}>Page</span>
                  <span className="font-bold" style={{ color: '#0d7377' }}>{filters.page}</span>
                  <span className="text-sm" style={{ color: '#5a5a6f' }}>of</span>
                  <span className="font-bold" style={{ color: '#0d7377' }}>{pagination.pages}</span>
                </div>
                <button
                  onClick={() =>
                    setFilters({
                      ...filters,
                      page: Math.min(pagination.pages, filters.page + 1),
                    })
                  }
                  disabled={filters.page === pagination.pages}
                  className="btn-outline text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
