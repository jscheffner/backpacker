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

router.get('/', auth.adminOnly, async (req, res) => {
  try {
    const user = await User.find({}, '_id googleId firstName lastName email avatar friends locations')
      .populate('locations', '-__v')
      .populate('friends', '-__v');
    return res.status(200).json(user);
  } catch (err) {
    return res.sendStatus(500);
  }
});

router.get('/:id', celebrate(schemas.idParam), auth.adminOrUser, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }, '_id firstName lastName birthday avatar friends locations').populate('locations', '-__v');
    return res.status(200).send(user);
  } catch (err) {
    return res.sendStatus(500);
  }
});

router.post('/', celebrate(schemas.create), auth.adminOrUserCandidate, async (req, res) => {
  try {
    const rawUser = await User.create(req.body);
    const user = _.pick(rawUser, ['_id', 'googleId', 'firstName', 'lastName']);
    return res.status(201).json(user);
  } catch (err) {
    return res.sendStatus(500);
  }
});

router.patch('/:id', celebrate(schemas.update), auth.adminOrUser, async (req, res) => {
  try {
    await User.update({ _id: req.params.id }, { $set: req.body });
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.delete('/:id', celebrate(schemas.idParam), auth.adminOrUser, async (req, res) => {
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

router.use('/:id/friends', celebrate(schemas.idParam), auth.adminOrUser, friends);
router.use('/:id/avatar', celebrate(schemas.idParam), auth.adminOrUser, avatar);

module.exports = router;
