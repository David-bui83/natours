const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

// Get top 5 cheap tours
exports.aliasTopTours = (req, res, next) => { 
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

// Get all tours 
exports.getAllTours = async (req, res) => {
  try{
    // BUILD QUERY
    // 1A) FILTERING
    // const queryObj = {...req.query};
    // const excludedFields = ['page', 'sort', 'limit', 'fields']; 
    // excludedFields.forEach(el => delete queryObj[el]);

    // // 1B) ADVANCED FILTERING 
    // // {difficulty: 'easy', duration: { $gte: 5}}
    // // {difficulty: 'easy', duration: { gte: 5}}
    // // gte, gt, lte, lt
    // let queryStr =JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    // console.log(JSON.parse(queryStr));

    // let query = Tour.find(JSON.parse(queryStr));
    
    // const query = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
    
    // 2) SORTING
    // if (req.query.sort){
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   console.log(sortBy);
    //   query = query.sort(sortBy);
    //   // sort('price ratingsAverage')
    // }else{
    //   query = query.sort('-createdAt');
    // }

    // 3) FIELD LIMITING
    // if(req.query.fields){
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // }else{
    //   query = query.select('-__v');
    // }

    // 4) PAGINATION

    // const page = req.query.page  * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;

    // // page=2&limit-10, 1-10 page 1, 11-20 page 2, 21-30 page 3
    // query = query.skip(skip).limit(limit);

    // if(req.query.page){
    //   const numTours = await Tour.countDocuments();
    //   if(skip >= numTours) throw new Error('This page does not exist');
    // }

    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
                    .filter()
                    .sort()
                    .limitFields()
                    .paginate();

    const tours = await features.query;

  
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tour: tours
      }
    });
  }catch(err){
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
}

// GET single tour by ID
exports.getTour = async (req, res) => {
  try{
    const tour = await Tour.findById(req.params.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  }catch(err){
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
}

// POST tour
exports.createTour = async (req, res) => {
  try{
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });

  }catch(err){
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
}

// PATCH tour
exports.updateTour = async (req, res) =>{ 
  try{
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    
    res.status(204).json({
      status: 'success',
      data: {
        tour 
      }
    });
  }catch(err){
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }

}

exports.deleteTour = async (req, res) => {
  try{
    // await Tour.find(el => el.id === parseInt(req.params.id));
    await Tour.findByIdAndDelete(req.params.id);
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  }catch(err){
    res.status(404).json({
      status: 'fail',
      message: 'Invalid id'
    });
  }
}

exports.getToursStats = async (req, res) => {
  try{
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
    })
  }catch(err){
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try{
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

  }catch(err){
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};