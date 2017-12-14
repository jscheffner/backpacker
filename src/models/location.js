const mongoose = require('mongoose');

const { Schema } = mongoose;

const locationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  googleId: {
    type: String,
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  images: [Schema.Types.ObjectId],
  categories: [String],
});

module.exports = mongoose.model('Location', locationSchema);
