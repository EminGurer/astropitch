const Pitch = require('./models/pitches');
const AppError = require('./errorUtilities/customError');
const { pitchJoiSchema, reviewJoiSchema } = require('./joiSchemas');
const Review = require('./models/reviews');

const validatePitch = function (req, res, next) {
  const { error } = pitchJoiSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((item) => item.message).join(',');
    throw new AppError(msg, 400);
  } else {
    next();
  }
};
const validateReview = function (req, res, next) {
  const { error } = reviewJoiSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((item) => item.message).join(',');
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

const isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must login');
    return res.redirect('/users/login');
  }
  next();
};
const isOwnerOfPitch = async function (req, res, next) {
  const { id } = req.params;
  const pitch = await Pitch.findById(id).populate('author');
  if (req.user.id !== pitch.author.id) {
    req.flash('error', 'You dont have permissions to update the pitch');
    return res.redirect(`/pitches/${id}`);
  }
  next();
};
const isOwnerOfReview = async function (req, res, next) {
  const { pitchID, reviewID } = req.params;
  const review = await Review.findById(reviewID).populate('author');
  if (req.user.id !== review.author.id) {
    req.flash('error', 'You dont have permissions to update the review');
    return res.redirect(`/pitches/${pitchID}`);
  }
  next();
};
module.exports = {
  isLoggedIn,
  isOwnerOfPitch,
  validatePitch,
  validateReview,
  isOwnerOfReview,
};
