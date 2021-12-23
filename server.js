const express = require('express');
const app = express();
const path = require('path');
const PORT = 8080;
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const Pitch = require('./models/pitches');

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
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Routes

//All pitches
app.get('/pitches', async (req, res) => {
  const pitches = await Pitch.find({});
  res.render('pitches/index.ejs', { pitches });
});

//Create
app.get('/pitches/new', (req, res) => {
  res.render('pitches/new.ejs');
});
app.post('/pitches', async (req, res) => {
  const pitch = new Pitch(req.body.pitch);
  await pitch.save();
  res.redirect(`/pitches/${pitch.id}`);
});

//Update
app.get('/pitches/:id/edit', async (req, res) => {
  const { id } = req.params;
  const pitch = await Pitch.findById(id);
  res.render('pitches/edit.ejs', { pitch });
});
app.put('/pitches/:id', async (req, res) => {
  const { id } = req.params;
  const newPitch = await Pitch.findByIdAndUpdate(id, req.body.pitch, {
    new: true,
  });
  res.redirect(`/pitches/${newPitch.id}`);
});

//Delete
app.delete('/pitches/:id', async (req, res) => {
  const { id } = req.params;
  await Pitch.findByIdAndDelete(id);
  res.redirect('/pitches');
});

//Show page
app.get('/pitches/:id', async (req, res) => {
  const { id } = req.params;
  const pitch = await Pitch.findById(id);
  res.render('pitches/show.ejs', { pitch });
});

//Fallback route
app.get('*', (req, res) => {
  res.send("This page doesn't exist");
});

app.listen(PORT, () => {
  console.log(`Express app is listening on http://localhost:${PORT}`);
});
