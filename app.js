const fs = require('fs');
const express = require('express');
const app = express();
const morgan = require('morgan');

const PORT = process.env.PORT || 5000;

// MIDDLEWARE
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello, from the middleware 😀');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});


// Read file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

/////////////////////////////////////////
// HANDLERS

// Get all tours 
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
}

// GET single tour by ID
 const getTour = (req, res) => {

  const tour = tours.find(el => el.id === parseInt(req.params.id));
  // const tour = tours.filter(el => el.id === parseInt(req.params.id));
  
  if(!tour){
    return res.status(404).json({
      status: 'fail',
     message: 'Invalid ID'
    })
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  })
}

// POST tour
const createTour = (req, res) => {
  // console.log(req.body);

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
const updateTour = (req, res) =>{ 

  const tour = tours.find(el => el.id === parseInt(req.params.id));

  if(!tour){
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid'
    })
  };

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated tour here...'
    }
  });
}

const deleteTour = (req, res) => {
  const tour = tours.find(el => el.id === parseInt(req.params.id));
  console.log(tour);

  if(!tour){
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  // tour.remove(tour);

  res.status(204).json({
    status: 'success',
    data: null
  })
}

///////////////////////////////////////
// ROUTES
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}....`);
});