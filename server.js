const express = require('express');
const app = express();
const path = require('path');
const PORT = 8080;
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const Pitch = require('./models/pitches');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./errorUtilities/wrapAsync');
const AppError = require('./errorUtilities/customError');

//Database
const DB_URL = 'mongodb://localhost:27017/astroPitch';
const mongoose = require('mongoose');
mongoose.connect(DB_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoDB connection error'));
db.once('open', () => {
  console.log('mongoDB connection is open');
});

//Static assets and body parsers
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

//View engine and views
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Routes

//All pitches
app.get(
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
app.get('/pitches/new', (req, res) => {
  res.render('pitches/new.ejs');
});
app.post(
  '/pitches',
  wrapAsync(async (req, res) => {
    if (!req.body.pitch) throw new AppError('Invalid pitch data', 400);
    const pitch = new Pitch(req.body.pitch);
    const save = await pitch.save();
    res.redirect(`/pitches/${pitch.id}`);
  })
);

//Update
app.get(
  '/pitches/:id/edit',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const pitch = await Pitch.findById(id);
    if (!pitch) {
      throw new AppError('There is no such a pitch', 404);
    }
    res.render('pitches/edit.ejs', { pitch });
  })
);
app.put(
  '/pitches/:id',
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
app.delete(
  '/pitches/:id',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const del = await Pitch.findByIdAndDelete(id);
    if (!del) {
      throw new AppError('Could not delete this pitch', 404);
    }
    res.redirect('/');
  })
);

//Show page
app.get(
  '/pitches/:id',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const pitch = await Pitch.findById(id);
    if (!pitch) {
      throw new AppError('This pitch does not exist', 404);
    }
    res.render('pitches/show.ejs', { pitch });
  })
);
//404 fallback
app.all('*', (req, res, next) => {
  next(new AppError('Page does not exist', 404));
});

//Error handler middleware
app.use((err, req, res, next) => {
  const { message = 'Something went wrong', status = 500 } = err;
  res.status(status).render('pitches/error.ejs', { message, status });
});

//App start
app.listen(PORT, () => {
  console.log(`Express app is listening on http://localhost:${PORT}`);
});
