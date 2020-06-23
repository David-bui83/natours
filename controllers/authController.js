const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

// Register new user
exports.signup = catchAsync(async (req, res, next) => {


  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  });
});