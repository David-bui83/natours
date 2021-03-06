const express = require('express');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
  deleteMe,
  uploadUserPhoto, 
  resizeUserPhoto
} = require('../controllers/usersController');
const { 
  signup, 
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect, 
  restrictTo
} = require('../controllers/authController');

const router = express.Router();

// Open to public
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout',logout);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// MIDDILEWARE - Apply protect() to all routes below
router.use(protect);

// Restricted from public
router.get('/me', getMe, getUser);
router.patch('/updateMyPassword', protect, updatePassword);

router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete('/deleteMe', deleteMe);

// MIDDLEWARE - Apply restricTo() to all routes below
router.use(restrictTo('admin'));

router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;