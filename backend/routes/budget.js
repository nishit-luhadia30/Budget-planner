const express = require('express');
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');
const router = express.Router();

// POST /api/budget - Create or update budget for a month
router.post('/', auth, async (req, res) => {
  try {
    const { month, budgetAmount } = req.body;
    const userId = req.user._id;

    // Check if budget already exists for this month
    let budget = await Budget.findOne({ userId, month });
    
    if (budget) {
      budget.budgetAmount = budgetAmount;
      await budget.save();
    } else {
      budget = new Budget({
        userId,
        month,
        budgetAmount,
        expenses: []
      });
      await budget.save();
    }

    res.json({
      message: 'Budget saved successfully',
      budget
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/budget/:month - Get budget for specific month
router.get('/:month', auth, async (req, res) => {
  try {
    const { month } = req.params;
    const userId = req.user._id;

    const budget = await Budget.findOne({ userId, month });
    
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found for this month' });
    }

    // Calculate total spent
    const totalSpent = budget.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = budget.budgetAmount - totalSpent;

    res.json({
      budget,
      summary: {
        budgetAmount: budget.budgetAmount,
        totalSpent,
        remaining,
        expenseCount: budget.expenses.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;