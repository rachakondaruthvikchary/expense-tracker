# Expense Tracker - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### 1. User Registration
**Endpoint:** `POST /auth/signup`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "monthlyBudget": 5000,
    "currency": "USD",
    "theme": "light",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. User Login
**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. Get User Profile
**Endpoint:** `GET /auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": { ... }
}
```

---

### 4. Update User Profile
**Endpoint:** `PUT /auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "name": "John Smith",
  "monthlyBudget": 6000,
  "currency": "EUR",
  "theme": "dark"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

### 5. Change Password
**Endpoint:** `POST /auth/change-password`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456",
  "confirmPassword": "newpassword456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## Transaction Endpoints

### 1. Create Transaction
**Endpoint:** `POST /transactions`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "title": "Groceries",
  "amount": 45.50,
  "type": "expense",
  "category": "food",
  "date": "2024-01-15",
  "description": "Weekly grocery shopping",
  "paymentMethod": "card"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "transaction": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "title": "Groceries",
    "amount": 45.50,
    "type": "expense",
    "category": "food",
    "date": "2024-01-15T00:00:00Z",
    "description": "Weekly grocery shopping",
    "paymentMethod": "card",
    "tags": [],
    "recurring": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 2. Get All Transactions
**Endpoint:** `GET /transactions`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
?category=food&type=expense&startDate=2024-01-01&endDate=2024-01-31&page=1&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "transactions": [ ... ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  },
  "stats": {
    "totalIncome": 2000,
    "totalExpense": 450,
    "netBalance": 1550,
    "byCategory": { ... },
    "byMonth": { ... }
  }
}
```

---

### 3. Get Single Transaction
**Endpoint:** `GET /transactions/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "transaction": { ... }
}
```

---

### 4. Update Transaction
**Endpoint:** `PUT /transactions/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "title": "Updated Title",
  "amount": 50.00,
  "category": "shopping"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Transaction updated successfully",
  "transaction": { ... }
}
```

---

### 5. Delete Transaction
**Endpoint:** `DELETE /transactions/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

---

### 6. Get Dashboard Summary
**Endpoint:** `GET /transactions/dashboard`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "summary": {
    "totalIncome": 2000,
    "totalExpense": 450,
    "netBalance": 1550,
    "topCategories": [
      { "category": "food", "amount": 200 },
      { "category": "travel", "amount": 150 }
    ],
    "transactionCount": 15
  }
}
```

---

### 7. Get AI Insights
**Endpoint:** `GET /transactions/insights`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "insights": [
    {
      "type": "spending_pattern",
      "message": "Your average monthly spending is $450.00",
      "severity": "info"
    },
    {
      "type": "top_category",
      "message": "food is your top spending category at 44.4% of total expenses",
      "severity": "warning"
    },
    {
      "type": "savings_rate",
      "message": "Your savings rate is 77.5%",
      "severity": "success"
    }
  ]
}
```

---

### 8. Get Chart Data
**Endpoint:** `GET /transactions/chart-data`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "chartData": {
    "lineChart": [
      { "month": "2024-01", "income": 2000, "expense": 450 },
      { "month": "2024-02", "income": 2000, "expense": 520 }
    ],
    "pieChart": [
      { "name": "food", "value": 200 },
      { "name": "travel", "value": 150 }
    ]
  }
}
```

---

### 9. Export to CSV
**Endpoint:** `GET /transactions/export`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
?category=food&type=expense&startDate=2024-01-01&endDate=2024-01-31
```

**Response:** CSV file download

---

## Budget Endpoints

### 1. Set Monthly Budget
**Endpoint:** `POST /budget`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "month": 1,
  "year": 2024,
  "totalLimit": 2000,
  "categoryLimits": {
    "food": 300,
    "travel": 400
  },
  "alertThreshold": 0.8
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Budget set successfully",
  "budget": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "month": 1,
    "year": 2024,
    "totalLimit": 2000,
    "categoryLimits": { ... },
    "alertThreshold": 0.8,
    "notifications": [],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 2. Get Budget Status
**Endpoint:** `GET /budget/status`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "budget": {
    "_id": "507f1f77bcf86cd799439013",
    "month": 1,
    "year": 2024,
    "totalLimit": 2000,
    "totalSpent": 450,
    "remainingBudget": 1550,
    "percentageSpent": "22.5",
    "categorySpent": {
      "food": 200,
      "travel": 150
    },
    "alerts": [
      {
        "type": "budget_exceeded",
        "message": "You've spent 22.5% of your monthly budget",
        "severity": "info"
      }
    ]
  }
}
```

---

### 3. Get Budget History
**Endpoint:** `GET /budget/history`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
?months=12
```

**Response (200):**
```json
{
  "success": true,
  "budgets": [ ... ]
}
```

---

### 4. Delete Budget
**Endpoint:** `DELETE /budget/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Budget deleted successfully"
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "Email is required",
    "Password must be at least 6 characters"
  ]
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Transaction not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Categories Available
- food
- travel
- bills
- shopping
- entertainment
- health
- education
- salary
- bonus
- other

## Payment Methods Available
- cash
- card
- bank_transfer
- digital_wallet
- other

## Recurring Frequencies Available
- daily
- weekly
- monthly
- yearly

---

## Rate Limiting
Currently no rate limiting implemented. Consider adding for production deployment.

## Pagination
Default limit: 10
Max limit: 100

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Transactions
```bash
curl -X GET "http://localhost:5000/api/transactions?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

---

## Postman Collection
Import this template in Postman for easier API testing:
[Download Postman Collection](./postman-collection.json)

---

**Last Updated:** January 2024
