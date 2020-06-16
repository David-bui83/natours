const fs = require('fs');

// Read file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkID = (req, res, next, val) => {
  if(req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  console.log(req.body)

  if(!req.body.name || !req.body.price){
    return res.status(400).json({
      status: 'fail',
      message: 'Body and price are required'
    });
  }
  next();
}

// Get all tours 
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
}

// GET single tour by ID
 exports.getTour = (req, res) => {

  const tour = tours.find(el => el.id === parseInt(req.params.id));
  // const tour = tours.filter(el => el.id === parseInt(req.params.id));

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  })
}

// POST tour
exports.createTour = (req, res) => {

  const newId = tours[tours.length -1].id + 1
  const newTour = Object.assign({id: newId}, req.body);

  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  });
}

// PATCH tour
exports.updateTour = (req, res) =>{ 

  const tour = tours.find(el => el.id === parseInt(req.params.id));

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated tour here...'
    }
  });
}

exports.deleteTour = (req, res) => {
  const tour = tours.find(el => el.id === parseInt(req.params.id));
  
  res.status(204).json({
    status: 'success',
    data: null
  })
}