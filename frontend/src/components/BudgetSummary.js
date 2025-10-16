import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const BudgetSummary = ({ budgetData, currentMonth }) => {
  const { budget, summary } = budgetData;

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Calculate category-wise expenses
  const categoryData = budget.expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.category === expense.category);
    if (existing) {
      existing.amount += expense.amount;
    } else {
      acc.push({
        category: expense.category,
        amount: expense.amount
      });
    }
    return acc;
  }, []);

  // Colors for pie chart
  const COLORS = {
    'Food': '#FF6B6B',
    'Entertainment': '#4ECDC4',
    'Transportation': '#45B7D1',
    'Shopping': '#96CEB4',
    'Bills': '#FFEAA7',
    'Healthcare': '#DDA0DD',
    'Other': '#98D8C8'
  };

  const pieData = categoryData.map(item => ({
    name: item.category,
    value: item.amount,
    color: COLORS[item.category] || '#999'
  }));

  const progressPercentage = (summary.totalSpent / summary.budgetAmount) * 100;

  return (
    <div className="budget-summary">
      <h2>Budget Summary - {currentMonth}</h2>
      
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Budget</h3>
          <div className="amount">{formatCurrency(summary.budgetAmount)}</div>
        </div>
        
        <div className="summary-card">
          <h3>Spent</h3>
          <div className="amount spent">{formatCurrency(summary.totalSpent)}</div>
        </div>
        
        <div className="summary-card">
          <h3>Remaining</h3>
          <div className={`amount ${summary.remaining < 0 ? 'negative' : 'positive'}`}>
            {formatCurrency(summary.remaining)}
          </div>
        </div>
        
        <div className="summary-card">
          <h3>Expenses</h3>
          <div className="amount">{summary.expenseCount}</div>
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-label">
          Budget Usage: {progressPercentage.toFixed(1)}%
        </div>
        <div className="progress-track">
          <div 
            className={`progress-fill ${progressPercentage > 100 ? 'over-budget' : ''}`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
        {progressPercentage > 100 && (
          <div className="over-budget-warning">
            ⚠️ You've exceeded your budget by {formatCurrency(Math.abs(summary.remaining))}
          </div>
        )}
      </div>

      {categoryData.length > 0 && (
        <div className="charts-container">
          <div className="chart-section">
            <h3>Expenses by Category</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-section">
            <h3>Category Breakdown</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="amount" fill="#4ECDC4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetSummary;