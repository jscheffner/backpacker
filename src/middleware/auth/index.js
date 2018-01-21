const _ = require('lodash');
const init = require('./init');
const passport = require('passport');

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

  const friendsAndSelf = _.concat(user.friends, user.id);

  const ownsId = !params.id || (params.id === user.id);
  const hasFriend = !params.friendId || _.includes(user.friends, params.friendId);
  const ownsLocation = !params.locationId || _.includes(user.locations, params.locationId);
  const hasFriends = !query.users || (_.difference(query.users, friendsAndSelf).length === 0);

  const hasPermission = ownsId && hasFriend && hasFriends && ownsLocation;

  if (!hasPermission) {
    return res.sendStatus(403);
  }

  return next();
};

const adminOrUserCandidate = ({ user, body }, res, next) => {
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

const query = name => (req, res, next) => {
  if (req.user.type === 'admin' || _.has(req.query, name)) {
    next();
  } else {
    res.sendStatus(403);
  }
};

const authenticate = strategy => passport.authenticate(strategy, { session: false });

module.exports = {
  authenticate,
  init,
  adminOnly,
  adminOrUser,
  adminOrUserCandidate,
  query,
};

