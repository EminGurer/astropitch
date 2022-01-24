const wrapAsync = require('../errorUtilities/wrapAsync');
const Pitch = require('../models/pitches');
const Review = require('../models/reviews');

const createReview = wrapAsync(async (req, res, next) => {
  const pitch = await Pitch.findById(req.params.pitchID);
  req.body.review.author = req.user.id;
  const review = new Review(req.body.review);
  pitch.reviews.push(review);
  await review.save();
  await pitch.save();
  req.flash('success', 'Review is created');
  res.redirect(`/pitches/${pitch.id}`);
});

const deleteReview = wrapAsync(async (req, res, next) => {
  const { pitchID, reviewID } = req.params;
  await Review.findByIdAndDelete(reviewID);
  await Pitch.findByIdAndUpdate(pitchID, { $pull: { reviews: reviewID } });
  req.flash('success', 'Review is deleted');
  res.redirect(`/pitches/${pitchID}`);
});

module.exports = { createReview, deleteReview };
