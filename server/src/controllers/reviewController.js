const mongoose = require('mongoose');
const Review = require('../models/Review');
const { reviewCodeWithGemini } = require('../services/geminiService');
const { getDBStatus } = require('../config/db');
const { ISSUE_TYPES, SEVERITY_LEVELS } = require('../utils/constants');

/**
 * @desc    Analyze code with Gemini AI, persist the review, and return structured review
 * @route   POST /api/v1/reviews
 */
const createReview = async (req, res, next) => {
  try {
    const { language, code } = req.body;

    const reviewData = await reviewCodeWithGemini(language, code);

    if (getDBStatus() !== 'connected') {
      const error = new Error('Review completed but could not be saved: database is not connected');
      error.statusCode = 503;
      throw error;
    }

    try {
      await Review.create({
        language: reviewData.language,
        originalCode: code,
        score: reviewData.score,
        summary: reviewData.summary,
        metrics: reviewData.metrics,
        issues: (reviewData.issues || []).map((issue) => ({
          type: ISSUE_TYPES.includes(issue.type) ? issue.type : 'quality',
          severity: SEVERITY_LEVELS.includes(issue.severity) ? issue.severity : 'medium',
          lineNumber: typeof issue.lineNumber === 'number' ? issue.lineNumber : null,
          title: String(issue.title || 'Code Improvement Notice').slice(0, 150),
          explanation: issue.explanation,
          suggestedFix: issue.suggestedFix,
        })),
        improvedCode: reviewData.improvedCode || '',
        status: 'completed',
      });
    } catch (dbError) {
      dbError.statusCode = dbError.name === 'ValidationError' ? 400 : 500;
      dbError.message = `Failed to save review to database: ${dbError.message}`;
      throw dbError;
    }

    res.status(200).json({
      success: true,
      message: 'Code review completed successfully',
      data: reviewData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all saved reviews (paginated)
 * @route   GET /api/v1/reviews
 */
const getReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.language) {
      filter.language = req.query.language.toLowerCase();
    }

    const total = await Review.countDocuments(filter);
    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-originalCode -improvedCode');

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single review by ID
 * @route   GET /api/v1/reviews/:id
 */
const getReviewById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format for resource: '${id}'`,
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: `Review with ID '${id}' not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Dashboard statistics from saved reviews
 * @route   GET /api/v1/reviews/stats
 */
const getReviewStats = async (req, res, next) => {
  try {
    const [totals] = await Review.aggregate([
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageScore: { $avg: '$score' },
          criticalIssues: { $sum: '$metrics.criticalIssues' },
          securityIssues: { $sum: '$metrics.securityIssues' },
        },
      },
    ]);

    const [topLanguage] = await Review.aggregate([
      { $group: { _id: '$language', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalReviews: totals ? totals.totalReviews : 0,
        averageScore: Math.round(((totals && totals.averageScore) || 0) * 10) / 10,
        criticalIssues: totals ? totals.criticalIssues : 0,
        securityIssues: totals ? totals.securityIssues : 0,
        mostReviewedLanguage: topLanguage ? topLanguage._id : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a review by ID
 * @route   DELETE /api/v1/reviews/:id
 */
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: `Review with ID '${req.params.id}' not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review successfully deleted',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getReviews,
  getReviewById,
  getReviewStats,
  deleteReview,
};
