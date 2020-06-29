const mongoose = require('mongoose');
const Tour = require('../models/tourModel');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review can not be empty']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createAt: {
    type: Date,
    defualt: Date.now
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must belong to a tour']
  }, 
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must be long to a user']
  }
},
{
  toJSON: { virtuals: true},
  toObject: { virtuals: true}
});

reviewSchema.pre(/^find/, function(next) {
  this.select('-__v');
  next();
});

reviewSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'user',
  //   select: 'name photo'
  // }).populate({
  //   path: 'tour',
  //   select: 'name'
  // }).select('-__v');

  this.populate({
    path: 'user',
    select: 'name photo'
  });

  next();
});

// Static Function
reviewSchema.statics.calcAverageRatings = async function(tourId) {
  
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  console.log(stats);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating
  });
};

reviewSchema.post('save', function() {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

