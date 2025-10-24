const express = require('express');
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');
const router = express.Router();

// ✅ GET /api/export/csv/:month
router.get('/csv/:month', auth, async (req, res) => {
  try {
    const { month } = req.params;
    const userId = req.user._id;

    const budget = await Budget.findOne({ userId, month });
    if (!budget) {
      return res.status(404).json({ message: `No budget found for ${month}` });
    }

    const csvData = budget.expenses.map(expense => ({
      name: expense.name,
      category: expense.category,
      amount: expense.amount,
      date: expense.date.toISOString().split('T')[0],
      isRecurring: expense.isRecurring ? 'Yes' : 'No',
      recurringFrequency: expense.recurringFrequency || 'N/A'
    }));

    const totalSpent = budget.expenses.reduce((sum, e) => sum + e.amount, 0);
    csvData.push({
      name: 'TOTAL',
      category: '',
      amount: totalSpent,
      date: '',
      isRecurring: '',
      recurringFrequency: ''
    });

    res.json({
      data: csvData,
      summary: {
        budgetAmount: budget.budgetAmount,
        totalSpent,
        remaining: budget.budgetAmount - totalSpent,
        month
      }
    });
  } catch (err) {
    console.error('CSV Export Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ GET /api/export/pdf-data/:month
router.get('/pdf-data/:month', auth, async (req, res) => {
  try {
    const { month } = req.params;
    const userId = req.user._id;

    const budget = await Budget.findOne({ userId, month }).populate(
      'userId',
      'username email'
    );
    if (!budget) {
      return res.status(404).json({ message: `No budget found for ${month}` });
    }

    const totalSpent = budget.expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = budget.budgetAmount - totalSpent;

    const categoryTotals = budget.expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    res.json({
      user: {
        username: budget.userId.username,
        email: budget.userId.email,
      },
      budget: {
        month,
        budgetAmount: budget.budgetAmount,
        totalSpent,
        remaining,
        expenseCount: budget.expenses.length,
      },
      expenses: budget.expenses.map(e => ({
        name: e.name,
        category: e.category,
        amount: e.amount,
        date: e.date.toISOString().split('T')[0],
        isRecurring: e.isRecurring,
        recurringFrequency: e.recurringFrequency,
      })),
      categoryTotals,
    });
  } catch (err) {
    console.error('PDF Export Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;