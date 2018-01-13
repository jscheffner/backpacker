const express = require('express');
const { IncomingForm } = require('formidable');
const fs = require('fs-extra');
const { Location } = require('../../models');
const { ObjectId } = require('mongoose').Types;

const router = express.Router({ mergeParams: true });

function saveFiles(files, locationId) {
  const promises = files.map((file) => {
    const id = ObjectId();
    const newPath = `uploads/imgs/location/${id}.jpg`;

    return Promise.all([
      fs.copy(file.path, newPath),
      Location.update({ _id: locationId }, { $addToSet: { images: id } }),
    ]);
  });

  return Promise.all(promises);
}

router.post('/', (req, res) => {
  const form = new IncomingForm({ multiple: true });
  form.parse(req);

  form.on('error', (err) => {
    console.log(err);
    res.sendStatus(500);
  });

  form.on('end', async () => {
    try {
      res.sendStatus(202);
      await saveFiles(form.openedFiles, req.params.locationId);
    } catch (error) {
      console.log(error);
    }
  });
});

router.delete('/:imageId', async (req, res) => {
  try {
    await fs.remove(`uploads/imgs/location/${req.params.imageId}.jpg`);
    await Location.update({ _id: req.params.locationId }, { $pull: { images: req.params.imageId } });
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;
