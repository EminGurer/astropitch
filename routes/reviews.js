const express = require('express');
const router = express.Router({ mergeParams: true });

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
