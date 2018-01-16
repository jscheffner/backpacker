const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: {
    type: String,
    required: false,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  locations: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  avatar: String,
});

module.exports = mongoose.model('User', userSchema);
