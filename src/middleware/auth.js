const _ = require('lodash');

const adminOnly = (req, res, next) => {
  if (req.user.type === 'admin') {
    next();
  } else {
    res.sendStatus(403);
  }
};

const adminOrUser = async (req, res, next) => {
  if (req.user.type === 'admin') {
    return next();
  }

  const ownsId = (!req.params.id || req.params.id === req.user.googleId);
  const hasFriend = (!req.params.friendId || _.includes(req.user.friends, req.params.friendId));

  const isUserWithPermission = ownsId && hasFriend;

  if (!isUserWithPermission) {
    return res.sendStatus(401);
  }

  return next();
};

const adminOrUserCandidate = (req, res, next) => {
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

