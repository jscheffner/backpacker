const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('config');

const salt = config.get('auth.salt');
const { Schema } = mongoose;

const adminSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

adminSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;

    return next();
  } catch (err) {
    return next(err);
  }
});

adminSchema.methods.validPassword = function validPassword(pw) {
  return bcrypt.compare(pw, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
