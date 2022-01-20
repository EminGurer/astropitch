const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
  rating: {
    type: Number,
    required: [true, 'Review must have a rating'],
  },
  body: {
    type: String,
    required: [true, 'Review must have a body'],
  },
});

module.exports = mongoose.model('Review', reviewSchema);
