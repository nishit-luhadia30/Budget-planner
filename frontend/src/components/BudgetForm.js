import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BudgetForm = ({ currentMonth, existingBudget, onBudgetCreated }) => {
  const [budgetAmount, setBudgetAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (existingBudget) {
      setBudgetAmount(existingBudget.budgetAmount.toString());
    } else {
      setBudgetAmount('');
    }
  }, [existingBudget]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post('/api/budget', {
        month: currentMonth,
        budgetAmount: parseFloat(budgetAmount)
      });

      setMessage('Budget saved successfully!');
      onBudgetCreated();
    } catch (error) {
      setMessage('Error saving budget: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="budget-form">
      <h3>{existingBudget ? 'Update' : 'Set'} Budget for {currentMonth}</h3>
      
      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="budgetAmount">Monthly Budget Amount (₹)</label>
          <input
            type="number"
            id="budgetAmount"
            value={budgetAmount}
            onChange={(e) => setBudgetAmount(e.target.value)}
            min="0"
            step="0.01"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : (existingBudget ? 'Update Budget' : 'Set Budget')}
        </button>
      </form>
    </div>
  );
};

export default BudgetForm;