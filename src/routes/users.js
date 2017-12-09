const express = require('express');
const { User } = require('../models');
const schemas = require('../schemas').user;
const { celebrate } = require('celebrate');
const _ = require('lodash');

const router = express.Router();

router.get('', async (req, res) => {
  try {
    const user = await User.find({}, '_id firstName lastName birthday friends locations').populate('locations', '-__v');
    res.status(200).send(user);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.get('/:id', celebrate(schemas.idParam), async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }, '_id firstName lastName birthday friends locations');
    res.status(200).send(user);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.post('/', celebrate(schemas.create), async (req, res) => {
  try {
    const rawUser = await User.create(req.body);
    const user = _.pick(rawUser, ['_id', 'firstName', 'lastName', 'birthday']);
    res.status(201).send(user);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.put('/:id', celebrate(schemas.update), async (req, res) => {
  try {
    await User.update({ _id: req.params.id }, { $set: req.body });
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.delete('/:id', celebrate(schemas.idParam), async (req, res) => {
  try {
    await Promise.all([
      User.update({}, { $pull: { friends: req.params.id } }),
      User.remove({ _id: req.params.id }),
    ]);
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.put('/:id/friends', celebrate(schemas.addFriend), async (req, res) => {
  try {
    const { friend } = req.body;
    await User.update({ _id: req.params.id }, { $addToSet: { friends: friend } });
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.delete('/:id/friends/:friendId', async (req, res) => {
  try {
    const { id, friendId } = req.params;
    await User.update({ _id: id }, { $pull: { friends: friendId } });
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.get('/:id/friends/', celebrate(schemas.idParam), async (req, res) => {
  try {
    const select = '_id firstName lastName locations';
    const { friends } = await User.findOne({ _id: req.params.id }, 'friends').populate('friends', select);
    res.status(200).send(friends);
  } catch (err) {
    res.sendStatus(500);
  }
});

module.exports = router;
