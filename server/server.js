require('dotenv').config();

const http = require('http');
const app = require('./src/app');
const { connectDB } = require('./src/config/db');

const PORT = Number(process.env.PORT) || 5000;
const HOST = '0.0.0.0';

// Start listening immediately so Render can detect the port.
const server = http.createServer(app);

server.listen(PORT, HOST, () => {
  console.log(`AI Code Review API running on ${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: /api/v1/health`);
});

// Connect to MongoDB independently of server startup.
connectDB().catch((error) => {
  console.error('MongoDB connection failed:', error.message);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error.message);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error.message);
});