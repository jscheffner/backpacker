const GoogleTokenStrategy = require('passport-google-id-token');
const { BasicStrategy } = require('passport-http');
const { User, Admin } = require('../../models');
const _ = require('lodash');
const passport = require('passport');
const chalk = require('chalk');

const clientID = '281227624759-l6dd68h5j2jlcn8scgh4g0kcn42f107l.apps.googleusercontent.com';

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

async function verifyGoogleUser(token, googleId, done) {
  try {
    const rawUser = await User.findOne({ googleId });
    let user;
    if (rawUser) {
      user = _.set(rawUser, 'type', 'user');
      user._id = _.toString(user._id);
      user.friends = _.map(user.friends, _.toString);
      user.locations = _.map(user.friends, _.toString);
    } else {
      user = { googleId, type: 'user_candidate' };
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
}

module.exports = () => {
  try {
    createDefaultAdmin();
  } catch (error) {
    console.log('Error creating default admin:', chalk.red(error));
  }

  passport.use(new GoogleTokenStrategy({ clientID }, verifyGoogleUser));
  passport.use(new BasicStrategy(verifyAdmin));

  return passport.initialize();
};
