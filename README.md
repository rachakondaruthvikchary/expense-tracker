# Expense Tracker - Production Ready Application

A full-stack expense tracking application built with React, Node.js, Express, MongoDB, and Tailwind CSS.

## 📋 Features

### User Authentication
- ✅ User registration and login with JWT authentication
- ✅ Hashed passwords using bcryptjs
- ✅ Protected routes requiring authentication
- ✅ Password change functionality
- ✅ User profile management

### Transaction Management
- ✅ Create, read, update, and delete transactions
- ✅ Transaction categories (food, travel, bills, shopping, etc.)
- ✅ Support for both income and expense types
- ✅ Transaction filtering by date range, category, and type
- ✅ Pagination for efficient data handling
- ✅ Payment method tracking

### Financial Analytics
- ✅ Dashboard with summary cards (Total Income, Total Expenses, Net Balance)
- ✅ AI-powered insights based on spending patterns
- ✅ Category-wise spending breakdown
- ✅ Monthly trend analysis

### Data Visualization
- ✅ Pie charts for category-wise expense distribution
- ✅ Line charts for monthly income vs. expense trends
- ✅ Interactive charts using Recharts

### Budget Management
- ✅ Monthly budget setting and tracking
- ✅ Budget alerts when spending thresholds are exceeded
- ✅ Category-specific budget limits
- ✅ Real-time budget status display

### Advanced Features
- ✅ Export transactions to CSV
- ✅ Dark mode support
- ✅ Responsive design for mobile and desktop
- ✅ Error handling and input validation
- ✅ Loading states

## 🏗️ Project Structure

```
expense-tracker/
├── backend/
│   ├── src/
│   │   ├── models/          # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Transaction.js
│   │   │   └── Budget.js
│   │   ├── controllers/     # Business logic
│   │   │   ├── authController.js
│   │   │   ├── transactionController.js
│   │   │   └── budgetController.js
│   │   ├── routes/          # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── transactionRoutes.js
│   │   │   └── budgetRoutes.js
│   │   ├── middleware/      # Custom middleware
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── utils/           # Utility functions
│   │   │   ├── analytics.js
│   │   │   └── csvExport.js
│   │   └── server.js        # Main server file
│   ├── config/
│   │   └── database.js      # MongoDB connection
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Navigation.jsx
│   │   │   ├── Charts.jsx
│   │   │   ├── TransactionCard.jsx
│   │   │   ├── TransactionForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── Budget.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/        # API services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── transactionService.js
│   │   │   └── budgetService.js
│   │   ├── hooks/           # Custom React hooks
│   │   │   ├── useTransactions.js
│   │   │   └── useBudget.js
│   │   ├── context/         # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── .gitignore
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: Custom validation

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Date Handling**: date-fns

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** in `.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/expense-tracker
   JWT_SECRET=your_super_secret_key_here
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

5. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

6. **Run the backend server:**
   ```bash
   # Development with auto-reload
   npm run dev

   # Production
   npm start
   ```

   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** in `.env`:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

6. **Build for production:**
   ```bash
   npm run build
   ```

## 🧪 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)
- `POST /api/auth/change-password` - Change password (Protected)
- `POST /api/auth/logout` - Logout (Protected)

### Transactions
- `POST /api/transactions` - Create transaction (Protected)
- `GET /api/transactions` - Get all transactions with filters (Protected)
- `GET /api/transactions/:id` - Get single transaction (Protected)
- `PUT /api/transactions/:id` - Update transaction (Protected)
- `DELETE /api/transactions/:id` - Delete transaction (Protected)
- `GET /api/transactions/dashboard` - Get dashboard summary (Protected)
- `GET /api/transactions/insights` - Get AI insights (Protected)
- `GET /api/transactions/chart-data` - Get chart data (Protected)
- `GET /api/transactions/export` - Export to CSV (Protected)

### Budget
- `POST /api/budget` - Set monthly budget (Protected)
- `GET /api/budget/status` - Get budget status (Protected)
- `GET /api/budget/history` - Get budget history (Protected)
- `DELETE /api/budget/:id` - Delete budget (Protected)

## 🔐 Database Schemas

### User Schema
```javascript
{
  name: String,
  email: String (unique, lowercase),
  password: String (hashed),
  monthlyBudget: Number,
  currency: String,
  theme: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Schema
```javascript
{
  userId: ObjectId (Reference to User),
  title: String,
  description: String,
  amount: Number,
  type: String (income/expense),
  category: String,
  date: Date,
  tags: [String],
  paymentMethod: String,
  recurring: Boolean,
  recurringFrequency: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Budget Schema
```javascript
{
  userId: ObjectId (Reference to User),
  month: Number,
  year: Number,
  totalLimit: Number,
  categoryLimits: Map,
  alertThreshold: Number,
  notifications: [Object],
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 Usage Guide

### 1. Register and Login
- Navigate to signup page and create an account
- Login with email and password
- JWT token is automatically stored in localStorage

### 2. Create Transactions
- Click "Add Transaction" in the Transactions page
- Fill in the form with transaction details
- Select category and payment method
- Submit to save

### 3. View Dashboard
- Dashboard displays summary cards
- View AI insights based on spending patterns
- See charts for visualization

### 4. Filter Transactions
- Use filters to find specific transactions
- Filter by category, type, date range
- Paginate through results

### 5. Set Budget
- Go to Budget page
- Set monthly budget limit
- configure alert threshold
- View spending progress and alerts

### 6. Export Data
- Click "Export CSV" in Transactions page
- Download all filtered transactions in CSV format

### 7. Manage Profile
- Update name and monthly budget
- Change currency and theme
- Settings are automatically saved

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Create account on deployment platform
2. Connect your GitHub repository
3. Add environment variables in dashboard:
   - `MONGO_URI`: MongoDB Atlas connection string
   - `JWT_SECRET`: Strong secret key
   - `NODE_ENV`: production
   - `FRONTEND_URL`: Your frontend URL

4. Deploy and monitor

### Frontend Deployment (Vercel/Netlify)

1. Create account on deployment platform
2. Connect GitHub repository
3. Add environment variable:
   - `VITE_API_URL`: Your backend API URL
4. Deploy

## 📝 Best Practices Implemented

✅ **Security**
- JWT authentication
- Password hashing with bcryptjs
- Input validation
- Protected routes

✅ **Performance**
- Pagination for large datasets
- Database indexes for frequent queries
- Efficient data fetching
- Optimized Recharts rendering

✅ **Code Quality**
- Modular architecture (MVC pattern)
- Reusable components and hooks
- Clean separation of concerns
- Comprehensive error handling

✅ **User Experience**
- Loading states
- Error messages
- Success notifications
- Responsive design
- Dark mode support

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in .env
- Verify network access if using Atlas

### CORS Errors
- Frontend URL should match FRONTEND_URL in backend .env
- Check that both servers are running

### Token Expiration
- Token automatically refreshes on page reload
- Old tokens are cleared on logout

### Port Already in Use
- Backend: `lsof -i :5000` and kill process
- Frontend: `lsof -i :5173` and kill process

## 📞 Support

For issues or questions:
1. Check the console for error messages
2. Review API logs in terminal
3. Verify environment configuration
4. Check database connection

## 📄 License

This project is open source and available for educational and commercial use.

---

**Made with ❤️ for financial tracking**
#   e x p e n s e - t r a c k e r  
 