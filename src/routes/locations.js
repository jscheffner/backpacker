const express = require('express');
const { Location } = require('../models');
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
    res.status(200).send(location);
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

module.exports = router;
