const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const budgetRoutes = require('./routes/budget');
const expenseRoutes = require('./routes/expense');

const app = express();

// Middleware

const allowedOrigins = [
  "https://budget-planner-pink.vercel.app",
  "http://localhost:3000"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));


app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/expense', expenseRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/budget-tracker')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});