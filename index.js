const express = require('express');
const router = require('./src/routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const methodOverride = require('method-override');
const cors = require('cors');
const passport = require('passport');
const GoogleTokenStrategy = require('passport-google-id-token');
const { BasicStrategy } = require('passport-http');
const { User, Admin } = require('./src/models');
const _ = require('lodash');
const morgan = require('morgan');

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/backpacker', { useMongoClient: true });

const createDefaultAdmin = async () => {
  const defaultAdmin = await Admin.findOne({ username: 'admin' });
  if (!defaultAdmin) {
    Admin.create({ username: 'admin', password: '1234' });
  }
};
try {
  createDefaultAdmin();
} catch (error) {
  console.log(error);
}

const clientID = '281227624759-l6dd68h5j2jlcn8scgh4g0kcn42f107l.apps.googleusercontent.com';

passport.use(new GoogleTokenStrategy({ clientID }, async (token, googleId, done) => {
  try {
    const rawUser = await User.findOne({ googleId });
    const user = rawUser ? _.set(rawUser, 'type', 'user') : { googleId, type: 'user_candidate' };
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

passport.use(new BasicStrategy(async (username, password, done) => {
  try {
    const admin = await Admin.findOne({ username });
    if (!(admin && await admin.validPassword(password))) {
      done(null, false);
    } else {
      done(null, _.set(admin, 'type', 'admin'));
    }
  } catch (err) {
    done(err);
  }
}));

const app = express();
app.use(morgan('tiny'));
app.use(cors());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(bodyParser.json({ type: ['application/json', 'application/merge-patch+json'] }));
app.use(passport.initialize());
app.use('/api/v0/', router);
app.use('/uploads', express.static('uploads'));
app.listen(3000, () => console.log('App listening on port 3000!'));
app.use(errors());

module.exports = {
  app,
};
