const express = require('express');
const { User } = require('../../models');
const schemas = require('../../schemas').user;
const { celebrate } = require('celebrate');
const firebase = require('firebase-admin');

const router = express.Router({ mergeParams: true });

async function notify(userId, friendId) {
  const { registrationToken } = await User.findById(friendId, 'registrationToken');
  if (!registrationToken) {
    console.log(`${userId} could not notify ${friendId} because the device token is missing`);
    return;
  }

  const { firstName, lastName } = await User.findById(userId, 'id firstName lastName');

  const payload = {
    data: {
      topic: 'friend_added',
      userId,
      firstName,
      lastName,
    },
  };
  try {
    await firebase.messaging().sendToDevice(registrationToken, payload);
    console.log(`${userId} notified ${friendId}: friend added`);
  } catch (err) {
    console.log('Sending notification to device failed:', err);
  }
}

router.put('/:friendId', celebrate(schemas.friendIdParam), celebrate(schemas.notify), async (req, res) => {
  try {
    const { friendId, id } = req.params;
    await User.update({ _id: friendId }, { $addToSet: { friends: id } });
    res.sendStatus(204);
    if (req.query.notify) {
      notify(id, friendId);
    }
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
    res.status(200).json(friends);
  } catch (err) {
    res.sendStatus(500);
  }
});

module.exports = router;
