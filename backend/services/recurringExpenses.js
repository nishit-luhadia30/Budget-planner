const cron = require('node-cron');
const Budget = require('../models/Budget');

class RecurringExpenseService {
  constructor() {
    this.startCronJob();
  }

  startCronJob() {
    // Run every day at 9:00 AM
    cron.schedule('0 9 * * *', async () => {
      console.log('Checking for recurring expenses...');
      await this.processRecurringExpenses();
    });
  }

  async processRecurringExpenses() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Find all budgets with recurring expenses due today
      const budgets = await Budget.find({
        'expenses.isRecurring': true,
        'expenses.nextDueDate': { $lte: today }
      });

      for (const budget of budgets) {
        let budgetUpdated = false;

        for (const expense of budget.expenses) {
          if (expense.isRecurring && expense.nextDueDate <= today) {
            // Create new expense for current period
            const newExpense = {
              name: expense.name,
              category: expense.category,
              amount: expense.amount,
              date: today,
              isRecurring: false // The new expense is not recurring itself
            };

            budget.expenses.push(newExpense);

            // Update next due date
            expense.nextDueDate = this.calculateNextDueDate(
              expense.nextDueDate,
              expense.recurringFrequency
            );

            budgetUpdated = true;
          }
        }

        if (budgetUpdated) {
          await budget.save();
          console.log(`Added recurring expenses for budget ${budget._id}`);
        }
      }
    } catch (error) {
      console.error('Error processing recurring expenses:', error);
    }
  }

  calculateNextDueDate(currentDate, frequency) {
    const nextDate = new Date(currentDate);

    switch (frequency) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
      default:
        nextDate.setMonth(nextDate.getMonth() + 1);
    }

    return nextDate;
  }

  async addRecurringExpense(budgetId, expenseData) {
    try {
      const budget = await Budget.findById(budgetId);
      if (!budget) {
        throw new Error('Budget not found');
      }

      const recurringExpense = {
        ...expenseData,
        isRecurring: true,
        nextDueDate: this.calculateNextDueDate(
          new Date(expenseData.date),
          expenseData.recurringFrequency
        )
      };

      budget.expenses.push(recurringExpense);
      await budget.save();

      return recurringExpense;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new RecurringExpenseService();