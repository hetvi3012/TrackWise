# TrackWise

A full-stack expense management application built with the MERN stack (MongoDB, Express, React, Node.js) and Ant Design. TrackWise lets users register, log in, and perform CRUD operations on their income and expenses, with a built-in analytics dashboard.

---

## 🚀 Features

- **User Authentication**  
  Secure signup/login with JWT and bcrypt password hashing.

- **Expense Management**  
  Create, read, update, and delete transactions (amount, type, category, date, reference, description).

- **Analytics Dashboard**  
  Filter by date range and type; view transactions in a table or as a chart breakdown by category.

- **Responsive UI**  
  Polished, mobile-friendly interface themed with Ant Design and CRACO.

- **Persistent Sessions**  
  User data stored in `localStorage` and MongoDB—persists across browser and server restarts.

---

## 🛠️ Tech Stack

| Layer       | Technology                 |
| ----------- | -------------------------- |
| Backend     | Node.js, Express           |
| Database    | MongoDB, Mongoose          |
| Authentication | JSON Web Tokens (JWT)  |
| Frontend    | React, Ant Design, CRACO   |
| Charts      | Chart.js                   |
| Dev Tools   | nodemon, concurrently      |

---

## 📁 Project Structure
TrackWise/
├── client/ # React app (CRA + CRACO)
│ ├── public/
│ ├── src/
│ │ ├── pages/ # Login, Register, HomePage
│ │ ├── components/ # Layout, Spinner, Analytics
│ │ └── craco.config.js # AntD theme overrides
│ ├── package.json
│ └── .gitignore
├── config/
│ └── connectDB.js # MongoDB connection
├── controllers/
│ ├── userController.js
│ └── transactionController.js
├── models/
│ ├── userModel.js
│ └── transactionModel.js
├── routes/
│ ├── userRoute.js
│ └── transactionRoute.js
├── .env # local environment variables
├── server.js # Express entrypoint
├── package.json # server scripts & dependencies
└── .gitignore





---

## 🔧 Getting Started

### Prerequisites

- **Node.js** v16+ & **npm**  
- **MongoDB** (local or Atlas)

### 1. Clone & Install

```bash
git clone https://github.com/<your-username>/TrackWise.git
cd TrackWise
```

# Install server dependencies

```bash
npm install
```



# Install client dependencies
```bash
cd client
npm install
cd ..
```

### 2. Configure Environment

Create a file at the project root named `.env` with the following content:

```ini
MONGO_URI="mongodb://localhost:27017/TrackWise"
JWT_SECRET="<your_jwt_secret_here>"
PORT=5000
```

