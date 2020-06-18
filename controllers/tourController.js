const Tour = require('../models/tourModel');

// Get all tours 
exports.getAllTours = async (req, res) => {
  try{
    // BUILD QUERY
    // 1A) FILTERING
    const queryObj = {...req.query};
    const excludedFields = ['page', 'sort', 'limit', 'fields']; 
    excludedFields.forEach(el => delete queryObj[el]);

    // 1B) ADVANCED FILTERING 
    // {difficulty: 'easy', duration: { $gte: 5}}
    // {difficulty: 'easy', duration: { gte: 5}}
    // gte, gt, lte, lt
    let queryStr =JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    console.log(JSON.parse(queryStr));

    let query = Tour.find(JSON.parse(queryStr));
    
    // const query = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
    
    // 2) SORTING
    if (req.query.sort){
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy);
      query = query.sort(sortBy);
      // sort('price ratingsAverage')
    }else{
      query = query.sort('-createdAt');
    }

    // 3) FIELD LIMITING
    if(req.query.fields){
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    }else{
      query = query.select('-__v');
    }

    // 4) PAGINATION

    const page = req.query.page  * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    // page=2&limit-10, 1-10 page 1, 11-20 page 2, 21-30 page 3
    query = query.skip(skip).limit(limit);

    if(req.query.page){
      const numTours = await Tour.countDocuments();
      if(skip >= numTours) throw new Error('This page does not exist');
    }

    // EXECUTE QUERY
    const tours = await query;

  
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