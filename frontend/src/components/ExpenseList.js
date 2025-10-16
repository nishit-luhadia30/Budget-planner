import React, { useState } from 'react';
import axios from 'axios';

const ExpenseList = ({ budget, onExpenseDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`/expense/${budget._id}/${expenseId}`);
      onExpenseDeleted();
    } catch (error) {
      alert('Error deleting expense: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  if (!budget.expenses || budget.expenses.length === 0) {
    return (
      <div className="expense-list">
        <h3>Expenses</h3>
        <p>No expenses recorded for this month.</p>
      </div>
    );
  }

  // Sort expenses by date (newest first)
  const sortedExpenses = [...budget.expenses].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="expense-list">
      <h3>Expenses ({budget.expenses.length})</h3>
      
      <div className="expense-table">
        <div className="expense-header">
          <div>Name</div>
          <div>Category</div>
          <div>Amount</div>
          <div>Date</div>
          <div>Actions</div>
        </div>
        
        {sortedExpenses.map((expense) => (
          <div key={expense._id} className="expense-row">
            <div className="expense-name">{expense.name}</div>
            <div className="expense-category">
              <span className={`category-badge ${expense.category.toLowerCase()}`}>
                {expense.category}
              </span>
            </div>
            <div className="expense-amount">{formatCurrency(expense.amount)}</div>
            <div className="expense-date">{formatDate(expense.date)}</div>
            <div className="expense-actions">
              <button
                onClick={() => handleDelete(expense._id)}
                disabled={loading}
                className="btn-danger btn-small"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;