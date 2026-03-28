/**
 * Convert transactions to CSV format
 */
export const convertToCSV = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return 'No transactions to export';
  }

  // CSV Header
  const headers = ['Date', 'Title', 'Category', 'Type', 'Amount', 'Payment Method', 'Description'];
  const rows = [headers.join(',')];

  // Add transaction rows
  transactions.forEach((transaction) => {
    const date = new Date(transaction.date).toISOString().split('T')[0];
    const row = [
      date,
      `"${transaction.title}"`, // Quote to handle commas
      transaction.category,
      transaction.type,
      transaction.amount,
      transaction.paymentMethod || 'cash',
      `"${transaction.description || ''}"`, // Quote to handle commas
    ];
    rows.push(row.join(','));
  });

  return rows.join('\n');
};

/**
 * Generate CSV filename with timestamp
 */
export const generateCSVFilename = () => {
  const date = new Date();
  const timestamp = date.toISOString().split('T')[0];
  return `expense-tracker-${timestamp}.csv`;
};
