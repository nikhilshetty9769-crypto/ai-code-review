const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️ [MongoDB] MONGODB_URI is not defined in environment variables. Database connection skipped.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if Atlas is unreachable
    });
    console.log(`✅ [MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ [MongoDB] Connection error: ${error.message}`);
    console.warn('⚠️ [MongoDB] Server is running in degraded mode without database connection. Please configure MONGODB_URI in server/.env with your MongoDB Atlas connection string.');
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('ℹ️ [MongoDB] Connection disconnected.');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ [MongoDB] Reconnected to database.');
});

const getDBStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

module.exports = {
  connectDB,
  getDBStatus,
};
