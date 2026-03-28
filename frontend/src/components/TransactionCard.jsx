import { formatDistanceToNow } from 'date-fns';
import { formatCurrencyWithUser } from '../utils/formatCurrency.js';

const categoryEmojis = {
  food: '🍔',
  travel: '✈️',
  bills: '📱',
  shopping: '🛍️',
  entertainment: '🎬',
  health: '🏥',
  education: '📚',
  other: '💰',
};

export const TransactionCard = ({ transaction, user, onEdit, onDelete }) => {
  const textColor = 'text-red-600';
  const bgColor = 'bg-red-50 border-l-4 border-red-500';

  return (
    <div className={`card p-5 flex items-center justify-between hover:shadow-lg transition-all duration-200 ${bgColor}`}>
      {/* Left Section - Icon & Details */}
      <div className="flex items-center gap-4 flex-1">
        {/* Category Icon */}
        <div className="text-4xl p-3 rounded-lg bg-red-100">
          {categoryEmojis[transaction.category] || categoryEmojis.other}
        </div>
        
        {/* Transaction Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
            {transaction.title}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
              {transaction.category}
            </span>
            <span className="text-gray-400 dark:text-gray-600">•</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {formatDistanceToNow(new Date(transaction.date), { addSuffix: true })}
            </span>
            {transaction.paymentMethod && (
              <>
                <span className="text-gray-400 dark:text-gray-600">•</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {transaction.paymentMethod}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Section - Amount & Actions */}
      <div className="flex items-center gap-6">
        {/* Amount */}
        <div className="text-right">
          <div className={`text-3xl font-bold ${textColor}`}>
            -{formatCurrencyWithUser(transaction.amount, user)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(transaction)}
            className="p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
            title="Edit transaction"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => onDelete(transaction._id)}
            className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
            title="Delete transaction"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
