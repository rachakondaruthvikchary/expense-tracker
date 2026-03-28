/**
 * Format currency based on currency code
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (USD, EUR, GBP, INR, AUD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    AUD: '$'
  };

  const symbol = currencySymbols[currency] || '$';
  const numAmount = parseFloat(amount) || 0;
  
  // Use 2 decimal places for all currencies
  const formatted = numAmount.toFixed(2);
  
  return `${symbol}${formatted}`;
};

/**
 * Dynamic currency formatter with user context
 * @param {number} amount - The amount to format
 * @param {object} user - User object containing currency preference
 * @returns {string} Formatted currency string
 */
export const formatCurrencyWithUser = (amount, user) => {
  const currency = user?.currency || 'USD';
  return formatCurrency(amount, currency);
};
