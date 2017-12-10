const express = require('express');
const { User } = require('../../models');
const schemas = require('../../schemas').user;
const { celebrate } = require('celebrate');

const router = express.Router({ mergeParams: true });

router.put('/', celebrate(schemas.addFriend), async (req, res) => {
  try {
    const { friend } = req.body;
    await User.update({ _id: req.params.id }, { $addToSet: { friends: friend } });
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.delete('/:friendId', async (req, res) => {
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

router.get('/', celebrate(schemas.idParam), async (req, res) => {
  try {
    const select = '_id firstName lastName avatar locations';
    const { friends } = await User.findOne({ _id: req.params.id }, 'friends').populate('friends', select);
    res.status(200).send(friends);
  } catch (err) {
    res.sendStatus(500);
  }
});

module.exports = router;
