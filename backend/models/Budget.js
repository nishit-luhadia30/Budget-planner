const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Entertainment', 'Transportation', 'Shopping', 'Bills', 'Healthcare', 'Other']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: function() { return this.isRecurring; }
  },
  nextDueDate: {
    type: Date,
    required: function() { return this.isRecurring; }
  }
});

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: String,
    required: true // Format: "2025-10"
  },
  budgetAmount: {
    type: Number,
    required: true,
    min: 0
  },
  expenses: [expenseSchema],
  notifications: {
    budgetAlert: {
      enabled: { type: Boolean, default: true },
      threshold: { type: Number, default: 80 } // Alert at 80% of budget
    },
    recurringReminder: {
      enabled: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true
});

// Compound index to ensure one budget per user per month
budgetSchema.index({ userId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);