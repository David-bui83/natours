const express = require('express');
const app = express();
const morgan = require('morgan');

/////////////////////////////////////////
// MIDDLEWARE 
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`/${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello, from the middleware 😀');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/////////////////////////////////////////
// MOUNTING ROUTERS
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

///////////////////////////////////////
// START SERVER
module.exports = app;