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
  'http://localhost:3000', // for local dev
  'https://budget-planner.vercel.app' // your deployed frontend domain
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // allow cookies or auth headers if needed
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