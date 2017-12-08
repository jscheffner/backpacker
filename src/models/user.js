const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  birthday: Date,
  locations: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('User', userSchema);
