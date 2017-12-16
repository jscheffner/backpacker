const express = require('express');
const router = require('./src/routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const passport = require('passport');
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const { User } = require('./src/models');

mongoose.connect('mongodb://localhost/backpacker', { useMongoClient: true });
mongoose.Promise = Promise;

const credentials = {
  clientID: '590779633384-cdoo51p2imhpuv04nautn8l3v49vnao5.apps.googleusercontent.com',
  clientSecret: '',
};

const verify = (accessToken, refreshToken, profile, done) => User.findById(profile.id, done);
const signup = (accessToken, refreshToken, profile, done) => {
  const data = {
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    avatar: profile._json.picture,
  };
  User.create(profile.id, data, done);
};

passport.use('authenticate', new GoogleTokenStrategy(credentials, verify));
passport.use('signup', new GoogleTokenStrategy(credentials, signup));

const app = express();
app.use(bodyParser.json());
app.use('/api/v0/', router);
app.use('/uploads', express.static('uploads'));
app.listen(3000, () => console.log('App listening on port 3000!'));
app.use(errors());

module.exports = {
  app,
};
