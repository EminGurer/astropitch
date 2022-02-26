const wrapAsync = require('../errorUtilities/wrapAsync');
const AppError = require('../errorUtilities/customError');
const Pitch = require('../models/pitches');
const { cloudinary } = require('../cloudinary');
const mapboxToken = process.env.MAPBOX_TOKEN;

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
  req.body.pitch.geometry = JSON.parse(req.body.pitch.geometry);
  req.body.pitch.author = req.user.id;
  req.body.pitch.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
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
  const moreImages = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  const pitch = await Pitch.findById(id);
  pitch.images.push(...moreImages);
  await pitch.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }

    await pitch.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash('success', 'Pitch is updated');
  res.redirect(`/pitches/${pitch.id}`);
});

const deletePitch = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const del = await Pitch.findByIdAndDelete(id);
  for (let image of del.images) {
    await cloudinary.uploader.destroy(image.filename);
  }
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
