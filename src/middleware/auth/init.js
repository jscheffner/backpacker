const GoogleTokenStrategy = require('passport-google-id-token');
const { BasicStrategy } = require('passport-http');
const { User, Admin } = require('../../models');
const _ = require('lodash');
const passport = require('passport');
const chalk = require('chalk');
const config = require('config');

const clientID = config.get('auth.clientID');

async function createDefaultAdmin() {
  const defaultAdmin = await Admin.findOne({ username: 'admin' });
  if (!defaultAdmin) {
    Admin.create({ username: 'admin', password: '1234' });
    console.log(chalk.yellow('Default admin created. Please change its password'));
  } else if (await defaultAdmin.validPassword('1234')) {
    console.log(chalk.yellow('The default admin password is supposed to be temporary. Please change it.'));
  }
}

async function verifyAdmin(username, password, done) {
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
}

const wrapUser = user => _
  .chain(user)
  .set('type', 'user')
  .set('friends', _.map(user.friends, friend => friend.id))
  .set('locations', _.map(user.locations, loc => loc.id))
  .value();

async function verifyGoogleUser(token, googleId, done) {
  try {
    const rawUser = await User.findOne({ googleId })
      .populate('locations')
      .populate('friends');
    const user = rawUser ? wrapUser(rawUser) : { googleId, type: 'user_candidate' };
    done(null, user);
  } catch (err) {
    done(err);
  }
}

module.exports = () => {
  try {
    createDefaultAdmin();
  } catch (error) {
    console.log(chalk.red('Error creating default admin:'), error);
  }

  passport.use(new GoogleTokenStrategy({ clientID }, verifyGoogleUser));
  passport.use(new BasicStrategy(verifyAdmin));

  return passport.initialize();
};
