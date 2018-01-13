const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

adminSchema.pre('save', function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  return bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    return bcrypt.hash(this.password, salt, (error, hash) => {
      if (error) {
        return next(err);
      }
      this.password = hash;

      return next();
    });
  });
});

adminSchema.methods.validPassword = function validPassword(pw) {
  console.log('pw:', pw, 'hash:', this.password);
  return bcrypt.compare(pw, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
