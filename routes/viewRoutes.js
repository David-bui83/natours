const express = require('express');
const {
  alerts, 
  getOverview,
  getTour,
  getLoginForm, 
  getAccount, 
  updateUserData,
  getMyTours
} = require('../controllers/viewController');
const { 
  isLoggedIn,
  protect 
} = require('../controllers/authController');
const {
  // createBookingCheckout
} = require('../controllers/bookingController');

const router = express.Router();

router.use(alerts);

router.get('/', isLoggedIn, getOverview);
router.get('/tour/:slug', isLoggedIn, getTour);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/me', protect, getAccount);
router.get(
  '/my-tours', 
  // createBookingCheckout, 
  protect, 
  getMyTours
);

router.post(
  '/submit-user-data',
  protect, 
  updateUserData
);

module.exports = router;