const multer = require('multer');
const sharp = require('sharp');
const Tour = require('../models/tourModel');
// const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if(file.mimetype.startsWith('image')) {
    cb(null, true);
  }else{
    cb(new Error('Not an image!, Please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadTourImages = upload.fields([
  {name: 'imageCover', maxCount: 1},
  {name: 'images', maxCount: 3}
]);

// upload.single('image'); req.file
// upload.array('images', 5); req.files

exports.resizeTourImages = (req, res, next) => {
  console.log(req.files);

  next();
};

// Get top 5 cheap tours
exports.aliasTopTours = (req, res, next) => { 
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, {path: 'reviews'});
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

// Get all tours 
// exports.getAllTours = catchAsync(async (req, res, next) => {
//   // try{
//     // BUILD QUERY
//     // 1A) FILTERING
//     // const queryObj = {...req.query};
//     // const excludedFields = ['page', 'sort', 'limit', 'fields']; 
//     // excludedFields.forEach(el => delete queryObj[el]);

//     // // 1B) ADVANCED FILTERING 
//     // // {difficulty: 'easy', duration: { $gte: 5}}
//     // // {difficulty: 'easy', duration: { gte: 5}}
//     // // gte, gt, lte, lt
//     // let queryStr =JSON.stringify(queryObj);
//     // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
//     // console.log(JSON.parse(queryStr));

//     // let query = Tour.find(JSON.parse(queryStr));
    
//     // const query = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
    
//     // 2) SORTING
//     // if (req.query.sort){
//     //   const sortBy = req.query.sort.split(',').join(' ');
//     //   console.log(sortBy);
//     //   query = query.sort(sortBy);
//     //   // sort('price ratingsAverage')
//     // }else{
//     //   query = query.sort('-createdAt');
//     // }

//     // 3) FIELD LIMITING
//     // if(req.query.fields){
//     //   const fields = req.query.fields.split(',').join(' ');
//     //   query = query.select(fields);
//     // }else{
//     //   query = query.select('-__v');
//     // }

//     // 4) PAGINATION

//     // const page = req.query.page  * 1 || 1;
//     // const limit = req.query.limit * 1 || 100;
//     // const skip = (page - 1) * limit;

//     // // page=2&limit-10, 1-10 page 1, 11-20 page 2, 21-30 page 3
//     // query = query.skip(skip).limit(limit);

//     // if(req.query.page){
//     //   const numTours = await Tour.countDocuments();
//     //   if(skip >= numTours) throw new Error('This page does not exist');
//     // }

//     // EXECUTE QUERY
    
//   // }catch(err){
//   //   res.status(404).json({
//   //     status: 'fail',
//   //     message: err
//   //   });
//   // }

//   const features = new APIFeatures(Tour.find(), req.query)
//                     .filter()
//                     .sort()
//                     .limitFields()
//                     .paginate();

//   const tours = await features.query;


//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//       tour: tours
//     }
//   });
// });

// // GET single tour by ID
// exports.getTour = catchAsync(async (req, res, next) => {
//   const tour = await (await Tour.findById(req.params.id).select('-__v').populate('reviews'));

//   if(!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }
  
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour
//     }
//   });
//   // try{
//   // }catch(err){
//   //   res.status(404).json({
//   //     status: 'fail',
//   //     message: err
//   //   });
//   // }
// });


// // POST tour
// exports.createTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour
//     }
//   });

//   // try{
//   // }catch(err){
//   //   res.status(400).json({
//   //     status: 'fail',
//   //     message: err
//   //   })
//   // }
// });

// PATCH tour
// exports.updateTour = catchAsync(async (req, res, next) =>{ 
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

//   if(!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }
  
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour 
//     }
//   });
//   // try{
//   // }catch(err){
//   //   res.status(404).json({
//   //     status: 'fail',
//   //     message: err
//   //   });
//   // }
// });

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if(!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }
  
//   res.status(204).json({
//     status: 'success',
//     data: null
//   });
//   // try{
//   //   // await Tour.find(el => el.id === parseInt(req.params.id));
//   // }catch(err){
//   //   res.status(404).json({
//   //     status: 'fail',
//   //     message: 'Invalid id'
//   //   });
//   // }
// });

exports.getToursStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { 
          $gte: 4.5 
        }
      }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty'},
        numTours: {
          $sum: 1
        },
        numRatings: {
          $sum: '$ratingsQuantity'
        },
        avgRating: { 
          $avg: '$ratingsAverage' 
        },
        avgPrice: {
          $avg: '$price'
        },
        minPrice: {
          $min: '$price'
        },
        maxPrice: {
          $max: '$price'
        }
      }
    },
    {
      $sort: { avgPrice: 1 }}
    // },
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ])

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
  // try{
  // }catch(err){
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err
  //   });
  // }
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-1`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month : '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name'}
      }
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan
    } 
  });
  // try{

  // }catch(err){
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err
  //   });
  // }
});

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/-40,45/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if(!lat || !lng) {
    return next(new AppError('Please provide latitude and longitude in the format lat,lng.', 400));
  }

  const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001

  if(!lat || !lng) {
    return next(new AppError('Please provide latitude and longitude in the format lat,lng', 400));
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: { 
        near: { 
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1,
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });

});