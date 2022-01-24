const wrapAsync = require('../errorUtilities/wrapAsync');
const AppError = require('../errorUtilities/customError');
const Pitch = require('../models/pitches');

const showAllPitches = wrapAsync(async (req, res) => {
  const pitches = await Pitch.find({});
  if (!pitches) {
    throw new AppError('There is problem finding pitches', 404);
  }
  res.render('pitches/index.ejs', { pitches });
});

const showCreateForm = (req, res) => {
  res.render('pitches/new.ejs');
};

const createPitch = wrapAsync(async (req, res) => {
  req.body.pitch.author = req.user.id;
  const pitch = new Pitch(req.body.pitch);
  await pitch.save();
  req.flash('success', 'Pitch is created');
  res.redirect(`/pitches/${pitch.id}`);
});

const showUpdateForm = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const pitch = await Pitch.findById(id);
  if (!pitch) {
    throw new AppError('There is no such a pitch', 404);
  }
  res.render('pitches/edit.ejs', { pitch });
});

const updatePitch = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const newPitch = await Pitch.findByIdAndUpdate(id, req.body.pitch, {
    new: true,
  });
  if (!newPitch) {
    throw new AppError('There was a problem while updating', 500);
  }
  req.flash('success', 'Pitch is updated');
  res.redirect(`/pitches/${newPitch.id}`);
});

const deletePitch = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const del = await Pitch.findByIdAndDelete(id);
  if (!del) {
    throw new AppError('Could not delete this pitch', 404);
  }
  req.flash('success', 'Pitch is deleted');
  res.redirect('/pitches');
});

const showOnePitch = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const pitch = await Pitch.findById(id)
    .populate({ path: 'reviews', populate: { path: 'author' } })
    .populate('author');
  if (!pitch) {
    throw new AppError('This pitch does not exist', 404);
  }
  res.render('pitches/show.ejs', { pitch });
});
module.exports = {
  showAllPitches,
  showCreateForm,
  createPitch,
  showUpdateForm,
  updatePitch,
  deletePitch,
  showOnePitch,
};
