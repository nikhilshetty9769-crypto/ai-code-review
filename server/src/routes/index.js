const express = require('express');
const router = express.Router();
const reviewRoutes = require('./reviewRoutes');
const statsRoutes = require('./statsRoutes');
const { getDBStatus } = require('../config/db');

/**
 * @desc    System Health & Diagnostic Check
 * @route   GET /api/v1/health
 */
router.get('/health', (req, res) => {
  const dbStatus = getDBStatus();
  const isHealthy = dbStatus === 'connected' || dbStatus === 'connecting';

  res.status(200).json({
    success: true,
    status: 'healthy',
    message: 'AI Code Review Assistant API is operational',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus,
    },
  });
});

// Mount modular sub-routers
router.use('/reviews', reviewRoutes);
router.use('/stats', statsRoutes);

module.exports = router;
