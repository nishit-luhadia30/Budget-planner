const express = require('express');
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');
const router = express.Router();

// POST /api/expense - Add new expense
router.post('/', auth, async (req, res) => {
  try {
    const { name, category, amount, date, month } = req.body;
    const userId = req.user._id;

    // Find or create budget for the month
    let budget = await Budget.findOne({ userId, month });
    
    if (!budget) {
      return res.status(404).json({ 
        message: 'Budget not found. Please create a budget for this month first.' 
      });
    }

    // Add expense to budget
    const newExpense = {
      name,
      category,
      amount: parseFloat(amount),
      date: new Date(date)
    };

    budget.expenses.push(newExpense);
    await budget.save();

    res.json({
      message: 'Expense added successfully',
      expense: budget.expenses[budget.expenses.length - 1]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/expense/:budgetId/:expenseId - Delete expense
router.delete('/:budgetId/:expenseId', auth, async (req, res) => {
  try {
    const { budgetId, expenseId } = req.params;
    const userId = req.user._id;

    const budget = await Budget.findOne({ _id: budgetId, userId });
    
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Remove expense from array
    budget.expenses = budget.expenses.filter(
      expense => expense._id.toString() !== expenseId
    );
    
    await budget.save();

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;