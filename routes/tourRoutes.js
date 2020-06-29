const express = require('express');
const { 
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour, 
  aliasTopTours,
  getToursStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances
} = require('../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
// const {
//   createReview
// } = require('../controllers/reviewController');
const reviewRouter = require('../routes/reviewRoutes');
const router = express.Router();

// POST /tours/232312312/reviews
// GET /tours/123123123/reviews
// GET /tours/2343242423/reivews/2423424234
router.use('/:tourId/reviews', reviewRouter);

// router.param('id', checkID);

router
  .route('/top-5-cheap')
  .get(aliasTopTours, getAllTours);

router
  .route('/tour-stats')
  .get(getToursStats);

router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router
  .route('/tours-within/:distances/center/:latlng/unit/:unit')
  .get(getToursWithin);

router
  .route('/distances/:latlng/unit/:unit')
  .get(getDistances);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

// POST /tours/232312312/reviews
// GET /tours/123123123/reviews
// GET /tours/2343242423/reivews/2423424234
// router
//   .route('/:tourId/reviews')
//   .post(protect, restrictTo('user'), createReview);

module.exports = router;