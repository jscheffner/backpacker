const _ = require('lodash');
const init = require('./init');
const passport = require('passport');

const equalsObjectId = id => doc => doc.equals(id);

const adminOnly = (req, res, next) => {
  if (req.user.type === 'admin') {
    next();
  } else {
    res.sendStatus(403);
  }
};

const userId = path => (req, res, next) => {
  const id = _.get(req, path);
  if (req.user.type === 'admin' || req.user._id.equals(id)) {
    next();
  } else {
    res.sendStatus(403);
  }
};

const friendId = path => (req, res, next) => {
  const id = _.get(req, path);
  const hasFriend = _.find(req.user.friends, equalsObjectId(id));
  if (req.user.type === 'admin' || hasFriend) {
    next();
  } else {
    res.sendStatus(403);
  }
};

const friends = path => (req, res, next) => {
  const users = _.get(req, path);
  const friendsAndSelf = _.concat(req.user.friends, req.user._id);
  const hasFriends = _.differenceWith(users, friendsAndSelf, equalsObjectId).length === 0;
  if (req.user.type === 'admin' || hasFriends) {
    next();
  } else {
    res.sendStatus(403);
  }
};

const required = (key, value) => (req, res, next) => {
  if (req.user.type === 'admin' || _.has(req[key], value)) {
    next();
  } else {
    res.sendStatus(403);
  }
};

const createUser = ({ user, body }, res, next) => {
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

const locationId = path => (req, res, next) => {
  const id = _.get(req, path);
  const ownLocation = _.find(req.user.locations, equalsObjectId(id));
  if (req.user.type === 'admin' || ownLocation) {
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
  userId,
  friendId,
  locationId,
  createUser,
  required,
  friends,
};

