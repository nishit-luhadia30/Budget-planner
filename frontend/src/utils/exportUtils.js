import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';

export const exportToCSV = (data, filename) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportToPDF = (data, filename) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('Budget Report', 20, 20);

  doc.setFontSize(12);
  doc.text(`User: ${data.user.username}`, 20, 35);
  doc.text(`Month: ${data.budget.month}`, 20, 45);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 55);

  doc.setFontSize(14);
  doc.text('Budget Summary', 20, 75);

  const summaryData = [
    ['Budget Amount', `₹${data.budget.budgetAmount.toLocaleString()}`],
    ['Total Spent', `₹${data.budget.totalSpent.toLocaleString()}`],
    ['Remaining', `₹${data.budget.remaining.toLocaleString()}`],
    ['Total Expenses', data.budget.expenseCount.toString()]
  ];

  autoTable(doc, {
    startY: 85,
    head: [['Category', 'Amount']],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [78, 205, 196] }
  });

  doc.setFontSize(14);
  doc.text('Expenses', 20, doc.lastAutoTable.finalY + 20);

  const expenseHeaders = ['Name', 'Category', 'Amount', 'Date', 'Recurring'];
  const expenseData = data.expenses.map(expense => [
    expense.name,
    expense.category,
    `₹${expense.amount.toLocaleString()}`,
    expense.date,
    expense.isRecurring ? `Yes (${expense.recurringFrequency})` : 'No'
  ]);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 30,
    head: [expenseHeaders],
    body: expenseData,
    theme: 'striped',
    headStyles: { fillColor: [78, 205, 196] }
  });

  if (Object.keys(data.categoryTotals).length > 0) {
    doc.setFontSize(14);
    doc.text('Category Breakdown', 20, doc.lastAutoTable.finalY + 20);

    const categoryData = Object.entries(data.categoryTotals).map(([category, amount]) => [
      category,
      `₹${amount.toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 30,
      head: [['Category', 'Total Amount']],
      body: categoryData,
      theme: 'grid',
      headStyles: { fillColor: [78, 205, 196] }
    });
  }

  doc.save(filename);
};

export const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;
export const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN');