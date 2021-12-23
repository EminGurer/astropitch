const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PitchSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Pitch', PitchSchema);
