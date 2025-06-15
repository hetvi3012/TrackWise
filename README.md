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
  - **Receipt OCR Scanning**  
  Upload receipt images to automatically extract amount, date, merchant, and description using Tesseract.js.

- **NLP-Powered Description Parser**  
  Type free-text transaction descriptions (e.g. “Paid 50 for coffee on June 5”) and have a custom NLP pipeline (Compromise + chrono-node) infer amount, date, merchant, category, and type.

- **AI-Assisted Category Prediction**  
  Optionally integrate with the OpenAI API to refine category suggestions based on transaction descriptions, improving accuracy over keyword-based rules.  


---

## 🛠️ Tech Stack

| Layer                 | Technology                                    |
| ----------------------| ----------------------------------------------|
| **Backend**           | Node.js, Express                               |
| **Database**          | MongoDB, Mongoose                              |
| **Authentication**    | JSON Web Tokens (JWT), bcrypt                  |
| **OCR**               | Tesseract.js                                   |
| **NLP & Date Parsing**| Compromise, chrono-node                        |
| **Frontend**          | React, Ant Design, CRACO                       |
| **HTTP Client**       | Axios                                          |
| **Charts**            | Chart.js                                       |
| **Dev Tools**         | nodemon, concurrently                          |
| **AI (optional)**     | OpenAI API (category prediction)               |
---

## 📁 Project Structure
```
TrackWise/
├── client/                         # React app (CRA + CRACO)
│   ├── public/
│   ├── src/
│   │   ├── pages/                  # Login, Register, HomePage
│   │   ├── components/             # Layout, Spinner, Analytics
│   │   └── utils/                  # nlpLogic (NLP parser)
│   ├── package.json
│   └── .gitignore
├── config/
│   └── connectDB.js                # MongoDB connection
├── controllers/
│   ├── userController.js
│   ├── transactionController.js
│   └── categoryController.js
|   └── nlpController.js       # OpenAI-based category predictor
├── utils/
│   └── nlpLogic.js                 # Custom NLP logic (amount, date, merchant, category, type)
├── models/
│   ├── userModel.js
│   └── transactionModel.js
├── routes/
│   ├── userRoute.js
│   └── transactionRoute.js         # includes /parse-description and /predict-category
├── .env                            # local environment variables (MONGO_URI, JWT_SECRET, optionally OPENAI_API_KEY)
├── server.js                       # Express entrypoint
├── package.json                    # server scripts & dependencies
└── .gitignore
```




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

### 4. Production Build

Build the React app and serve it with Express:

```bash
npm start
```
This will:

Run the build-client script to compile the React app into client/build.

Start the Express server, which—when NODE_ENV=production—serves the static files from client/build.

Browse to `http://localhost:5000` to see your production-build app.


### ⚙️ Available Scripts

From the project root:

| Command               | Description                                                   |
| --------------------- | ------------------------------------------------------------- |
| `npm run server`      | Start Express with nodemon (auto-reload on changes)          |
| `npm run client`      | Start the React dev server (with CRACO theming)              |
| `npm run dev`         | Run **server** and **client** in parallel                     |
| `npm run build-client`| Install & build the React app into `client/build`             |
| `npm start`           | Build client (if needed) and start Express for production     |


## 🤝 Contributing

1. **Fork** the repo  
2. **Create a branch**  
   ```bash
   git checkout -b feature/awesome
   git commit -m "Add awesome feature"
   git push origin feature/awesome
   ```
3. Open a pull request


Happy Expense Tracking! 🚀

