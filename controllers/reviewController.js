const Review = require('../models/reviewModel');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if(!req.body.tour) req.body.tour = req.params.tourId;
  if(!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

// GET all reviews
// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   let filter = {};
//   if(req.params.tourId) filter = {tour: req.params.tourId};

//   const reviews = await Review.find(filter);

//   res.status(200).json({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       reviews
//     }
//   });
// });

// GET single review by ID
// exports.getReview = catchAsync(async (req, res, next) => {
//   const review = await Review.findById(req.params.id);

//   if(!review){
//     return next(new AppError('No review with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       review
//     }
//   });
// });

// // CREATE a review
// exports.createReview = catchAsync(async (req, res, next) => {
//   // Allow nested routes
//   if(!req.body.tour) req.body.tour = req.params.tourId
//   if(!req.body.user) req.body.user = req.user.id;
  
//   const newReview = await Review.create(req.body);
  
//   res.status(201).json({
//     status: 'success',
//     data: {
//       review: newReview
//     }
//   });
// });

// Delete a review by ID
// exports.deleteReview = catchAsync(async (req, res, next) => {
//   const review = await Review.findByIdAndDelete(req.params.id);

//   if(!review){
//     return next(new AppError('No review found with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null
//   });
// });