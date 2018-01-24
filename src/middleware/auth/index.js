const _ = require('lodash');
const init = require('./init');
const passport = require('passport');

const equalsObjectId = id => doc => doc.equals(id);

const allowedTypes = types => (req, res, next) => {
  if (_.includes(types, req.user.type)) {
    next();
  } else {
    res.sendStatus(403);
  }
};

const userId = path => (req, res, next) => {
  const id = _.get(req, path);
  const { user } = req;
  if (user.type === 'admin' || (user.type === 'user' && req.user._id.equals(id))) {
    next();
  } else {
    res.sendStatus(403);
  }
};

const friendId = path => (req, res, next) => {
  const id = _.get(req, path);
  const { user } = req;
  const friendsAndSelf = _.concat(user.friends, user._id);
  const hasFriend = _.find(friendsAndSelf, equalsObjectId(id));
  if (user.type === 'admin' || hasFriend) {
    next();
  } else {
    res.sendStatus(403);
  }
};

const friends = path => (req, res, next) => {
  const users = _.get(req, path);
  const { user } = req;
  const friendsAndSelf = _.concat(user.friends, user._id);
  const hasFriends = _.differenceWith(users, friendsAndSelf, equalsObjectId).length === 0;
  if (user.type === 'admin' || hasFriends) {
    next();
  } else {
    res.sendStatus(403);
  }
};

const required = (key, value) => (req, res, next) => {
  const { user } = req;
  if (user.type === 'admin' || _.has(req[key], value)) {
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
  const { user } = req;
  const ownLocation = _.find(user.locations, equalsObjectId(id));
  if (user.type === 'admin' || ownLocation) {
    next();
  } else {
    res.sendStatus(403);
  }
};

const authenticate = strategy => passport.authenticate(strategy, { session: false });

module.exports = {
  authenticate,
  init,
  allowedTypes,
  userId,
  friendId,
  locationId,
  createUser,
  required,
  friends,
};

