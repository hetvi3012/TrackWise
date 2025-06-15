// server.js
require('dotenv').config();               // 1) load .env
const express   = require('express');
const cors      = require('cors');
const morgan    = require('morgan');
const colors    = require('colors');
const connectDB = require('./config/connectDB');
const userRoute = require('./routes/userRoute');
const txRoute   = require('./routes/transactionRoute');

const app = express();

// connect to Mongo
connectDB();

// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// routes
app.use('/api/v1/users',        userRoute);
app.use('/api/v1/transactions', txRoute);

// 404 for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// ← Global error handler
app.use((err, req, res, next) => {
  console.error(colors.red('🔥 Uncaught Error:'), err.stack);
  res.status(500).json({
    message: err.message || 'Server Error',
    // uncomment next line if you want stack in the response:
    // stack: err.stack
  });
});

// start server
const PORT = process.env.PORT || 5000;
const path = require('path');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
  );
}

app.listen(PORT, () => {
  console.log(colors.green(`Server running on port ${PORT}`));
});
