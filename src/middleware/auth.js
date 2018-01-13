const _ = require('lodash');

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
    return res.sendStatus(401);
  }

  return next();
};

const adminOrUserCandidate = (req, res, next) => {
  if (req.user.type === 'user') {
    return res.status(200).send(_.pick(req.user, ['_id', 'googleId', 'firstName', 'lastName']));
  }
  const isUserCandidateWithPermission = req.user.type === 'user_candidate' && req.user.googleId === req.body.googleId;
  const isAdmin = req.user.type === 'admin';

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
  authenticated,
  adminOnly,
  adminOrUser,
  adminOrUserCandidate,
};

