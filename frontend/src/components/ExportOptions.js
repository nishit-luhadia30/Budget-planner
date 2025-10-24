import React, { useState } from 'react';
import axios from 'axios';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

const ExportOptions = ({ currentMonth, budgetData }) => {
  const [loading, setLoading] = useState(false);

  // ✅ Helper: attach JWT token to every request
  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  const handleCSVExport = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/export/csv/${currentMonth}`,
        getAuthHeaders()
      );

      const filename = `budget-expenses-${currentMonth}.csv`;
      exportToCSV(response.data.data, filename);

      alert('✅ CSV exported successfully!');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert(
        '❌ Error exporting CSV: ' +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePDFExport = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/export/pdf-data/${currentMonth}`,
        getAuthHeaders()
      );

      const filename = `budget-report-${currentMonth}.pdf`;
      exportToPDF(response.data, filename);

      alert('✅ PDF exported successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert(
        '❌ Error exporting PDF: ' +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  if (!budgetData) return null;

  return (
    <div className="export-options">
      <h3>Export Options</h3>
      <div className="export-buttons">
        <button
          onClick={handleCSVExport}
          disabled={loading}
          className="btn-export csv"
        >
          {loading ? 'Exporting...' : '📊 Export CSV'}
        </button>

        <button
          onClick={handlePDFExport}
          disabled={loading}
          className="btn-export pdf"
        >
          {loading ? 'Generating...' : '📄 Export PDF'}
        </button>
      </div>

      <div className="export-info">
        <p>📈 CSV: Spreadsheet format for data analysis</p>
        <p>📋 PDF: Formatted report for printing/sharing</p>
      </div>
    </div>
  );
};

export default ExportOptions;