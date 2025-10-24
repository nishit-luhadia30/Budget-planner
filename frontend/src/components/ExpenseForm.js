import React, { useState } from 'react';
import axios from 'axios';

const ExpenseForm = ({ currentMonth, onExpenseAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Food',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    isRecurring: false,
    recurringFrequency: 'monthly'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const categories = [
    'Food',
    'Entertainment', 
    'Transportation',
    'Shopping',
    'Bills',
    'Healthcare',
    'Other'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post('/api/expense', {
        ...formData,
        amount: parseFloat(formData.amount),
        month: currentMonth
      });

      setMessage('Expense added successfully!');
      setFormData({
        name: '',
        category: 'Food',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        isRecurring: false,
        recurringFrequency: 'monthly'
      });
      onExpenseAdded();
    } catch (error) {
      setMessage('Error adding expense: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="expense-form">
      <h3>Add New Expense</h3>
      
      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Expense Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">Amount (₹)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="isRecurring"
              checked={formData.isRecurring}
              onChange={(e) => setFormData({
                ...formData,
                isRecurring: e.target.checked
              })}
            />
            Make this a recurring expense
          </label>
        </div>

        {formData.isRecurring && (
          <div className="form-group">
            <label htmlFor="recurringFrequency">Frequency</label>
            <select
              id="recurringFrequency"
              name="recurringFrequency"
              value={formData.recurringFrequency}
              onChange={handleChange}
              required
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Adding...' : (formData.isRecurring ? 'Add Recurring Expense' : 'Add Expense')}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;