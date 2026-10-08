const Review = require('../models/Review');

/**
 * @desc    Get dashboard metrics & summary
 * @route   GET /api/v1/stats
 */
const getStats = async (req, res, next) => {
  try {
    const totalReviews = await Review.countDocuments();

    // Aggregation for averages and totals
    const aggregates = await Review.aggregate([
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$score' },
          totalIssues: { $sum: '$metrics.totalIssues' },
          criticalIssues: { $sum: '$metrics.criticalIssues' },
          securityIssues: { $sum: '$metrics.securityIssues' },
          performanceIssues: { $sum: '$metrics.performanceIssues' },
          qualityIssues: { $sum: '$metrics.qualityIssues' },
        },
      },
    ]);

    const recentReviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title language score metrics createdAt');

    const statsData = aggregates[0] || {
      averageScore: 0,
      totalIssues: 0,
      criticalIssues: 0,
      securityIssues: 0,
      performanceIssues: 0,
      qualityIssues: 0,
    };

    res.status(200).json({
      success: true,
      data: {
        totalReviews,
        averageScore: Math.round((statsData.averageScore || 0) * 10) / 10,
        totalIssues: statsData.totalIssues,
        criticalIssues: statsData.criticalIssues,
        securityIssues: statsData.securityIssues,
        performanceIssues: statsData.performanceIssues,
        qualityIssues: statsData.qualityIssues,
        recentReviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
};
