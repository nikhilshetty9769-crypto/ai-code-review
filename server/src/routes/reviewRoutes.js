const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviews,
  getReviewById,
  getReviewStats,
  deleteReview,
} = require('../controllers/reviewController');
const { validateReviewPayload } = require('../middlewares/validateRequest');

router.route('/')
  .post(validateReviewPayload, createReview)
  .get(getReviews);

router.get('/stats', getReviewStats);

router.route('/:id')
  .get(getReviewById)
  .delete(deleteReview);

module.exports = router;
