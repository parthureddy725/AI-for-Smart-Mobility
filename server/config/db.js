const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/moveai';
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log(`[MoveAI DB] Connected to MongoDB at ${uri}`);
  } catch (err) {
    isConnected = false;
    console.warn(`[MoveAI DB] MongoDB connection skipped (${err.message}). Using high-performance In-Memory Datastore.`);
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
