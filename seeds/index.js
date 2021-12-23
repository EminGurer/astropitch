const Pitch = require('../models/pitches');
const seeds = require('./seedHelpers');
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
  await Pitch.deleteMany({});
  for (seed of seeds) {
    const pitch = new Pitch({
      title: seed.STADIUM,
      price: 160,
      description: seed.ADRESS,
      location: seed.CITY,
    });
    await pitch.save();
  }
  await Pitch.deleteMany({ title: '-' });
  console.log('Seeds are inserted');
};

seedDB().then(() => {
  mongoose.connection.close();
});
