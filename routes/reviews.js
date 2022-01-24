const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../errorUtilities/wrapAsync');
const Pitch = require('../models/pitches');
const Review = require('../models/reviews');

//Middlewares
const {
  validateReview,
  isLoggedIn,
  isOwnerOfReview,
} = require('../middlewares');

//Controllers
const { createReview, deleteReview } = require('../controllers/reviews');

//Create
router.post('/', isLoggedIn, validateReview, createReview);
//Delete
router.delete('/:reviewID', isLoggedIn, isOwnerOfReview, deleteReview);

module.exports = router;
