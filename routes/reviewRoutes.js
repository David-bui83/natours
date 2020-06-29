const express = require('express');
const {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  setTourUserIds
} = require('../controllers/reviewController');

const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// MIDDLEWARE - Apply to all routes below
router.use(protect);

router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setTourUserIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(protect, restrictTo('user', 'admin'), deleteReview);

  module.exports = router;