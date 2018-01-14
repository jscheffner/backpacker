const _ = require('lodash');
const init = require('./init');
const chalk = require('chalk');

const adminOnly = (req, res, next) => {
  if (req.user.type === 'admin') {
    next();
  } else {
    res.sendStatus(403);
  }
};

const adminOrUser = async ({ user, params, query }, res, next) => {
  if (user.type === 'admin') {
    return next();
  }

  const ownsId = (!params.id || params.id === user._id);
  const hasFriend = (!params.friendId || _.includes(user.friends, params.friendId));
  const ownsLocation = (!params.locationId || _.includes(user.locations, params.locationId));
  const hasFriends = (!query.users || _.difference(query.users, user.friends).length === 0);

  const isUserWithPermission = ownsId && hasFriend && hasFriends && ownsLocation;

  if (!isUserWithPermission) {
    return res.sendStatus(403);
  }

  return next();
};

const adminOrUserCandidate = ({ user, body }, res, next) => {
  console.log(chalk.blue(user));
  if (user.type === 'admin') {
    return res.status(200).json(_.pick(user, ['_id', 'username']));
  }
  if (user.type === 'user') {
    return res.status(200).json(_.pick(user, ['_id', 'googleId', 'firstName', 'lastName']));
  }

  const isUserCandidateWithPermission = user.type === 'user_candidate' && user.googleId === body.googleId;
  const isAdmin = user.type === 'admin';

  if (!isAdmin && !isUserCandidateWithPermission) {
    return res.sendStatus(403);
  }
  return next();
};

const authenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

module.exports = {
  init,
  authenticated,
  adminOnly,
  adminOrUser,
  adminOrUserCandidate,
};

