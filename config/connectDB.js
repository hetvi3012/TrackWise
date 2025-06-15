// config/connectDB.js

const mongoose = require('mongoose');
const colors   = require('colors');

const connectDB = async () => {
  // Ensure the MONGO_URI env var is set
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error(colors.bgRed.white('❌ MONGO_URI is not defined in your environment variables'));
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser:    true,
      useUnifiedTopology: true,
    });
    console.log(colors.bgCyan.white(`✔ MongoDB connected: ${conn.connection.host}`));
  } catch (err) {
    console.error(colors.bgRed.white(`❌ MongoDB connection error: ${err.stack || err.message}`));
    process.exit(1);
  }
};

module.exports = connectDB;
