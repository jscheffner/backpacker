const express = require('express');
const { User } = require('../../models');
const schemas = require('../../schemas').user;
const { celebrate } = require('celebrate');
const _ = require('lodash');
const friends = require('./friends');
const avatar = require('./avatar');
const { auth } = require('../../middleware');

const router = express.Router();
router.use(auth.authenticate(['basic', 'google-id-token']));

const middleware = {
  getAll: [
    celebrate(schemas.search),
    auth.required('query', 'email'),
  ],
  single: [
    celebrate(schemas.idParam),
    auth.userId('params.id'),
  ],
  post: [
    celebrate(schemas.create),
    auth.createUser,
  ],
  patch: [
    celebrate(schemas.update),
    auth.userId('params.id'),
  ],
  avatar: [
    auth.userId('params.id'),
  ],
};

router.get('/', ...middleware.getAll, async (req, res) => {
  try {
    const rawUsers = await User.find(req.query, '_id googleId firstName lastName locations email avatar friends')
      .populate('locations', '-__v')
      .populate('friends', '-__v');

    const isAdmin = req.user.type === 'admin';
    const users = isAdmin ? rawUsers : _.map(rawUsers, rawUser => _.pick(rawUser, ['firstName', 'lastName', 'email', '_id']));

    return res.status(200).json(users);
  } catch (err) {
    return res.sendStatus(500);
  }
});

router.get('/:id', ...middleware.single, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }, '_id firstName lastName birthday avatar friends locations').populate('locations', '-__v');
    return res.status(200).send(user);
  } catch (err) {
    return res.sendStatus(500);
  }
});

router.post('/', ...middleware.post, async (req, res) => {
  try {
    const rawUser = await User.create(req.body);
    const user = _.pick(rawUser, ['_id', 'googleId', 'firstName', 'lastName']);
    return res.status(201).json(user);
  } catch (err) {
    return res.sendStatus(500);
  }
});

router.patch('/:id', ...middleware.patch, async (req, res) => {
  try {
    await User.update({ _id: req.params.id }, { $set: req.body });
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.delete('/:id', ...middleware.single, async (req, res) => {
  try {
    await Promise.all([
      User.update({}, { $pull: { friends: req.params.id } }, { multi: true }),
      User.remove({ _id: req.params.id }),
    ]);
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.use('/:id/friends', friends);
router.use('/:id/avatar', ...middleware.avatar, avatar);

module.exports = router;
