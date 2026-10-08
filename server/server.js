require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { connectDB } = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Initialize Server
const startServer = async () => {
  // Connect to Database
  await connectDB();

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 AI Code Review API Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🩺 Health Check: http://localhost:${PORT}/api/v1/health`);
    console.log(`===============================================`);
  });

  // Handle Unhandled Promise Rejections
  process.on('unhandledRejection', (err) => {
    console.error(`❌ [UnhandledRejection]: ${err.message}`);
  });

  // Handle Uncaught Exceptions
  process.on('uncaughtException', (err) => {
    console.error(`❌ [UncaughtException]: ${err.message}`);
  });
};

startServer();
