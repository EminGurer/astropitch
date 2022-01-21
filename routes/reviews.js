const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../errorUtilities/wrapAsync');
const AppError = require('../errorUtilities/customError');
const { reviewJoiSchema } = require('../joiSchemas');
const Pitch = require('../models/pitches');
const Review = require('../models/reviews');

//Custom middleware
const validateReview = function (req, res, next) {
  const { error } = reviewJoiSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((item) => item.message).join(',');
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

//Create
router.post(
  '/',
  validateReview,
  wrapAsync(async (req, res, next) => {
    const pitch = await Pitch.findById(req.params.pitchID);
    const review = new Review(req.body.review);
    pitch.reviews.push(review);
    await review.save();
    await pitch.save();
    req.flash('success', 'Review is created');
    res.redirect(`/pitches/${pitch.id}`);
  })
);
//Delete
router.delete(
  '/:reviewID',
  wrapAsync(async (req, res, next) => {
    const { pitchID, reviewID } = req.params;
    await Review.findByIdAndDelete(reviewID);
    await Pitch.findByIdAndUpdate(pitchID, { $pull: { reviews: reviewID } });
    req.flash('error', 'Review is deleted');
    res.redirect(`/pitches/${pitchID}`);
  })
);

module.exports = router;
