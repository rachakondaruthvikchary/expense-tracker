import mongoose from 'mongoose';

/**
 * Transaction Schema
 * Stores financial transactions (income/expense)
 */
const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: [true, 'Type must be either income or expense'],
    },
    category: {
      type: String,
      enum: ['food', 'travel', 'bills', 'shopping', 'entertainment', 'health', 'education', 'other', 'salary', 'bonus'],
      required: [true, 'Category is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: new Date(),
    },
    tags: {
      type: [String],
      default: [],
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'bank_transfer', 'digital_wallet', 'other'],
      default: 'cash',
    },
    recurring: {
      type: Boolean,
      default: false,
    },
    recurringFrequency: {
      type: String,
      enum: {
        values: ['daily', 'weekly', 'monthly', 'yearly', null],
        message: '{VALUE} is not a valid recurring frequency'
      },
      default: null,
    },
  },
  { timestamps: true }
);

/**
 * Create compound index for efficient queries
 */
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ userId: 1, type: 1 });

export default mongoose.model('Transaction', transactionSchema);
