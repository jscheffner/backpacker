const express = require('express');
const { Location, User } = require('../..//models');
const { celebrate } = require('celebrate');
const schemas = require('../../schemas').location;
const images = require('./images');
const { auth } = require('../../middleware');

const router = express.Router();
router.use(auth.authenticate(['basic', 'google-id-token']));
router.use(auth.allowedTypes(['admin', 'user']));

router.get('/', celebrate(schemas.find), auth.friends('query.users'), async (req, res) => {
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

router.post('/', celebrate(schemas.create), auth.userId('body.user'), async (req, res) => {
  try {
    const location = await Location.create(req.body);
    await User.update({ _id: location.user }, { $addToSet: { locations: location._id } });
    res.status(201).send(location);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.patch('/:locationId', celebrate(schemas.update), auth.locationId('params.locationId'), async (req, res) => {
  try {
    await Location.update({ _id: req.params.locationId }, req.body);
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.delete('/:locationId', celebrate(schemas.remove), auth.locationId('params.locationId'), async (req, res) => {
  try {
    const { locationId } = req.params;
    const { user } = await Location.findById(locationId);
    await Promise.all([
      User.update({ _id: user }, { $pull: { locations: locationId } }),
      Location.remove({ _id: locationId }),
    ]);
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.use('/:locationId/images', celebrate(schemas.idParam), auth.locationId('params.locationId'), images);

module.exports = router;
