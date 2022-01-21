const express = require('express');
const router = express.Router();
const wrapAsync = require('../errorUtilities/wrapAsync');
const AppError = require('../errorUtilities/customError');
const { pitchJoiSchema } = require('../joiSchemas');
const Pitch = require('../models/pitches');

//Custom middlewares
const validatePitch = function (req, res, next) {
  const { error } = pitchJoiSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((item) => item.message).join(',');
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

//All pitches
router.get(
  '/',
  wrapAsync(async (req, res) => {
    const pitches = await Pitch.find({});
    if (!pitches) {
      throw new AppError('There is problem finding pitches', 404);
    }
    res.render('pitches/index.ejs', { pitches });
  })
);
//Create
router.get('/new', (req, res) => {
  res.render('pitches/new.ejs');
});
router.post(
  '/',
  validatePitch,
  wrapAsync(async (req, res) => {
    const pitch = new Pitch(req.body.pitch);
    await pitch.save();
    req.flash('success', 'Pitch is created');
    res.redirect(`/pitches/${pitch.id}`);
  })
);
//Update
router.get(
  '/:id/edit',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const pitch = await Pitch.findById(id);
    if (!pitch) {
      throw new AppError('There is no such a pitch', 404);
    }
    res.render('pitches/edit.ejs', { pitch });
  })
);
router.put(
  '/:id',
  validatePitch,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const newPitch = await Pitch.findByIdAndUpdate(id, req.body.pitch, {
      new: true,
    });
    if (!newPitch) {
      throw new AppError('There was a problem while updating', 500);
    }
    res.redirect(`/pitches/${newPitch.id}`);
  })
);

//Delete
router.delete(
  '/:id',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const del = await Pitch.findByIdAndDelete(id);
    if (!del) {
      throw new AppError('Could not delete this pitch', 404);
    }
    req.flash('danger', 'Pitch is deleted');
    res.redirect('/pitches');
  })
);

//Show page
router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const pitch = await Pitch.findById(id).populate('reviews');
    if (!pitch) {
      throw new AppError('This pitch does not exist', 404);
    }
    res.render('pitches/show.ejs', { pitch });
  })
);

module.exports = router;
