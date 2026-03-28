import mongoose from 'mongoose';

/**
 * Budget Schema
 * Tracks monthly budget and spending limits by category
 */
const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    month: {
      type: Number,
      required: [true, 'Month is required'],
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
    },
    totalLimit: {
      type: Number,
      required: [true, 'Total budget limit is required'],
      min: [0, 'Budget cannot be negative'],
    },
    categoryLimits: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    alertThreshold: {
      type: Number,
      default: 0.8, // Alert when 80% spent
      min: 0,
      max: 1,
    },
    notifications: {
      type: [
        {
          category: String,
          message: String,
          timestamp: Date,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

/**
 * Create compound unique index
 */
budgetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model('Budget', budgetSchema);
