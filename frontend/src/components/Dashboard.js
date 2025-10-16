import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import BudgetForm from './BudgetForm';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import BudgetSummary from './BudgetSummary';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchBudgetData();
  }, [currentMonth]);

  const fetchBudgetData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/budget/${currentMonth}`);
      setBudgetData(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setBudgetData(null);
      } else {
        console.error('Error fetching budget data:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetCreated = () => {
    fetchBudgetData();
  };

  const handleExpenseAdded = () => {
    fetchBudgetData();
  };

  const handleExpenseDeleted = () => {
    fetchBudgetData();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Budget Tracker</h1>
          <div className="header-actions">
            <span>Welcome, {user?.username}!</span>
            <button onClick={logout} className="btn-secondary">Logout</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="month-selector">
          <label htmlFor="month">Select Month:</label>
          <input
            type="month"
            id="month"
            value={currentMonth}
            onChange={(e) => setCurrentMonth(e.target.value)}
          />
        </div>

        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('expenses')}
          >
            Expenses
          </button>
          <button 
            className={`tab ${activeTab === 'budget' ? 'active' : ''}`}
            onClick={() => setActiveTab('budget')}
          >
            Budget Settings
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              {budgetData ? (
                <>
                  <BudgetSummary 
                    budgetData={budgetData} 
                    currentMonth={currentMonth}
                  />
                  <div className="quick-actions">
                    <h3>Quick Actions</h3>
                    <ExpenseForm 
                      currentMonth={currentMonth}
                      onExpenseAdded={handleExpenseAdded}
                    />
                  </div>
                </>
              ) : (
                <div className="no-budget">
                  <h3>No budget set for {currentMonth}</h3>
                  <p>Create a budget to start tracking your expenses.</p>
                  <button 
                    onClick={() => setActiveTab('budget')}
                    className="btn-primary"
                  >
                    Set Budget
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="expenses-tab">
              {budgetData ? (
                <ExpenseList 
                  budget={budgetData.budget}
                  onExpenseDeleted={handleExpenseDeleted}
                />
              ) : (
                <p>No budget set for this month. Please create a budget first.</p>
              )}
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="budget-tab">
              <BudgetForm 
                currentMonth={currentMonth}
                existingBudget={budgetData?.budget}
                onBudgetCreated={handleBudgetCreated}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;