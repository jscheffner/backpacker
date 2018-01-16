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
  .set('_id', user._id.toString())
  .set('friends', _.map(user.friends, _.toString))
  .set('locations', _.map(user.locations, _.toString))
  .value();

async function verifyGoogleUser(token, googleId, done) {
  try {
    const rawUser = await User.findOne({ googleId });
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
