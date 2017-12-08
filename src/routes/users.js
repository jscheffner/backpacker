const express = require('express');
const { User } = require('../models');
const { createUserSchema, updateUserSchema, getOrDeleteUserSchema } = require('../schemas');
const { celebrate } = require('celebrate');
const _ = require('lodash');

const router = express.Router();

router.get('/:id', celebrate(getOrDeleteUserSchema), async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }, '_id firstName lastName birthday friends locations');
    res.status(200).send(user);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.post('/', celebrate(createUserSchema), async (req, res) => {
  try {
    const rawUser = await User.create(req.body);
    const user = _.pick(rawUser, ['_id', 'firstName', 'lastName', 'birthday', 'friends', 'locations']);
    res.status(201).send(user);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.put('/:id', celebrate(updateUserSchema), async (req, res) => {
  try {
    await User.update({ _id: req.params.id }, { $set: req.body });
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.delete('/:id', celebrate(getOrDeleteUserSchema), async (req, res) => {
  try {
    await User.remove({ _id: req.params.id });
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.post('/:id/friends', async (req, res) => {
  try {
    const { friend } = req.body;
    await User.update({ _id: req.params.id }, { $addToSet: { friends: friend } });
    res.sendStatus(201);
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

router.get('/:id/friends/', async (req, res) => {
  try {
    const select = '_id firstName lastName birthday friends locations';
    const { friends } = await User.findOne({ _id: req.params.id }, 'friends').populate('friends', select);
    res.status(200).send(friends);
  } catch (err) {
    res.sendStatus(500);
  }
});


module.exports = router;
