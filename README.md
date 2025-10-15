# Budget Tracker Web App

A full-stack web application for personal budget management built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Budget Management**: Set monthly budgets and track spending
- **Expense Tracking**: Add, categorize, and delete expenses
- **Visual Analytics**: Interactive charts showing spending patterns
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React.js with hooks
- React Router for navigation
- Recharts for data visualization
- Axios for API calls
- CSS3 for styling

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd budget-tracker
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/budget-tracker
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   PORT=5000
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # For local MongoDB installation
   mongod
   
   # Or use MongoDB Atlas cloud database
   # Update MONGODB_URI in .env with your Atlas connection string
   ```

5. **Run the application**
   
   ```bash
   # Start both backend and frontend concurrently
   npm run dev
   
   # Or start them separately:
   # Backend (runs on http://localhost:5000)
   npm run server
   
   # Frontend (runs on http://localhost:3000)
   npm run client
   ```

6. **Access the application**
   
   Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Budget Management
- `POST /api/budget` - Create/update monthly budget
- `GET /api/budget/:month` - Get budget and expenses for specific month

### Expense Management
- `POST /api/expense` - Add new expense
- `DELETE /api/expense/:budgetId/:expenseId` - Delete expense

## Database Schema

### Users Collection
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  timestamps: true
}
```

### Budgets Collection
```javascript
{
  userId: ObjectId,
  month: String, // Format: "2025-10"
  budgetAmount: Number,
  expenses: [{
    name: String,
    category: String,
    amount: Number,
    date: Date
  }],
  timestamps: true
}
```

## Usage

1. **Sign Up**: Create a new account with username, email, and password
2. **Login**: Access your dashboard with your credentials
3. **Set Budget**: Define your monthly budget amount
4. **Add Expenses**: Record your daily expenses with categories
5. **Track Progress**: View charts and summaries of your spending
6. **Manage Data**: Edit budgets and delete expenses as needed

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend development server
- `npm run build` - Build the frontend for production
- `npm run install-deps` - Install dependencies for both frontend and backend

## Expense Categories

- Food
- Entertainment
- Transportation
- Shopping
- Bills
- Healthcare
- Other

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Future Enhancements

- Export data to CSV/PDF
- Dark mode toggle
- Google OAuth integration
- Budget notifications
- Recurring expense templates
- Multi-currency support
- Expense receipt uploads