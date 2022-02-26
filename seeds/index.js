const Pitch = require('../models/pitches');
const Review = require('../models/reviews');
const User = require('../models/user');
const seedReviews = require('./reviews.json');
const seedPitches = require('./pitches.json');
const seedUsers = require('./users.json');
//Database
const DB_URL = 'mongodb://localhost:27017/astroPitch';
const mongoose = require('mongoose');
mongoose.connect(DB_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoDB connection error'));
db.once('open', () => {
  console.log('mongoDB connection is open');
});

const seedDB = async () => {
  try {
    await Review.deleteMany({});
    await Pitch.deleteMany({});
    await User.deleteMany({});
    await Pitch.insertMany(seedPitches);
    await Review.insertMany(seedReviews);
    await User.insertMany(seedUsers);
  } catch (e) {
    console.log(e);
  }
  console.log('Seeds are inserted');
};

seedDB().then(() => {
  mongoose.connection.close();
});
