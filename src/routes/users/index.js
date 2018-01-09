const express = require('express');
const { User } = require('../../models');
const schemas = require('../../schemas').user;
const { celebrate } = require('celebrate');
const friends = require('./friends');
const avatar = require('./friends');
const passport = require('passport');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const user = await User.find({}, '_id firstName lastName birthday avatar friends locations').populate('locations', '-__v');
    res.status(200).send(user);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.get('/:id', celebrate(schemas.idParam), async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }, '_id firstName lastName birthday avatar friends locations');
    res.status(200).send(user);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.post('/', passport.authenticate('signup'), (req, res) => (req.user ? res.status(201).send(req.user) : res.sendStatus(500)));

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
      User.update({}, { $pull: { friends: req.params.id } }, { multi: true }),
      User.remove({ _id: req.params.id }),
    ]);
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.use('/:id/friends', celebrate(schemas.idParam), friends);
router.use('/:id/avatar', celebrate(schemas.idParam), avatar);

module.exports = router;
