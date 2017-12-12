const express = require('express');
const { User } = require('../../models');
const { IncomingForm } = require('formidable');
const fs = require('fs-extra');

const router = express.Router({ mergeParams: true });

router.put('/', async (req, res) => {
  const form = new IncomingForm();
  form.parse(req);

  form.on('file', () => {
    res.sendStatus(202);
  });

  form.on('error', (err) => {
    console.log(err);
    res.sendStatus(500);
  });

  form.on('end', async () => {
    try {
      const { path } = form.openedFiles[0];
      const newPath = `uploads/imgs/user/${req.params.id}.jpg`;
      await fs.copy(path, newPath);
      await User.update({ _id: req.params.id }, { $set: { avatar: `/${newPath}` } });
    } catch (error) {
      console.warn('Saving file failed:', error);
    }
  });
});

router.delete('/', async (req, res) => {
  try {
    await fs.remove(`uploads/imgs/user/${req.params.id}.jpg`);
    await User.update({ _id: req.params.id }, { $unset: { avatar: 1 } });
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;
