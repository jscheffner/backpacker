const mongoose = require('mongoose');

const { Schema } = mongoose;

const locationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  description: String,
  favorite: Boolean,
  googleId: String,
  images: [Schema.Types.ObjectId],
});

module.exports = mongoose.model('Location', locationSchema);
