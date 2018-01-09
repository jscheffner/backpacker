const express = require('express');
const router = require('./src/routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const passport = require('passport');
const GoogleTokenStrategy = require('passport-google-oauth2').Strategy;
const { User } = require('./src/models');

mongoose.connect('mongodb://localhost/backpacker', { useMongoClient: true });
mongoose.Promise = Promise;

const credentials = {
  clientID: '281227624759-l6dd68h5j2jlcn8scgh4g0kcn42f107l.apps.googleusercontent.com',
};

const signup = (request, accessToken, refreshToken, profile, done) => {
  const data = {
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    avatar: profile._json.picture,
  };
  User.create(profile.id, data, done);
};

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
