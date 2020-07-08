/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_51H22XcFxGUAyaf7wqZzoqJSikvYMgRQ2ULCpoQJw3la4JFnzPP1ZipdtTEmOjmNhISQ5doOJ1Yeo37wA0TUx459o00SkYqEUI4');

export const bookTour = async tourId => {
  try{
    // console.log(tourId);
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);
  
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  }catch(err){
    console.log(err);
    showAlert('error', err);
  }
};