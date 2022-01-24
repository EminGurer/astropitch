const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews');

const PitchSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Pitch must have a title'],
  },
  image: {
    type: String,
    required: [true, 'Pitch must have an image'],
  },
  price: {
    type: Number,
    required: [true, 'Pitch must have a price'],
  },
  description: {
    type: String,
    required: [true, 'Pitch must have a description'],
  },
  location: {
    type: String,
    required: [true, 'Pitch must have a location'],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is needed to create a pitch. You must login'],
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
});

PitchSchema.post('findOneAndDelete', async (doc) => {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

const Pitch = mongoose.model('Pitch', PitchSchema);

module.exports = Pitch;
