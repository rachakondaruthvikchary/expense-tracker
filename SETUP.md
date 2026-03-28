# Expense Tracker - Setup Instructions

## Quick Start (5-10 minutes)

### Prerequisites
- **Node.js** (v14+) - [Download](https://nodejs.org)
- **MongoDB** - Either:
  - Local installation - [Download](https://www.mongodb.com/try/download/community)
  - MongoDB Atlas (Cloud) - [Create Account](https://www.mongodb.com/cloud/atlas)
- **Git** (optional)

---

## Backend Setup

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- express (Web framework)
- mongoose (MongoDB ODM)
- jsonwebtoken (JWT auth)
- bcryptjs (Password hashing)
- cors (Cross-origin requests)
- dotenv (Environment variables)

### Step 3: Configure Environment Variables

**Create `.env` file in backend folder:**
```bash
cp .env.example .env
```

**Edit `.env` file** with your settings:

#### Option A: Local MongoDB
```
MONGO_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_super_secret_key_change_in_production_12345
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

#### Option B: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account and cluster
3. Get connection string
4. Update `.env`:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker
JWT_SECRET=your_super_secret_key_change_in_production_12345
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Step 4: Start MongoDB (if running locally)

**Windows (PowerShell):**
```powershell
# Start MongoDB service
net start MongoDB

# Or run mongod directly
mongod
```

**Mac/Linux:**
```bash
brew services start mongodb-community
# Or
mongod
```

### Step 5: Run Backend Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

**Expected output:**
```
✓ MongoDB Connected: localhost
✓ Server running on http://localhost:5000
✓ Environment: development
```

✅ **Backend is ready!** Access health check at: `http://localhost:5000/api/health`

---

## Frontend Setup

### Step 1: Navigate to Frontend Directory (in new terminal)
```bash
cd frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- react (UI library)
- react-router-dom (Routing)
- axios (HTTP client)
- recharts (Charts)
- date-fns (Date handling)
- tailwindcss (Styling)

### Step 3: Configure Environment Variables

**Create `.env` file in frontend folder:**
```bash
cp .env.example .env
```

**Edit `.env` file:**
```
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Run Frontend Development Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

✅ **Frontend is ready!** Browser should auto-open at `http://localhost:5173`

---

## Testing the Application

### 1. Create Account
1. Click "Sign up" on login page
2. Fill in:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
   - Confirm: `password123`
3. Click "Sign up"

### 2. View Dashboard
- Summary cards show (should all be $0.00 initially)
- Empty charts (no data yet)

### 3. Add First Transaction
1. Go to "Transactions" page
2. Click "+ Add Transaction"
3. Fill form:
   - Title: `Grocery Shopping`
   - Amount: `50.00`
   - Type: `Expense`
   - Category: `Food`
   - Date: Today
4. Click "Add Transaction"

### 4. View Updated Dashboard
- Transaction appears in list
- Dashboard updates with spending

### 5. Test Other Features
- **Filter**: Use filters to find transactions
- **Edit**: Click Edit on any transaction
- **Delete**: Click Delete (you'll be asked to confirm)
- **Budget**: Set a monthly budget in Budget page
- **Charts**: View spending distribution and trends
- **Export**: Export transactions to CSV

---

## Folder Structure Explained

```
expance tracker/
├── backend/                 # Node.js/Express server
│   ├── src/
│   │   ├── models/         # Database schemas (User, Transaction, Budget)
│   │   ├── controllers/    # Business logic (auth, transactions, budget)
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # JWT auth, error handling
│   │   ├── utils/          # Helper functions
│   │   └── server.js       # Main application file
│   ├── config/
│   │   └── database.js     # Database connection
│   ├── package.json        # Node dependencies
│   ├── .env                # Environment variables (create this)
│   └── .env.example        # Template for .env
│
├── frontend/               # React/Vite app
│   ├── src/
│   │   ├── pages/          # Page components (Login, Dashboard, etc.)
│   │   ├── components/     # Reusable components
│   │   ├── services/       # API calls
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # State management
│   │   ├── styles/         # CSS files
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── index.html          # HTML template
│   ├── package.json        # npm dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind CSS config
│   ├── .env                # Environment variables (create this)
│   └── .env.example        # Template for .env
│
├── .gitignore              # Git ignore rules
└── README.md               # Documentation
```

---

## API Endpoints Reference

### Authentication
```
POST   /api/auth/signup              - Register user
POST   /api/auth/login               - Login user
GET    /api/auth/profile             - Get profile (Protected)
PUT    /api/auth/profile             - Update profile (Protected)
POST   /api/auth/change-password     - Change password (Protected)
```

### Transactions
```
POST   /api/transactions             - Create (Protected)
GET    /api/transactions             - List all (Protected)
GET    /api/transactions/:id         - Get one (Protected)
PUT    /api/transactions/:id         - Update (Protected)
DELETE /api/transactions/:id         - Delete (Protected)
GET    /api/transactions/dashboard   - Summary (Protected)
GET    /api/transactions/insights    - AI insights (Protected)
GET    /api/transactions/chart-data  - Charts (Protected)
GET    /api/transactions/export      - CSV export (Protected)
```

### Budget
```
POST   /api/budget                   - Set budget (Protected)
GET    /api/budget/status            - Get status (Protected)
GET    /api/budget/history           - History (Protected)
DELETE /api/budget/:id               - Delete (Protected)
```

---

## Troubleshooting

### Issue: "Cannot find module" errors

**Solution:**
```bash
# Backend
cd backend
delete node_modules
npm install

# Frontend
cd frontend
delete node_modules
npm install
```

### Issue: MongoDB connection failed

**Check:**
1. Is MongoDB running?
   - Local: Run `mongod` in another terminal
   - Atlas: Check connection string in .env

2. Connection string format:
   ```
   ✅ mongodb://localhost:27017/expense-tracker
   ✅ mongodb+srv://user:pass@cluster.mongodb.net/database
   ❌ mongodb://localhost:27017/
   ```

### Issue: Port already in use

**For Port 5000 (Backend):**
```bash
# Windows
netstat -ano | findstr :5000
# Kill process: taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
# Kill: kill -9 <PID>
```

**For Port 5173 (Frontend):**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5173
kill -9 <PID>
```

### Issue: CORS errors in browser console

**Solution:** Ensure FRONTEND_URL in backend `.env` matches your frontend URL:
```
FRONTEND_URL=http://localhost:5173
```

### Issue: Login not working

**Check:**
1. Backend running? `http://localhost:5000/api/health` should return JSON
2. Network tab in browser DevTools for error details
3. Backend logs in terminal

### Issue: Cannot find env variables

**Solution:**
```bash
# Backend
1. Check .env file exists
2. Restart server after editing .env
3. Verify format: VARIABLE=value (no quotes needed)

# Frontend
1. Check .env file exists
2. Add VITE_ prefix to variables
3. Restart npm run dev
```

---

## Development Tips

### 1. View Backend Logs
- Check terminal where `npm run dev` is running
- Logs show API calls, errors, connections

### 2. Browser DevTools
- **Network Tab**: View API requests and responses
- **Console Tab**: JavaScript errors and logs
- **Application Tab**: LocalStorage (JWT token stored here)

### 3. Test API Directly
Use Postman or similar:
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "john@example.com",
  "password": "password123"
}
```

### 4. Hot Reload
- Frontend: Changes saved = auto-reload
- Backend: Need to restart (`npm run dev`)

---

## Next Steps

### After Setup Works:

1. **Customize**: Modify colors in `frontend/tailwind.config.js`
2. **Add Features**: Extend API with new endpoints
3. **Deploy**: Follow [README.md](README.md) deployment section
4. **Mobile**: Add PWA features for mobile app
5. **Notifications**: Add email/push notifications

---

## Production Deployment

### Before Going Live:

✅ Change JWT_SECRET in backend .env
✅ Set NODE_ENV=production
✅ Build frontend: `npm run build`
✅ Use MongoDB Atlas (not local)
✅ Enable HTTPS
✅ Set up proper error logging

### Quick Deploy:

**Backend (Render/Railway):**
```bash
# Push to GitHub, connect to Render/Railway
# Set environment variables in dashboard
```

**Frontend (Vercel/Netlify):**
```bash
# Push to GitHub, connect to Vercel/Netlify
# Set VITE_API_URL to production API URL
```

---

## Need Help?

1. Check console for error messages
2. Review API response in Network tab
3. Verify .env files are created and configured
4. Ensure both backend and frontend servers are running
5. Check that MongoDB is connected

---

**Happy tracking! 💰**
