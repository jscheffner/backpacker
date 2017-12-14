const express = require('express');
const { User } = require('../../models');
const schemas = require('../../schemas').user;
const { celebrate } = require('celebrate');

const router = express.Router({ mergeParams: true });

router.put('/:friendId', celebrate(schemas.friendIdParam), async (req, res) => {
  try {
    const { friendId, id } = req.params;
    await User.update({ _id: id }, { $addToSet: { friends: friendId } });
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.delete('/:friendId', celebrate(schemas.friendIdParam), async (req, res) => {
  try {
    const { id, friendId } = req.params;
    await Promise.all([
      await User.update({ _id: id }, { $pull: { friends: friendId } }),
      await User.update({ _id: friendId }, { $pull: { friends: id } }),
    ]);
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.get('/', async (req, res) => {
  try {
    const select = '_id firstName lastName avatar locations';
    const { friends } = await User.findOne({ _id: req.params.id }, 'friends')
      .populate({ path: 'friends', select, populate: { path: 'locations', select: '-__v' } });
    res.status(200).send(friends);
  } catch (err) {
    res.sendStatus(500);
  }
});

module.exports = router;
