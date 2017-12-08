const mongoose = require('mongoose');

const { Schema } = mongoose;

const locationSchema = new Schema({
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
  images: [Schema.Types.ObjectId],
});

module.exports = mongoose.model('Location', locationSchema);
