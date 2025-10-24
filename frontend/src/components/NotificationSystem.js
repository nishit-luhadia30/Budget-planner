import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationSystem = ({ budgetData, currentMonth }) => {
  useEffect(() => {
    if (budgetData && budgetData.summary) {
      const { budgetAmount, totalSpent, remaining } = budgetData.summary;
      const spentPercentage = (totalSpent / budgetAmount) * 100;

      // Budget alerts
      if (spentPercentage >= 100) {
        toast.error(`⚠️ Budget Exceeded! You've spent ₹${Math.abs(remaining).toLocaleString()} over your budget for ${currentMonth}`, {
          position: "top-right",
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else if (spentPercentage >= 90) {
        toast.warning(`🚨 90% Budget Used! Only ₹${remaining.toLocaleString()} remaining for ${currentMonth}`, {
          position: "top-right",
          autoClose: 6000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else if (spentPercentage >= 75) {
        toast.info(`📊 75% Budget Used! ₹${remaining.toLocaleString()} remaining for ${currentMonth}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }

      // Check for recurring expenses due soon
      checkRecurringExpenses(budgetData.budget);
    }
  }, [budgetData, currentMonth]);

  const checkRecurringExpenses = (budget) => {
    if (!budget.expenses) return;

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const upcomingRecurring = budget.expenses.filter(expense => {
      if (!expense.isRecurring || !expense.nextDueDate) return false;
      
      const dueDate = new Date(expense.nextDueDate);
      return dueDate <= tomorrow && dueDate >= today;
    });

    upcomingRecurring.forEach(expense => {
      toast.info(`🔄 Recurring Expense Due: ${expense.name} - ₹${expense.amount.toLocaleString()}`, {
        position: "top-right",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });
  };

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

export default NotificationSystem;