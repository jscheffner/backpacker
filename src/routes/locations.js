const express = require('express');
const { Location, User } = require('../models');
const { celebrate } = require('celebrate');
const schemas = require('../schemas').location;

const router = express.Router();

router.get('/', celebrate(schemas.find), async (req, res) => {
  try {
    const query = {
      user: { $in: req.query.users },
    };
    if (req.query.googleId) {
      query.googleId = req.query.googleId;
    }
    const locations = await Location.find(query, '-__v').populate('user', '_id firstName lastName');
    res.status(200).send(locations);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.post('/', celebrate(schemas.create), async (req, res) => {
  try {
    const location = await Location.create(req.body);
    await User.update({ _id: location.user }, { $addToSet: { locations: location._id } });
    res.status(201).send(location);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.put('/:id', celebrate(schemas.update), async (req, res) => {
  try {
    await Location.update({ _id: req.params.id }, req.body);
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.delete('/:id', celebrate(schemas.remove), async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = await Location.findById(id);
    await Promise.all([
      User.update({ _id: user }, { $pull: { locations: id } }),
      Location.remove({ _id: id }),
    ]);
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;
