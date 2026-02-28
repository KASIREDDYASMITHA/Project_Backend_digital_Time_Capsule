
# 🚏 Digital Time Capsule – Backend

## 📌 Project Overview

This is the backend service for the Digital Time Capsule application. It handles authentication, capsule management, scheduling logic, and communication with the Supabase database.

The backend is built using Node.js and Express, following a modular MVC architecture for scalability and maintainability.


## 🎯 Responsibilities

* Handle user authentication and authorization
* Manage time capsule creation and retrieval
* Enforce capsule locking logic
* Trigger scheduled reminders and unlock events
* Connect and interact with Supabase database



## ⚙️ Tech Stack

* Node.js
* Express.js
* Supabase (PostgreSQL)
* JWT Authentication
* Nodemon (Development)



## 📂 Folder Structure


backend/
│
├── controllers/     # Business logic
├── models/          # Database queries
├── routes/          # API routes
├── middleware/      # Auth & error handling
├── config/          # Supabase & env setup
├── utils/           # Helper functions (cron, mail, etc.)
└── server.js        # Entry point



## 🔐 Authentication

* JWT-based authentication
* Secure login and registration
* Protected routes using middleware

### Flow:

1. User logs in
2. Server generates JWT
3. Token is sent to frontend
4. Protected routes verify token


## 📡 API Endpoints

### 🔑 Auth Routes

POST /api/auth/register   # Register new user
POST /api/auth/login      # Login user
GET  /api/auth/me         # Get current user



### 📦 Capsule Routes


POST   /api/capsules        # Create capsule
GET    /api/capsules        # Get all user capsules
GET    /api/capsules/:id    # Get single capsule
DELETE /api/capsules/:id    # Delete capsule (if allowed)




### 🔔 Notification / Scheduler


- Cron job checks unlock dates
- Sends reminder notifications
- Updates capsule status (locked → unlocked)



## 🗄️ Database Design (Supabase)

### Tables Overview

#### Users


- id (UUID, Primary Key)
- email
- password
- created_at
```

#### Capsules

- id (UUID)
- user_id (FK → users.id)
- title
- message
- media_url
- unlock_date
- is_locked
- created_at


#### Recipients (Optional Feature)

- id
- capsule_id (FK)
- email

## 🔗 Relationships

* One user → many capsules
* One capsule → multiple recipients


## 🔄 Core Logic

### Capsule Locking

* Capsules cannot be edited after creation
* `is_locked = true` until unlock date

### Unlock Mechanism

* Cron job runs periodically
* Checks current date vs unlock_date
* Unlocks eligible capsules



## ⚠️ Error Handling

* Centralized error middleware
* Consistent API response format


{
  "success": false,
  "message": "Error message"
}

## 🌐 Environment Variables


PORT=5000
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
JWT_SECRET=your_secret


## ▶️ Running the Server

npm install
npm run dev

## ☁️ Deployment

* **Backend:** Render


## ⚠️ Known Limitations

* No file storage optimization (large media)
* Email notifications may be basic
* No rate limiting implemented


## 🚀 Future Improvements

* Role-based access control
* Shareable capsule links with expiry
* Advanced notification system (email + push)
* AI-based message suggestions



## 📖 API Testing

Use tools like:

* Postman
* Thunder Client (VS Code)


## 👨‍💻 Author
KASIREDDY ASMITHA
Developed as part of a Full Stack Project.

